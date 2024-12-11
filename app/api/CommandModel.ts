import { CommandType } from "../robot-arm/types/jsonRrpcMethods.types";

export type Command = {
  command: CommandType;
  payload: string | number;
};
