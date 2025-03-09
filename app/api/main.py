from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import os

# Import database and models (to be created)
from .database import get_db, engine, Base
from .models import Graph, GraphNode, GraphEdge
from .schemas import GraphCreate, GraphResponse, GraphNodeCreate, GraphEdgeCreate, GraphRun

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GraphFlow API", description="API for managing LangGraph workflows")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

@app.post("/api/graphs", response_model=GraphResponse)
def create_graph(graph: GraphCreate, db: Session = Depends(get_db)):
    """Create a new graph definition"""
    db_graph = Graph(
        name=graph.name,
        description=graph.description,
        definition=graph.definition
    )
    db.add(db_graph)
    db.commit()
    db.refresh(db_graph)
    return db_graph

@app.get("/api/graphs", response_model=List[GraphResponse])
def get_graphs(db: Session = Depends(get_db)):
    """Get all graph definitions"""
    return db.query(Graph).all()

@app.get("/api/graphs/{graph_id}", response_model=GraphResponse)
def get_graph(graph_id: int, db: Session = Depends(get_db)):
    """Get a specific graph definition"""
    db_graph = db.query(Graph).filter(Graph.id == graph_id).first()
    if db_graph is None:
        raise HTTPException(status_code=404, detail="Graph not found")
    return db_graph

@app.put("/api/graphs/{graph_id}", response_model=GraphResponse)
def update_graph(graph_id: int, graph: GraphCreate, db: Session = Depends(get_db)):
    """Update a graph definition"""
    db_graph = db.query(Graph).filter(Graph.id == graph_id).first()
    if db_graph is None:
        raise HTTPException(status_code=404, detail="Graph not found")
    
    db_graph.name = graph.name
    db_graph.description = graph.description
    db_graph.definition = graph.definition
    
    db.commit()
    db.refresh(db_graph)
    return db_graph

@app.delete("/api/graphs/{graph_id}")
def delete_graph(graph_id: int, db: Session = Depends(get_db)):
    """Delete a graph definition"""
    db_graph = db.query(Graph).filter(Graph.id == graph_id).first()
    if db_graph is None:
        raise HTTPException(status_code=404, detail="Graph not found")
    
    db.delete(db_graph)
    db.commit()
    return {"message": "Graph deleted successfully"}

@app.post("/api/graphs/{graph_id}/run", response_model=Dict[str, Any])
def run_graph(graph_id: int, run_input: GraphRun, db: Session = Depends(get_db)):
    """Run a graph with the given input"""
    db_graph = db.query(Graph).filter(Graph.id == graph_id).first()
    if db_graph is None:
        raise HTTPException(status_code=404, detail="Graph not found")
    
    # This is a placeholder - actual implementation will use LangGraph
    # to build and run the graph based on the stored definition
    try:
        # Here we would build and run the LangGraph
        # For now, just return a mock response
        return {
            "status": "success",
            "graph_id": graph_id,
            "input": run_input.input,
            "output": "This is a mock response. The actual implementation will run the LangGraph."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running graph: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 