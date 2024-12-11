import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { CreateClientIdResponse } from "../robot-arm/types/common.types";

const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

export const controllerAddress = "192.168.178.36";
export const baseUrl = `http://${controllerAddress}`;
export const controllerWsUrl = `ws://${controllerAddress}/ws`;
export const basePath = "api/v1";
export const systemApiDocsPath = `/${basePath}/docs`;
export const newClientIdPath = `/${basePath}/new_client`;

export const removeClientId = () => {
  console.debug("[DEBUG] removing client_id cookie");
  Cookies.remove("client_id");
};

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

export const createNewClientId = async (): Promise<CreateClientIdResponse> => {
  removeClientId();
  const response: AxiosResponse<CreateClientIdResponse> = await apiGetJson.get(
    newClientIdPath,
    {},
  );
  return response.data;
};

export const getApiInfo = async (): Promise<string> => {
  console.log("[DEBUG] getApiInfo ");
  return apiGetYaml.get(systemApiDocsPath, {}).then((response) => {
    return response.data;
  });
};

export const useApiInfoQuery = () => {
  return useQuery({
    queryKey: ["openApiConfig"],
    queryFn: getApiInfo,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useClientIdMutation = () => {
  return useMutation({
    mutationFn: createNewClientId,
    mutationKey: ["newClientId"],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
