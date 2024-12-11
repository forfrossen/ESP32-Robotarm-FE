import { useAtom, useAtomValue } from "jotai";
import { JSONRPCClient, JSONRPCRequest, JSONRPCResponse } from "json-rpc-2.0";
import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  apiInfoAtom,
  clientIdAtom,
  controllerWsUrlAtom,
  nextRequestIdAtom,
} from "../store/atoms";
import { UseJsonRpcClientReturn } from "./types/common.types";
import { JsonRpcRequest } from "./types/jsonRpc.types";
import { useUpdateJsonRpcMultiResponse } from "./useUpdateJsonRpcMultiResponse";

export function useJsonRpcClient(): UseJsonRpcClientReturn {
  const [clientId, setClientId] = useAtom(clientIdAtom);
  const openApiConfigQuery = useAtomValue(apiInfoAtom);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const { updateMultiResponseAtom } = useUpdateJsonRpcMultiResponse();
  const wsUrl = useAtomValue(controllerWsUrlAtom);
  const [requestId, setRequestId] = useAtom(nextRequestIdAtom);
  const nextRequestId = () => setRequestId(requestId + 1);
  const [effectiveUrl, setEffectiveUrl] = useState<string | null>(
    clientId ? `${wsUrl}?client_id=${clientId}` : null,
  );

  useEffect(() => {
    if (openApiConfigQuery.data) {
      console.log("[DEBUG] openApiConfigQuery.data: ", openApiConfigQuery.data);
    }
  }, [openApiConfigQuery.data]);

  const handleWsConnectionError = async (event: Event) => {
    console.error(
      "WebSocket error trying to get new clientId. Error Event was: ",
      event,
    );

    const result = await setClientId();
    console.log(`[DEBUG] setClientId result: ${result}`);

    if (result) {
      setEffectiveUrl(`${wsUrl}?client_id=${result}`);
    }

    setRetryCount(retryCount + 1);
  };

  const shouldReconnect = (): boolean => {
    console.log("shouldReconnect", reconnectAttempts);
    setReconnectAttempts(reconnectAttempts + 1);
    if (reconnectAttempts >= 3) {
      return false;
    }
    return true;
  };

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    effectiveUrl,
    {
      protocols: "jsonrpc2.0",
      onError: handleWsConnectionError,
      retryOnError: retryCount < 3,
      shouldReconnect: shouldReconnect,
      reconnectInterval: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
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
      {
        resolve: (value: JSONRPCResponse) => void;
        reject: (reason?: unknown) => void;
      }
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
        console.debug(`[DEBUG] Received response:`, data);
        clientRef.current.receive(data);
      } else if (data.method && data.params !== undefined) {
        // This is a notification from the server
        // setMessageHistory((prev) => [...prev, data as JsonRpcMessage]);
        console.debug(`[DEBUG] Received notification:`, data);
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

  const sendRpc: UseJsonRpcClientReturn["sendRpc"] = (method, params?) => {
    console.debug(`[DEBUG] Sending request: ${method}`, params);
    nextRequestId();
    const effectiveParams = params
      ? { ...params, client_id: clientId }
      : { client_id: clientId };

    const request: JSONRPCRequest = {
      jsonrpc: "2.0",
      method,
      params: effectiveParams,
      id: requestId,
    };

    console.debug(`[DEBUG] Sending request:`, request);

    clientRef.current.requestAdvanced(request);

    updateMultiResponseAtom(requestId, {
      ...request,
      timestamp: Date.now(),
    } as JsonRpcRequest<typeof effectiveParams>);
  };

  return { sendRpc, readyState };
}
