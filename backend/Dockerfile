FROM tensorflow/tensorflow:latest-gpu

# Set working directory
WORKDIR /app

# Copy requirements first for layer caching
COPY ./app/requirements.txt ./

# Install dependencies including OpenJDK 8 and required tools
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk curl && \
    apt-get clean

# Set JAVA_HOME environment variable for Spark
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Optionally set SPARK_HOME if Spark is available or will be mounted
# ENV SPARK_HOME=/opt/spark
# ENV PYSPARK_PYTHON=python3
# ENV PYSPARK_DRIVER_PYTHON=python3

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Optional: copy app source code into container
# COPY ./app ./ 

# Expose API port
EXPOSE 9090

# Run FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9090"]
