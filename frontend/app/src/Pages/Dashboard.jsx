import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllSessions,
  getUserInitiatedSessions,
} from "../services/federatedService";
import { getLocalDatasets } from "../services/privateService";

export default function Dashboard() {
  const [initiatedSessions, setInitiatedSessions] = useState([]);
  const [datasets, setDatasets] = useState({ uploads: [], processed: [] });
  const [sessions, setSessions] = useState([]);
  const { api } = useAuth();
  const fetchInitiatedSession = async () => {
    try {
      getUserInitiatedSessions(api).then((res) => {
        console.log("Initiated Sessions fetched: ", res.data);
        setInitiatedSessions(res.data);
      });
    } catch (error) {
      console.error("Error fetching initiated sessions:", error);
    }
  };
  const fetchDatasets = async () => {
    try {
      getLocalDatasets().then((res) => {
        console.log("Global Datasets : ", res.data);
        setDatasets(res.data.contents);
      });
    } catch (error) {
      console.error("Error fetching Datasets:", error);
    }
  };
  const fetchSessions = async () => {
    try {
      getAllSessions(api).then((res) => {
        console.log("Sessions : ", res.data);
        setSessions(res.data);
      });
    } catch (error) {
      console.error("Error fetching Sessions:", error);
    }
  };
  // Define statusMap outside for better performance
  const statusMap = {
    1: { text: "Pre-Training Stage", color: "bg-blue-200 text-blue-700" },
    2: { text: "Pre-Training Stage", color: "bg-blue-200 text-blue-700" },
    3: { text: "Pre-Training Stage", color: "bg-blue-200 text-blue-700" },
    4: { text: "Training Stage", color: "bg-yellow-200 text-yellow-700" },
    5: { text: "Post-Training", color: "bg-green-200 text-green-700" },
    "-1": { text: "Training Failed", color: "bg-red-200 text-red-700" },
  };

  // Default status if not found
  const defaultStatus = { text: "Unknown", color: "bg-gray-200 text-gray-700" };

  useEffect(() => {
    const fetchData = async () => {
      await fetchInitiatedSession();
      await fetchDatasets();
      await fetchSessions();
    };
    fetchData();
  }, []);
  return (
    <div className="w-full min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Federated Learning Dashboard
      </h1>

      {/* Initiated Sessions Section */}
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Initiated Sessions</h2>
        <div className="overflow-x-auto">
          {initiatedSessions.length > 0 ? (
            <table className="w-full border-collapse border border-gray-200 text-center">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Session ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Current Round
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Max Rounds
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Session Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Training Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {initiatedSessions.map((session, index) => (
                  <tr key={session.session_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {session.session_id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {session.curr_round}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {session.max_round}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {session.session_price || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${
                          statusMap[session.training_status]?.color ||
                          defaultStatus.color
                        }`}
                      >
                        {statusMap[session.training_status]?.text ||
                          defaultStatus.text}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Link
                        to={`/TrainingStatus/details/${session.session_id}`}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No initiated sessions found.</p>
          )}
        </div>
      </div>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Recent Sessions */}
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Recent Sessions</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.length > 0 ? (
                  sessions.map(({ id, name, training_status }) => (
                    <tr key={id} className="border-b border-gray-200">
                      <td className="border border-gray-300 px-4 py-2">{id}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {name || "Unknown"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${
                            statusMap[training_status]?.color ||
                            defaultStatus.color
                          }`}
                        >
                          {statusMap[training_status]?.text ||
                            defaultStatus.text}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Link
                          to={`/TrainingStatus/details/${id}`}
                          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          🔍 View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-gray-500 border border-gray-300 px-4 py-2"
                    >
                      No recent sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Link
            to="/TrainingStatus"
            className="text-blue-500 mt-4 block hover:underline text-center"
          >
            📂 View All Sessions →
          </Link>
        </div>

        {/* My Data */}
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold">My Data</h2>
          <div className="mt-2 space-y-3">
            {datasets.uploads.map((dataset) => (
              <div key={dataset} className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  {dataset}
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-200 rounded-lg">
                    Raw
                  </span>
                </span>
                <Link
                  to={`/dataset-overview/uploads/${dataset}`}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  🔍 View
                </Link>
              </div>
            ))}
            {datasets.processed.map((dataset) => (
              <div key={dataset} className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  {dataset}
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-200 rounded-lg">
                    Processed
                  </span>
                </span>
                <Link
                  to={`/dataset-overview/processed/${dataset}`}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  🔍 View
                </Link>
              </div>
            ))}
          </div>
          <Link
            to="/ManageData"
            className="text-blue-500 mt-4 block hover:underline"
          >
            📂 Manage Datasets →
          </Link>
        </div>
      </div>

      {/* Floating Add Job Button */}
      <div className="fixed bottom-6 right-6">
        <Link to="/request">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition">
            + Add Session
          </button>
        </Link>
      </div>
    </div>
  );
}
