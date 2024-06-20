import React from "react";
import { useForm } from "react-hook-form";
import { useGlobalData } from "../GlobalContext";

export default function Register() {
  const { GlobalData, setGlobalData } = useGlobalData();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const connectionURL = "http://localhost:8000/events";
  const regURL = "http://localhost:8000/sign-in";

  const onSubmit = (formData) => {
    if (GlobalData.ConnectionObject) {
      console.log("Already registered..");
      return;
    }

    const clientData = {
      name: formData.clientName,
      data_path: formData.data_path,
      password: formData.password,
    };

    let eventSource = null;
    console.log("SSE connection Request Sent");
    try {
      const stream_url = connectionURL;
      eventSource = new EventSource(stream_url);
    } catch (err) {
      console.log("The error occurred while SSE connection is:", err);
    }

    const postData = async (url, data) => {
      console.log("Data in POST", JSON.stringify(data)); //comment this
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
        setGlobalData({
          ...GlobalData,
          Client: {
            ClientID: result.ClientID,
            ClientName: clientData.name,
            DataPath: clientData.data_path,
            Password: clientData.password,
          },
          ConnectionObject: eventSource,
        });
        console.log("Response from server:", result);
      } catch (err) {
        console.log("Error in sending Client Reg Data:", err);
      }
    };

    postData(regURL, clientData);
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
