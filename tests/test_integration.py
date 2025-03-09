import pytest
import os
import json
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

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

def test_create_and_get_graph(test_db, sample_graph_definition):
    # Test creating a new graph
    response = client.post(
        "/graphs/",
        json={
            "name": "Test Graph",
            "description": "A test graph",
            "definition": sample_graph_definition,
            "user_id": 1
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Graph"
    assert data["description"] == "A test graph"
    assert "id" in data
    
    graph_id = data["id"]
    
    # Test getting the graph
    response = client.get(f"/graphs/{graph_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Graph"
    assert data["description"] == "A test graph"
    assert data["definition"] == sample_graph_definition

def test_list_graphs(test_db, sample_graph_definition):
    # Create a few test graphs
    for i in range(3):
        client.post(
            "/graphs/",
            json={
                "name": f"Test Graph {i}",
                "description": f"A test graph {i}",
                "definition": sample_graph_definition,
                "user_id": 1
            }
        )
    
    # Test listing all graphs
    response = client.get("/graphs/")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["name"] == "Test Graph 0"
    assert data[1]["name"] == "Test Graph 1"
    assert data[2]["name"] == "Test Graph 2"

@patch("app.api.langgraph_builder.ChatOpenAI")
def test_run_graph(mock_chat_openai, test_db, sample_graph_definition):
    # Mock the ChatOpenAI class
    mock_llm_instance = MagicMock()
    mock_llm_instance.invoke.return_value.content = "This is a test result in JSON format: {\"key\": \"value\"}"
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
    
    # Test running the graph
    response = client.post(
        f"/graphs/{graph_id}/run",
        json={
            "input": "Test input"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "final_output" in data
    assert data["final_output"] == {"key": "value"}
    
    # Verify that the LLM was called with the correct input
    mock_llm_instance.invoke.assert_called_once()

def test_update_graph(test_db, sample_graph_definition):
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
    
    # Update the graph
    updated_definition = sample_graph_definition.copy()
    updated_definition["nodes"][0]["config"]["temperature"] = 0.5
    
    response = client.put(
        f"/graphs/{graph_id}",
        json={
            "name": "Updated Graph",
            "description": "An updated test graph",
            "definition": updated_definition
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Graph"
    assert data["description"] == "An updated test graph"
    assert data["definition"]["nodes"][0]["config"]["temperature"] == 0.5
    
    # Verify the update in the database
    response = client.get(f"/graphs/{graph_id}")
    data = response.json()
    assert data["name"] == "Updated Graph"
    assert data["definition"]["nodes"][0]["config"]["temperature"] == 0.5

def test_delete_graph(test_db, sample_graph_definition):
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
    
    # Delete the graph
    response = client.delete(f"/graphs/{graph_id}")
    
    assert response.status_code == 200
    
    # Verify the graph is deleted
    response = client.get(f"/graphs/{graph_id}")
    assert response.status_code == 404 