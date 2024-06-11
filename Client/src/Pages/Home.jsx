import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

export default function Home() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-10 col-md-8 col-lg-6">
          <h1 className="text-center mb-4">Welcome to the Home Page</h1>
          <p className="text-center">
            This is Client Application for a Federated Learning Architecture
          </p>
        </div>
      </div>
    </div>
  );
}
