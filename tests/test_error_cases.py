import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.main import app
from app.api.database import Base, get_db
from app.api.models import Graph, User
from app.api.langgraph_builder import build_langgraph_from_definition, run_graph

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create a test client
client = TestClient(app)

@pytest.fixture
def test_db():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    
    # Create a test user
    db = TestingSessionLocal()
    test_user = User(username="testuser", email="test@example.com")
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    
    yield db
    
    # Clean up
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def sample_graph_definition():
    return {
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
            }
        ],
        "edges": [
            {
                "source": "START",
                "target": "node1"
            },
            {
                "source": "node1",
                "target": "END"
            }
        ],
        "state_type": "dict"
    }

def test_create_graph_missing_fields(test_db):
    # Test creating a graph with missing required fields
    response = client.post(
        "/graphs/",
        json={
            "name": "Test Graph",
            # Missing description
            # Missing definition
            "user_id": 1
        }
    )
    
    assert response.status_code == 422  # Unprocessable Entity

def test_create_graph_invalid_definition(test_db):
    # Test creating a graph with an invalid definition
    response = client.post(
        "/graphs/",
        json={
            "name": "Test Graph",
            "description": "A test graph",
            "definition": {
                # Missing nodes
                "edges": []
            },
            "user_id": 1
        }
    )
    
    assert response.status_code == 422  # Unprocessable Entity

def test_get_nonexistent_graph(test_db):
    # Test getting a graph that doesn't exist
    response = client.get("/graphs/999")
    
    assert response.status_code == 404  # Not Found

def test_update_nonexistent_graph(test_db, sample_graph_definition):
    # Test updating a graph that doesn't exist
    response = client.put(
        "/graphs/999",
        json={
            "name": "Updated Graph",
            "description": "An updated test graph",
            "definition": sample_graph_definition
        }
    )
    
    assert response.status_code == 404  # Not Found

def test_delete_nonexistent_graph(test_db):
    # Test deleting a graph that doesn't exist
    response = client.delete("/graphs/999")
    
    assert response.status_code == 404  # Not Found

@patch("app.api.langgraph_builder.ChatOpenAI")
def test_run_graph_missing_input(mock_chat_openai, test_db, sample_graph_definition):
    # Create a test graph
    response = client.post(
        "/graphs/",
        json={
            "name": "Test Graph",
            "description": "A test graph",
            "definition": sample_graph_definition,
            "user_id": 1
        }
    )
    
    graph_id = response.json()["id"]
    
    # Test running the graph without providing input
    response = client.post(
        f"/graphs/{graph_id}/run",
        json={}  # Missing input
    )
    
    assert response.status_code == 422  # Unprocessable Entity

@patch("app.api.langgraph_builder.ChatOpenAI")
def test_run_graph_llm_error(mock_chat_openai, test_db, sample_graph_definition):
    # Mock the ChatOpenAI class to raise an exception
    mock_llm_instance = MagicMock()
    mock_llm_instance.invoke.side_effect = Exception("LLM error")
    mock_chat_openai.return_value = mock_llm_instance
    
    # Create a test graph
    response = client.post(
        "/graphs/",
        json={
            "name": "Test Graph",
            "description": "A test graph",
            "definition": sample_graph_definition,
            "user_id": 1
        }
    )
    
    graph_id = response.json()["id"]
    
    # Test running the graph with an LLM that raises an error
    response = client.post(
        f"/graphs/{graph_id}/run",
        json={
            "input": "Test input"
        }
    )
    
    assert response.status_code == 500  # Internal Server Error
    assert "error" in response.json()

def test_invalid_node_type(test_db):
    # Test creating a graph with an invalid node type
    invalid_definition = {
        "nodes": [
            {
                "id": "node1",
                "type": "invalid_type",  # Invalid node type
                "config": {}
            }
        ],
        "edges": [
            {
                "source": "START",
                "target": "node1"
            },
            {
                "source": "node1",
                "target": "END"
            }
        ],
        "state_type": "dict"
    }
    
    response = client.post(
        "/graphs/",
        json={
            "name": "Test Graph",
            "description": "A test graph",
            "definition": invalid_definition,
            "user_id": 1
        }
    )
    
    assert response.status_code == 200  # Should still create the graph
    
    graph_id = response.json()["id"]
    
    # Test running the graph with an invalid node type
    response = client.post(
        f"/graphs/{graph_id}/run",
        json={
            "input": "Test input"
        }
    )
    
    assert response.status_code == 500  # Internal Server Error
    assert "error" in response.json()

def test_invalid_edge_configuration(test_db):
    # Test creating a graph with invalid edge configuration
    invalid_definition = {
        "nodes": [
            {
                "id": "node1",
                "type": "llm",
                "config": {
                    "model_name": "gpt-3.5-turbo",
                    "temperature": 0
                }
            },
            {
                "id": "node2",
                "type": "llm",
                "config": {
                    "model_name": "gpt-3.5-turbo",
                    "temperature": 0
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
                "target": "node2",
                "type": "conditional",
                # Missing condition and destinations
            },
            {
                "source": "node2",
                "target": "END"
            }
        ],
        "state_type": "dict"
    }
    
    response = client.post(
        "/graphs/",
        json={
            "name": "Test Graph",
            "description": "A test graph",
            "definition": invalid_definition,
            "user_id": 1
        }
    )
    
    assert response.status_code == 200  # Should still create the graph
    
    graph_id = response.json()["id"]
    
    # Test running the graph with invalid edge configuration
    response = client.post(
        f"/graphs/{graph_id}/run",
        json={
            "input": "Test input"
        }
    )
    
    assert response.status_code == 500  # Internal Server Error
    assert "error" in response.json()

def test_run_nonexistent_graph(test_db):
    # Test running a graph that doesn't exist
    response = client.post(
        "/graphs/999/run",
        json={
            "input": "Test input"
        }
    )
    
    assert response.status_code == 404  # Not Found 