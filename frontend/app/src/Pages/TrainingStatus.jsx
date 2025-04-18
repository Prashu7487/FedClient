import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllSessions } from "../services/federatedService";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  ArrowRightIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function TrainingStatus() {
  const navigate = useNavigate();
  const { api } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const openDetails = (sessionId) => {
    navigate(`/TrainingStatus/details/${sessionId}`);
  };

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllSessions(api);
      setSessions(response.data || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load training sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 0: return 'bg-gray-100 text-gray-800';      // Session Created
      case 1: return 'bg-yellow-100 text-yellow-800';   // Price Negotiation
      case 2: return 'bg-blue-100 text-blue-800';       // Client Recruitment
      case 3: return 'bg-indigo-100 text-indigo-800';   // Model Initialization
      case 4: return 'bg-purple-100 text-purple-800';   // Training Active
      case 5: return 'bg-green-100 text-green-800';     // Completed
      case -1: return 'bg-red-100 text-red-800';        // Failed
      default: return 'bg-gray-100 text-gray-800';      // Unknown
    }
  };

  const TrainingStatuses = {
    0: "Session Created",
    1: "Price Negotiation",
    2: "Client Recruitment",
    3: "Model Initialization",
    4: "Training Active",
    5: "Completed",
    [-1]: "Failed"
  };
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return timestamp;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-700">Loading training sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Error loading data</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={fetchSessions}
            className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CubeIcon className="h-6 w-6 text-blue-600 mr-2" />
            Training Sessions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor active and completed federated learning sessions
          </p>
        </div>
        <button
          onClick={fetchSessions}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium text-yellow-800">No training sessions</h3>
          </div>
          <p className="mt-2 text-sm text-yellow-700">
            There are currently no training sessions to display.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {sessions.length} training session{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openDetails(session.id)}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {session.name || 'Untitled Session'}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.training_status)}`}>
                      {TrainingStatuses[session.training_status] || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <ClockIcon className="flex-shrink-0 h-4 w-4 mr-1.5" />
                    <span>
                      Session ID: {session.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <ChartBarIcon className="flex-shrink-0 h-4 w-4 mr-1.5" />
                    <span>
                      Created: {formatTimestamp(session.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    View details
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}