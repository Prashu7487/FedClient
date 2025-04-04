import { PrivateHTTPService } from "./config";

export const initializeModel = (data: {
  mondel_config: any;
  session_id: number;
  client_id: any;
}) => {
  return PrivateHTTPService.post("initiate-model", data);
};

export const trainModelService = (local_model_id) => {
  return PrivateHTTPService.get(
    `/execute-round?local_model_id=${local_model_id}`
  );
};

export const getRawDatasets = (skip = 0, limit = 5) => {
  return PrivateHTTPService.get(
    `/list-raw-datasets?skip=${skip}&limit=${limit}`
  );
};

export const getProcessedDatasets = (skip = 0, limit = 5) => {
  return PrivateHTTPService.get(`/list-datasets?skip=${skip}&limit=${limit}`);
};
