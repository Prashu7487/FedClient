import os
from utility.hdfs_services import HDFSServiceManager
import pandas as pd
import shutil
import numpy as np
import requests

HDFS_PROCESSED_DATASETS_DIR = os.getenv('HDFS_PROCESSED_DATASETS_DIR')
REACT_APP_SERVER_BASE_URL = os.getenv('REACT_APP_SERVER_BASE_URL')

def send_client_initialize_model_signal(session_id: int, client_token: str) -> bool:
    """
    Notify remote server about successful model initialization
    Returns True if successful, False otherwise
    """
    try:
        headers = {
            "Authorization": f"Bearer {client_token}",
            "Content-Type": "application/json",
        }
        
        data = {"session_id": session_id}
        
        response = requests.post(
            f"{REACT_APP_SERVER_BASE_URL}/client-initialize-model",
            json=data,
            headers=headers
        )
        response.raise_for_status()
        return True
        
    except Exception as e:
        print(f"Error notifying remote server: {e}")
        return False

def process_parquet_and_save_xy(filename: str, session_id: str, output_column: list, client_token: str):
    """
    Download and combine multiple parquet files from HDFS,
    extract X and Y arrays, save them, and return metadata.

    Args:
        filename: HDFS folder name containing parquet files
        session_id: Unique session ID for temp file management
        output_column: Column to be treated as output (target)

    Returns:
        dict: Information about the combined data and saved files
    """

    # Create paths
    hdfs_path = os.path.join(HDFS_PROCESSED_DATASETS_DIR, filename)
    local_dir = os.path.join(os.getcwd(), "data")
    os.makedirs(local_dir, exist_ok=True)

    # Temporary download directory
    temp_download_dir = os.path.join(local_dir, f"temp_{session_id}")
    os.makedirs(temp_download_dir, exist_ok=True)

    # Download from HDFS
    hdfs_service = HDFSServiceManager()
    hdfs_service.download_folder_from_hdfs(hdfs_path, temp_download_dir)

    # Find and combine parquet files
    combined_df = None
    parquet_files = []

    for root, _, files in os.walk(temp_download_dir):
        for file in files:
            if file.endswith('.parquet'):
                file_path = os.path.join(root, file)
                parquet_files.append(file_path)

                df = pd.read_parquet(file_path)
                if combined_df is None:
                    combined_df = df
                else:
                    combined_df = pd.concat([combined_df, df], ignore_index=True)

    shutil.rmtree(temp_download_dir)

    if not parquet_files:
        raise Exception("No parquet files found in the downloaded folder")

    print(f"Combined DataFrame Shape: {combined_df.shape}")
    print(f"DataFrame Column Labels: {combined_df.columns.tolist()}")

    print(combined_df.dtypes)
    
    def reshape_image(img_array):
        stacked = np.stack(img_array, axis=0)  # shape: (224, 224, 1)
        stacked = np.expand_dims(stacked, axis=-1)
        return stacked.astype(np.float32)

    X = np.array([reshape_image(img) for img in combined_df['image']])
    print(f"X shape: {X.shape}")
    
    Y = combined_df[output_column].values
    if len(Y.shape) == 1:
        Y = Y.reshape(-1, 1)  # Ensure 2D shape
    print(f"Y shape: {Y.shape}")
    
    

    # Save to local_dir
    X_filename = os.path.join(local_dir, f"X_{session_id}.npy")
    Y_filename = os.path.join(local_dir, f"Y_{session_id}.npy")

    np.save(X_filename, X)
    np.save(Y_filename, Y)

    # Sending Model Initialization signal to server
    send_client_initialize_model_signal(session_id, client_token)
    return 