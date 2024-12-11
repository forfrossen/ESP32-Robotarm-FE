import { CreateClientIdResponse } from "../robot-arm/types/common.types";
import { setCientIdCookie } from "../robot-arm/utils";

export const onSuccessNewClientId = (
  data: CreateClientIdResponse,
  variables: Error,
  context: unknown,
) => {
  console.log("[DEBUG] got client_id from server:", data.client_id);
  setCientIdCookie(data.client_id);
};
