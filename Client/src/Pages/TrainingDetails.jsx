import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGlobalData } from "../GlobalContext";
import Error from "../Pages/Error";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const client_fed_response_endpoint =
  process.env.REACT_APP_SUBMIT_CLIENT_FEDERATED_RESPONSE_URL;
const get_training_endpoint_base_url =
  process.env.REACT_APP_GET_FEDERATED_SESSION_URL;

// Recursive component to render any type of data
const RenderData = ({ data, level = 0 }) => {
  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      return (
        <ul className="list-group ms-3">
          {data.map((item, index) => (
            <li className="list-group-item" key={index}>
              <RenderData data={item} level={level + 1} />
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <div className="ms-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key}:</strong>
              <RenderData data={value} level={level + 1} />
            </div>
          ))}
        </div>
      );
    }
  } else {
    return <span className="ms-3">{data?.toString()}</span>;
  }
};

export default function TrainingDetails({ clientToken, socket }) {
  const { sessionId } = useParams();
  const [federatedSessionData, setFederatedSessionData] = useState({});

  const { register, handleSubmit } = useForm();

  const fetchFederatedSessionData = async (clientId) => {
    const get_training_endpoint = `${get_training_endpoint_base_url}/${sessionId}`;
    console.log("get_training_endpoint", get_training_endpoint);
    try {
      const params = {
        client_id: clientId,
      };
      const res = await axios.get(get_training_endpoint, { params });
      console.log("data fetched from server:", res.data);
      setFederatedSessionData(res.data);
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    fetchFederatedSessionData(clientToken);
    // if (socket) {
    //   socket.onmessage = (event) => {
    //     const message = JSON.parse(event.data);
    //     // const modelConfig = message.data;
    //     console.log("Config before initialising: ", message);
    //     if (message.type === "get_model_parameters_start_background_process") {
    //       // setConfig(modelConfig);
    //       setUpTraining(config); // Function to initialize training
    //     } else if (message.type === "start_training") {
    //       train_model(config);
    //     }
    //   };
    // }
  }, [clientToken]);

  // Function to determine status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 1:
        return "badge bg-secondary";
      case 2:
        return "badge bg-warning";
      default:
        return "badge bg-success";
    }
  };

  const onSubmit = async (data) => {
    console.log(data.decision);
    const requestData = {
      client_id: clientToken,
      session_id: sessionId,
      decision: data.decision == "accepted" ? 1 : 0,
    };

    console.log(requestData.decision, typeof requestData.decision);
    try {
      console.log(requestData);
      const res = await axios.post(client_fed_response_endpoint, requestData);
      if (res.status === 200) {
        // Client Background Task --> Save the session token in the use State have to implement logic in backend
        console.log(res.data);
        fetchFederatedSessionData(clientToken);
      } else {
        console.error("Failed to submit the request:", res);
      }
    } catch (error) {
      console.error("Error submitting the request:", error);
    }
  };

  return clientToken ? (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-center bg-primary text-white">
          <h3>Training Details</h3>
        </div>
        <div className="card-body">
          {federatedSessionData &&
            Object.entries(federatedSessionData).map(([key, value]) => (
              <div key={key} className="mb-3">
                <h5 className="text-primary border-bottom pb-2">{key}</h5>
                {key.toLowerCase() === "training_status" ? (
                  <span className={getStatusBadgeClass(value)}>{value}</span>
                ) : (
                  <>
                    {value === 1 ? (
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <label>
                          <input
                            type="radio"
                            value="accepted"
                            {...register("decision", { required: true })}
                          />
                          Accept
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="rejected"
                            {...register("decision", { required: true })}
                          />
                          Reject
                        </label>
                        <br />
                        <button type="submit">Submit Response</button>
                      </form>
                    ) : (
                      <RenderData data={value} />
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  ) : (
    <>LogInFirst</>
  );
}
