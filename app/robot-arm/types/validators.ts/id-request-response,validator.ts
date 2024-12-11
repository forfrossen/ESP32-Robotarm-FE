import { z } from "zod";
import {
  JsonRpcMultiResponse,
  JsonRpcRequest,
  JsonRpcRequestSchema,
  JsonRpcResponse,
  JsonRpcResponseSchema,
} from "../jsonRpc.types";
import { ValidationOutcome, validateParams } from "./generic.validator";

export const areParamsValidSchema = z
  .object({
    id: z.union([z.string(), z.number()]).refine(
      (id) => {
        return id !== null && id !== undefined && id !== "" && id !== 0;
      },
      { message: "id must be a valid non-empty string or non-zero number" },
    ),
    request: JsonRpcRequestSchema.optional(),
    response: JsonRpcResponseSchema.optional(),
  })
  .refine(
    (data) => {
      return data.request !== undefined || data.response !== undefined;
    },
    {
      message: "At least one of request or response must be provided",
      path: ["request", "response"],
    },
  );

export const areParamsValid = (
  id: JsonRpcMultiResponse["id"],
  request?: JsonRpcRequest<unknown>,
  response?: JsonRpcResponse<unknown>,
): ValidationOutcome => {
  const params = { id, request, response };
  return validateParams(areParamsValidSchema, params);
};
