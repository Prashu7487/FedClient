import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PreviewIcon from '@mui/icons-material/Preview';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const url_get_dataset = process.env.REACT_APP_GET_DATASET;

const DatasetDetail = () => {
  const { code } = useParams();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("mae");

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const url = `${url_get_dataset}/${code}`;
        const res = await axios.get(url);
        console.log("Checkpoint 1: ", res.data);
        setDataset(res.data);
      } catch (err) {
        setError("Failed to fetch dataset. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [code]);

  const openMetricsBlock = (benchmark) => {
    setSelectedBenchmark(benchmark);
    setSelectedMetric(Object.keys(benchmark.metrics)[0]); // Default to the first metric
  };

  const closeMetricsBlock = () => {
    setSelectedBenchmark(null);
  };

  const getChartData = () => {
    if (!selectedBenchmark || !selectedBenchmark.metrics[selectedMetric])
      return null;

    const metricData = selectedBenchmark.metrics[selectedMetric];
    return {
      labels: ["Mean"], // Only show "Mean" as label
      datasets: [
        {
          label: `${selectedMetric.toUpperCase()} Metrics`,
          data: [metricData.mean],
          borderColor: "#4A90E2",
          backgroundColor: "rgba(74, 144, 226, 0.2)",
          pointBackgroundColor: "#4A90E2",
          pointBorderColor: "#fff",
          tension: 0.4,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "#50E3C2",
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `${selectedMetric.toUpperCase()} Metrics` },
      tooltip: {
        callbacks: {
          label: (context) => {
            const metricData = selectedBenchmark.metrics[selectedMetric];
            return [
              `Mean: ${metricData.mean.toFixed(3)}`,
              `Std Dev: ${metricData.std_dev.toFixed(3)}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: `${selectedMetric.toUpperCase()} Value` },
        beginAtZero: true,
      },
      x: {
        display: false, // Hide x-axis as it's static
      },
    },
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading dataset details...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 shadow-lg rounded-lg">
      {/* Dataset Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {dataset.name}
        </h1>
        <p className="text-gray-700 mb-4">{dataset.description}</p>
        <p className="text-sm text-gray-600">
          <strong>Source:</strong>{" "}
          <a
            href={dataset.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {dataset.source}
          </a>
        </p>
      </div>

      {/* Benchmarks Table */}
      {/* Benchmarks Table */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Benchmarks</h2>
        <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Task
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Benchmark Metric
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Best Model
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 text-center">
                Metrics
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 text-center">
                Train Model
              </th>
            </tr>
          </thead>
          <tbody>
            {dataset.benchmarks.map((benchmark) => (
              <tr key={benchmark.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                  {benchmark.task}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                  {benchmark.benchmark_metric.toUpperCase()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                  {benchmark.model_name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600 text-center">
                  <button
                    onClick={() => openMetricsBlock(benchmark)}
                    className="text-blue-500 hover:underline"
                  >
                    <PreviewIcon/>
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600 text-center">
                  <button
                    onClick={() => navigateToTrainModel(benchmark)}
                    className="text-green-500 hover:underline"
                  >
                    <ExitToAppIcon/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metrics Block */}
      {selectedBenchmark && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative shadow-lg">
            <button
              onClick={closeMetricsBlock}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">
              Metrics for {selectedBenchmark.task}
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 p-2 rounded mb-4 w-full"
            >
              {Object.keys(selectedBenchmark.metrics).map((metric) => (
                <option key={metric} value={metric}>
                  {metric.toUpperCase()}
                </option>
              ))}
            </select>
            {getChartData() ? (
              <Line data={getChartData()} options={chartOptions} />
            ) : (
              <p className="text-gray-500">
                No data available for this metric.
              </p>
            )}
          </div>
        </div>
      )}
      <div className="my-8">
        <hr className="border-t-2 border-gray-600 rounded-md" />
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Columns</h2>
        <table className="w-full table-auto border border-gray-200 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Data Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dataset.columns.map((column, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">
                  {column.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {column.dtype}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {column.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-8">
        <hr className="border-t-2 border-gray-600 rounded-md" />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Files</h2>
        <table className="w-full table-auto border border-gray-200 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Path
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dataset.files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{file.name}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  <a
                    href={`hdfs://${file.hdfs_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.hdfs_path}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {file.is_folder ? "Folder" : "File"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {file.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetDetail;
