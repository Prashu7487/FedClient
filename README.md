# FedClient

- Application to simulate client in Federated Learning

# Project Setup Guide

This guide will help you set up the project environment, clone the repository, and to start the client and its private server.

## Prerequisites

Make sure you have the following installed (rest of the dependencies will be installed later):

- Node.js
- Git
- pip (for Python package management)
- nvm (Node Version Manager)

## Steps to Setup the Project

1. **Create a Project Directory:**

   - This directory will represent the client.

```bash
    mkdir my-client-project
    cd my-client-project
```

2. **Create a New Environment for the Client and install node**

```bash
    nvm install node
    nvm use node
```

3. **Clone the Repository:**

```bash
    git clone [<repository_url>](https://github.com/Prashu7487/FedClient.git)
```

4. **Install Dependencies by navigating to project(client) directory:**

```bash
    npm run setup
```

5. **Start the Client and Private Server:**

```bash
    npm run start:all
```

6. **Access the Application:**
   Client FE: http://localhost:5173/
   Client Private Server: http://127.0.0.1:9000/docs
