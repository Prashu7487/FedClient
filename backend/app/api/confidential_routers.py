from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.db import get_db
from schemas.dataset import DatasetCreate
from utils.datasets_crud import create_dataset, create_raw_dataset

confidential_router = APIRouter(tags=["confidential"])

@confidential_router.post("/create-dataset", status_code=201)
def create_dataset_endpoint(dataset: DatasetCreate, db: Session = Depends(get_db)):
    return create_dataset(db, dataset)

@confidential_router.post("/create-raw-dataset", status_code=201)
def create_raw_dataset_endpoint(dataset: DatasetCreate, db: Session = Depends(get_db)):
    return create_raw_dataset(db, dataset)