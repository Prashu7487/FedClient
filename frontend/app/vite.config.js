import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const environmentVariables = [
  "REACT_APP_SERVER_BASE_URL",
  "REACT_APP_SERVER_WS_BASE_URL",
  "REACT_APP_PRIVATE_SERVER_BASE_URL",
  "REACT_APP_REGISTER_CLIENT_URL",
  "REACT_APP_REQUEST_FEDERATED_SESSION_URL",
  "REACT_APP_SUBMIT_CLIENT_FEDERATED_RESPONSE_URL",
  "REACT_APP_GET_ALL_FEDERATED_SESSIONS_URL",
  "REACT_APP_UPDATE_CLIENT_STATUS_FOUR_URL",
  "REACT_APP_GET_FEDERATED_SESSION_URL",
  "REACT_APP_GET_ALL_COMPLETED_TRAININGS",
  "REACT_APP_GET_TRAINING_RESULT_WITH_SESSION_ID",
  "REACT_APP_SUBMIT_CLIENT_PRICE_RESPONSE_URL",
  "REACT_APP_GET_DATASET",
  "REACT_APP_GET_ALL_INITIATED_SESSIONS",
  "REACT_APP_GET_ALL_PARTICIPATED_SESSIONS",
  "REACT_APP_WS_URL",
  "REACT_APP_SERVER_DATASET_OVERVIEW_PATH",
  "REACT_APP_GET_TASKS_WITH_DATASET_ID",
  "REACT_APP_VIEW_RECENT_UPLOADS_URL",
  "REACT_APP_RAW_DATASETS_ENDPOINT",
  "REACT_APP_RAW_DATASET_RENAME_ENDPOINT",
  "REACT_APP_DELETE_RAW_ENDPOINT",
  "REACT_APP_RAW_OVERVIEW_PATH",
  "REACT_APP_PROCESSED_DATASETS_ENDPOINT",
  "REACT_APP_PROCESSED_DATASET_RENAME_ENDPOINT",
  "REACT_APP_DELETE_PROCESSED_ENDPOINT",
  "REACT_APP_PROCESSED_OVERVIEW_PATH",
  "REACT_APP_INITIATE_MODEL_FOR_TRAINING",
  "REACT_APP_EXECUTE_TRAINING_ROUND",
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const processEnv = {};
  environmentVariables.forEach((key) => (processEnv[key] = env[key]));

  return {
    define: {
      "process.env": processEnv,
    },
    plugins: [react()],
    server: {
      host: "0.0.0.0", // Allows external access from Docker
      port: 5174, // Change to the new port
    },
  };
});
