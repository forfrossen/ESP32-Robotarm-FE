import { CommandType } from "../types";

export type Command = {
  command: CommandType;
  payload: string | number;
};
