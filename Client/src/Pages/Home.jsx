import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import FedClientImage from "../assets/FedClient.jpeg";
import FedprocessGif from "../assets/fedprocess.gif"; // card2
import StepsGif from "../assets/steps.gif"; // in backgrd

export default function Home() {
  return (
    <div className="container-fluid d-flex align-items-center">
      <div className="row w-100">
        <div className="col-md-5 d-none d-md-block">
          <img src={StepsGif} alt="Steps" className="img-fluid" />
        </div>
        <div className="col-md-7 d-flex justify-content-center align-items-center">
          <div className="card shadow-md mb-5 rounded card-hover">
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
              <div className="alert alert-info text-center" role="alert">
                <strong>
                  This is Client Application to simulate Federated Learning
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="col-10 col-md-5 col-lg-4 mb-5" style={overlapStyle}>
  <div className="card shadow-sm">
    <div className="card-body">
      <div className="text-center">
        <img src={FedprocessGif} className="img-fluid" alt="Fedprocess Gif" />
      </div>
    </div>
  </div>
</div>; */
}
