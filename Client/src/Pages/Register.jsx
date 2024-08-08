import React from "react";
import { set, useForm } from "react-hook-form";
import { useGlobalData } from "../GlobalContext";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import RegisterImg from "../assets/register.png";

const register_client_URL = process.env.REACT_APP_REGISTER_CLIENT_URL;
export default function Register({ clientToken, setClientToken, setSocket }) {
  const { GlobalData, setGlobalData } = useGlobalData();
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    if (clientToken) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return;
    }

    const clientData = {
      name: formData.clientName,
      data_path: formData.data_path,
      password: formData.password,
    };
    try {
      const res = await axios.post(register_client_URL, clientData);
      if (res.status === 200) {
        const clientToken = res.data["client_token"];
        console.log("Client Token:", clientToken);
        // Connect to websocket for this client Token
        const wsURL = `${process.env.REACT_APP_WS_URL}${clientToken}`;
        const socket = new WebSocket(wsURL);

        socket.onopen = function (event) {
          console.log("Connected to WebSocket server.");
        };

        setSocket(socket);
        setClientToken(clientToken);
        alert(res.data.message);
      } else {
        console.error("Failed to submit the request:", res);
      }
    } catch (error) {
      console.error("Error submitting the request:", error);
    }
  };

  const handleDeregistration = (event) => {
    event.preventDefault();
    if (GlobalData.ConnectionObject) GlobalData.ConnectionObject.close();
    setGlobalData({
      ...GlobalData,
      Client: {
        ...GlobalData.Client,
        ClientID: "",
        DataPath: "",
        Password: "",
      },
      ConnectionObject: null,
    });
    console.log("Deregistered:", GlobalData.ConnectionObject == null);
  };

  // registration form
  return (
    <>
      <form
        id="Registration-form"
        className="row d-flex justify-content-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-2 mt-5">
          <img src={RegisterImg} alt="FedClient" className="img-fluid" />
        </div>
        <div className="col-8">
          <div className="col-8">
            <label htmlFor="clientName" className="form-label">
              Client Name:
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.clientName ? "is-invalid" : ""
              }`}
              id="clientName"
              placeholder="Enter Client Name"
              defaultValue={GlobalData.Client.ClientName}
              {...register("clientName", { required: true })}
            />
            {errors.clientName && (
              <div className="invalid-feedback">Client Name is required.</div>
            )}
          </div>
          <div className="col-8">
            <label htmlFor="data_path" className="form-label">
              Data Path:
            </label>
            <input
              type="text"
              className={`form-control ${errors.data_path ? "is-invalid" : ""}`}
              id="data_path"
              placeholder="Enter Data Path"
              defaultValue={GlobalData.Client.DataPath}
              {...register("data_path", { required: true })}
            />
            {errors.data_path && (
              <div className="invalid-feedback">Data Path is required.</div>
            )}
          </div>
          <div className="col-8">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter Password"
              defaultValue={GlobalData.Client.Password}
              {...register("password", { required: true })}
            />
            {errors.password && (
              <div className="invalid-feedback">Password is required.</div>
            )}
          </div>
          <div className="col-8 mt-5 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-success mx-5 border border-primary"
              id="liveToastBtn"
            >
              Register
            </button>

            <button
              type="button"
              className="btn btn-secondary mx-5 border border-primary"
              onClick={handleDeregistration}
            >
              Deregister
            </button>
          </div>
        </div>
      </form>
      {showToast && (
        <div
          className="position-fixed top-0 end-0 p-5"
          style={{ margin: "1rem", zIndex: 1100 }}
        >
          <div
            className="toast align-items-center text-bg-primary border-0 show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            data-bs-autohide="true" //it's not working to be corrected later (now using setTimeout)
            data-bs-delay="3000" // 3 seconds
          >
            <div className="d-flex">
              <div className="toast-body">
                Already registered. Please deregister to register again.
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
