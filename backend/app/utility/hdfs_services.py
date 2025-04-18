import os
from hdfs import InsecureClient
from dotenv import load_dotenv

load_dotenv()

HDFS_URL = os.getenv("HDFS_URL")
HADOOP_USER_NAME = os.getenv("HADOOP_USER_NAME")
HDFS_RAW_DATASETS_DIR = os.getenv("HDFS_RAW_DATASETS_DIR")
HDFS_PROCESSED_DATASETS_DIR = os.getenv("HDFS_PROCESSED_DATASETS_DIR")
RECENTLY_UPLOADED_DATASETS_DIR = os.getenv("RECENTLY_UPLOADED_DATASETS_DIR")
"""
NOTE: HDFS session is created and destroyed on demand, so there is no session created when __init__ method is called.
"""
class HDFSServiceManager:
    def __init__(self):
        """
        Initialize HDFSServiceManager with basic settings.
        HDFS connection is not persistent and will be established only when required.
        """
        self.buffer = b""
        self.file_name = ""

    def _with_hdfs_client(self, operation):
        """
        Internal utility to manage HDFS connection asynchronously.
        Offloads HDFS operations to a separate thread to avoid blocking the event loop.
        """
        def wrapped_operation():
            client = InsecureClient(HDFS_URL, user=HADOOP_USER_NAME)
            try:
                return operation(client)
            except Exception as e:
                print(f"Error during HDFS operation: {e}")
                raise Exception(f"Error during HDFS operation: {e}")
            finally:
                client = None  # Explicitly clean up the client

        # Offloading the blocking operation to a thread ...didn't work for some reason
        # return asyncio.to_thread(wrapped_operation)
        return wrapped_operation()

    async def delete_file_from_hdfs(self, directory, filename):
        """
        Delete a file from HDFS, don't make this method async (sync nature required for few use cases)
        """
        hdfs_path = os.path.join(directory, filename)
        print(f"Deleting {hdfs_path} from HDFS...")
        def delete(client):
            status = client.delete(hdfs_path,recursive=True)
            if status:
                print(f"Deleted {hdfs_path} from HDFS.")
            else:
                print(f"Failed to delete {hdfs_path} from HDFS.")
                raise Exception(f"Failed to delete {hdfs_path} from HDFS.")

        try:
            return self._with_hdfs_client(delete)
        except Exception as e:
            raise Exception(f"Error deleting file from HDFS: {e}")

    async def list_recent_uploads(self):
        def human_readable_size(size_in_bytes):
            """Convert size in bytes to human-readable format (KB, MB, GB, etc.)."""
            for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
                if size_in_bytes < 1024.0:
                    return f"{size_in_bytes:.2f} {unit}"
                size_in_bytes /= 1024.0
            return f"{size_in_bytes:.2f} PB"

        def list_files(client):
            result = {'contents': {}, 'error': None}
            try:
                files = client.list(f"/user/{HADOOP_USER_NAME}/{RECENTLY_UPLOADED_DATASETS_DIR}", status=True)
                files = [{"filename": entry[0], "size": human_readable_size(entry[1]["length"])} for entry in files if entry[1]["type"] == "FILE"]
                result['contents'] = {RECENTLY_UPLOADED_DATASETS_DIR: files}
                return result
            except Exception as e:
                print(f"Error listing files in HDFS: {e}")
                raise Exception(f"Error listing files in HDFS: {e}")
            

        return self._with_hdfs_client(list_files)
    
    async def testing_list_all_datasets(self):
        def list_files(client):
            result = {'contents': {}, 'error': None}
            try:
                files = client.list(f"/user/{HADOOP_USER_NAME}/{RECENTLY_UPLOADED_DATASETS_DIR}", status=True)
                result['contents'] = files
            except Exception as e:
                result['error'] = str(e)
            return result

        return self._with_hdfs_client(list_files)


    async def rename_file_or_folder(self,source_path, destination_path):
        """
        Rename a file in HDFS.
        NOTE: If the destination_path already exists and is a directory, the source will be moved into it
        """
        def rename(client):
            client.rename(source_path, destination_path)
            print(f"Renamed {source_path} to {destination_path} in HDFS.")

        try:
            return self._with_hdfs_client(rename)
        except Exception as e:
            print(f"Error renaming file in HDFS: {e}")
            raise Exception(f"Error renaming file in HDFS: {e}")

    ########## Don't delete ################
    # this method is never used in the current implementation of FedData

    # def list_all_content(self):
    #     """
    #     List files and directories in the specified HDFS directory.
    #     """
    #     def list_files(client):
    #         result = {'contents': {}, 'error': None}
    #         try:
    #             dirs = client.list(f"/user/{HADOOP_USER_NAME}", status=True)
    #             dirs = [entry[0] for entry in dirs if entry[1]["type"] == "DIRECTORY"] #entry[0] is dir name
    #             print("dirs:", dirs)
    #             for entry in dirs:
    #                 try:
    #                     files = client.list(entry, status=True)
    #                     result['contents'][entry] = [file_name[0] for file_name in files if file_name[1]["type"] == "FILE"]
    #                 except Exception as e:
    #                     result['contents'][entry] = [str(e)]
    #         except Exception as e:
    #             result['error'] = str(e)
    #         return result

    #     return self._with_hdfs_client(list_files)

    # def read_file_from_hdfs(self, hdfs_path):
    #     """
    #     Read a file from HDFS and return its content as a string.
    #     """
    #     def read(client):
    #         with client.read(hdfs_path) as reader:
    #             return reader.read().decode("utf-8")

    #     try:
    #         return self._with_hdfs_client(read)
    #     except Exception as e:
    #         print(f"Error reading file from HDFS: {e}")
    #         return None

    # def download_from_hdfs(self, hdfs_path, local_path):
    #     """
    #     Download a file from HDFS to the local filesystem.
    #     """
    #     def download(client):
    #         client.download(hdfs_path, local_path, overwrite=True)
    #         print(f"Downloaded {hdfs_path} to {local_path}")

    #     try:
    #         return self._with_hdfs_client(download)
    #     except Exception as e:
    #         print(f"Error downloading file from HDFS: {e}")
    #         return None
        
# sample response if list a directory is called without filters on response
# {
#   "contents": [
#     [
#       "Maragakis et al DUDE docking scores and vortex properties.parquet",
#       {
#         "accessTime": 1738518372593,
#         "blockSize": 134217728,
#         "childrenNum": 0,
#         "fileId": 16977,
#         "group": "supergroup",
#         "length": 37598383,
#         "modificationTime": 1738518373840,
#         "owner": "prashu",
#         "pathSuffix": "Maragakis et al DUDE docking scores and vortex properties.parquet",
#         "permission": "644",
#         "replication": 1,
#         "storagePolicy": 0,
#         "type": "FILE"
#       }
#     ],
#     [
#       "health.parquet",
#       {
#         "accessTime": 1738514857243,
#         "blockSize": 134217728,
#         "childrenNum": 0,
#         "fileId": 16609,
#         "group": "supergroup",
#         "length": 3365,
#         "modificationTime": 1736325436275,
#         "owner": "prashu",
#         "pathSuffix": "health.parquet",
#         "permission": "644",
#         "replication": 1,
#         "storagePolicy": 0,
#         "type": "FILE"
#       }
#     ]
#   ],
#   "error": null
# }