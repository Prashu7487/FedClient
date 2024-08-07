import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import FedprocessGif from "../assets/fedprocess.gif";

export default function About() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-10 col-md-8 col-lg-6 align-items-center">
          <h3 className="text-center text-dark">How It Works</h3>
          <div className="card shadow-lg border-primary rounded-3 overflow-hidden">
            <div className="card-body p-4">
              <div className="text-center">
                <img
                  src={FedprocessGif}
                  className="img-fluid rounded-3"
                  alt="Fedprocess Gif"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
