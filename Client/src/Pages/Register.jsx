import React from "react";
import { useForm } from "react-hook-form";
import { useGlobalData } from "../GlobalContext";
import axios from "axios";

const register_client_URL = process.env.REACT_APP_REGISTER_CLIENT_URL;
export default function Register({ clientToken, setClientToken, setSocket }) {
  const { GlobalData, setGlobalData } = useGlobalData();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    if (clientToken) {
      console.log("Already registered..");
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

        // Connect to websocket for this client Token
        const wsURL = `${process.env.REACT_APP_WS_URL}${clientToken}`;
        const socket = new WebSocket(wsURL);

        socket.onopen = function (event) {
          console.log("Connected to WebSocket server.");
          socket.send("Client connected with client_id: " + clientToken);
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
    <form
      id="Registration-form"
      className="row g-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="col-12">
        <label htmlFor="clientName" className="form-label">
          Client Name:
        </label>
        <input
          type="text"
          className={`form-control ${errors.clientName ? "is-invalid" : ""}`}
          id="clientName"
          placeholder="Enter Client Name"
          defaultValue={GlobalData.Client.ClientName}
          {...register("clientName", { required: true })}
        />
        {errors.clientName && (
          <div className="invalid-feedback">Client Name is required.</div>
        )}
      </div>
      <div className="col-12">
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
      <div className="col-12">
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
      <div className="col-12">
        <button
          type="submit"
          className="btn btn-primary me-3"
          id="liveToastBtn"
        >
          Register
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDeregistration}
        >
          Deregister
        </button>
      </div>
    </form>
  );
}
