import { AxiosInstance } from "axios";

// const get_all_initiated_sessions =
//   process.env.REACT_APP_GET_ALL_INITIATED_SESSIONS ||
//   "http://localhost:8000/get-all-initiated-sessions"; // this is the default value

export const createSession = async (
  api: AxiosInstance,
  session_data: {
    fed_info: any;
  }
) => {
  return api.post("create-federated-session", session_data);
};

export const getAllSessions = async (api, page = 1, perPage = 6) => {
  return api.get(`/get-all-federated-sessions?page=${page}&per_page=${perPage}`);
};

export const getFederatedSession = (api: AxiosInstance, session_id) => {
  return api.get(`get-federated-session/${session_id}`);
};

export const submitTrainingAcceptanceResponse = (
  api: AxiosInstance,
  data: { session_id: number; decision: number }
) => {
  return api.post("submit-client-training-acceptance-response", data);
};

export const submitPriceAcceptanceResponse = (
  api: AxiosInstance,
  data: { session_id: number; decision: number }
) => {
  return api.post("submit-client-price-acceptance-response", data);
};

export const sendModelInitiation = (
  api: AxiosInstance,
  data: { session_id: number }
) => {
  return api.post("client-initialize-model", data);
};

export const getUserInitiatedSessions = (api: AxiosInstance) => {
  return api.get("get-all-initiated-sessions");
};

export const getLogsSession = (api: AxiosInstance, session_id) => {
  return api.get(`logs/${session_id}`);
};


export const getTrainingResults = (api: AxiosInstance, session_id) => {
  return api.get(`training-result/${session_id}`);
};



