import { defineConfig,loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const environmentVariables = [
  "REACT_APP_REGISTER_CLIENT_URL",
  "REACT_APP_REQUEST_FEDERATED_SESSION_URL",
  "REACT_APP_GET_ALL_FEDERATED_SESSIONS_URL",
  "REACT_APP_SUBMIT_CLIENT_FEDERATED_RESPONSE_URL",
  "REACT_APP_UPDATE_CLIENT_STATUS_FOUR_URL",
  "REACT_APP_WS_URL"
];


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv = {};
  environmentVariables.forEach(key => processEnv[key] = env[key]);

  return {
    define: {
      'process.env': processEnv
    },
    plugins: [react()],
  }
})