import { useGlobalData } from "./GlobalContext";
import axios from "axios";

const private_training_start_url = "http://localhost:9000/execute-round";
const server_status_four_update_Url =
  "http://localhost:8000/update-client-status-four";
const private_server_model_initiate_url =
  "http://localhost:9000/initiate-model";

export default function EventsAction({ socket, clientToken }) {
  const setUpModel = async (config, sessionId) => {
    console.log("config received by setUpModel: ", config);

    const data = {
      model_config: config,
      session_id: sessionId,
      client_id: clientToken,
    };
    const res = await axios.post(private_server_model_initiate_url, data);
    if (res.status === 200) {
      console.log(res.data.message);

      const status_four_data = {
        client_id: clientToken,
        session_id: sessionId,
        decision: 1,
      };
      const response = await axios.post(
        server_status_four_update_Url,
        status_four_data
      );
      if (response.status === 200) {
        console.log(response.message);
      } else {
        console.error("Failed to update the client status", response);
      }
    } else {
      console.error("Failed to send model config to private server", res);
    }
  };

  const train_model = async () => {
    const training_verbose = await axios.get(private_training_start_url);
    if (training_verbose.status === 200) {
      console.log("output:", training_verbose.data.stdout);
      console.log("stderr:", training_verbose.data.stderr);
      console.log("returncode:", training_verbose.data.returncode);
    } else {
      console.error("Failed to start the execution on the private server", res);
    }
  };

  if (socket) {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Config before initialising: ", message);
      if (message.type === "get_model_parameters_start_background_process") {
        const config = message.data;
        const sessionId = message.session_id;
        console.log("building model on client side...");
        setUpModel(config, sessionId); // Function to initialize training
      } else if (message.type === "start_training") {
        console.log("start training on client side...");
        train_model();
      }
    };
  }
}
