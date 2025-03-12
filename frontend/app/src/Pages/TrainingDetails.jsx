import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import {
  getFederatedSession,
  respondToSession,
} from "../services/federatedService";
import { ClientStatus, TrainingStatuses } from "../helpers/constants";
import axios from "axios";

const clientPriceResponseEndpoint =
  process.env.REACT_APP_SUBMIT_CLIENT_PRICE_RESPONSE_URL;

const RenderData = ({ data }) => {
  if (typeof data === "object" && data !== null) {
    return Array.isArray(data) ? (
      <ul className="list-disc list-inside ml-4">
        {data.map((item, index) => (
          <li
            key={index}
            className="border p-2 rounded-lg shadow-sm bg-gray-50"
          >
            <RenderData data={item} />
          </li>
        ))}
      </ul>
    ) : (
      <div className="ml-4 space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="p-2 bg-gray-100 rounded-md shadow-sm">
            <strong className="text-blue-600">{key}:</strong>{" "}
            <RenderData data={value} />
          </div>
        ))}
      </div>
    );
  } else {
    return <span className="ml-2 text-gray-700">{data?.toString()}</span>;
  }
};

export default function TrainingDetails({ clientToken }) {
  const { sessionId } = useParams();
  const { api } = useAuth();
  const { register, handleSubmit } = useForm();
  const [federatedSessionData, setFederatedSessionData] = useState({});
  const [uploadStatus, setUploadStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    const fetchFederatedSessionData = async () => {
      try {
        const response = await getFederatedSession(api, sessionId);
        console.log("Checkpoint 1 : ", response.data)
        setFederatedSessionData(response.data);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };
    fetchFederatedSessionData();
  }, [sessionId]);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("No file selected.");
      return;
    }
    alert("File is Selected")
  }
  const onSubmit = async (data) => {
    try {
      const requestData = {
        session_id: sessionId,
        decision: data.decision === "accepted" ? 1 : 0,
      };
      const response = await respondToSession(api, requestData);
      if (response?.data?.success) {
        setFederatedSessionData((prev) => ({
          ...prev,
          client_status: data.decision === "accepted" ? 2 : 3,
        }));
      }
    } catch (error) {
      console.error("Error submitting decision:", error);
    }
  };

  const onSubmitPriceAcceptance = async (data) => {
    const requestData = {
      client_id: clientToken,
      session_id: sessionId,
      decision: data.decision === "accepted" ? 1 : -1,
    };

    try {
      const res = await axios.post(clientPriceResponseEndpoint, requestData);
      if (res.status === 200) {
        setFederatedSessionData((prev) => ({
          ...prev,
          price_accepted: requestData.decision,
        }));
      }
    } catch (error) {
      console.error("Error submitting price acceptance:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-bold text-center text-blue-700">
          Training Details
        </h3>
        <div className="mt-4 space-y-4">
          {federatedSessionData &&
            Object.entries(federatedSessionData).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-100 rounded-lg shadow">
                <h5 className="text-lg font-semibold text-blue-600 border-b pb-1">
                  {key.replace(/_/g, " ")}
                </h5>

                {key.toLowerCase() === "training_status" ? (
                  value === 1 ? (
                    <form
                      onSubmit={handleSubmit(onSubmitPriceAcceptance)}
                      className="mt-2 p-4 border rounded-lg bg-gray-50 shadow-md"
                    >
                      {/* Display Training Price in Data Points */}
                      <div className="mb-4">
                        <label className="block text-lg font-semibold text-gray-700">
                          Training Price
                        </label>
                        <div className="p-3 bg-white border rounded-lg shadow-sm text-gray-900 text-lg font-bold">
                        {federatedSessionData.session_price} Points
                        </div>
                      </div>

                      {/* Accept/Reject Price */}
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="accepted"
                            {...register("decision", { required: true })}
                            className="form-radio text-blue-500"
                          />
                          <span className="text-gray-800">Accept</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="rejected"
                            {...register("decision", { required: true })}
                            className="form-radio text-red-500"
                          />
                          <span className="text-gray-800">Reject</span>
                        </label>
                      </div>

                      {/* Upload Data Button */}
                      <div className="mt-4">
                        <input
                          type="file"
                          accept=".npy"
                          onChange={handleFileChange}
                          className="mb-2"
                        />
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                        >
                          Upload Data
                        </button>
                        {uploadStatus && (
                          <p className="mt-2 text-sm text-gray-600">
                            {uploadStatus}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                      >
                        Submit Price to Server
                      </button>
                    </form>
                  ) : (
                    <div className="text-gray-700">
                      {TrainingStatuses[value]}
                    </div>
                  )
                ) : key.toLowerCase() === "client_status" ? (
                  value === 1 ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="accepted"
                            {...register("decision", { required: true })}
                            className="form-radio text-blue-500"
                          />
                          <span>Accept</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="rejected"
                            {...register("decision", { required: true })}
                            className="form-radio text-red-500"
                          />
                          <span>Reject</span>
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Submit Response
                      </button>
                    </form>
                  ) : (
                    <div className="text-gray-700">{ClientStatus[value]}</div>
                  )
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
