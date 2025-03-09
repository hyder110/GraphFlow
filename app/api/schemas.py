from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
from datetime import datetime

# Graph schemas
class GraphBase(BaseModel):
    name: str
    description: Optional[str] = None
    definition: Dict[str, Any]

class GraphCreate(GraphBase):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class GraphUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None

class Graph(GraphBase):
    id: int
    nodes: str  # JSON string of nodes
    edges: str  # JSON string of edges
    created_at: datetime
    updated_at: datetime

    model_config = {
        "orm_mode": True,
        "from_attributes": True
    }

# Response model for Graph
class GraphResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    definition: Dict[str, Any]
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    model_config = {
        "orm_mode": True,
        "from_attributes": True
    }

# Node schemas
class GraphNodeBase(BaseModel):
    node_id: str
    node_type: str
    config: Optional[Dict[str, Any]] = None
    position_x: Optional[int] = None
    position_y: Optional[int] = None

class GraphNodeCreate(GraphNodeBase):
    graph_id: int

class GraphNodeResponse(GraphNodeBase):
    id: int
    graph_id: int

    model_config = {
        "orm_mode": True
    }

# Edge schemas
class GraphEdgeBase(BaseModel):
    source_id: str
    target_id: str
    edge_type: Optional[str] = None
    condition: Optional[str] = None

class GraphEdgeCreate(GraphEdgeBase):
    graph_id: int

class GraphEdgeResponse(GraphEdgeBase):
    id: int
    graph_id: int

    model_config = {
        "orm_mode": True
    }

# Run schemas
class GraphRun(BaseModel):
    input: Dict[str, Any] = Field(default_factory=dict)

class GraphRunResponse(BaseModel):
    id: int
    graph_id: int
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    status: str
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {
        "orm_mode": True
    }

# Graph execution schemas
class GraphExecutionBase(BaseModel):
    graph_id: int
    input_data: Dict[str, Any]
    output_data: Dict[str, Any]

class GraphExecutionCreate(GraphExecutionBase):
    pass

class GraphExecution(GraphExecutionBase):
    id: int
    execution_time: datetime

    model_config = {
        "orm_mode": True,
        "from_attributes": True
    }

# Input for running a graph
class GraphRunInput(BaseModel):
    input: Dict[str, Any] = Field(..., description="Input data for the graph execution") 