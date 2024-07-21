from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json
import os


"""
  Don't start this server from terminal without specifying port (9000 or something unused) in the command,
  otherwise by default 8000 port will conflict with federated server


  Dataset link: https://drive.google.com/drive/folders/11fclSnlnfEvgYukFkUk9ienmv7SzHmv2?usp=drive_link
  Please download respective client datasets and adjust the paths accordingly (preferably keep in PrivateServer\data directory).

  NOTE: adjust the directory of training_script
"""

# NOne -> null, and False-> false is a big big issue...for common error

""" 
    These paths can be directly accessed in the training_script, but this setting allows more freedom in general setting...
    for e.g. if dataset path is changed then client should not modify in actual training_script.
"""

""" NOTE: changing path requires restarting of the server for obvious reasons"""

model_path = "model_config.json"
# (put data in PrivateServer\data)
# train_X_path = r"PrivateServer\data\X_train.npy"
# train_Y_path = r"PrivateServer\data\Y_train.npy"

# OR with this one (put data in FedClient)
train_X_path = r"D:\FedClient\X_train.npy" 
train_Y_path = r"D:\FedClient\Y_train.npy"

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


@app.get("/execute-round")
def run_script():
    # Run the script using subprocess "PrivateServer\training_script.py"
    print(train_X_path)
    # print(os.getcwd())

    result = subprocess.run(["python", r"D:\FedClient\PrivateServer\training_script.py",model_path,train_X_path,train_Y_path], capture_output=True, text=True)
    return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=9000)


# http://localhost:9000/initiate-model
# http://localhost:9000/execute-round
# 


