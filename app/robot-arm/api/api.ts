import axios from "axios";

const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

export const controllerAddress = "192.168.178.36";
export const baseUrl = `http://${controllerAddress}`;
export const controllerWsUrl = `ws://${controllerAddress}/ws`;
export const systemApiDocsUrl = `${baseUrl}/api/v1`;

export const apiGetJson = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: "application/json",
    ["Content-Type"]: "application/json",
  },
  responseType: "json",
  method: "GET",
});

export const apiGetYaml = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: "application/yaml",
    ["Content-Type"]: "application/yaml",
  },
  responseType: "text",
  method: "GET",
});

export type CreateClientIdResponse = {
  client_id: string;
};

export const createNewClientId = async (): Promise<CreateClientIdResponse> => {
  console.log("[DEBUG] createNewClientId ");
  return apiGetJson.get("/new_client", {}).then((response) => {
    return response.data;
  });
};

export const getApiInfo = async (): Promise<string> => {
  console.log("[DEBUG] getApiInfo ");
  return apiGetYaml.get("/api/v1/docs", {}).then((response) => {
    return response.data;
  });
};
