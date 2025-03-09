import pytest
import json
from unittest.mock import patch, MagicMock
from app.api.langgraph_builder import (
    build_langgraph_from_definition,
    create_node_function,
    create_router_function,
    run_graph
)
from langgraph.graph import StateGraph, START, END

# Test building a simple graph with two nodes
def test_build_simple_graph():
    # Define a simple graph with two nodes and one edge
    definition = {
        "nodes": [
            {
                "id": "node1",
                "type": "llm",
                "config": {
                    "model_name": "gpt-3.5-turbo",
                    "temperature": 0,
                    "input_key": "input",
                    "output_key": "output"
                }
            },
            {
                "id": "node2",
                "type": "transform",
                "config": {
                    "transform_type": "extract_json",
                    "input_key": "output",
                    "output_key": "final_output"
                }
            }
        ],
        "edges": [
            {
                "source": "START",
                "target": "node1"
            },
            {
                "source": "node1",
                "target": "node2"
            },
            {
                "source": "node2",
                "target": "END"
            }
        ],
        "state_type": "dict"
    }
    
    # Mock the ChatOpenAI class
    with patch("app.api.langgraph_builder.ChatOpenAI") as mock_chat_openai:
        # Build the graph
        graph = build_langgraph_from_definition(definition)
        
        # Assert that the graph is a StateGraph
        assert isinstance(graph, StateGraph)
        
        # Assert that ChatOpenAI was called with the correct parameters
        mock_chat_openai.assert_called_once_with(
            model_name="gpt-3.5-turbo",
            temperature=0
        )

# Test building a graph with conditional edges
def test_build_graph_with_conditional_edges():
    # Define a graph with conditional edges
    definition = {
        "nodes": [
            {
                "id": "node1",
                "type": "llm",
                "config": {
                    "model_name": "gpt-3.5-turbo",
                    "temperature": 0,
                    "input_key": "input",
                    "output_key": "output"
                }
            },
            {
                "id": "node2",
                "type": "transform",
                "config": {
                    "transform_type": "extract_json",
                    "input_key": "output",
                    "output_key": "decision"
                }
            },
            {
                "id": "node3",
                "type": "llm",
                "config": {
                    "model_name": "gpt-4",
                    "temperature": 0.5,
                    "input_key": "decision",
                    "output_key": "final_output"
                }
            },
            {
                "id": "node4",
                "type": "tool",
                "config": {
                    "tool_type": "search",
                    "input_key": "decision",
                    "output_key": "search_results"
                }
            }
        ],
        "edges": [
            {
                "source": "START",
                "target": "node1"
            },
            {
                "source": "node1",
                "target": "node2"
            },
            {
                "source": "node2",
                "target": "node3",
                "type": "conditional",
                "condition": {
                    "type": "key_value",
                    "key": "decision.action",
                    "value_map": {
                        "generate": "node3",
                        "search": "node4"
                    },
                    "default": "node3"
                },
                "destinations": ["node3", "node4"]
            },
            {
                "source": "node3",
                "target": "END"
            },
            {
                "source": "node4",
                "target": "END"
            }
        ],
        "state_type": "dict"
    }
    
    # Mock the necessary classes
    with patch("app.api.langgraph_builder.ChatOpenAI") as mock_chat_openai, \
         patch("app.api.langgraph_builder.TavilySearchResults") as mock_tavily:
        # Build the graph
        graph = build_langgraph_from_definition(definition)
        
        # Assert that the graph is a StateGraph
        assert isinstance(graph, StateGraph)
        
        # Assert that ChatOpenAI was called twice with different parameters
        assert mock_chat_openai.call_count == 2
        mock_chat_openai.assert_any_call(model_name="gpt-3.5-turbo", temperature=0)
        mock_chat_openai.assert_any_call(model_name="gpt-4", temperature=0.5)
        
        # Assert that TavilySearchResults was called
        mock_tavily.assert_called_once_with(max_results=3)

# Test error handling when building a graph
def test_build_graph_error_handling():
    # Define an invalid graph (missing required fields)
    invalid_definition = {
        "nodes": [
            {
                "id": "node1",
                # Missing "type" field
                "config": {
                    "model_name": "gpt-3.5-turbo"
                }
            }
        ],
        "edges": [
            {
                "source": "START",
                "target": "node1"
            }
        ]
    }
    
    # Assert that building the graph raises a ValueError
    with pytest.raises(ValueError):
        build_langgraph_from_definition(invalid_definition)

# Test creating different types of node functions
def test_create_node_functions():
    # Test LLM node
    llm_config = {
        "model_name": "gpt-3.5-turbo",
        "temperature": 0,
        "input_key": "input",
        "output_key": "output"
    }
    
    # Test tool node
    tool_config = {
        "tool_type": "search",
        "max_results": 5,
        "input_key": "query",
        "output_key": "results"
    }
    
    # Test transform node
    transform_config = {
        "transform_type": "extract_json",
        "input_key": "text",
        "output_key": "json"
    }
    
    # Mock the necessary classes
    with patch("app.api.langgraph_builder.ChatOpenAI") as mock_chat_openai, \
         patch("app.api.langgraph_builder.TavilySearchResults") as mock_tavily:
        # Create the node functions
        llm_node = create_node_function("llm", llm_config)
        tool_node = create_node_function("tool", tool_config)
        transform_node = create_node_function("transform", transform_config)
        
        # Assert that the functions are callable
        assert callable(llm_node)
        assert callable(tool_node)
        assert callable(transform_node)
        
        # Assert that ChatOpenAI was called with the correct parameters
        mock_chat_openai.assert_called_once_with(
            model_name="gpt-3.5-turbo",
            temperature=0
        )
        
        # Assert that TavilySearchResults was called with the correct parameters
        mock_tavily.assert_called_once_with(max_results=5)

# Test running a graph
def test_run_graph():
    # Create a mock graph
    mock_graph = MagicMock()
    mock_graph.invoke.return_value = {"output": "test result"}
    
    # Run the graph
    result = run_graph(mock_graph, {"input": "test input"})
    
    # Assert that the graph was invoked with the correct inputs
    mock_graph.invoke.assert_called_once_with({"input": "test input"})
    
    # Assert that the result is correct
    assert result == {"output": "test result"}

# Test error handling when running a graph
def test_run_graph_error_handling():
    # Create a mock graph that raises an exception
    mock_graph = MagicMock()
    mock_graph.invoke.side_effect = Exception("Test error")
    
    # Assert that running the graph raises a ValueError
    with pytest.raises(ValueError):
        run_graph(mock_graph, {"input": "test input"}) 