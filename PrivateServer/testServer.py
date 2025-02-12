from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json
import os
import shutil
from dotenv import load_dotenv

"""
  NOTE: adjust the directory of training_script
"""

load_dotenv()
# Paths for model configuration and training data
model_path = "model_config.json"
data_dir = os.path.join(os.path.dirname(__file__), 'data')
train_X_path = os.path.join(data_dir, "X_train.npy")
train_Y_path = os.path.join(data_dir, "Y_train.npy")
training_script_path = os.path.join(os.path.dirname(__file__), "training_script.py")

# Get the environment (default to 'development' if not set)
environment = os.getenv('ENVIRONMENT')
# print(environment)

# Determine the server argument
server_argument = '--production' if environment == 'production' else '--development'

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # OR Define the origins that should be allowed to make requests 'origins = ["http://localhost:5173",]'
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/initiate-model")
def initiate_model(modelConfig: dict):
    with open(model_path, 'w') as json_file:
        json.dump(modelConfig, json_file, indent=4)
    return {"message": "model configuration saved"}

@app.get("/execute-round")
def run_script():
    # Run the script using subprocess
    result = subprocess.run(["python", training_script_path, model_path, train_X_path, train_Y_path, server_argument], capture_output=True, text=True, encoding='utf-8')
    return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}  

@app.get("/check")
def check_environment():
    return {"environment": environment}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    #  The UploadFile class from FastAPI will process the incoming file. It allows access to the file’s metadata and content.
    # File(...) specifies that file is a required parameter, and tells FastAPI to expect the file from the client as part of the form data.

    save_path = os.path.join(data_dir, file.filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"message": f'{file.filename} uploaded successfully'}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=9000)

# http://localhost:9000/initiate-model
# http://localhost:9000/execute-round
