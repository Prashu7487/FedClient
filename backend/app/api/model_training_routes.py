from fastapi import APIRouter
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from utility.db import get_db
from crud.trainings_crud import create_training, get_training_details
from schemas.trainings import InitiateModelRequest
import requests
import subprocess
from subprocess import CalledProcessError
import json
import os
import random
import sys


model_router = APIRouter(tags = ["Model Training"])
BASE_URL = os.getenv("API_BASE_URL")
get_training_url = f"{BASE_URL}/get-federated-session"
get_params_url = f"{BASE_URL}/get-model-parameters"
post_params_url = f"{BASE_URL}/receive-client-parameters"

# federated_info_mock = {
#     "organisation_name": "test-clinic",
#     "dataset_info": {
#         "client_filename": "test_data.parquet",
#         "output_columns": ["pct_2013"],
#         "task_id": 3,
#         "metric": "MAE"
#     },
#     "model_name": "CNN",
#     "model_info": {
#         "input_shape": "(128,128,1)",
#         "output_layer": {
#             "num_nodes": "1",
#             "activation_function": "sigmoid"
#         },
#         "loss": "mse",
#         "optimizer": "adam",
#         "test_metrics": ["mae"],
#         "layers": [
#             {
#                 "layer_type": "convolution",
#                 "filters": "8",
#                 "kernel_size": "(3,3)",
#                 "stride": "(1,1)",
#                 "activation_function": "relu"
#             },
#             {
#                 "layer_type": "pooling",
#                 "pooling_type": "max",
#                 "pool_size": "(2,2)",
#                 "stride": "(2,2)"
#             },
#             {
#                 "layer_type": "flatten"
#             },
#             {
#                 "layer_type": "dense",
#                 "num_nodes": "64",
#                 "activation_function": "relu"
#             }
#         ]
#     }
# }

  

@model_router.post("/initiate-model")
def initiate_model(request: InitiateModelRequest, db: Session = Depends(get_db)):
    try:
        # ------------------------------------------
        # Fetch client_data from hdfs to data folder
        # ------------------------------------------
        session_id = request.session_id
        client_token = request.client_token
        
        headers = {
            "Authorization": f"Bearer {client_token}",
            "Content-Type": "application/json",
        }

        get_url = f"{get_training_url}/{session_id}"
        response = requests.get(get_url, headers=headers)
        response.raise_for_status()  # Raises HTTPError if not 2xx

        result = response.json()

        training_details = {
            "session_id": session_id,
            "training_details": result.get("federated_info")  # safer with .get
        }
        
        # Store in DB
        db_training = create_training(db, training_details)

        if isinstance(db_training, dict) and "error" in db_training:
            raise HTTPException(status_code=400, detail=db_training["error"])

        return {"message": "Model initiation successful", "training": db_training}

    except requests.exceptions.HTTPError as http_err:
        raise HTTPException(status_code=response.status_code, detail=str(http_err))
    except Exception as e:
        print(f"Error initiating model: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@model_router.get("/execute-round")
def run_script(session_id: int, client_token: str, db: Session = Depends(get_db)):
    env = os.environ.copy()
    try:
        result = subprocess.run(
            [sys.executable, "-m", "utility.training_script", "--session_id", str(session_id), "--client_token", client_token],
            capture_output=True,
            text=True,
            check=True,
            env=env
        )

        with open("stdout_output.txt", "a") as out_file:
            out_file.write("\n---\n")
            out_file.write(result.stdout)
            out_file.write("\n---\n")

        with open("stderr_output.txt", "a") as err_file:
            err_file.write("\n---\n")
            err_file.write(result.stderr)
            err_file.write("\n---\n")

        return {
            "message": "Script executed successfully",
            "stdout": result.stdout,
            "stderr": result.stderr
        }

    except CalledProcessError as e:
        # Log exact stdout/stderr from the failing subprocess
        with open("stdout_output.txt", "a") as out_file:
            out_file.write("\n--- ERROR ---\n")
            out_file.write(e.stdout or "No stdout")
            out_file.write("\n---\n")

        with open("stderr_output.txt", "a") as err_file:
            err_file.write("\n--- ERROR ---\n")
            err_file.write(e.stderr or "No stderr")
            err_file.write("\n---\n")

        return {
            "error": "Script failed",
            "stdout": e.stdout,
            "stderr": e.stderr
        }

    except Exception as e:
        return {
            "error": "Unexpected error",
            "detail": str(e)
        }








































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




