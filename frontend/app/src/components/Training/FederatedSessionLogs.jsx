import React from "react";

const dummyLogs = [
  { id: 1, session_id: 101, timestamp: "2025-03-25 10:00:00", message: "Session created." },
  { id: 2, session_id: 101, timestamp: "2025-03-25 10:05:00", message: "Price communicated and sent to admin." },
  { id: 3, session_id: 101, timestamp: "2025-03-25 10:10:00", message: "Admin accepted the price." },
  { id: 4, session_id: 101, timestamp: "2025-03-25 10:15:00", message: "Federated request sent to all clients." },
  { id: 5, session_id: 101, timestamp: "2025-03-25 10:20:00", message: "Client 2 accepted the request." },
  { id: 6, session_id: 101, timestamp: "2025-03-25 10:25:00", message: "All 5/5 clients accepted." },
  { id: 7, session_id: 101, timestamp: "2025-03-25 10:30:00", message: "Model configuration sent to all clients." },
  { id: 8, session_id: 101, timestamp: "2025-03-25 10:35:00", message: "Client 3 initiated model training." },
  { id: 9, session_id: 101, timestamp: "2025-03-25 10:40:00", message: "All clients have initiated their model training." },
  { id: 10, session_id: 101, timestamp: "2025-03-25 10:45:00", message: "Global parameters sent to all clients." },
  { id: 11, session_id: 101, timestamp: "2025-03-25 10:50:00", message: "Client 4 completed training." },
  { id: 12, session_id: 101, timestamp: "2025-03-25 10:55:00", message: "All clients have completed training." },
  { id: 13, session_id: 101, timestamp: "2025-03-25 11:00:00", message: "Server started aggregation." },
  { id: 14, session_id: 101, timestamp: "2025-03-25 11:05:00", message:"Server completed aggregation."},
];

const FederatedSessionLogs = ({ sessionId = dummyLogs[0]?.session_id }) => {
    const logs = dummyLogs.filter((log) => log.session_id === sessionId);

    return (
        <div className="container w-full">
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Training Logs</h3>

                {/* Scrollable Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Timestamp</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Message</th>
                            </tr>
                        </thead>
                    </table>

                    {/* Scrollable tbody */}
                    <div className="max-h-[300px] overflow-y-auto border-t border-gray-300">
                        <table className="min-w-full border-collapse">
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="text-center text-gray-500 py-4">
                                            No logs available.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-2 text-sm text-gray-800">{log.timestamp}</td>
                                            <td className="px-4 py-2 text-sm text-gray-800">{log.message}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end items-center">
                    <p className="text-sm text-gray-500">Showing logs for Session ID #{sessionId}</p>
                </div>
            </div>
        </div>
    );
};

export default FederatedSessionLogs;
