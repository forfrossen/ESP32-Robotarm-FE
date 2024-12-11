import { z } from "zod";

export interface JsonRpcMultiResponse {
  id: number;
  request?: JsonRpcRequest<any>;
  responses?: JsonRpcResponse<any>[];
}

export const JsonRpcMultiResponseSchema = z.object({
  id: z.number(),
  request: z.any().optional(),
  responses: z.array(z.any()).optional(),
});

export interface JsonRpcRequest<TParams> {
  jsonrpc: "2.0";
  method: string;
  params?: TParams;
  id: number;
  timestamp: number;
}
export const JsonRpcRequestSchema = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string(),
  params: z.any(),
  id: z.number(),
  timestamp: z.number(),
});

export interface JsonRpcResponse<TResult> {
  jsonrpc: "2.0";
  result?: TResult;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number;
  timestamp: number;
}

export const JsonRpcResponseSchema = z.object({
  jsonrpc: z.literal("2.0"),
  result: z.any().optional(),
  error: z
    .object({
      code: z.number(),
      message: z.string(),
      data: z.any().optional(),
    })
    .optional(),
  id: z.number(),
  timestamp: z.number(),
});

export interface JsonRpcMessage {
  jsonrpc: "2.0";
  method?: string;
  params?: any;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  timestamp: number;
}
export const JsonRpcMessageSchema = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string().optional(),
  params: z.any().optional(),
  result: z.any().optional(),
  error: z
    .object({
      code: z.number(),
      message: z.string(),
      data: z.any().optional(),
    })
    .optional(),
  timestamp: z.number(),
});
