from typing import Dict, Any
from pydantic import BaseModel

class TransferCreate(BaseModel):
    training_name: str
    num_datapoints: int
    parent_filename: str
    federated_session_id: int

