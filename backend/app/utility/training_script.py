import requests
import json
import os
import numpy as np
from .model_builder import model_instance_from_config
import argparse
from .db import get_db
from sqlalchemy.orm import Session
from models.Trainings import CurrentTrainings

# Start from the current script's file location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
print("SCRIPT_Working_DIR",SCRIPT_DIR)

# Go three directories up
BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", ".."))


def get_model_config(session_id: int):
    db: Session = next(get_db())
    try:
        record = db.query(CurrentTrainings).filter_by(session_id=session_id).first()
        if not record:
            raise ValueError(f"No training config found for session_id {session_id}")
        return record.training_details
    finally:
        db.close()

def receive_global_parameters(url,session_id,client_token):
    try:
        response = requests.get(url+"/"+session_id)
        response.raise_for_status()  # Raise an HTTPError for bad responses 
        data = response.json()  # Assuming the response is in JSON format
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
        return None

def send_updated_parameters(url, payload, client_token):
    try:
        headers = {
            "Authorization": f"Bearer {client_token}",  # Using Bearer token
            "Content-Type": "application/json"         # Specify the payload format
        }
        print("Payload : ", type(payload["client_parameter"]))
        response = requests.post(url, json=payload, headers=headers)
        # Debug output
        print("Status Code:", response.status_code)
        print("Response Text:", response.text)
        
        response.raise_for_status()  # Raise an HTTPError for bad responses
        print("Response.json() - ", response.json())  # Assuming the response is in JSON format
    except requests.exceptions.RequestException as e:
        print(f"Error posting data to {url}: {e}")



def main(session_id, client_token):
    try:
        # ==== HARDCODED CONFIGURATION ====
        BASE_URL = "http://host.docker.internal:8000"
        get_url = f"{BASE_URL}/get-model-parameters"
        post_url = f"{BASE_URL}/receive-client-parameters"
        
        model_config = get_model_config(session_id)
        

        # ==== Load model ====
        model = model_instance_from_config(model_config)
        print("Model built successfully")

        X_path = os.path.join("data", f"X_1.npy")
        Y_path = os.path.join("data", f"Y_1.npy")

        X = np.load(X_path)
        Y = np.load(Y_path)
        

        # ==== Load and update global parameters ====
        global_parameters = receive_global_parameters(get_url, session_id, client_token)
        print("Checkpoint isFirst : ", global_parameters["is_first"])
        if global_parameters and global_parameters['is_first'] == 0:
            print("Checkpint global_parameters: ", len)
            model.update_parameters(global_parameters['global_parameters'])

        # ==== Save current local parameters ====
        with open("local_parameters.txt", "a", encoding="utf-8") as f:
            f.write("\n---\n")
            f.write(json.dumps(model.get_parameters()))
            f.write("\n")

        print("Local parameters saved to local_parameters.txt")

        # ==== Train ====
        model.fit(X, Y)

        # Save updated parameters after training
        with open("updated_parameters.txt", "a", encoding="utf-8") as f:
            f.write("\n--- Updated Parameters After Training ---\n")
            f.write(json.dumps(model.get_parameters()))
            f.write("\n")
        # ==== Send updated parameters ====
        updated_parameters = model.get_parameters()
        print("Checkpoint Updated_parameters: ", updated_parameters)
        payload = {
            "session_id": int(session_id),
            "client_parameter": updated_parameters
        }

        send_updated_parameters(post_url, payload, client_token)
        print("Parameters sent to server")

    except Exception as e:
        print(f"Error from training_script: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--session_id", required=True, help="Session ID")
    parser.add_argument("--client_token", required=True, help="Client Token")  
    args = parser.parse_args()

    main(args.session_id, args.client_token)

