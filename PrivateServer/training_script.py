import requests
import sys
import json
import os
from ModelBuilder import model_instance_from_config
import numpy as np

"""
  Dataset link: https://drive.google.com/drive/folders/11fclSnlnfEvgYukFkUk9ienmv7SzHmv2?usp=drive_link
  Please download respective client datasets and adjust the paths accordingly.

"""

def receive_global_parameters(url):
    try:
        response = requests.get(url)
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
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error posting data to {url}: {e}")
        return None


if __name__ == "__main__":
    get_url = "http://localhost:8000/get-parameters"
    post_url = "http://localhost:8000/receive-parameters"

    model_path = sys.argv[1]
    with open(model_path, 'r') as json_file:
        modelConfig = json.load(json_file)
        
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

    # global_parameters = receive_global_parameters(get_url)
    # global_parameters = dict(global_parameters) #see if works without it
    # if global_parameters:
    #     print("Received global weights")

    # if(global_parameters.is_first==0):
    #     model.update_parameters(global_parameters.parameter)
    model.fit(X,Y)
    payload = {"client_parameters":model.get_parameters(),"client_id":1}
    print("successify executed")
    # posted_data = send_updated_parameters(post_url, payload)
    # if posted_data:
    #     print("updated parameters sent")
