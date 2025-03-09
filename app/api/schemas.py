from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
from datetime import datetime

# Graph schemas
class GraphBase(BaseModel):
    name: str
    description: Optional[str] = None
    definition: Dict[str, Any]

class GraphCreate(GraphBase):
    pass

class GraphResponse(GraphBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

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

    class Config:
        orm_mode = True

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

    class Config:
        orm_mode = True

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

    class Config:
        orm_mode = True 