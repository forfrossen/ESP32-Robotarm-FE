import { ReadyState } from "react-use-websocket";
import { ParamsType, RpcMethods } from "./jsonRrpcMethods.types";

export interface UseJsonRpcClientReturn {
  // messageHistory: any[];
  sendRpc: <Method extends keyof RpcMethods>(
    method: Method,
    params?: ParamsType<Method>,
    // ) => PromiseLike<RpcMethods[Method] extends { result: infer R } ? R : never>;
    // ) => PromiseLike<JSONRPCResponse>;
  ) => void;
  readyState: ReadyState;
}

export type CreateClientIdResponse = {
  client_id: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};
