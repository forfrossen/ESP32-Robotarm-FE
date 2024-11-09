import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import * as yaml from "js-yaml";
import { getApiInfo } from "./api/api";
import { JsonRpcMessage } from "./types";

export const controllerAddressAtom = atom("192.168.178.36");
export const baseUrlAtom = atom(
  (get) => `http://${get(controllerAddressAtom)}`,
);
export const controllerWsUrlAtom = atom(
  (get) => `ws://${get(controllerAddressAtom)}/ws`,
);
export const systemApiDocsUrlAtom = atom((get) => `${get(baseUrlAtom)}/api/v1`);

export const apiInfoAtom = atomWithQuery(() => ({
  queryKey: ["openApiConfig"],
  queryFn: async () => getApiInfo(),
  retry: 0,
  select: (data: string) => {
    const yamlApiInfo = yaml.load(data);
    console.log("[DEBUG] yamlApiInfo: ", yamlApiInfo);
    return yamlApiInfo;
  },
}));

export const setMessageHistory = atom<JsonRpcMessage[]>([]);
export const receivedNotificationHistory = atom<JsonRpcMessage[]>([]);
export const receivedMessageHistory = atom<JsonRpcMessage[]>([]);
