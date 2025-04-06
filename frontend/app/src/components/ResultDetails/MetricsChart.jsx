import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import {
  ChartBarIcon,
  ArrowsPointingOutIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MetricsChart = ({ testResults }) => {
  const [selectedMetric, setSelectedMetric] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [metrics, setMetrics] = useState([]);

  // Extract labels and available metrics
  useEffect(() => {
    if (testResults && Object.keys(testResults).length > 0) {
      const firstRound = testResults[Object.keys(testResults)[0]];
      const availableMetrics = Object.keys(firstRound);
      setMetrics(availableMetrics);
      // Auto-select the first metric if none is selected
      if (!selectedMetric && availableMetrics.length > 0) {
        setSelectedMetric(availableMetrics[0]);
      }
    }
  }, [testResults]);

  // Prepare chart data
  const data = {
    labels: Object.keys(testResults),
    datasets: selectedMetric ? [{
      label: selectedMetric,
      data: Object.keys(testResults).map(round => testResults[round][selectedMetric]),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointBackgroundColor: '#1d4ed8',
      borderWidth: 2,
      tension: 0.1,
      fill: true
    }] : []
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(4)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grace: '10%',
        beginAtZero: false
      }
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${
      isFullscreen ? 'fixed inset-0 z-50 p-4' : 'w-full mb-6'
    }`}>
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Training Metrics</h3>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <ArrowsPointingOutIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Metric</label>
            <select
              className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {metrics.length === 0 && (
                <option value="">No metrics available</option>
              )}
              {metrics.map((metric) => (
                <option key={metric} value={metric}>
                  {metric.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {selectedMetric && (
            <div className="flex items-center text-sm text-gray-600">
              <InformationCircleIcon className="h-4 w-4 mr-1" />
              <span>Showing data for {selectedMetric}</span>
            </div>
          )}
        </div>

        <div className={`relative ${isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-80'}`}>
          {selectedMetric ? (
            <Line data={data} options={options} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center p-6 max-w-md">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No metric selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {metrics.length > 0 
                    ? "Please select a metric from the dropdown" 
                    : "No metrics data available"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsChart;