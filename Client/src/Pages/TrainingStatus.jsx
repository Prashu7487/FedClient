import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalData } from "../GlobalContext";

export default function TrainingStatus() {
  const { GlobalData } = useGlobalData();
  const navigate = useNavigate();

  const opendetails = (item) => {
    navigate(`/TrainingStatus/details/${item}`);
  };

  return (
    <div className="container">
      {GlobalData.CurrentModels.length === 0 ? (
        <div className="alert alert-warning text-center mt-4" role="alert">
          No training Data Available!!
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {GlobalData.CurrentModels.map((item) => (
            <div className="col" key={item.RequestId}>
              <div className="card h-100">
                <div className="card-header">
                  <h3>{item.OrgName}</h3>
                </div>
                <div className="card-body">
                  <h5 className="card-title">RequestID: {item.RequestId}</h5>
                  <h5 className="card-title">Status: {item.Status}</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => opendetails(item.RequestId)}
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
