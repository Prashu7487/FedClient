// import React from "react";
// import { FolderIcon } from "@heroicons/react/24/outline";
// import { useFormContext } from "react-hook-form";

// export default function SelectDatasetsStep() {
//   const { register } = useFormContext();

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center space-x-2">
//         <FolderIcon className="h-6 w-6 text-green-600" />
//         <h4 className="text-lg font-semibold">Dataset Information</h4>
//       </div>

//       <div className="space-y-4">
//         <input
//           type="text"
//           placeholder="Dataset description"
//           {...register("dataset_info.about_dataset")}
//           className="w-full p-3 border rounded-md"
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             placeholder="Feature name"
//             {...register("dataset_info.feature_list.0.feature_name")}
//             className="p-2 border rounded-md"
//           />
//           <input
//             type="text"
//             placeholder="Feature type"
//             {...register("dataset_info.feature_list.0.type_Of_feature")}
//             className="p-2 border rounded-md"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  FolderIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useFormContext } from "react-hook-form";

export default function SelectDatasetsStep() {
  const { register, setValue, watch } = useFormContext();
  const [loadingClient, setLoadingClient] = useState(false);
  const [loadingServer, setLoadingServer] = useState(false);
  const [clientStats, setClientStats] = useState(null);
  const [serverStats, setServerStats] = useState(null);
  const [errorClient, setErrorClient] = useState(null);
  const [errorServer, setErrorServer] = useState(null);
  const [outputColumns, setOutputColumns] = useState([]);
  const [showColumnSelection, setShowColumnSelection] = useState(false);

  const clientFilename = watch("dataset_info.client_filename");
  const serverFilename = watch("dataset_info.server_filename");

  const fetchClientStats = async () => {
    if (!clientFilename) return;
    setLoadingClient(true);
    setErrorClient(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dataset-stats/client/${clientFilename}`
      );
      const data = await response.json();
      if (data.detail) {
        setErrorClient(data.detail);
        setClientStats(null);
      } else {
        setClientStats(data);
        setErrorClient(null);
      }
    } catch (err) {
      setErrorClient("Failed to fetch client dataset stats");
      setClientStats(null);
    } finally {
      setLoadingClient(false);
    }
  };

  const fetchServerStats = async () => {
    if (!serverFilename) return;
    setLoadingServer(true);
    setErrorServer(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dataset-stats/server/${serverFilename}`
      );
      const data = await response.json();
      if (data.detail) {
        setErrorServer(data.detail);
        setServerStats(null);
      } else {
        setServerStats(data);
        setErrorServer(null);
      }
    } catch (err) {
      setErrorServer("Failed to fetch server dataset stats");
      setServerStats(null);
    } finally {
      setLoadingServer(false);
    }
  };

  const handleOutputColumnChange = (column) => {
    setOutputColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
    setValue("dataset_info.output_columns", outputColumns);
  };

  const columnsMatch = () => {
    if (!clientStats || !serverStats) return false;
    const clientColumns = clientStats.columnStats.map((c) => c.name);
    const serverColumns = serverStats.columnStats.map((c) => c.name);
    return JSON.stringify(clientColumns) === JSON.stringify(serverColumns);
  };

  const getAvailableColumns = () => {
    if (columnsMatch() && clientStats) {
      return clientStats.columnStats.map((c) => c.name);
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FolderIcon className="h-6 w-6 text-green-600" />
        <h4 className="text-lg font-semibold">Dataset Information</h4>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Dataset Name:
          </label>
          <input
            type="text"
            placeholder="Enter your dataset name"
            {...register("dataset_info.name")}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Client Dataset:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter client filename"
                {...register("dataset_info.client_filename")}
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={fetchClientStats}
                disabled={loadingClient || !clientFilename}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center disabled:opacity-50"
              >
                {loadingClient ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowPathIcon className="h-4 w-4" />
                )}
                <span className="ml-1">Fetch</span>
              </button>
            </div>
            {errorClient && (
              <div className="text-red-500 text-sm flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errorClient}
              </div>
            )}
            {clientStats && (
              <div className="text-green-600 text-sm flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Found {clientStats.numRows} rows, {clientStats.numColumns}{" "}
                columns
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Server Dataset:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter server filename"
                {...register("dataset_info.server_filename")}
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={fetchServerStats}
                disabled={loadingServer || !serverFilename}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center disabled:opacity-50"
              >
                {loadingServer ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowPathIcon className="h-4 w-4" />
                )}
                <span className="ml-1">Fetch</span>
              </button>
            </div>
            {errorServer && (
              <div className="text-red-500 text-sm flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errorServer}
              </div>
            )}
            {serverStats && (
              <div className="text-green-600 text-sm flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Found {serverStats.numRows} rows, {serverStats.numColumns}{" "}
                columns
              </div>
            )}
          </div>
        </div>

        {clientStats && serverStats && (
          <div className="space-y-2">
            <div
              className={`text-sm p-2 rounded-md ${
                columnsMatch()
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              } flex items-center`}
            >
              {columnsMatch() ? (
                <CheckCircleIcon className="h-4 w-4 mr-1" />
              ) : (
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              )}
              {columnsMatch()
                ? "Column names match between client and server datasets"
                : "Column names do not match between client and server datasets"}
            </div>

            {columnsMatch() && (
              <div className="border rounded-md p-3">
                <button
                  type="button"
                  onClick={() => setShowColumnSelection(!showColumnSelection)}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {showColumnSelection ? (
                    <ChevronUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 mr-1" />
                  )}
                  Select Output Columns
                </button>

                {showColumnSelection && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600">
                      Select which columns should be used as output:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {getAvailableColumns().map((column) => (
                        <label
                          key={column}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={outputColumns.includes(column)}
                            onChange={() => handleOutputColumnChange(column)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{column}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hidden fields to store the stats data */}
        <input
          type="hidden"
          {...register("dataset_info.client_stats")}
          value={JSON.stringify(clientStats)}
        />
        <input
          type="hidden"
          {...register("dataset_info.server_stats")}
          value={JSON.stringify(serverStats)}
        />
      </div>
    </div>
  );
}
