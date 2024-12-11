import { Getter, PrimitiveAtom, atom } from "jotai";
import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { atomFamily } from "jotai/utils";
import * as yaml from "js-yaml";
import { OpenAPI3 } from "openapi-typescript";
import { createNewClientId, getApiInfo } from "../api/api";
import { CreateClientIdResponse } from "../robot-arm/types/common.types";
import {
  JsonRpcMessage,
  JsonRpcMultiResponse,
  JsonRpcRequest,
} from "../robot-arm/types/jsonRpc.types";
import {
  getClientIdFromCookieOrServer,
  removeClientIdCookie,
} from "../robot-arm/utils";
import { onSuccessNewClientId } from "./attomEffects";

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
    const yamlApiInfo: OpenAPI3 = yaml.load(data) as OpenAPI3;
    console.log("[DEBUG] yamlApiInfo: ", yamlApiInfo);
    return yamlApiInfo;
  },
  staleTime: Infinity, // Prevents refetching by setting an infinite stale time
  cacheTime: Infinity, // Keep it in the cache as long as possible
}));

export const setMessageHistory = atom<JsonRpcMessage[]>([]);
export const receivedNotificationHistory = atom<JsonRpcMessage[]>([]);
export const receivedMessageHistory = atom<JsonRpcMessage[]>([]);
export const clientIdMutationAtom = atomWithMutation<
  CreateClientIdResponse,
  Error,
  void
>(() => ({
  mutationKey: ["newUserId"],
  mutationFn: createNewClientId,
  onSuccess: onSuccessNewClientId,
}));

export const clientIdAtom = atom(
  async (get: Getter) => {
    const client_id = await getClientIdFromCookieOrServer(get);
    console.log("[DEBUG] clientIdAtom - clientIdFromCookieAtom: ", client_id);
    return client_id;
  },
  async (get: Getter) => {
    console.log("[DEBUG] clientIdAtom - setter. Remove client_id cookie!");
    // set(clientIdFromCookieAtom, "");
    await removeClientIdCookie();
    const client_id = await getClientIdFromCookieOrServer(get);
    console.log("[DEBUG] clientIdAtom - setter. New client_id: ", client_id);
    return client_id;
  },
);

export const jsonRpcMultiResponseAtomFamily = atomFamily<
  JsonRpcMultiResponse["id"],
  PrimitiveAtom<JsonRpcMultiResponse>
>(
  (id: JsonRpcMultiResponse["id"]) =>
    atom<JsonRpcMultiResponse>({
      id,
      request: {} as JsonRpcRequest<unknown>,
      responses: [],
    }),
  (a: JsonRpcMultiResponse["id"], b: JsonRpcMultiResponse["id"]) => a === b,
);

export const nextRequestIdAtom = atom(0);
