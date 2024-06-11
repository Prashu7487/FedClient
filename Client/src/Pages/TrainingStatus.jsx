import { useGlobalData } from "../GlobalContext";
import React, { useState } from "react";
import DetailsPopUp from "../components/OnTrainingStatus/DetailsPopUp";

export default function TrainingStatus() {
  const { GlobalData } = useGlobalData();
  const [showModal, setShowModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState({
    model: {},
    data: {},
  });

  const handleShow = (model, data) => {
    setSelectedDetails({ model, data });
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedDetails({ model: null, data: null });
    setShowModal(false);
  };

  return (
    <>
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {GlobalData.CurrentModels.map((item) => (
            <div className="col" key={item.RequestId}>
              <div className="card h-100">
                <div className="card-header">
                  <h3>{item.OrgName}</h3>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Time Created: {item.RequestId}</h5>
                  <h5 className="card-title">Status: {item.Status}</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleShow(item.Model, item.Data)}
                    data-bs-toggle="modal"
                    data-bs-target="#detailsModal"
                  >
                    Expand
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <DetailsPopUp
          selectedDetails={selectedDetails}
          handleClose={handleClose}
        />
      )}
      {showModal && <div className="modal-backdrop fade show" />}
    </>
  );
}
