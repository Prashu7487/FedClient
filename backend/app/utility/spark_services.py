from pyspark.sql import SparkSession
from dotenv import load_dotenv
from pyspark.sql.functions import col, size, count, expr, mean, stddev, min, max, rand, lit, rank, when
from pyspark.sql.types import NumericType, StringType, ArrayType
import numpy as np
from utility.processing_helper_functions import All_Column_Operations, Column_Operations
from utility.hdfs_services import HDFSServiceManager
import threading
import time
import os
import time
import json
import uuid

load_dotenv()
hdfs_client = HDFSServiceManager()

HADOOP_USER_NAME = os.getenv("HADOOP_USER_NAME")
HDFS_NAME_NODE_URL = os.getenv("HDFS_NAME_NODE_URL")
HDFS_RAW_DATASETS_DIR = os.getenv("HDFS_RAW_DATASETS_DIR")
HDFS_PROCESSED_DATASETS_DIR = os.getenv("HDFS_PROCESSED_DATASETS_DIR")
HDFS_FILE_READ_URL = f"hdfs://{HDFS_NAME_NODE_URL}/user/{HADOOP_USER_NAME}"
RECENTLY_UPLOADED_DATASETS_DIR = os.getenv("RECENTLY_UPLOADED_DATASETS_DIR")
SPARK_MASTER_URL = os.getenv("SPARK_MASTER_URL")
BUCKET_NAME = os.getenv("BUCKET_NAME")  # "qpd-data"  
S3_PREFIX = os.getenv("S3_PREFIX")  # "temp"  

# to see the docker hostname if running inside the docker container
# import socket
# host_ip = socket.gethostbyname(socket.gethostname())
# print(f"Host IP of docker comtainer: {host_ip}")

class SparkSessionManager:
    """
    Thread-safe singleton SparkSession manager with reference counting.
    Creates a new SparkSession object if not already created, and returns an active session if there is (for threads).
    This is thread safe implementation, and not process safe (pyspark limitation).
    """
    # Class variables 
    _instance = None
    _lock = threading.Lock()
    _session = None
    _reference_count = 0
    _config_lock = threading.Lock()  

    def __new__(cls, app_name="default_app", master=SPARK_MASTER_URL):
        with cls._lock:
            if not cls._instance:
                cls._instance = super().__new__(cls)
                cls._instance.app_name = app_name
                cls._instance.master = master
            return cls._instance

    # Context Manager for SparkSession creation
    def __enter__(self):
        with self._config_lock:
            # Double-checked locking pattern
            if self._session is None:
                self._session = SparkSession.builder.master(self.master).appName(self.app_name).getOrCreate()                   
                print("Spark session created...")  
                # # for standalone cluster (will not use YARN as resource manager)
                # spark = SparkSession.builder.remote("sc://localhost:8080").getOrCreate() 

        with self._lock:
            self._reference_count += 1
        return self._session

    def __exit__(self, exc_type, exc_val, exc_tb):
        with self._lock:
            self._reference_count -= 1
            if self._reference_count == 0:
                self._session.stop()
                self._session = None
                print("Spark session stopped...")

    @classmethod
    def get_active_session(cls):
        """Get the active session without reference counting"""
        with cls._lock:
            return cls._session

    @classmethod
    def session_exists(cls):
        """Check if session is active"""
        with cls._lock:
            return cls._session is not None

    def __del__(self):
        # Safety net for resource cleanup
        if self._session is not None:
            self._session.stop()

    def spark_session_cleanup(self):
        """Stop the spark session and reset the reference count."""
        with self._lock:
            self._reference_count = 0
            self._session.stop()
            self._session = None

    def _get_overview(self, df):
        """
        Get an overview of the dataset given pyspark dataframe.
        """
        if not df:
            return {"message": "Dataset not found."}
        
        overview = None
        column_stats = []
        for column in df.columns:
            try:
                column_expr = col(f"`{column}`") #useful if col name contains special characters or spaces
                column_type = df.schema[column].dataType
                num_rows = df.select(column_expr).count()
                stats = {"name": column, "type": str(column_type), "entries": num_rows}
                
                # Common statistics for all columns 
                stats["nullCount"] = df.filter(column_expr.isNull()).count()
                
                # Column specific statistics
                NumberTypes = ["IntegerType()", "DoubleType()", "FloatType()", "LongType()"]
                if str(column_type) in NumberTypes:
                    summary = df.select(
                        mean(column_expr).alias("mean"),
                        stddev(column_expr).alias("stddev"),
                        min(column_expr).alias("min"),
                        max(column_expr).alias("max")
                    ).first()
                    stats.update({
                        "mean": summary["mean"],
                        "stddev": summary["stddev"],
                        "min": summary["min"],
                        "max": summary["max"],
                        "uniqueCount": df.select(column_expr).distinct().count()
                    })
                    
                    # Quartile calculation
                    quantiles = df.approxQuantile(column, [0.25, 0.5, 0.75], 0.05)
                    stats["quartiles"] = {
                        "Q1": quantiles[0],
                        "median": quantiles[1],
                        "Q3": quantiles[2],
                        "IQR": quantiles[2] - quantiles[0]
                    }
                    
                    # Histogram binning
                    min_val = summary["min"]
                    max_val = summary["max"]
                    bin_width = (max_val - min_val) / 10
                    bins = [min_val + i * bin_width for i in range(11)]
                    histogram = (
                        df.select(column_expr)
                        .rdd.flatMap(lambda x: x)
                        .histogram(bins)
                    )
                    stats["histogram"] = {
                        "bins": histogram[0],
                        "counts": histogram[1]
                    }

                # String columns
                elif "StringType" in str(column_type):
                    stats["uniqueCount"] = df.select(column_expr).distinct().count()
                    
                    # Frequency distribution for top 10 categories
                    top_categories = (
                        df.groupBy(column_expr)
                        .count()
                        .orderBy(col("count").desc())
                        .limit(10)
                        .collect()
                    )

                    stats["topCategories"] = [
                        {   "value": row[column][:50] + "..." if isinstance(row[column], str) and len(row[column]) > 50 else row[column],
                            "count": row["count"]
                        }
                        for row in top_categories
                    ]
                
                elif "ArrayType" in str(column_type):
                    # Get first non-null entry
                    row = df.select(column_expr).filter(col(column).isNotNull()).limit(1).first()
                    arr = row[column] if row else None
                
                    # Infer shape
                    shape = []
                    temp = arr
                    while isinstance(temp, list):
                        shape.append(len(temp))
                        if len(temp) == 0:
                            break
                        temp = temp[0] if isinstance(temp[0], list) else None
                    stats["Shape"] = tuple(shape) if shape else None
                    
                
                    # Length Distribution (top level)
                    length_stats = df.select(size(col(column)).alias("len")) \
                        .summary("count", "min", "max", "mean", "stddev") \
                        .toPandas().set_index("summary").to_dict()["len"]
                
                    stats["LengthStats"] = {
                        "min": int(length_stats.get("min", 0)),
                        "max": int(length_stats.get("max", 0)),
                        "mean": float(length_stats.get("mean", 0)),
                        "std": float(length_stats.get("stddev", 0))
                    }
                
                    # Check if inner elements are numeric — if so, calculate value statistics
                    def flatten_all(x):
                        """Recursively flatten list to 1D"""
                        if isinstance(x, list):
                            for i in x:
                                yield from flatten_all(i)
                        else:
                            yield x
                
                    if row and isinstance(row[column], list):
                        flat_sample = list(flatten_all(row[column]))
                        if flat_sample and isinstance(flat_sample[0], (int, float)):
                            # Only compute value-level stats if numeric
                            # Use RDD for optimized distributed stat collection
                            rdd = df.select(column_expr).rdd \
                                .filter(lambda row: row[column] is not None) \
                                .flatMap(lambda row: flatten_all(row[column]) if row[column] else [])
                
                            try:
                                num_samples = int(np.minimum(num_rows * 0.2, 100000))
                                stats["sampleSize"] = f"{int(np.minimum(num_rows * 0.2, 100000))} samples"
                                sampled = rdd.take(num_samples)  # Safe sample
                                
                                if sampled:
                                    arr_np = np.array(sampled)
                                    stats["valueStats"] = {
                                        "min": float(np.min(arr_np)),
                                        "max": float(np.max(arr_np)),
                                        "mean": float(np.mean(arr_np)),
                                        "std": float(np.std(arr_np)),
                                        "median": float(np.median(arr_np)),
                                        "sparsity": float(np.mean(arr_np == 0))  # Fraction of zeros
                                    }
                            except Exception as e:
                                stats["valueStats"] = None
                        else:
                            stats["valueStats"] = "Not numeric"
                    else:
                        stats["valueStats"] = "Not detected"

                # Add the column stats to the list
                column_stats.append(stats)
            except Exception as e:
                print(f"Error processing column {column}: {e}")
                continue

        # Dataset overview Dict
        overview = {
            "numRows": df.count(),
            "numColumns": len(df.columns),
            "columnStats": column_stats
        }

        return overview

    async def create_new_dataset(self, filename, filetype):
        """
        Move the newly uploaded dataset to the HDFS raw datasets directory.
        Notes:
        - ensure no same file name exists in the tmpuploads directory, or in uploads directory
        """
        print(f"in create_new_dataset {filename} is {filetype}")
        try:
            with SparkSessionManager() as spark:
                
                # later create a switch case based on file type
                if filetype == "csv":
                    print(f"Reading CSV file: {HDFS_FILE_READ_URL}/{RECENTLY_UPLOADED_DATASETS_DIR}/{filename}")
                    df = spark.read.csv(f"{HDFS_FILE_READ_URL}/{RECENTLY_UPLOADED_DATASETS_DIR}/{filename}",header=True,inferSchema=True)
                    write_filename = write_filename = filename.replace(".csv__PROCESSING__", ".parquet")
                    # if you write without parquet extension, it will create a directory with the filename and store the data in it
                    df.write.mode("overwrite").parquet(f"{HDFS_FILE_READ_URL}/{HDFS_RAW_DATASETS_DIR}/{write_filename}")
                    print(f"Successfully created new dataset in HDFS: {HDFS_RAW_DATASETS_DIR}/{write_filename}")

                elif filetype == "parquet":
                    write_filename = filename.replace("__PROCESSING__","")
                    print(f"Reading Parquet file: {HDFS_FILE_READ_URL}/{RECENTLY_UPLOADED_DATASETS_DIR}/{filename}")
                    # we don't need inferSchema=True with parquet (as parquet stores the schema as metadata)
                    df = spark.read.parquet(f"{HDFS_FILE_READ_URL}/{RECENTLY_UPLOADED_DATASETS_DIR}/{filename}")
                    df.write.mode("overwrite").parquet(f"{HDFS_FILE_READ_URL}/{HDFS_RAW_DATASETS_DIR}/{write_filename}")
                    print(f"Successfully created new dataset in HDFS: {HDFS_RAW_DATASETS_DIR}/{write_filename}")
                else:
                    print("Unsupported file type for creating new dataset.")
                    return {"message": "Unsupported file type."}

                dataset_overview = self._get_overview(df)
                
                dataset_overview["filename"] = write_filename
                return dataset_overview        
            return {"message": "Dataset created."}
        except Exception as e:
            print(f"Error creating new dataset: {e}")
            raise e
    

    async def preprocess_data(self, directory: str, filename: str, operations: list):
        """
        Preprocess a dataset using as per the options JSON received.

        Notes:
        i) If error occured at any step, the function will print the error and continue to the next step.
        ii) When the operation is not finished in case of error, the df still could be modified (because I'm not maintaining the copy and each step is done on the same df)
        iii) During many ops (like normalization, calculating mean, mode etc.) pyspark internally skips null if there is any
        iv) Before changing the code please ensure from pyspark docs if it can be paralellized (on executors) 
        v) ensure correctness of the operations and the order of operations, some general rules:
                - Drop Null, Fill Null, Drop Duplicates should be done before any normalization, scaling, encoding etc.
                - Normalization, Scaling, Encoding should be done before any transformation (like log, square etc.)
                - Avoid log, square root and such transformation on negative or 0 values 
                - Avoid normalization on categorical columns (see count of unique values in the column to decide)
                - In most of the ops invalid rows are dropped or skiped by pyspark, take care of that
                - only int cols can be encoded into one-hot, label encoding
                - Normalization operation in "All Columns" will treat one row of all col as a vector, considering this they will do the opr
                and then assigns the values back to the respective columns
                - Exclude col from All Cloumns excludes that column from "All Columns" operation onwards, still you can select that col and do any ops
                - even the order of cols in initial df matters for final results

        vi) Sample operations JSON:
            operations = [
                            {"column": "col1", "operation": "Label Encoding"},
                            {"column": "col2", "operation": "Drop Null"},
                            {"column": "col3", "operation": "z-score"},
                            {"column": "All Columns", "operation": "Drop Null"},
                            {"column": "All Columns", "operation": "z-score std"},
                            {"column": "col4", "operation": "One Hot Encoding"},
                            {"column": "col5", "operation": "Min-Max Scaling"},
                            {"column": "col6", "operation": "Fill Mean"},
                            {"column": "All Columns", "operation": "Drop Duplicates"},
                        ]
        """
        
        # don't put try except here, if any error occurs, it will be printed and counted as no error ..
        # so wherever this function is called next step will continue even after this error (put try except there instead)
        try:
            with SparkSessionManager() as spark:
                # Load the dataset from HDFS
                print(f"Starting preprocessing for {HDFS_FILE_READ_URL}/{directory}/{filename}...")
                df = spark.read.parquet(f"{HDFS_FILE_READ_URL}/{directory}/{filename}")
                
                # Record the time, and get the numeric columns
                t1 = time.time()
                All_Columns = df.columns
                numericCols = [c for c in All_Columns if isinstance(df.schema[c].dataType, NumericType)]

                # Apply the preprocessing steps
                for step in operations:
                    if step["operation"] == "Exclude from All Columns list":
                        All_Columns.remove(step['column'])
                        if step['column'] in numericCols:
                            numericCols.remove(step['column'])
                            
                    elif step["column"] == "All Columns":
                        try:
                            df = All_Column_Operations(df, step, numericCols, All_Columns)
                        except Exception as e:
                            print(f"error: Error in {step['operation']} operation for {step['column']} column: {str(e)} \n")       
                    else:
                        try:
                            df = Column_Operations(df, step)
                        except Exception as e:
                            print(f"error: Error in {step['operation']} operation for {step['column']} column: {str(e)} \n")

                newfilename = f"{filename}_{uuid.uuid4().hex}.parquet"
                df.write.mode("overwrite").parquet(f"{HDFS_FILE_READ_URL}/{HDFS_PROCESSED_DATASETS_DIR}/{newfilename}")

                print(f"Preprocessed dataset saved to: {HDFS_FILE_READ_URL}/{HDFS_PROCESSED_DATASETS_DIR}/{newfilename} and time taken: ",time.time()-t1)

                overview = self._get_overview(df)
                overview["filename"] = newfilename
                return overview
        except Exception as e:
            print(f"Error preprocessing dataset: {e}")
            raise e  # Raise the exception to be handled by the caller

    async def create_qpd_dataset(self, filename: str, num_points:int):
        """
        Creating Dataset for QPD (Quality preserving Database) from the original dataset.
        """      
 
        try:
            with SparkSessionManager() as spark:
                # Load the dataset from HDFS
                print(f"Starting creating qpd dataset from {HDFS_FILE_READ_URL}/{HDFS_PROCESSED_DATASETS_DIR}/{filename}...")
                df = spark.read.parquet(f"{HDFS_FILE_READ_URL}/{HDFS_PROCESSED_DATASETS_DIR}/{filename}")
                
                # Create a new dataset with the specified number of points
                df_subset = df.orderBy(rand()).limit(num_points)

                # write the subset to S3 bucket
                newfilename = f"{uuid.uuid4()}_{filename}"
                write_path = f"s3a://{BUCKET_NAME}/{S3_PREFIX}/{newfilename}" 
                df_subset.write.parquet(write_path) # no overwrite since it will be unique path
                print(f"Created QPD dataset saved to: {write_path}")

                overview = self._get_overview(df_subset)
                overview["datapath"] = write_path
                return overview
        except Exception as e:
            print(f"Error creating QPD dataset: {e}")
            raise e
            











# the _get_overview  function will return something like this:
# {
#     "filename": "sample.parquet",
#     "numRows": 1000,
#     "numColumns": 5,
#     "columnStats": [
#         {
#             "name": "age",
#             "type": "IntegerType",
#             "nullCount": 0,
#             "mean": 40.5,
#             "stddev": 10.5,
#             "min": 20,
#             "max": 60,
#            "uniqueCount": 100,
#             "quartiles": {
#                 "Q1": 30,
#                 "median": 40.5,
#                 "Q3": 50,
#                 "IQR": 20
#             },
#             "histogram": {
            #    "bins": [20, 25, 30, 35, 40, 45, 50, 55, 60],
            #    "counts": [100, 200, 150, 100, 150, 200, 100, 50]
#             }
#         },
#         {
#             "name": "name",
#             "type": "StringType",
#             "nullCount": 0,
#             "uniqueCount": 100,
#             "topCategories": [
#                 {"value": "Alice", "count": 200},
#                 {"value": "Bob", "count": 150},
#                 {"value": "Charlie", "count": 100},
#                 {"value": "David", "count": 50}
#             ]
#         }
#     ]
# }