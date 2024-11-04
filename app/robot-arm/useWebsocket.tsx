import { JSONRPCClient } from "json-rpc-2.0";
import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { finalRequestState } from "./api/RequestStateModel";
import { controllerWsUrl } from "./api/system";
import { JsonRpcMessage, UseJsonRpcClientReturn } from "./types";
import { useClientId } from "./useClientId";

export function useJsonRpcClient(): UseJsonRpcClientReturn {
  const [messageHistory, setMessageHistory] = useState<JsonRpcMessage[]>([]);
  const { clientId, reqeustState, getNewClientId } = useClientId();
  const [newClientIdRequested, setNewClientIdRequested] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const effectiveUrl =
    reqeustState === finalRequestState.success
      ? `${controllerWsUrl}?client_id=${clientId}`
      : "";

  const handleError = useCallback(
    async (event: unknown) => {
      console.error("WebSocket error trying to get new clientId", event);
      if (!newClientIdRequested) {
        await getNewClientId();
        setNewClientIdRequested(true);
      }
    },
    [newClientIdRequested, getNewClientId],
  );

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    effectiveUrl,
    {
      protocols: "jsonrpc2.0",
      onError: handleError,
      retryOnError: true,
      shouldReconnect: () => {
        console.log("shouldReconnect", reconnectAttempts);
        if (reconnectAttempts < 3) {
          return true;
        }
        return false;
      },
      reconnectAttempts: 3,
      reconnectInterval: 1000,
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

  const clientRef = useRef<JSONRPCClient>(
    new JSONRPCClient((jsonRPCRequest) => {
      if (latestReadyState.current === ReadyState.OPEN) {
        latestSendMessage.current(JSON.stringify(jsonRPCRequest));
      } else {
        return Promise.reject(new Error("WebSocket is not open"));
      }
    }),
  );

  const pendingRequests = useRef<
    Map<
      number,
      { resolve: (value: any) => void; reject: (reason?: any) => void }
    >
  >(new Map());

  useEffect(() => {
    if (lastMessage !== null) {
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
    }
  }, [lastMessage]);

  useEffect(() => {
    // Handle WebSocket errors
    const websocket = getWebSocket();
    if (websocket) {
      const handleError = (event: Event) => {
        console.error("WebSocket error:", event);
        // Reject all pending requests
        pendingRequests.current.forEach(({ reject }) => {
          reject(new Error("WebSocket error"));
        });
        pendingRequests.current.clear();
      };

      websocket.addEventListener("error", handleError);

      return () => {
        websocket.removeEventListener("error", handleError);
      };
    }
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
