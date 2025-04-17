import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

import {
  submitPriceAcceptanceResponse,
  submitTrainingAcceptanceResponse,
} from "../../services/federatedService";

import { createQPDataset } from "../../services/privateService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Result from "./Result";

const ActionSection = ({ data, clientToken, sessionId }) => {
  const { register, handleSubmit } = useForm();
  const [isQpdCreated, setIsQpdCreated] = useState(false);
  const {
    training_status: trainingStatus,
    client_status: clientStatus,
    session_price: sessionPrice,
  } = data || {};
  const { api } = useAuth();
  const navigate = useNavigate();

  const handleCreateQpd = async () => {
    try {
      const qpdDataRequest = {
        session_id: Number(sessionId),
        session_price: Number(sessionPrice),
        client_token: JSON.parse(localStorage.getItem("user")).access_token,
      };

      console.log("QPD Data Request:", qpdDataRequest);
      await createQPDataset(qpdDataRequest);
      // alert("QPD dataset created successfully!");
      toast.success("QPD dataset creation started !!", {
        position: "bottom-center",
        autoClose: 4000,
      });
      setIsQpdCreated(true);
    } catch (error) {
      // alert("Error creating QPD dataset. Please try again.");
      toast.error("Error creating QPD dataset. Please try again.", {
        position: "bottom-center",
        autoClose: 4000,
      });
      console.error("Error creating QPD dataset:", error);
    }
  };

  const onSubmitParticipationDecision = async (data) => {
    const requestData = {
      session_id: sessionId,
      decision: data.decision === "accepted" ? 1 : 0,
    };
    try {
      submitTrainingAcceptanceResponse(api, requestData).then((response) => {
        // alert(response?.data?.message);
        toast.success(response?.data?.message, {
          position: "bottom-center",
          autoClose: 4000,
        });
        navigate(`/TrainingStatus/details/${sessionId}`);
      });
    } catch (error) {
      console.error("Error submitting decision:", error);
    }
  };

  const onSubmitPriceAcceptance = async (data) => {
    try {
      const requestData = {
        session_id: sessionId,
        decision: data.decision === "accepted" ? 1 : 0,
      };
      await submitPriceAcceptanceResponse(api, requestData);
      // alert(response?.data?.message);
      toast.success(response?.data?.message, {
        position: "bottom-center",
        autoClose: 4000,
      });
      navigate(`/TrainingStatus/details/${sessionId}`);
    } catch (error) {
      console.error("Error submitting price decision:", error);
    }
  };

  const renderPriceAcceptanceForm = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Set Training Price
      </h3>
      <form onSubmit={handleSubmit(onSubmitPriceAcceptance)}>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-700">Training Price</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {sessionPrice || 0} Data Points
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateQpd}
              className="h-fit py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create QPD Dataset
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Decision</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="accepted"
                  {...register("decision", { required: true })}
                  className="form-radio text-blue-600"
                  disabled={!isQpdCreated}
                />
                <span className="ml-2 text-gray-700">Accept</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="rejected"
                  {...register("decision", { required: true })}
                  className="form-radio text-red-600"
                  disabled={!isQpdCreated}
                />
                <span className="ml-2 text-gray-700">Reject</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isQpdCreated}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isQpdCreated
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                : "bg-gray-400 cursor-not-allowed focus:ring-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            Submit Price Decision
          </button>
        </div>
      </form>
    </div>
  );

  // Rest of the component remains the same
  const renderParticipationDecisionForm = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Join Training Session
      </h3>

      <form onSubmit={handleSubmit(onSubmitParticipationDecision)}>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="accepted"
                {...register("decision", { required: true })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Accept</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="rejected"
                {...register("decision", { required: true })}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
              <span className="ml-2 text-gray-700">Reject</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Response
          </button>
        </div>
      </form>
    </div>
  );

  const renderWaitingForClientConfirmation = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
      <div className="flex items-center">
        <CogIcon className="h-5 w-5 text-yellow-500 mr-2" />
        <h3 className="text-lg font-medium text-yellow-800">
          Sending Model Configurations
        </h3>
      </div>
      <p className="mt-2 text-sm text-yellow-700">
        Model configuration sent to interested clients. Waiting for them to
        acknowledge and prepare for training.
      </p>
    </div>
  );

  const renderTrainingInProgress = () => (
    <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg">
      <div className="flex items-center">
        <ClockIcon className="h-5 w-5 text-purple-500 mr-2" />
        <h3 className="text-lg font-medium text-purple-800">
          Training In Progress
        </h3>
      </div>
      <p className="mt-2 text-sm text-purple-700">
        The training session is currently running.
      </p>
    </div>
  );

  const renderTrainingCompleted = () => (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
      <div className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
        <h3 className="text-lg font-medium text-green-800">
          Training Completed
        </h3>
      </div>
      <p className="mt-2 text-sm text-green-700">
        The training is complete. View the results below.
      </p>

      <Result sessionId={sessionId} />
    </div>
  );

  const ParticipationConfirmedAlert = () => {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-green-800">
              Participation Confirmed
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Thank you for confirming your participation in this training
                session. Your spot has been secured.
              </p>
              <div className="mt-3 bg-green-100 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-700 font-medium">
                  <InformationCircleIcon className="h-5 w-5 inline mr-1.5 text-green-600" />
                  Other participants are still confirming their attendance. The
                  session will proceed once we reach the minimum required
                  participants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (trainingStatus) {
    case 1:
      return renderPriceAcceptanceForm();
    case 2:
      if (clientStatus === -1) {
        return renderParticipationDecisionForm();
      }
      return ParticipationConfirmedAlert();
    case 3:
      return renderWaitingForClientConfirmation();
    case 4:
      return renderTrainingInProgress();
    case 5:
      return renderTrainingCompleted();
    case -1:
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-800">
              Training Failed
            </h3>
          </div>
          <p className="mt-2 text-sm text-red-700">
            This session encountered an error and could not complete.
          </p>
        </div>
      );
    default:
      return (
        <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">
              Unknown Status
            </h3>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            Unable to determine the current session status.
          </p>
        </div>
      );
  }
};

export default ActionSection;
