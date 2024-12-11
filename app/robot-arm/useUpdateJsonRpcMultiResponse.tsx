import { Getter, PrimitiveAtom, Setter } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import { jsonRpcMultiResponseAtomFamily } from "../store/atoms";
import {
  JsonRpcMultiResponse,
  JsonRpcMultiResponseSchema,
  JsonRpcRequest,
  JsonRpcRequestSchema,
  JsonRpcResponse,
  JsonRpcResponseSchema,
} from "./types/jsonRpc.types";
import {
  ValidationOutcome,
  validateMultiple,
  validateParams,
} from "./types/validators.ts/generic.validator";
import { areParamsValidSchema } from "./types/validators.ts/id-request-response,validator";

const updateAtomState = (
  set: Setter,
  effectiveAtom: PrimitiveAtom<JsonRpcMultiResponse>,
  request?: JsonRpcRequest<unknown>,
  response?: JsonRpcResponse<unknown>,
) => {
  set(effectiveAtom, (prev: JsonRpcMultiResponse) => {
    const jsonRpcRequest = JsonRpcRequestSchema.optional().safeParse(request);
    const jsonRpcResponse =
      JsonRpcResponseSchema.optional().safeParse(response);

    const newState = { ...prev };
    if (request && jsonRpcRequest.success) {
      newState.request = request;
    }
    if (response && jsonRpcResponse.success) {
      newState.responses = [...(prev?.responses || []), response];
    }
    return newState;
  });
};

export const areParamsValid = (
  id: JsonRpcMultiResponse["id"],
  request?: JsonRpcRequest<unknown>,
  response?: JsonRpcResponse<unknown>,
): ValidationOutcome => {
  const params = { id, request, response };
  return validateParams(areParamsValidSchema, params);
};

export const useUpdateJsonRpcMultiResponse = () => {
  const updateMultiResponseAtom = useAtomCallback(
    useCallback(
      (
        get: Getter,
        set: Setter,
        id: JsonRpcMultiResponse["id"],
        request?: JsonRpcRequest<unknown>,
        response?: JsonRpcResponse<unknown>,
      ) => {
        const validationResult = validateMultiple(
          [id, request, response],
          [
            JsonRpcMultiResponseSchema.shape.id,
            JsonRpcRequestSchema.optional(),
            JsonRpcResponseSchema.optional(),
          ],
        );

        if (!validationResult.isValid) {
          return;
        }

        const effectiveAtom = jsonRpcMultiResponseAtomFamily(id);
        const currState = get(effectiveAtom);

        if (currState) {
          updateAtomState(set, effectiveAtom, request, response);
          return;
        }

        console.debug(
          `[DEBUG] updateMultiResponseAtom: no current state. Creating new Atom.`,
        );

        set(effectiveAtom, {
          id,
          request,
          responses: response ? [response] : [],
        });
        return;
      },
      [],
    ),
  );

  return { updateMultiResponseAtom };
};
