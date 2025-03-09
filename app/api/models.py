from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Graph(Base):
    """Model for storing graph definitions"""
    __tablename__ = "graphs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    definition = Column(JSON, nullable=False)  # Stores the complete graph definition as JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    nodes = relationship("GraphNode", back_populates="graph", cascade="all, delete-orphan")
    edges = relationship("GraphEdge", back_populates="graph", cascade="all, delete-orphan")
    runs = relationship("GraphRun", back_populates="graph", cascade="all, delete-orphan")

class GraphNode(Base):
    """Model for storing graph nodes"""
    __tablename__ = "graph_nodes"

    id = Column(Integer, primary_key=True, index=True)
    graph_id = Column(Integer, ForeignKey("graphs.id"))
    node_id = Column(String, index=True)  # ID used in the graph definition
    node_type = Column(String, index=True)  # Type of node (e.g., "llm", "tool", "human")
    config = Column(JSON, nullable=True)  # Node-specific configuration
    position_x = Column(Integer, nullable=True)  # X position in the UI
    position_y = Column(Integer, nullable=True)  # Y position in the UI

    # Relationships
    graph = relationship("Graph", back_populates="nodes")

class GraphEdge(Base):
    """Model for storing graph edges"""
    __tablename__ = "graph_edges"

    id = Column(Integer, primary_key=True, index=True)
    graph_id = Column(Integer, ForeignKey("graphs.id"))
    source_id = Column(String, index=True)  # Source node ID
    target_id = Column(String, index=True)  # Target node ID
    edge_type = Column(String, nullable=True)  # Type of edge (e.g., "default", "conditional")
    condition = Column(Text, nullable=True)  # Condition for conditional edges

    # Relationships
    graph = relationship("Graph", back_populates="edges")

class GraphRun(Base):
    """Model for storing graph execution runs"""
    __tablename__ = "graph_runs"

    id = Column(Integer, primary_key=True, index=True)
    graph_id = Column(Integer, ForeignKey("graphs.id"))
    input_data = Column(JSON, nullable=True)  # Input data for the run
    output_data = Column(JSON, nullable=True)  # Output data from the run
    status = Column(String, index=True)  # Status of the run (e.g., "success", "error")
    error_message = Column(Text, nullable=True)  # Error message if the run failed
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    graph = relationship("Graph", back_populates="runs") 