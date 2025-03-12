import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserInitiatedSessions } from "../services/federatedService";

export default function Dashboard() {
  const [initiatedSessions, setInitiatedSessions] = useState([]);
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
  useEffect(() => {
    const fetchData = async () => {
      await fetchInitiatedSession();
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
            <table className="w-full border-collapse border border-gray-200">
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
                      {session.training_status === 1
                        ? "🕒 Waiting"
                        : session.training_status === 2
                        ? "📩 Collecting Clients"
                        : session.training_status === 3
                        ? "🚀 Training"
                        : "✅ Completed"}
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
          <h2 className="text-xl font-semibold">Recent Sessions</h2>
          <div className="mt-2 space-y-2">
            <p className="text-gray-600">Session 1 - ✅ Completed</p>
            <p className="text-gray-600">Session 2 - ⏳ In Progress</p>
            <p className="text-gray-600">Session 3 - ❌ Failed</p>
          </div>
          <Link
            to="/sessions"
            className="text-blue-500 mt-3 block hover:underline"
          >
            View All Sessions →
          </Link>
        </div>

        {/* My Data */}
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold">My Data</h2>
          <div className="mt-2 space-y-2">
            <p className="text-gray-600 flex justify-between">
              Dataset 1{" "}
              <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                View
              </button>
            </p>
            <p className="text-gray-600 flex justify-between">
              Dataset 2{" "}
              <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                View
              </button>
            </p>
            <p className="text-gray-600 flex justify-between">
              Dataset 3{" "}
              <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                View
              </button>
            </p>
          </div>
          <Link
            to="/datasets"
            className="text-blue-500 mt-3 block hover:underline"
          >
            Manage Datasets →
          </Link>
        </div>
      </div>

      {/* Floating Add Job Button */}
      <div className="fixed bottom-6 right-6">
        <Link to="/add-session">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition">
            + Add Session
          </button>
        </Link>
      </div>
    </div>
  );
}
