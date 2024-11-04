import { ReadyState } from "react-use-websocket";

export enum CommandType {
  START = "START",
  STOP = "STOP",
  SET_RUNLEVEL = "SET_RUNLEVEL",
  READ_ENCODER_VALUE_CARRY = "READ_ENCODER_VALUE_CARRY",
  READ_ENCODED_VALUE_ADDITION = "READ_ENCODED_VALUE_ADDITION",
  READ_MOTOR_SPEED = "READ_MOTOR_SPEED",
  READ_NUM_PULSES_RECEIVED = "READ_NUM_PULSES_RECEIVED",
  READ_IO_PORT_STATUS = "READ_IO_PORT_STATUS",
  READ_MOTOR_SHAFT_ANGLE_ERROR = "READ_MOTOR_SHAFT_ANGLE_ERROR",
  READ_EN_PINS_STATUS = "READ_EN_PINS_STATUS",
  READ_GO_BACK_TO_ZERO_STATUS_WHEN_POWER_ON = "READ_GO_BACK_TO_ZERO_STATUS_WHEN_POWER_ON",
  RELEASE_MOTOR_SHAFT_LOCKED_PROTECTION_STATE = "RELEASE_MOTOR_SHAFT_LOCKED_PROTECTION_STATE",
  READ_MOTOR_SHAFT_PROTECTION_STATE = "READ_MOTOR_SHAFT_PROTECTION_STATE",
  RESTORE_DEFAULT_PARAMETERS = "RESTORE_DEFAULT_PARAMETERS",
  RESTART = "RESTART",
  MOTOR_CALIBRATION = "MOTOR_CALIBRATION",
  SET_WORK_MODE = "SET_WORK_MODE",
  SET_WORKING_CURRENT = "SET_WORKING_CURRENT",
  SET_SUBDIVISIONS = "SET_SUBDIVISIONS",
  SET_EN_PIN_CONFIG = "SET_EN_PIN_CONFIG",
  SET_MOTOR_ROTATION_DIRECTION = "SET_MOTOR_ROTATION_DIRECTION",
  SET_AUTO_TURN_OFF_SCREEN = "SET_AUTO_TURN_OFF_SCREEN",
  SET_MOTOR_SHAFT_LOCKED_ROTOR_PROTECTION = "SET_MOTOR_SHAFT_LOCKED_ROTOR_PROTECTION",
  SET_SUBDIVISION_INTERPOLATION = "SET_SUBDIVISION_INTERPOLATION",
  SET_CAN_BITRATE = "SET_CAN_BITRATE",
  SET_CAN_ID = "SET_CAN_ID",
  SET_GROUP_ID = "SET_GROUP_ID",
  SET_KEY_LOCK_ENABLE = "SET_KEY_LOCK_ENABLE",
  SET_HOME = "SET_HOME",
  GO_HOME = "GO_HOME",
  SET_CURRENT_AXIS_TO_ZERO = "SET_CURRENT_AXIS_TO_ZERO",
  SET_MODE0 = "SET_MODE0",
  SET_HOLDING_CURRENT = "SET_HOLDING_CURRENT",
  SET_LIMIT_PORT_REMAP = "SET_LIMIT_PORT_REMAP",
  QUERY_MOTOR_STATUS = "QUERY_MOTOR_STATUS",
  ENABLE_MOTOR = "ENABLE_MOTOR",
  RUN_MOTOR_RELATIVE_MOTION_BY_AXIS = "RUN_MOTOR_RELATIVE_MOTION_BY_AXIS",
  RUN_MOTOR_ABSOLUTE_MOTION_BY_AXIS = "RUN_MOTOR_ABSOLUTE_MOTION_BY_AXIS",
  RUN_MOTOR_SPEED_MODE = "RUN_MOTOR_SPEED_MODE",
  EMERGENCY_STOP = "EMERGENCY_STOP",
  RUN_MOTOR_RELATIVE_MOTION_BY_PULSES = "RUN_MOTOR_RELATIVE_MOTION_BY_PULSES",
  RUN_MOTOR_ABSOLUTE_MOTION_BY_PULSES = "RUN_MOTOR_ABSOLUTE_MOTION_BY_PULSES",
  SAVE_CLEAN_IN_SPEED_MODE = "SAVE_CLEAN_IN_SPEED_MODE",
  UNKNOWN_COMMAND = "UNKNOWN_COMMAND",
  LAST_SEEN = "LAST_SEEN",
}

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: unknown;
  id?: string | number | null;
  client_id: string;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  result?: unknown;
  error?: JsonRpcError;
  id: string | number | null;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * JsonRpcMessage can be either a request or a response.
 */
export type JsonRpcMessage = JsonRpcRequest | JsonRpcResponse;

/**
 * RpcMethods maps method names to their parameter and result types.
 */
export type RpcMethod = {
  params?: any;
  result: any;
};

export type RpcMethods = {
  [key in keyof typeof CommandType]: {
    SET_RUNLEVEL: {
      params: { runlevel: number };
      result: boolean;
    };
    START: {
      params: undefined;
      result: boolean;
    };
    STOP: {
      params: undefined;
      result: boolean;
    };
  };
};

export interface UseJsonRpcClientReturn {
  messageHistory: JsonRpcMessage[];
  sendRpc: <Method extends CommandType>(
    method: Method,
    params: RpcMethods[Method] extends { params: infer P } ? P : never,
  ) => PromiseLike<RpcMethods[Method] extends { result: infer R } ? R : never>;
  readyState: ReadyState;
}
