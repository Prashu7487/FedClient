import requests
import sys
import json
import os
from ModelBuilder import model_instance_from_config
import numpy as np


def receive_global_parameters(url,session_id,client_id):
    try:
        params = {'session_id': session_id}
        response = requests.get(url+"/"+session_id)
        # print(response.text)
        response.raise_for_status()  # Raise an HTTPError for bad responses 
        data = response.json()  # Assuming the response is in JSON format
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
        return None


def send_updated_parameters(url, payload):
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        result = response.json()  # Assuming the response is in JSON format
        print("response of sending updated paramter to server:", result)
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
        if server_argument == '--production':
            get_url = "https://cdis.iitk.ac.in/fed_server/get-model-parameters"
            post_url = "https://cdis.iitk.ac.in/fed_server/receive-client-parameters"
        else:
            get_url = "http://127.0.0.1:8000/get-model-parameters"
            post_url = "http://localhost:8000/receive-client-parameters"

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
        # print(Y.shape)

        # =======================================================
        #  uncomment when end points implemented
        # =======================================================

        global_parameters = receive_global_parameters(get_url,session_id,client_id)
        # global_parameters = dict(global_parameters) #see if works without it
    
        if global_parameters:
            print("Received global weights")
            # print(global_parameters)

        if(global_parameters['is_first']==0):
            model.update_parameters(global_parameters['global_parameters']) 
    
        model.fit(X,Y)

        # Sending updated parameters to the server
        updated_parameters = model.get_parameters()
        payload = {
            "session_id": session_id,
            "client_id": client_id,
            "client_parameter": updated_parameters
        }

        send_updated_parameters(post_url, payload)
        print("Parameters sent to server")
        # =======================================================
    except Exception as e:
        print(f"Error from training_script: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
