import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const onSubmitParticipationDecision = async (data) => {
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
          if (res.status == 200) {
            await fetchFederatedSessionData();
          } else {
            console.error("⚠️ Unexpected response:", res.data);
          }
        } catch (error) {
          console.error("Error submitting price acceptance:", error);
        }
      };

const ActionSection = ({ 
  data, 
}) => {
  const { register, handleSubmit } = useForm();
  const {
    training_status: trainingStatus,
    client_status: clientStatus,
    session_price: sessionPrice
  } = data || {};

  // Render price acceptance form (for admin when training_status = 1)
  const renderPriceAcceptanceForm = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Set Training Price
      </h3>
      <form onSubmit={handleSubmit(onSubmitPriceAcceptance)}>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700">Training Price</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {sessionPrice || 0} Data Points
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Price to Clients
          </button>
        </div>
      </form>
    </div>
  );

  // Render participation decision form (for client when training_status = 2)
  const renderParticipationDecisionForm = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Join Training Session
      </h3>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700">Training Price</h4>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {sessionPrice || 0} Data Points
          </p>
        </div>

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
    </div>
  );

  // Render client status after decision
  const renderClientStatus = () => {
    if (clientStatus === 2) {
      return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-green-800">
              Participation Confirmed
            </h3>
          </div>
          <p className="mt-2 text-sm text-green-700">
            You have accepted to participate in this training session.
          </p>
        </div>
      );
    } else if (clientStatus === 3) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium text-yellow-800">
              Participation Declined
            </h3>
          </div>
          <p className="mt-2 text-sm text-yellow-700">
            You have chosen not to participate in this training session.
          </p>
        </div>
      );
    }
    return null;
  };

  switch(trainingStatus) {
    case 1:
      // Admin sets the price (training_status = 1)
      return renderPriceAcceptanceForm();
    case 2:
      // Client decides to participate (training_status = 2)
      if (clientStatus === 1) {
        return renderParticipationDecisionForm();
      }
      return renderClientStatus();
    case 3:
      return (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-blue-800">
              Awaiting Client Responses
            </h3>
          </div>
          <p className="mt-2 text-sm text-blue-700">
            Waiting for clients to respond to the training invitation.
          </p>
        </div>
      );
    case 4:
      return (
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
    case 5:
      return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-green-800">
              Training Completed
            </h3>
          </div>
          <p className="mt-2 text-sm text-green-700">
            Review the results and metrics from this completed session.
          </p>
        </div>
      );
    case -1:
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Training Failed</h3>
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