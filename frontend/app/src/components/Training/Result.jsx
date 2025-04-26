import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getTrainingResults } from "../../services/federatedService";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Result = ({ sessionId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("chart");
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const { api } = useAuth();
  const [refreshInterval, setRefreshInterval] = useState(null);

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
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setResults(data);
      
      // Initialize selected metrics with all available metrics
      if (data.length > 0 && data[0].metrics) {
        const firstMetricKey = Object.keys(data[0].metrics)[0]; // Get first key
        setSelectedMetrics([firstMetricKey]);
      }
    } catch (err) {
      console.error("Error fetching training results:", err);
      setError("Failed to fetch training results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultsData();
    
    // Set up real-time refresh every 5 seconds when sessionId is present
    if (sessionId) {
      const interval = setInterval(fetchResultsData, 30000);
      setRefreshInterval(interval);
      
      // Clean up interval on unmount or when sessionId changes
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [sessionId]);

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [refreshInterval]);

  const formatMetricValue = (value, isPercentage = false) => {
    if (typeof value !== 'number') return value;
    if (isPercentage) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toFixed(4);
  };

  // Prepare data for charts - only if results is an array and has items
  const chartData = Array.isArray(results) && results.length > 0 
    ? results.map((result) => ({
        round: `Round ${result.round_number}`,
        ...Object.entries(result.metrics || {}).reduce((acc, [key, value]) => {
          acc[key] = key === "accuracy" ? value * 100 : value;
          return acc;
        }, {}),
      }))
    : [];

  const metricKeys = results.length > 0 && results[0].metrics 
    ? Object.keys(results[0].metrics) 
    : [];

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // Generate consistent colors for metrics
  const getMetricColor = (metric) => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', 
      '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#D0ED57'
    ];
    const index = metricKeys.indexOf(metric) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
            Training Results
            {loading && (
              <ArrowPathIcon className="h-5 w-5 ml-2 text-blue-500 animate-spin" />
            )}
          </h3>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-3 py-1 text-sm rounded-md ${
                activeTab === "chart"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Chart View
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1 text-sm rounded-md ${
                activeTab === "table"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Table View
            </button>
            <button
              onClick={fetchResultsData}
              className="px-3 py-1 text-sm rounded-md text-gray-600 hover:bg-gray-100 flex items-center"
              disabled={loading}
            >
              <ArrowPathIcon className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === "table" ? (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Round
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metrics
                      </th>
                    </tr>
                  </thead>
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
                            {sessionId
                              ? "No results available yet"
                              : "Select a session to view results"}
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
                              {Object.entries(result.metrics || {}).map(([key, value]) => (
                                <div key={key} className="flex">
                                  <span className="font-medium text-gray-700 w-24 capitalize">
                                    {key}:
                                  </span>
                                  <span>
                                    {formatMetricValue(value, key === "accuracy")}
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
          ) : (
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  <ArrowPathIcon className="h-8 w-8 mr-2 animate-spin" />
                  Loading charts...
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64 text-red-500">
                  <ExclamationTriangleIcon className="h-8 w-8 mr-2" />
                  {error}
                </div>
              ) : results.length === 0 ? (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  <InformationCircleIcon className="h-8 w-8 mr-2" />
                  {sessionId
                    ? "No results available for charts"
                    : "Select a session to view charts"}
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {metricKeys.map((metric) => (
                      <button
                        key={metric}
                        onClick={() => toggleMetric(metric)}
                        className={`px-3 py-1 text-sm rounded-md capitalize ${
                          selectedMetrics.includes(metric)
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {metric}
                      </button>
                    ))}
                  </div>

                  <div className="h-80">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Metrics Progression
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="round" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [
                            name === "accuracy" ? `${value}%` : value,
                            name,
                          ]}
                        />
                        <Legend />
                        {selectedMetrics.map((metric) => (
                          <Line
                            key={metric}
                            type="monotone"
                            dataKey={metric}
                            stroke={getMetricColor(metric)}
                            activeDot={{ r: 8 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-gray-50 text-right text-xs text-gray-500 border-t border-gray-200">
          {sessionId && `Session ID #${sessionId}`}
          {sessionId && (
            <span className="ml-2">
              {loading ? 'Updating...' : 'Auto-refresh every 5 seconds'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;