from typing import Dict, List, Any, Optional, Callable, Union
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import json

from . import logger

def build_langgraph_from_definition(definition: Dict[str, Any]) -> StateGraph:
    """
    Build a LangGraph StateGraph from a graph definition.
    
    Args:
        definition: A dictionary containing the graph definition
        
    Returns:
        A compiled LangGraph StateGraph
    """
    try:
        logger.info("Building LangGraph from definition")
        
        # Extract graph components from definition
        nodes = definition.get("nodes", [])
        edges = definition.get("edges", [])
        state_type = definition.get("state_type", "dict")
        
        logger.debug("Graph components extracted", data={
            "node_count": len(nodes),
            "edge_count": len(edges),
            "state_type": state_type
        })
        
        # Create a new StateGraph
        graph = StateGraph(state_type)
        
        # Add nodes to the graph
        for node in nodes:
            node_id = node["id"]
            node_type = node["type"]
            node_config = node.get("config", {})
            
            logger.debug(f"Adding node to graph", data={
                "node_id": node_id,
                "node_type": node_type
            })
            
            # Create the node function based on node type
            node_function = create_node_function(node_type, node_config)
            
            # Add the node to the graph
            graph.add_node(node_id, node_function)
        
        # Add edges to the graph
        for edge in edges:
            source = edge["source"]
            target = edge["target"]
            edge_type = edge.get("type", "default")
            
            if source == "START":
                source = START
            
            if target == "END":
                target = END
            
            logger.debug(f"Adding edge to graph", data={
                "source": source if source != START else "START",
                "target": target if target != END else "END",
                "edge_type": edge_type
            })
            
            if edge_type == "conditional":
                # For conditional edges, we need to create a router function
                condition = edge.get("condition", {})
                destinations = edge.get("destinations", [])
                
                # Create the router function
                router = create_router_function(condition, destinations)
                
                # Add conditional edges
                graph.add_conditional_edges(source, router, destinations)
            else:
                # Add a regular edge
                graph.add_edge(source, target)
        
        # Compile the graph
        logger.info("Compiling LangGraph")
        compiled_graph = graph.compile()
        
        return compiled_graph
    
    except Exception as e:
        logger.error(f"Error building LangGraph: {str(e)}")
        raise ValueError(f"Failed to build LangGraph: {str(e)}")

def create_node_function(node_type: str, config: Dict[str, Any]) -> Callable:
    """
    Create a node function based on the node type and configuration.
    
    Args:
        node_type: The type of node to create
        config: Configuration for the node
        
    Returns:
        A callable function that can be used as a node in the graph
    """
    logger.debug(f"Creating node function", data={"node_type": node_type})
    
    if node_type == "llm":
        # Create an LLM node
        model_name = config.get("model_name", "gpt-3.5-turbo")
        temperature = config.get("temperature", 0)
        
        logger.debug(f"Creating LLM node", data={
            "model_name": model_name,
            "temperature": temperature
        })
        
        llm = ChatOpenAI(model_name=model_name, temperature=temperature)
        
        # If there's a prompt template, use it
        if "prompt_template" in config:
            prompt = ChatPromptTemplate.from_template(config["prompt_template"])
            chain = prompt | llm
            
            def llm_node(state):
                # Extract inputs for the prompt from the state
                inputs = {}
                for key in config.get("input_keys", []):
                    if key in state:
                        inputs[key] = state[key]
                
                logger.debug(f"Running LLM node with prompt template", data={
                    "inputs": list(inputs.keys())
                })
                
                # Run the chain
                result = chain.invoke(inputs)
                
                # Update the state with the result
                output_key = config.get("output_key", "output")
                return {output_key: result.content}
            
            return llm_node
        else:
            # Simple LLM node without a prompt template
            def llm_node(state):
                input_key = config.get("input_key", "input")
                output_key = config.get("output_key", "output")
                
                logger.debug(f"Running simple LLM node", data={
                    "input_key": input_key,
                    "output_key": output_key
                })
                
                if input_key in state:
                    result = llm.invoke(state[input_key])
                    return {output_key: result.content}
                return {}
            
            return llm_node
    
    elif node_type == "tool":
        # Create a tool node
        tool_type = config.get("tool_type", "")
        
        logger.debug(f"Creating tool node", data={"tool_type": tool_type})
        
        if tool_type == "search":
            from langchain_community.tools.tavily_search import TavilySearchResults
            
            search_tool = TavilySearchResults(max_results=config.get("max_results", 3))
            
            def search_node(state):
                input_key = config.get("input_key", "query")
                output_key = config.get("output_key", "search_results")
                
                logger.debug(f"Running search tool node", data={
                    "input_key": input_key,
                    "output_key": output_key
                })
                
                if input_key in state:
                    result = search_tool.invoke(state[input_key])
                    return {output_key: result}
                return {}
            
            return search_node
        
        # Add more tool types as needed
        
        # Default empty tool
        logger.warning(f"Unknown tool type: {tool_type}")
        return lambda state: {}
    
    elif node_type == "human":
        # Create a human-in-the-loop node
        # This is just a placeholder - in a real app, this would interact with the UI
        logger.debug(f"Creating human node")
        
        def human_node(state):
            input_key = config.get("input_key", "human_input")
            output_key = config.get("output_key", "human_response")
            
            logger.debug(f"Running human node", data={
                "input_key": input_key,
                "output_key": output_key
            })
            
            # In a real app, this would wait for user input
            # For now, just pass through any existing input
            if input_key in state:
                return {output_key: state[input_key]}
            return {}
        
        return human_node
    
    elif node_type == "transform":
        # Create a transform node that applies a transformation to the state
        transform_type = config.get("transform_type", "")
        
        logger.debug(f"Creating transform node", data={"transform_type": transform_type})
        
        if transform_type == "extract_json":
            def extract_json_node(state):
                input_key = config.get("input_key", "input")
                output_key = config.get("output_key", "output")
                
                logger.debug(f"Running extract_json transform node", data={
                    "input_key": input_key,
                    "output_key": output_key
                })
                
                if input_key in state:
                    try:
                        # Try to extract JSON from the input
                        text = state[input_key]
                        # Find JSON-like patterns
                        start_idx = text.find("{")
                        end_idx = text.rfind("}")
                        
                        if start_idx >= 0 and end_idx > start_idx:
                            json_str = text[start_idx:end_idx+1]
                            result = json.loads(json_str)
                            return {output_key: result}
                    except Exception as e:
                        logger.warning(f"Failed to extract JSON: {str(e)}")
                        # If extraction fails, return the original text
                        return {output_key: state[input_key]}
                return {}
            
            return extract_json_node
        
        # Add more transform types as needed
        
        # Default pass-through transform
        logger.warning(f"Unknown transform type: {transform_type}")
        def pass_through(state):
            input_key = config.get("input_key", "input")
            output_key = config.get("output_key", "output")
            
            logger.debug(f"Running pass-through transform node", data={
                "input_key": input_key,
                "output_key": output_key
            })
            
            if input_key in state:
                return {output_key: state[input_key]}
            return {}
        
        return pass_through
    
    # Default empty node
    logger.warning(f"Unknown node type: {node_type}")
    return lambda state: {}

def create_router_function(condition: Dict[str, Any], destinations: List[str]) -> Callable:
    """
    Create a router function for conditional edges.
    
    Args:
        condition: Configuration for the condition
        destinations: List of possible destinations
        
    Returns:
        A callable function that routes to one of the destinations
    """
    condition_type = condition.get("type", "key_value")
    
    logger.debug(f"Creating router function", data={
        "condition_type": condition_type,
        "destinations": destinations
    })
    
    if condition_type == "key_value":
        # Route based on a key's value
        key = condition.get("key", "")
        value_map = condition.get("value_map", {})
        default = condition.get("default", destinations[0] if destinations else None)
        
        def key_value_router(state):
            if key in state:
                value = state[key]
                # Convert value to string for comparison
                str_value = str(value)
                
                logger.debug(f"Routing based on key value", data={
                    "key": key,
                    "value": str_value
                })
                
                if str_value in value_map:
                    return value_map[str_value]
            
            logger.debug(f"Using default route", data={"default": default})
            return default
        
        return key_value_router
    
    elif condition_type == "function":
        # Route based on a custom function
        # This is just a placeholder - in a real app, this would be more sophisticated
        function_code = condition.get("function", "")
        default = condition.get("default", destinations[0] if destinations else None)
        
        # WARNING: Using eval is dangerous in production!
        # This is just for demonstration purposes
        try:
            # Create a function that takes a state and returns a destination
            router_func = eval(f"lambda state: {function_code}")
            
            def function_router(state):
                try:
                    logger.debug(f"Routing based on custom function")
                    result = router_func(state)
                    
                    if result in destinations:
                        logger.debug(f"Custom function route", data={"route": result})
                        return result
                    
                    logger.debug(f"Using default route", data={"default": default})
                    return default
                except Exception as e:
                    logger.error(f"Error in custom routing function: {str(e)}")
                    return default
            
            return function_router
        except Exception as e:
            logger.error(f"Failed to create custom routing function: {str(e)}")
            # If the function is invalid, return a default router
            return lambda state: default
    
    # Default router that always returns the first destination
    logger.warning(f"Unknown condition type: {condition_type}")
    return lambda state: destinations[0] if destinations else None

def run_graph(graph, inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run a compiled LangGraph with the given inputs.
    
    Args:
        graph: A compiled LangGraph
        inputs: Input values for the graph
        
    Returns:
        The final state after running the graph
    """
    try:
        logger.info("Running LangGraph", data={"inputs": list(inputs.keys())})
        
        # Run the graph
        result = graph.invoke(inputs)
        
        logger.info("LangGraph execution completed successfully")
        return result
    except Exception as e:
        logger.error(f"Error running LangGraph: {str(e)}")
        raise ValueError(f"Failed to run LangGraph: {str(e)}") 