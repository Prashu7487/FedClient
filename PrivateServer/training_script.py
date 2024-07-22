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
        print(response.text)
        response.raise_for_status()  # Raise an HTTPError for bad responses 
        data = response.json()  # Assuming the response is in JSON format
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
        return None


def send_updated_parameters(url, client_parameter,session_id,client_id):
    try:
        payload = {"client_parameters":client_parameter,"client_id":client_id,"session_id":session_id}
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        result = response.json()  # Assuming the response is in JSON format
        print(result)
    except requests.exceptions.RequestException as e:
        print(f"Error posting data to {url}: {e}")
    

def main():
    try:

        get_url = "http://127.0.0.1:8000/get-model-parameters"
        post_url = "http://localhost:8000/receive-client-parameters"

        model_path = sys.argv[1]
        with open(model_path, 'r') as json_file:
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

        if(global_parameters['is_first']==0):
            model.update_parameters(global_parameters.parameter)
    
        model.fit(X,Y)

        # Sending updated parameters to the server
        updated_model_parameters = model.get_parameters()
        # Assuming updated_model_parameters is a list of lists or similar structure
        for i, item in enumerate(updated_model_parameters):
            for j, item2 in enumerate(item):
                if isinstance(item2, np.ndarray):
                    updated_model_parameters[i][j] = item2.tolist()

        send_updated_parameters(post_url, updated_model_parameters,session_id,client_id)
        print("Parameters sent to server")
        # =======================================================
    except Exception as e:
        print(f"Error from training_script: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
