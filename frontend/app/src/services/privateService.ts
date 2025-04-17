import { PrivateHTTPService } from "./config";

export const initializeModel = (data: {
  session_id: number;
  client_token: any;
}) => {
  return PrivateHTTPService.post("initiate-model", data);
};

export const trainModelService = (data: {
  session_id: number;
  client_token: any;
}) => {
  return PrivateHTTPService.get(`/execute-round`, { params: data });
};

export const getRawDatasets = (skip = 0, limit = 5) => {
  return PrivateHTTPService.get(
    `/list-raw-datasets?skip=${skip}&limit=${limit}`
  );
};

export const getProcessedDatasets = (skip = 0, limit = 5) => {
  return PrivateHTTPService.get(`/list-datasets?skip=${skip}&limit=${limit}`);
};

export const createQPDataset = (data: {
  session_id: number;
  session_price: number;
  client_token: string;
}) => {
  return PrivateHTTPService.post("/create-qpdataset", data);
};
