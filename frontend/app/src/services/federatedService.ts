import { AxiosInstance } from "axios";

const get_all_initiated_sessions =
  process.env.REACT_APP_GET_ALL_INITIATED_SESSIONS ||
  "http://localhost:8000/get-all-initiated-sessions"; // this is the default value

export const createSession = async (
  api: AxiosInstance,
  session_data: {
    fed_info: any;
  }
) => {
  return api.post("create-federated-session", session_data);
};

export const getAllSessions = (api: AxiosInstance) => {
  return api.get("get-all-federated-sessions");
};

export const getFederatedSession = (api: AxiosInstance, session_id) => {
  return api.get(`get-federated-session/${session_id}`);
};

export const respondToSession = (
  api: AxiosInstance,
  data: { session_id: number; decision: number }
) => {
  return api.post("submit-client-federated-response", data);
};

export const sendModelInitiation = (
  api: AxiosInstance,
  data: { session_id: number; decision: number }
) => {
  return api.post("update-client-status-four", data);
};

export const getUserInitiatedSessions = (api: AxiosInstance) => {
  return api.get(get_all_initiated_sessions);
};
