import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { useGlobalData } from "../GlobalContext";

export default function Register() {
  const { GlobalData, setGlobalData } = useGlobalData();
  const clientIDRef = useRef("");
  const dataPathRef = useRef("");
  const emailRef = useRef("");

  const handleRegistration = (event) => {
    event.preventDefault();
    if (GlobalData.ConnectionObject) {
      console.log("Already registered..");
      return;
    }

    const clientData = {
      name: clientIDRef.current.value,
      data_path: dataPathRef.current.value,
      email: emailRef.current.value,
    };

    let eventSource = null;
    console.log("SSE connection Request Sent");
    try {
      const stream_url = "http://localhost:8000/events";
      eventSource = new EventSource(stream_url);
    } catch (err) {
      console.log("The error occurred while SSE connection is:", err);
    }

    setGlobalData({
      ...GlobalData,
      Client: {
        ClientID: clientData.name,
        DataPath: clientData.data_path,
        Email: clientData.email,
      },
      ConnectionObject: eventSource,
    });

    const postData = async (url, data) => {
      console.log("Data in POST", JSON.stringify(data));
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result = await res.json();
        console.log("Response from server:", result);
      } catch (err) {
        console.log("Error in sending Client Reg Data:", err);
      }
    };

    postData("http://localhost:8000/sign-in", clientData);
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
        Email: "",
      },
      ConnectionObject: null,
    });
    clientIDRef.current.value = "";
    dataPathRef.current.value = "";
    emailRef.current.value = "";
    console.log(
      "In deregistration null value of connection obj",
      GlobalData.ConnectionObject == null
    );
  };

  return (
    <form
      id="Registration-form"
      className="row g-3"
      onSubmit={handleRegistration}
    >
      <div className="col-12">
        <label className="form-label">Client ID:</label>
        <input
          type="text"
          className="form-control"
          id="inputClientID"
          placeholder="e.g. client1, client2.."
          defaultValue={GlobalData.Client.ClientID}
          ref={clientIDRef}
        ></input>
      </div>
      <div className="col-12">
        <label className="form-label">DataPath:</label>
        <input
          type="text"
          className="form-control"
          id="inputName"
          placeholder="Enter Name"
          defaultValue={GlobalData.Client.DataPath}
          ref={dataPathRef}
        ></input>
      </div>
      <div className="col-12">
        <label className="form-label">Email:</label>
        <input
          type="email"
          className="form-control"
          id="inputEmail"
          placeholder="Enter email"
          defaultValue={GlobalData.Client.Email}
          ref={emailRef}
        ></input>
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
