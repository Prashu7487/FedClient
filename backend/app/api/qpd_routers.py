from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utility.db import get_db
from schemas.training_data_transfer import TransferCreate
import requests
import os

qpd_router = APIRouter(tags=["QPD"])

CREATE_TRANSFERRED_DATA_URL = os.getenv("API_BASE_URL") + "/create-transferred-data/"

@qpd_router.get("/create-qpd-dataset", status_code=201)
def create_qpd_dataset_endpoint(transfer_data: TransferCreate, db: Session = Depends(get_db)):
    # take the training_data_transfers schema and use keys in that to create a dataset 
    # at remote location, then add the results in the database
    print("Received transfer_data:", transfer_data)
    pass

def create_transfer(db: Session, transfer_data: TransferCreate):
    # Logic to write file and return datastats to remote by taking values from transfer_data
    # update transfer_data with the datastats and path then send it to remote server
    # include client toekn to authenticate the request
    overview = None
    transfer_data_dict = transfer_data.dict()
    transfer_data_dict["datastats"] = overview
    transfer_data_dict["data_path"] = "/hdfs/user/client1/data/fed_model_xyz.parquet"

    headers = {"Content-Type": "application/json"}

    response = requests.post(CREATE_TRANSFERRED_DATA_URL, json=transfer_data_dict, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error:", response.status_code, response.text)
        return {"error": "Failed to create transferred data"}

