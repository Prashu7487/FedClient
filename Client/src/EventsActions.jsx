import { useGlobalData } from "./GlobalContext";

export default function EventsAction() {
  const { GlobalData, setGlobalData } = useGlobalData();
  const trainingURL = "http://localhost:9000/execute-round";

  let Fed = false;
  if (GlobalData.ConnectionObject) {
    let eventSource = GlobalData.ConnectionObject;

    eventSource.onopen = function (event) {
      console.log("Connection established.");
    };

    eventSource.onmessage = function (event) {
      console.log("Received message from event:", event.data);

      // separate this code later
      if (Fed) {
        Fed = false;
        const FedRound = async (url) => {
          console.log("Starting Fedrated Round...");
          try {
            const res = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            const result = await res.json();

            console.log("Msg after this round:", result.message);
          } catch (err) {
            console.log("Error in executing this round:", err);
          }
        };

        FedRound(trainingURL);
      }
    };
  }

  // eventSource.onerror = function (event) {
  //   console.error("EventSource failed:", event);
  // }; //problem is all 3 are executing...
}

/*
  1. special signal for events... for (to_initialte_asking_request_data, fed_round, end_training ...used to kill the server)

*/
