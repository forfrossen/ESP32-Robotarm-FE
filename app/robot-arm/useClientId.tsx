import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { RequestState } from "./api/RequestStateModel";
import { CreateClientIdResponse, systemApi } from "./api/system";

export const useClientId = () => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [reqeustState, setRequestState] = useState<RequestState>("idle");
  const [hasClientRequestFailed, setHasClientRequestFailed] = useState(false);
  const { createNewClientId } = systemApi();

  const handleError = useCallback((error: unknown) => {
    console.error("Failed to get client_id from server", error);
    setHasClientRequestFailed(true);
    setRequestState("error");
  }, []);

  const handleSuccess = useCallback(
    (data: CreateClientIdResponse) => {
      if (data.client_id) {
        console.log("[DEBUG] got client_id from server:", data.client_id);
        setClientId(data.client_id);
        Cookies.set("client_id", data.client_id, {
          path: "/",
          secure: false,
        });
        console.log("[DEBUG] set client_id cookie for domain 192.168.178.36");
        setRequestState("success");
      } else {
        console.warn("[WARN] client_id not found in the response");
        setHasClientRequestFailed(true);
        setRequestState("error");
      }
    },
    [setRequestState],
  );

  const mutation = useMutation<CreateClientIdResponse, Error, void>({
    mutationFn: createNewClientId,
    onSuccess: handleSuccess,
    onError: handleError,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const getClientIdFromCookie = () =>
    new Promise<string>((resolve) => {
      setRequestState("loading");
      const cookie = Cookies.get("client_id");
      if (cookie) {
        console.log("[DEBUG] got client_id from cookie:", cookie);
        setClientId(cookie);
        setRequestState("success");
        resolve(cookie);
      }
      resolve("");
    });

  const isRequestingClientIdAllowed =
    !hasClientRequestFailed &&
    mutation.status !== "pending" &&
    mutation.status !== "success";

  useEffect(() => {
    getClientIdFromCookie()
      .then((data) => {
        if (data) {
          return;
        }
        console.log("[DEBUG] client_id not set, trying to get from server");
        if (isRequestingClientIdAllowed) {
          mutation.mutate();
        }
      })
      .catch((error) => {
        console.error("Error in getClientId:", error);
        setHasClientRequestFailed(true);
        setRequestState("error");
      });
  }, []);

  return {
    clientId,
    hasClientRequestFailed,
    reqeustState,
    getNewClientId: mutation.mutate,
  };
};
