import { useAtom, useAtomValue } from "jotai";
import { JSONRPCClient, JSONRPCRequest } from "json-rpc-2.0";
import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { finalRequestState } from "./api/RequestStateModel";
import { apiInfoAtom, controllerWsUrlAtom } from "./store";
import { JsonRpcMessage, UseJsonRpcClientReturn } from "./types";
import { useClientId } from "./useClientId";

export function useJsonRpcClient(): UseJsonRpcClientReturn {
  const [messageHistory, setMessageHistory] = useState<JsonRpcMessage[]>([]);
  const { clientId, reqeustState, getNewClientId } = useClientId();
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // const openApiConfigQuery = useQuery({
  //   queryKey: ["openApiConfig"],
  //   queryFn: () => getApiInfo(),
  //   retry: 0,
  // });

  const openApiConfigQuery = useAtom(apiInfoAtom);
  openApiConfigQuery.

  const wsUrl = useAtomValue(controllerWsUrlAtom);

  const effectiveUrl =
    reqeustState === finalRequestState.success && !!clientId
      ? `${wsUrl}?client_id=${clientId}`
      : null;

  useEffect(() => {
    if (openApiConfigQuery.isSuccess) {
      console.log(
        "[DEBUG] openApiConfigQuery.isSuccess: ",
        openApiConfigQuery.data,
      );
    } else if (openApiConfigQuery.isError) {
      console.error(
        "[ERROR] openApiConfigQuery.isError: ",
        openApiConfigQuery.error,
      );
    } else if (openApiConfigQuery.isLoading) {
      console.log("[DEBUG] openApiConfigQuery.isLoading: ");
    }
  }, [openApiConfigQuery]);

  const handleWsConnectionError = async (event: unknown) => {
    console.error("WebSocket error trying to get new clientId", event);
    await getNewClientId();
    setRetryCount(retryCount + 1);
  };

  const shouldReconnect = () => {
    console.log("shouldReconnect", reconnectAttempts);
    setReconnectAttempts(reconnectAttempts + 1);
    return reconnectAttempts < 3;
  };

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    effectiveUrl,
    {
      protocols: "jsonrpc2.0",
      onError: handleWsConnectionError,
      retryOnError: true,
      shouldReconnect: shouldReconnect,
      reconnectAttempts: 5,
      reconnectInterval: 2000,
    },
  );

  const latestSendMessage = useRef(sendMessage);
  const latestReadyState = useRef(readyState);

  useEffect(() => {
    latestSendMessage.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    latestReadyState.current = readyState;
  }, [readyState]);

  const jsonRpcCLient = async (jsonRPCRequest: JSONRPCRequest) => {
    if (latestReadyState.current === ReadyState.OPEN) {
      latestSendMessage.current(JSON.stringify(jsonRPCRequest));
    } else {
      return Promise.reject(new Error("WebSocket is not open"));
    }
  };

  const clientRef = useRef<JSONRPCClient>(
    new JSONRPCClient((jsonRPCRequest: JSONRPCRequest) =>
      jsonRpcCLient(jsonRPCRequest),
    ),
  );

  const pendingRequests = useRef<
    Map<
      number,
      { resolve: (value: any) => void; reject: (reason?: any) => void }
    >
  >(new Map());

  useEffect(() => {
    if (lastMessage == null) {
      return;
    }
    try {
      const data = JSON.parse(lastMessage.data);
      if (data.id !== undefined) {
        // This is a response to a request
        clientRef.current.receive(data);
      } else if (data.method && data.params !== undefined) {
        // This is a notification from the server
        setMessageHistory((prev) => [...prev, data as JsonRpcMessage]);
      }
    } catch (error) {
      console.error("Failed to parse JSON-RPC message:", error);
    }
  }, [lastMessage]);

  const handleError = (event: Event) => {
    console.error("WebSocket error:", event);
    // Reject all pending requests
    pendingRequests.current.forEach(({ reject }) => {
      reject(new Error("WebSocket error"));
    });
    pendingRequests.current.clear();
  };

  useEffect(() => {
    const websocket = getWebSocket();
    if (!websocket) {
      return;
    }
    websocket.addEventListener("error", handleError);
    return () => {
      websocket.removeEventListener("error", handleError);
    };
  }, [getWebSocket]);

  const sendRpc: UseJsonRpcClientReturn["sendRpc"] = useCallback(
    (method, params?) => {
      const effectiveParams = params
        ? { ...params, client_id: clientId }
        : { client_id: clientId };
      return clientRef.current.request(method as string, effectiveParams);
    },
    [clientId],
  );

  return { messageHistory, sendRpc, readyState };
}
