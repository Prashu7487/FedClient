import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Error from "../Pages/Error";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const get_training_detail_from_session_id =
  process.env.REACT_APP_GET_TRAINING_RESULT_WITH_SESSION_ID;

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

export default function ResultDetails() {
  const { sessionId } = useParams();
  const [resultDetails, setresultDetails] = useState({});

  const fetchResultDetails = async () => {
    const get_result_detail_endpoint = `${get_training_detail_from_session_id}/${sessionId}`;
    console.log("getting result from: ", get_result_detail_endpoint);
    try {
      const res = await axios.get(get_result_detail_endpoint);
      console.log("result detail fetched from server:", res.data);
      setresultDetails(res.data);
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    fetchResultDetails();
  }, []);

  return Object.keys(resultDetails).length === 0 ? (
    <div className="alert alert-warning text-center mt-4" role="alert">
      SessionID Does Not exist!!
    </div>
  ) : (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-center bg-primary text-white">
          <h3>Result Details</h3>
        </div>
        <div className="card-body">
          {Object.entries(resultDetails).map(([key, value]) => (
            <div key={key} className="mb-3">
              <h5 className="text-primary border-bottom pb-2">{key}</h5>
              <RenderData data={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
