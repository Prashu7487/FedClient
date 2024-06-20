import React from "react";
import { useParams } from "react-router-dom";
import { useGlobalData } from "../GlobalContext";
import Error from "../Pages/Error";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

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

export default function TrainingDetails() {
  const { id } = useParams();
  const { GlobalData } = useGlobalData();

  // Finding the training object of the id in the URL path
  const training = GlobalData.CurrentModels.find(
    (item) => item.RequestId === id
  );

  if (!training) {
    return <Error />;
  }

  // Function to determine status badge color
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "unknown":
        return "badge bg-secondary";
      case "requested":
        return "badge bg-warning";
      default:
        return "badge bg-success";
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-center bg-primary text-white">
          <h3>Training Details</h3>
        </div>
        <div className="card-body">
          {Object.entries(training).map(([key, value]) => (
            <div key={key} className="mb-3">
              <h5 className="text-primary border-bottom pb-2">{key}</h5>
              {key.toLowerCase() === "status" ? (
                <span className={getStatusBadgeClass(value)}>{value}</span>
              ) : (
                <RenderData data={value} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
