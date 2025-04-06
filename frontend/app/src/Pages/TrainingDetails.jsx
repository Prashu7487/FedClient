import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import {
  getFederatedSession,
  respondToSession,
} from "../services/federatedService";
import axios from "axios";
import FederatedSessionLogs from "../components/Training/FederatedSessionLogs";
import SessionInfo from "../components/Training/SessionInfo";
import DatasetInfo from "../components/Training/DatasetInfo";
import ModelConfig from "../components/Training/ModelConfig";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  ServerStackIcon,
  InformationCircleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import ActionSection from "../components/Training/ActionSection";


const clientPriceResponseEndpoint =
  process.env.REACT_APP_SUBMIT_CLIENT_PRICE_RESPONSE_URL;

const statusConfig = {
  1: { 
    text: "Pending Start", 
    color: "bg-blue-100 text-blue-800",
    icon: <ClockIcon className="h-5 w-5" />
  },
  2: { 
    text: "Initializing", 
    color: "bg-blue-100 text-blue-800",
    icon: <CogIcon className="h-5 w-5" />
  },
  3: { 
    text: "Awaiting Clients", 
    color: "bg-blue-100 text-blue-800",
    icon: <InformationCircleIcon className="h-5 w-5" />
  },
  4: { 
    text: "Training Active", 
    color: "bg-yellow-100 text-yellow-800",
    icon: <BoltIcon className="h-5 w-5" />
  },
  5: { 
    text: "Completed", 
    color: "bg-green-100 text-green-800",
    icon: <CheckCircleIcon className="h-5 w-5" />
  },
  "-1": { 
    text: "Failed", 
    color: "bg-red-100 text-red-800",
    icon: <ExclamationTriangleIcon className="h-5 w-5" />
  },
};

export default function TrainingDetails({ clientToken }) {
  const { sessionId } = useParams();
  const { api } = useAuth();
  const { register, handleSubmit } = useForm();
  const [federatedSessionData, setFederatedSessionData] = useState({});
  const [currentSection, setCurrentSection] = useState("session-info");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFederatedSessionData = async () => {
    try {
      setIsRefreshing(true);
      const response = await getFederatedSession(api, sessionId);
      setFederatedSessionData(response.data);
      console.log("Checkpoint 1: ",response.data)
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFederatedSessionData();
  }, [sessionId]);

  const onSubmitPriceAcceptance = async (data) => {
    const requestData = {
      client_id: clientToken,
      session_id: sessionId,
      decision: data.decision === "accepted" ? 1 : -1,
    };

    try {
      const res = await axios.post(clientPriceResponseEndpoint, requestData);
      if (res.status === 200) {
        await fetchFederatedSessionData();
      }
    } catch (error) {
      console.error("Error submitting price acceptance:", error);
    }
  };

  const sections = [
    { id: "session-info", label: "Session Information", icon: <InformationCircleIcon className="h-5 w-5" /> },
    { id: "dataset-info", label: "Dataset", icon: <ServerStackIcon className="h-5 w-5" /> },
    { id: "model-config", label: "Model Config", icon: <CogIcon className="h-5 w-5" /> },
    { id: "session-logs", label: "Logs", icon: <ChartBarIcon className="h-5 w-5" /> },
    { id: "actions", label: "Actions", icon: <BoltIcon className="h-5 w-5" /> },
  ];

  const renderStatusBadge = () => {
    const status = federatedSessionData?.federated_info?.training_status;
    const config = statusConfig[status] || statusConfig["-1"];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-2">{config.text}</span>
      </span>
    );
  };

  const renderActionSection = () => {
    const status = federatedSessionData?.federated_info?.training_status;
    const clientStatus = federatedSessionData?.federated_info?.client_status;
    const price = federatedSessionData?.federated_info?.session_price;

    if (status === 1 || status === 2 || status === 3) {
      return (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-blue-800">Session Not Started</h3>
          </div>
          <p className="mt-2 text-sm text-blue-700">
            The training session has not yet begun. Please check back later or wait for
            the organizer to start the session.
          </p>
        </div>
      );
    }

    if (status === 4) {
      if (clientStatus === 1) {
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Join Training Session</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700">Training Price</h4>
                <p className="text-2xl font-bold text-blue-600 mt-1">{price || 0} Data Points</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmitPriceAcceptance)}>
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
      } else if (clientStatus === 2) {
        return (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-green-800">Participation Confirmed</h3>
            </div>
            <p className="mt-2 text-sm text-green-700">
              You have accepted to participate in this training session. The training is currently in progress.
            </p>
          </div>
        );
      } else if (clientStatus === 3) {
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium text-yellow-800">Participation Declined</h3>
            </div>
            <p className="mt-2 text-sm text-yellow-700">
              You have chosen not to participate in this training session.
            </p>
          </div>
        );
      }
    }

    if (status === 5) {
      return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-green-800">Training Completed</h3>
          </div>
          <p className="mt-2 text-sm text-green-700">
            This training session has been successfully completed. You can review the results and metrics.
          </p>
        </div>
      );
    }

    if (status === -1) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Training Failed</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">
            This training session encountered an error and could not be completed.
          </p>
        </div>
      );
    }

    return null;
  };

  if (!federatedSessionData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No session data</h3>
          <p className="mt-2 text-sm text-gray-600">
            The requested training session could not be found or loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-sm p-4 border-r border-gray-200">
        <div className="flex items-center justify-between mb-6 p-2">
          <h3 className="text-lg font-semibold text-gray-800">Session Navigation</h3>
          <button 
            onClick={fetchFederatedSessionData}
            disabled={isRefreshing}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="mb-4 p-2">
          {renderStatusBadge()}
        </div>
        
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                currentSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {currentSection === "session-info" && (
            <SessionInfo data={federatedSessionData.federated_info} />
          )}
          {currentSection === "session-logs" && (
            <FederatedSessionLogs sessionId={sessionId} />
          )}
          {currentSection === "dataset-info" && (
            <DatasetInfo data={federatedSessionData.federated_info} />
          )}
          {currentSection === "model-config" && (
            <ModelConfig data={federatedSessionData.federated_info} />
          )}
          {currentSection === "actions" && (
            <ActionSection
            data={federatedSessionData}
          />
          )}
        </div>
      </div>
    </div>
  );
}