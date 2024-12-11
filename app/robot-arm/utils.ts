import { Getter } from "jotai";
import Cookies from "js-cookie";
import { clientIdMutationAtom } from "../store/atoms";

export const isClientIdFromServerValid = (client_id: string) => {
  if (!client_id) {
    console.debug(`[DEBUG] client_id is empty: ${client_id}`);
    return false;
  }
  if (client_id === Cookies.get("client_id")) {
    console.debug(`[DEBUG] client_id is same as cookie: ${client_id}`);
    return false;
  }

  return true;
};

export const getClientIdCookie = () => {
  const client_id = Cookies.get("client_id");
  console.log("[DEBUG] get client_id cookie for domain 192.168.178.36");
  return client_id;
};

export const setCientIdCookie = (client_id: string) => {
  if (!isClientIdFromServerValid(client_id)) {
    return;
  }

  console.log("[DEBUG] set client_id cookie for domain 192.168.178.36");
  Cookies.set("client_id", client_id, {
    path: "/",
    secure: false,
  });
};

export const getClientIdFromCookieOrServer = async (get: Getter) => {
  const client_id = Cookies.get("client_id");
  console.debug(
    "[DEBUG] getClientIdFromCookieOrServer - client_id from cookie:",
    client_id,
  );
  if (client_id) {
    return client_id;
  }

  const mutation = get(clientIdMutationAtom);

  const data = await mutation.mutateAsync(
    new Error("Something went wrong getting the user_id from the server"),
    undefined,
  );

  setCientIdCookie(data.client_id);

  return data.client_id;
};

export const removeClientIdCookie = async () => {
  console.debug("[DEBUG] remove client_id cookie for domain 192.168.178.36");
  await Cookies.remove("client_id");
};
