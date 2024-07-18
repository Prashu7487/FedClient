from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json

"""
NOTE: adjust the directory of myscript
"""


# NOne -> null and False-> false is a big big issue...**************
model_path = "model_config.json"
train_X_path = "data\X_train.npy"
train_Y_path =  "data\Y_train.npy"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  ## OR Define the origins that should be allowed to make requests 'origins = ["http://localhost:5173",]'
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/initiate-model")
def initiate_model(modelConfig: dict):  
    with open('model_config.json', 'w') as json_file:
        json.dump(modelConfig, json_file, indent=4)
    return {"message": "model configuration saved"}

# 
# using multiprocessing.Array or multiprocessing.shared_memory in Python
# whereever communication is happening...look again to reduce overhead

@app.get("/execute-round")
def run_script():
    # Run the script using subprocess
    result = subprocess.run(["python", "PrivateServer/traning_script.py",model_path,train_X_path,train_Y_path], capture_output=True, text=True)
    return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=9000)

