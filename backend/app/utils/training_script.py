import requests
import sys
import json
import os
from modelbuilder import model_instance_from_config
import numpy as np

def receive_global_parameters(url,session_id,client_id):
    try:
        response = requests.get(url+"/"+str(session_id))
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
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        result = response.json()  # Assuming the response is in JSON format
    except requests.exceptions.RequestException as e:
        print(f"Error posting data to {url}: {e}")
    

    # =========================================================================================================================
    ###################### Flow of the training (1 epoch by default) ##########################

    # read model_config and build model using model builder
    # Read dataset (from data folder in privateServer)
    # receive global parameters (gets list that is compatible to serialize and send from server) from the central server,
    # .. and update it using update_parameters methd of model (if not first parameter, which is empty)
    # train the model (using fit mthd)
    # obtain new trained parameters using get_parameters methd (this returns a list, compatible to serialize and send)
    # send updated params to the central server
    # =========================================================================================================================


def main():
    try:
        server_argument = sys.argv[4] if len(sys.argv) > 4 else '--development'
        # Get API Base URL from environment variable
        BASE_URL = os.getenv("API_BASE_URL", "http://host.docker.internal:8000")
        
        # Construct URLs dynamically
        get_url = f"{BASE_URL}/get-model-parameters"
        post_url = f"{BASE_URL}/receive-client-parameters"
        
        
        model_path = sys.argv[1]
        with open(model_path, 'r', encoding='utf-8') as json_file:
            modelInfo = json.load(json_file)
    
        session_id = modelInfo['session_id']
        client_id = modelInfo['client_id']
        modelConfig = modelInfo['model_config']

        
        model = model_instance_from_config(modelConfig)
        print("model built successifully")

        X_path = sys.argv[2]
        X = np.load(X_path)

        Y_path = sys.argv[3]
        Y = np.load(Y_path)

        # =======================================================
        #  uncomment when end points implemented
        # =======================================================
        global_parameters = receive_global_parameters(get_url,session_id,client_id)

        if(global_parameters['is_first']==0):
            model.update_parameters(global_parameters['global_parameters'])

        # Save global_parameters string into a file
        file_path = "local_parameters.txt"  # Specify the desired file path and name
        with open(file_path, "a" , encoding="utf-8") as file:
            file.write("\n---\n")  # Add a separator before each new entry
            file.write(json.dumps(model.get_parameters()))  # Append the JSON string
            file.write("\n")  # Add a newline after the entry for readability
        print(f"Local parameters have been saved to {file_path}.")
        
        
        model.fit(X,Y)
        
        # Sending updated parameters to the server
        updated_parameters = model.get_parameters()
        payload = {
            "session_id": session_id,
            "client_parameter": updated_parameters
        }

        send_updated_parameters(post_url, payload, client_id)
        print("Parameters sent to server")
        # =======================================================
    except Exception as e:
        print(f"Error from training_script: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
