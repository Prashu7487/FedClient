from fastapi import APIRouter
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from utils.db import get_db
from crud.trainings_crud import create_training, get_training_details
import requests
import subprocess
import json
import os
import random

model_router = APIRouter(tags = ["Model Training"])
BASE_URL = os.getenv("API_BASE_URL")
get_training_url = f"{BASE_URL}/get-federated-session"
get_params_url = f"{BASE_URL}/get-model-parameters"
post_params_url = f"{BASE_URL}/receive-client-parameters"

@model_router.post("/initiate-model")
def initiate_model(session_id: int, client_token: str, db: Session = Depends(get_db)):
    try:
        headers = {
            'Authorization': f"Bearer {client_token}",  # Using Bearer token
            'Content-Type': 'application/json',
        }
        response = requests.post(f"{get_training_url}/{session_id}",headers=headers)
        response.raise_for_status() 
        result = response.json()  
        training_details = {"session_id": session_id, "training_details": result.federated_info}

        # Create a new training session in the database
        db_training = create_training(db, training_details)

        if db_training is dict and "error" in db_training:
            raise HTTPException(status_code=400, detail=db_training["error"])
    except Exception as e:
        print(f"Error initiating model: {e}")
        return {"error": str(e)}
    

@model_router.get("/execute-round")
def run_script(session_id: int, client_token: str, db: Session = Depends(get_db)):
    try:
        # Fetch the training details from the database
        training_details = get_training_details(db, session_id)

        if training_details is dict and "error" in training_details:
            raise HTTPException(status_code=404, detail=training_details["error"])
        
        # Construct the command to run the script
        model_path = f"/backend/app/storage/model_config/{session_id}.json"
        result = subprocess.run(["python", "/backend/app/utils/training_script.py", model_path, client_token], capture_output=True, text=True, encoding='utf-8')
        
        return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}  
    except Exception as e:
        print(f"Error executing round: {e}")
        return {"error": str(e)}









































# # Paths for model configuration and training data
# # model_path = "/backend/app/storage/model_config"
# model_path = "/"
# data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
# train_X_path = os.path.join(data_dir, "X_train.npy")
# train_Y_path = os.path.join(data_dir, "Y_train.npy")
# utils_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "utils")
# training_script_path = os.path.join(utils_path, "training_script.py")

# # Ensure the directory exists
# os.makedirs(model_path, exist_ok=True)

# # Determine the server argument
# environment = os.getenv('ENVIRONMENT')
# server_argument = '--production' if environment == 'production' else '--development'

# def generate_random_hex(n):
#     if n <= 0:
#         raise ValueError("Length of the hex string must be greater than 0")
#     # Generate a random hex string
#     return ''.join(random.choices('0123456789abcdef', k=n))

# @model_router.post("/initiate-model")
# def initiate_model(modelConfig: dict):
#     local_model_id = None

#     while local_model_id == None or os.path.exists(model_file):
#         local_model_id = generate_random_hex(18)
#         model_file = f"{model_path}/{local_model_id}.json"

#     with open(model_file, 'w') as json_file:
#         json.dump(modelConfig, json_file, indent=4)
#     return {
#         "message": "model configuration saved",
#         "local_model_id": local_model_id
#     }

# @model_router.get("/execute-round")
# def run_script(local_model_id: str):
#     # Run the script using subprocess
#     model_path_with_id = f"{model_path}/{local_model_id}.json"
#     result = subprocess.run(["python", training_script_path, model_path_with_id, train_X_path, train_Y_path, server_argument], capture_output=True, text=True, encoding='utf-8')
#     return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}  




