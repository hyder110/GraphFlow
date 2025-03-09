from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import json
import os
import logging
import time
from datetime import datetime
import uuid
from contextlib import asynccontextmanager

# Import database and models (to be created)
from .database import get_db, engine, Base
from .models import Graph, GraphNode, GraphEdge, GraphExecution
from .schemas import GraphCreate, GraphResponse, GraphNodeCreate, GraphEdgeCreate, GraphRun, GraphUpdate
from .langgraph_builder import build_langgraph_from_definition, run_graph
from . import logger

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("graphflow-api")

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting GraphFlow API")
    yield
    logger.info("Shutting down GraphFlow API")

app = FastAPI(title="GraphFlow API", description="API for managing and running LangGraph workflows", lifespan=lifespan)

# Add middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    logger.info(f"Request {request_id} started: {request.method} {request.url.path}")
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(f"Request {request_id} completed: {response.status_code} in {process_time:.3f}s")
    
    return response

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to GraphFlow API"}

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    logger.info("Health check endpoint called")
    return {"status": "ok"}

@app.post("/api/graphs", response_model=GraphResponse)
def create_graph(graph: GraphCreate, db: Session = Depends(get_db)):
    """Create a new graph"""
    logger.info("Creating new graph", data={"name": graph.name})
    
    # Create a new graph
    db_graph = Graph(
        name=graph.name,
        description=graph.description,
        definition=graph.definition
    )
    
    # Save to database
    db.add(db_graph)
    db.commit()
    db.refresh(db_graph)
    
    logger.info("Graph created successfully", data={"graph_id": db_graph.id})
    return db_graph

@app.get("/api/graphs", response_model=List[GraphResponse])
def get_graphs(db: Session = Depends(get_db)):
    """Get all graphs"""
    logger.info("Fetching all graphs")
    graphs = db.query(Graph).all()
    return graphs

@app.get("/api/graphs/{graph_id}", response_model=GraphResponse)
def get_graph(graph_id: int, db: Session = Depends(get_db)):
    """Get a specific graph by ID"""
    logger.info("Fetching graph", data={"graph_id": graph_id})
    graph = db.query(Graph).filter(Graph.id == graph_id).first()
    if not graph:
        logger.warning("Graph not found", data={"graph_id": graph_id})
        raise HTTPException(status_code=404, detail=f"Graph with ID {graph_id} not found")
    return graph

@app.put("/api/graphs/{graph_id}", response_model=GraphResponse)
def update_graph(graph_id: int, graph: GraphCreate, db: Session = Depends(get_db)):
    """Update a graph"""
    logger.info("Updating graph", data={"graph_id": graph_id})
    
    # Get the existing graph
    db_graph = db.query(Graph).filter(Graph.id == graph_id).first()
    if not db_graph:
        logger.warning("Graph not found for update", data={"graph_id": graph_id})
        raise HTTPException(status_code=404, detail=f"Graph with ID {graph_id} not found")
    
    # Update the graph
    db_graph.name = graph.name
    db_graph.description = graph.description
    db_graph.definition = graph.definition
    
    # Save to database
    db.commit()
    db.refresh(db_graph)
    
    logger.info("Graph updated successfully", data={"graph_id": graph_id})
    return db_graph

@app.delete("/api/graphs/{graph_id}")
def delete_graph(graph_id: int, db: Session = Depends(get_db)):
    """Delete a graph"""
    logger.info("Deleting graph", data={"graph_id": graph_id})
    
    # Get the existing graph
    db_graph = db.query(Graph).filter(Graph.id == graph_id).first()
    if not db_graph:
        logger.warning("Graph not found for deletion", data={"graph_id": graph_id})
        raise HTTPException(status_code=404, detail=f"Graph with ID {graph_id} not found")
    
    # Delete the graph
    db.delete(db_graph)
    db.commit()
    
    logger.info("Graph deleted successfully", data={"graph_id": graph_id})
    return {"message": "Graph deleted successfully"}

@app.post("/api/graphs/{graph_id}/run", response_model=Dict[str, Any])
def run_graph_endpoint(graph_id: int, run_input: GraphRun, db: Session = Depends(get_db)):
    """Run a graph with the provided input"""
    logger.info("Running graph", data={"graph_id": graph_id})
    
    try:
        # Get the graph
        graph = db.query(Graph).filter(Graph.id == graph_id).first()
        if not graph:
            logger.warning("Graph not found for execution", data={"graph_id": graph_id})
            raise HTTPException(status_code=404, detail=f"Graph with ID {graph_id} not found")
        
        # Build the graph
        logger.debug("Building graph from definition", data={"graph_id": graph_id})
        langgraph = build_langgraph_from_definition(graph.definition)
        
        # Run the graph
        logger.debug("Executing graph", data={"graph_id": graph_id, "input": run_input.input})
        result = run_graph(langgraph, {"input": run_input.input})
        
        logger.info("Graph execution completed successfully", data={"graph_id": graph_id})
        
        # Save the execution result
        execution_time = datetime.now()
        db_execution = GraphExecution(
            graph_id=graph_id,
            input_data=json.dumps(run_input.input),
            output_data=json.dumps(result),
            execution_time=execution_time
        )
        db.add(db_execution)
        db.commit()
        
        return {
            "result": result,
            "execution_id": db_execution.id,
            "execution_time": execution_time
        }
    except Exception as e:
        logger.error(f"Error running graph: {str(e)}", data={"graph_id": graph_id, "error": str(e)})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to run graph: {str(e)}"
        )

@app.get("/api/graphs/{graph_id}/executions", response_model=List[GraphExecution])
def get_graph_executions(graph_id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching executions for graph ID: {graph_id}")
    executions = db.query(GraphExecution).filter(
        GraphExecution.graph_id == graph_id
    ).order_by(GraphExecution.execution_time.desc()).all()
    
    return executions

if __name__ == "__main__":
    import uvicorn
    from .https_config import get_https_config
    
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    
    # Get HTTPS configuration if enabled
    https_config = get_https_config()
    
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run("app.api.main:app", host=host, port=port, reload=True, **https_config) 