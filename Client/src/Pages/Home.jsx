import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import FedClientImage from "../assets/FedClient.jpeg";

export default function Home() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-10 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-center mb-4">
                <img
                  src={FedClientImage}
                  className="rounded-circle"
                  alt="FedClient"
                  width="150"
                  height="150"
                />
              </div>
              <h1 className="text-center mb-4 text-primary">
                Welcome to FedClient
              </h1>
              <p className="text-center">
                This is Client Application for a Federated Learning Architecture
              </p>
              <div className="alert alert-info text-center" role="alert">
                updates coming soon!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
