import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getTrainingResults } from "../../services/federatedService";
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  ChartBarIcon
} from "@heroicons/react/24/solid";


const Result = ({ sessionId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { api } = useAuth();

  const fetchResultsData = async () => {
    if (!sessionId) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getTrainingResults(api, sessionId);
      console.log("Checkpoint Results :", response.data)
      setResults(response.data);
    } catch (err) {
      console.error("Error fetching training results:", err);
      setError("Failed to fetch training results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultsData();
  }, [sessionId]);


  const formatMetricValue = (value, isPercentage = false) => {
    if (isPercentage) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toFixed(4);
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
            Training Results
            {loading && (
              <ArrowPathIcon className="h-5 w-5 ml-2 text-blue-500 animate-spin" />
            )}
          </h3>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Round
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Metrics
                  </th>
                </tr>
              </thead>
            </table>
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center text-gray-500">
                          <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                          Loading results...
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center text-red-500">
                          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                          {error}
                        </div>
                      </td>
                    </tr>
                  ) : results.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center text-gray-500">
                          <InformationCircleIcon className="h-5 w-5 mr-2" />
                          {sessionId ? "No results available yet" : "Select a session to view results"}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    results.map((result) => (
                      <tr key={result.round_number} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Round {result.round_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="space-y-1">
                            {Object.entries(result.metrics).map(([key, value]) => (
                              <div key={key} className="flex">
                                <span className="font-medium text-gray-700 w-24 capitalize">
                                  {key}:
                                </span>
                                <span>
                                  {formatMetricValue(value, key === 'accuracy')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 text-right text-xs text-gray-500 border-t border-gray-200">
          {sessionId && `Showing results for Session ID #${sessionId}`}
        </div>
      </div>
    </div>
  );
};

export default Result;