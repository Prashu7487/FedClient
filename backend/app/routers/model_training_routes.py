from fastapi import APIRouter
import subprocess
import json
import os
import random

router = APIRouter(tags = ["Model Training"])

# Paths for model configuration and training data
# model_path = "/backend/app/storage/model_config"
model_path = "/"
data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
train_X_path = os.path.join(data_dir, "X_train.npy")
train_Y_path = os.path.join(data_dir, "Y_train.npy")
utils_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "utils")
training_script_path = os.path.join(utils_path, "training_script.py")

# Ensure the directory exists
os.makedirs(model_path, exist_ok=True)

# Determine the server argument
environment = os.getenv('ENVIRONMENT')
server_argument = '--production' if environment == 'production' else '--development'

def generate_random_hex(n):
    if n <= 0:
        raise ValueError("Length of the hex string must be greater than 0")
    # Generate a random hex string
    return ''.join(random.choices('0123456789abcdef', k=n))

@router.post("/initiate-model")
def initiate_model(modelConfig: dict):
    local_model_id = None

    while local_model_id == None or os.path.exists(model_file):
        local_model_id = generate_random_hex(18)
        model_file = f"{model_path}/{local_model_id}.json"

    with open(model_file, 'w') as json_file:
        json.dump(modelConfig, json_file, indent=4)
    return {
        "message": "model configuration saved",
        "local_model_id": local_model_id
    }

@router.get("/execute-round")
def run_script(local_model_id: str):
    # Run the script using subprocess
    model_path_with_id = f"{model_path}/{local_model_id}.json"
    result = subprocess.run(["python", training_script_path, model_path_with_id, train_X_path, train_Y_path, server_argument], capture_output=True, text=True, encoding='utf-8')
    return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}  




