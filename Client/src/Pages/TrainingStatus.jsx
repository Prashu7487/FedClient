import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalData } from "../GlobalContext";
import axios from "axios";
import { useState } from "react";

const getAllFederatedSessionsURL = process.env.REACT_APP_GET_ALL_FEDERATED_SESSIONS_URL;

export default function TrainingStatus() {
  const navigate = useNavigate();
  const [federatedSession, setFederatedSession] = useState([]);

  const opendetails = (item) => {
    navigate(`/TrainingStatus/details/${item}`);
  };

  useEffect(() => {
    async function fetchData(url) {
      try {
        const res = await axios.get(url);
        if (res.status == 200) {
          const federatedSession = res.data["federated_session"];
          setFederatedSession(federatedSession);
        } else {
          console.log("Failed to fetch data from server");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    console.log(getAllFederatedSessionsURL)
    fetchData(getAllFederatedSessionsURL);
  }, []);

  return (
    <div className="container">
      {federatedSession.length === 0 ? (
        <div className="alert alert-warning text-center mt-4" role="alert">
          No training Data Available!!
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {federatedSession.map((item) => (
            <div className="col" key={item.session_id}>
              <div className="card h-100">
                <div className="card-header">
                  <h3>{item.OrgName}</h3>
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    RequestID: {item["session_id"]}
                  </h5>
                  <h5 className="card-title">
                    Status: {item["training_status"]}
                  </h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => opendetails(item["session_id"])}
                  >
                    Expand
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
