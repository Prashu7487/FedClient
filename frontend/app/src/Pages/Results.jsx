import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card/Card";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const getAllTrainingResultsURL = process.env.REACT_APP_GET_ALL_COMPLETED_TRAININGS;

export default function TrainingResults() {
  const navigate = useNavigate();
  const [completedTrainings, setCompletedTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const openDetails = (sessionId) => {
    navigate(`/TrainingResults/details/${sessionId}`);
  };

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(getAllTrainingResultsURL);
        
        if (response.status === 200) {
          setCompletedTrainings(response.data.results || []);
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching training data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(getAllTrainingResultsURL);
      setCompletedTrainings(response.data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-700">Loading training results...</p>
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
            onClick={refreshData}
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
            <ChartBarIcon className="h-6 w-6 text-blue-600 mr-2" />
            Training Results
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review completed training sessions and their performance metrics
          </p>
        </div>
        <button
          onClick={refreshData}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {completedTrainings.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium text-yellow-800">No completed trainings</h3>
          </div>
          <p className="mt-2 text-sm text-yellow-700">
            There are currently no completed training sessions to display.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {completedTrainings.length} completed training session{completedTrainings.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTrainings.map((item) => (
              <Card 
                key={item.session_id} 
                item={item} 
                onClick={() => openDetails(item.session_id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}