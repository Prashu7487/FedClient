// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGlobalData } from "../GlobalContext";
// import axios from "axios";
// import { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { getAllSessions } from "../services/federatedService";
// import { TrainingStatuses } from "../helpers/constants";

// const getAllFederatedSessionsURL =
//   process.env.REACT_APP_GET_ALL_FEDERATED_SESSIONS_URL;

// export default function TrainingStatus() {
//   const navigate = useNavigate();
//   const [federatedSession, setFederatedSession] = useState([]);
//   const { api } = useAuth()

//   const opendetails = (item) => {
//     navigate(`/TrainingStatus/details/${item}`);
//   };

//   useEffect(() => {
//     async function fetchData(url) {
//       try {
//         getAllSessions(api)
//           .then((response) => {
//             setFederatedSession(response.data);
//           })
//           .catch(() => {
//             console.log("Failed to fetch data from server");
//           })
//         // const res = await axios.get(url);
//         // if (res.status == 200) {
//         //   const federatedSession = res.data["federated_session"];
//         //   setFederatedSession(federatedSession);
//         // } else {
//         // }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }
//     console.log(getAllFederatedSessionsURL);
//     fetchData(getAllFederatedSessionsURL);
//   }, []);

//   return (
//     <div className="container">
//       {federatedSession.length === 0 ? (
//         <div className="alert alert-warning text-center mt-4" role="alert">
//           No training Data Available!!
//         </div>
//       ) : (
//         <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//           {federatedSession.map((item, index) => (
//             <div className="col" key={index}>
//               <div className="card h-100">
//                 <div className="card-header">
//                   <h3>{item['name']}</h3>
//                 </div>
//                 <div className="card-body">
//                   <h6 className="card-title">
//                     RequestID: {item["id"]}
//                   </h6>
//                   <h6 className={`card-title color-`}>
//                     {TrainingStatuses[item["training_status"]]}
//                   </h6>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => opendetails(item["id"])}
//                   >
//                     Expand
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllSessions } from "../services/federatedService";
import { TrainingStatuses } from "../helpers/constants";

const getAllFederatedSessionsURL =
  process.env.REACT_APP_GET_ALL_FEDERATED_SESSIONS_URL;

export default function TrainingStatus() {
  const navigate = useNavigate();
  const [federatedSession, setFederatedSession] = useState([]);
  const { api } = useAuth();

  const opendetails = (item) => {
    navigate(`/TrainingStatus/details/${item}`);
  };

  useEffect(() => {
    async function fetchData(url) {
      try {
        getAllSessions(api)
          .then((response) => {
            setFederatedSession(response.data);
          })
          .catch(() => {
            console.log("Failed to fetch data from server");
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    console.log(getAllFederatedSessionsURL);
    fetchData(getAllFederatedSessionsURL);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {federatedSession.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg text-center mt-4">
          No training data available!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {federatedSession.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg border p-4"
            >
              <div className="border-b pb-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item["name"]}
                </h3>
              </div>
              <div className="space-y-2">
                <h6 className="text-sm font-medium text-gray-600">
                  Request ID: {item["id"]}
                </h6>
                <h6 className="text-sm font-medium text-gray-700">
                  {TrainingStatuses[item["training_status"]]}
                </h6>
                <button
                  className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                  onClick={() => opendetails(item["id"])}
                >
                  Expand
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
