from pydantic import BaseModel

class CreateTraining(BaseModel):
    session_id: int
    training_details: dict