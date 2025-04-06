import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import MetricsChart from "../components/ResultDetails/MetricsChart";
import {
  InformationCircleIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  EyeIcon,
  EyeSlashIcon,
  ChartBarIcon,
  ChartPieIcon,
  TableCellsIcon,
  QuestionMarkCircleIcon,
  CodeBracketIcon,
  CircleStackIcon,
  TrophyIcon,
  ScaleIcon,
  ClockIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const get_training_detail_from_session_id =
  process.env.REACT_APP_GET_TRAINING_RESULT_WITH_SESSION_ID;

const RenderData = ({ data, level = 0 }) => {
  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      return (
        <ul className="list-group ms-3">
          {data.map((item, index) => (
            <li className="list-group-item" key={index}>
              <RenderData data={item} level={level + 1} />
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <div className="ms-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{capitalizeFirstLetter(key)}:</strong>
              <RenderData data={value} level={level + 1} />
            </div>
          ))}
        </div>
      );
    }
  } else {
    return (
      <div className="card ms-3 mb-2" style={{ display: "inline-block" }}>
        <div className="card-body p-2">{data?.toString()}</div>
      </div>
    );
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Results = ({ data }) => {
  const testResults = data.test_results;
  const [showDetails, setShowDetails] = useState(false);

  const { organisation_name, model_name, model_info, dataset_info } =
    data.session_data;
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
            Training Session Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your federated learning progress and metrics
          </p>
        </div>
  
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <BuildingOfficeIcon className="h-4 w-4 mr-1 text-gray-500" />
              Organization
            </label>
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-700"
                value={organisation_name}
                readOnly
              />
            </div>
          </div>
  
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <CpuChipIcon className="h-4 w-4 mr-1 text-gray-500" />
              Model
            </label>
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-700"
                value={model_name}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
  
      {/* Toggle Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={toggleDetails}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          {showDetails ? (
            <>
              <EyeSlashIcon className="-ml-1 mr-2 h-5 w-5" />
              Hide Technical Details
            </>
          ) : (
            <>
              <EyeIcon className="-ml-1 mr-2 h-5 w-5" />
              Show Technical Details
            </>
          )}
        </button>
      </div>
  
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metrics Visualization - Takes 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 h-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Training Metrics Visualization
              </h3>
            </div>
            <div className="px-6 py-4 h-[500px]"> {/* Increased height */}
              <MetricsChart testResults={testResults} />
            </div>
          </div>
        </div>
  
        {/* Summary Stats - Takes 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 h-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <ChartPieIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Summary
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  title="Best Round" 
                  value={findBestRound(testResults)} 
                  icon={<TrophyIcon className="h-5 w-5 text-yellow-500" />}
                />
                <StatCard 
                  title="Avg Accuracy" 
                  value={calculateAverage(testResults, 'accuracy')} 
                  icon={<ScaleIcon className="h-5 w-5 text-green-500" />}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  title="Total Rounds" 
                  value={Object.keys(testResults).length} 
                  icon={<ClockIcon className="h-5 w-5 text-blue-500" />}
                />
                <StatCard 
                  title="Last Loss" 
                  value={getLastRoundValue(testResults, 'loss')} 
                  icon={<ArrowDownIcon className="h-5 w-5 text-red-500" />}
                />
              </div>
            </div>
          </div>
        </div>
  
        {/* Results Table - Full width below */}
        <div className="col-span-full">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center">
              <TableCellsIcon className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-md font-semibold text-gray-800">Round Metrics</h3>
              <span className="ml-auto text-xs text-gray-500">
                {Object.keys(testResults).length} rounds completed
              </span>
            </div>
  
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                    >
                      Round
                    </th>
                    {Object.keys(testResults["round 0"]).map((metric) => (
                      <th
                        key={metric}
                        scope="col"
                        className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate max-w-[100px]">
                            {capitalizeFirstLetter(metric)}
                          </span>
                          <QuestionMarkCircleIcon
                            className="ml-1 h-3.5 w-3.5 text-gray-400 hover:text-gray-600 cursor-help"
                            data-tooltip-content={`Description of ${metric}`}
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {Object.entries(testResults).map(([round, result]) => (
                    <tr key={round} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-900 text-xs">
                        {capitalizeFirstLetter(round)}
                      </td>
                      {Object.values(result).map((value, index) => (
                        <td
                          key={index}
                          className={`px-4 py-2.5 whitespace-nowrap text-xs ${
                            typeof value === "number" ? "font-mono" : ""
                          } ${index % 2 === 0 ? "text-gray-700" : "text-gray-500"}`}
                        >
                          {typeof value === "number" ? value.toFixed(4) : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              Hover over{" "}
              <QuestionMarkCircleIcon className="h-3 w-3 inline ml-0.5" /> for
              metric details
            </div>
          </div>
        </div>
      </div>
  
      {/* Detailed Information (Conditional) */}
      {showDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <CodeBracketIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Model Specifications
              </h3>
            </div>
            <div className="px-6 py-4">
              <RenderData data={model_info} />
            </div>
          </div>
  
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
              <CircleStackIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Dataset Characteristics
              </h3>
            </div>
            <div className="px-6 py-4">
              <RenderData data={dataset_info} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ResultDetails() {
  const { sessionId } = useParams();
  const [resultDetails, setresultDetails] = useState({});

  const fetchResultDetails = async () => {
    const get_result_detail_endpoint = `${get_training_detail_from_session_id}/${sessionId}`;
    console.log("getting result from: ", get_result_detail_endpoint);
    try {
      const res = await axios.get(get_result_detail_endpoint);
      console.log("result detail fetched from server:", res.data);
      setresultDetails(res.data);
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    fetchResultDetails();
  }, []);

  return Object.keys(resultDetails).length === 0 ? (
    <div className="alert alert-warning text-center mt-4" role="alert">
      SessionID Does Not exist!!
    </div>
  ) : (
    <div className="container-md">
      <div className="card bg-light">
        <div className="card-header text-center bg-dark text-white">
          <h3>Training Details</h3>
        </div>
        <Results data={resultDetails} />
      </div>
    </div>
  );
}

// Define the StatCard component
const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between">
      <h4 className="text-xs font-medium text-gray-500">{title}</h4>
      {icon}
    </div>
    <p className="mt-1 text-xl font-semibold text-gray-900">
      {typeof value === 'number' ? value.toFixed(4) : value}
    </p>
  </div>
);

// Mock implementations - replace with your actual logic
const findBestRound = (results) => 'Round 5';
const calculateAverage = (results, metric) => 0.8724;
const getLastRoundValue = (results, metric) => 0.1234;