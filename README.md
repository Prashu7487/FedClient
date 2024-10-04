# FedClient

- Application to simulate client in Federated Learning

# Project Setup Guide

This guide will help you clone the repository, set up the project environment, and to start the client and its private server.

## Prerequisites

Make sure you have the following installed (rest of the dependencies will be installed later):

- Node.js (v20.11.1)
- Git
- python 3.11.4

## Steps to Setup the Project

1. **Create a Project Directory:**

   - This directory will represent the client.

```bash
    mkdir Client
    cd Client
```

2. **Clone the Repository:**

```bash
    git clone [https://github.com/Prashu7487/FedClient.git]
    cd FedClient
```

3. **Install node Dependencies by navigating to FedClient(in cloned repo) directory:**

```bash
    npm run setup
```

4. **Create a virtual env in Private Server and install requirements.txt:**

```bash
     # while being in FedClient directory run following

    python3.11 -m venv PrivateServer/venv
    # or it may be 'python -m venv PrivateServer/venv' just make sure version of python in venv is as specified

    source PrivateServer/venv/bin/activate   # in ubuntu
    PrivateServer\venv\Scripts\activate      # in windows
    # check 'python --version' it should be python 3.11.4


    pip install -r requirements.txt
    # if this gives error for tensorflow-intel 2.17.0 not found then edit requirements.txt and remove all tensorflow packages from it,
    # later run 'pip install tensorflow' seperately and it will work

```

5. **Now move the dataset in the PrivateServer/data directory (in required format):**

6. **Build client before starting first time (and after each pull):**

```bash
    npm run build:client
```

5. **Start the Client and Private Server:**

```bash
    npm run start:all:prod
```

6. **Access the Application:**
   Client FE: http://localhost:3000/
   Client Private Server: http://127.0.0.1:9000/docs

7. Datasets for federated Learning (prepared for 5 clients)

https://drive.google.com/drive/folders/1kodF_hf66guEGsYqlEAKwYMj9bqSw3hZ?usp=sharing

**Extra**

1. **gdown command:**
   gdown --fuzzy <gdrive_publicly_shared_file_link>

2. **Add CORS extension in your browser**
