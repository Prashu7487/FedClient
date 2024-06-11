from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
from ModelBuilder import model_instance_from_config
import json
"""
NOTE: adjust the directory of myscript
"""

modelConfig = {
    "model": "LandMarkSVM",
    "config": {
        "C": 1.0,
        "is_binary": False,
        "kernel": "rbf",
        "gamma": "auto",
        "degree": 3,
        "coef0": 0.0,
        "lr": 0.01,
        "n_iters": 100,
        "landmarks": None,
        "num_landmarks": 15,
        "weights_shape": None
    }
}

model = None

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  ## OR Define the origins that should be allowed to make requests 'origins = ["http://localhost:5173",]'
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/initiate-model")
def initiate_model(modelConfig: dict):  # should be a JSON not dict ??**********
    model = model_instance_from_config(modelConfig)

# methods = [method_name for method_name in dir(model) if callable(getattr(model, method_name)) and not method_name.startswith("__")]
# print(methods)
   


@app.get("/execute-round")
def run_script():
    # Run the script using subprocess
    result = subprocess.run(["python", "PrivateServer\myscript.py"], capture_output=True, text=True)
    return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=9000)

