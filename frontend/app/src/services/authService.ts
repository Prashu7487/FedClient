import { AxiosInstance } from "axios";
import { HTTPService } from "./config"; // assuming you have this config

export const createUser = async (userData: {
  username: String;
  data_url: String;
  password: String;
}) => {
  return HTTPService.post("/signup", userData);
};

export const login = async (credentials: {
  username: String;
  password: String;
}) => {
  console.log("Sent details for login of:", credentials.username);
  return HTTPService.post("/login", credentials);
};

export const refreshAccessToken = async (
  api: AxiosInstance,
  refresh_token: String
) => {
  return api.post("/refresh-token", { refresh_token });
};

export const logout = async (api: AxiosInstance) => {
  return api.post("/logout");
};

export const getMe = async (api: AxiosInstance) => {
  return api.get("/users/me");
};
