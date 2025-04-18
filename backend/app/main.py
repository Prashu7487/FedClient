from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import uvicorn
import requests
from api import preprocessing_routes
from api import model_training_routes
from api import confidential_routers    
from api import qpd_routers
"""
  Don't start this server from terminal without specifying port (9000 or something unused) in the command,
  otherwise by default 8000 port will conflict with federated server


  Dataset link: https://drive.google.com/drive/folders/11fclSnlnfEvgYukFkUk9ienmv7SzHmv2?usp=drive_link
  Please download respective client datasets and adjust the paths accordingly (preferably keep in PrivateServer\data directory).

  NOTE: adjust the directory of training_script
"""
load_dotenv()
environment = os.getenv('ENVIRONMENT')

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # OR Define the origins that should be allowed to make requests 'origins = ["http://localhost:5173",]'
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Including routers
app.include_router(preprocessing_routes.dataset_router)
app.include_router(model_training_routes.model_router)
app.include_router(confidential_routers.confidential_router)
app.include_router(qpd_routers.qpd_router)

# Temporary testing endpoints
@app.get("/testing")
def testing():
    try:
        response = requests.get("http://host.docker.internal:8000/datasets")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return f"Error Connecting to FedServer: {e}"

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=9090)


# Paths for model configuration and training data
# model_path = "/backend/app/storage/model_config"
# data_dir = os.path.join(os.path.dirname(__file__), 'data')
# train_X_path = os.path.join(data_dir, "X_train.npy")
# train_Y_path = os.path.join(data_dir, "Y_train.npy")
# training_script_path = os.path.join(os.path.dirname(__file__), "training_script.py")

# Ensure the directory exists
# os.makedirs(model_path, exist_ok=True)

# Get the environment (default to 'development' if not set)

# print(environment)

# # Determine the server argument
# server_argument = '--production' if environment == 'production' else '--development'

# def generate_random_hex(n):
#     if n <= 0:
#         raise ValueError("Length of the hex string must be greater than 0")
#     # Generate a random hex string
#     return ''.join(random.choices('0123456789abcdef', k=n))

# @app.post("/initiate-model")
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

# @app.get("/execute-round")
# def run_script(local_model_id: str):
#     # Run the script using subprocess
#     model_path_with_id = f"{model_path}/{local_model_id}.json"
#     result = subprocess.run(["python", training_script_path, model_path_with_id, train_X_path, train_Y_path, server_argument], capture_output=True, text=True, encoding='utf-8')
#     return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}  

# http://localhost:9000/initiate-model
# http://localhost:9000/execute-round

