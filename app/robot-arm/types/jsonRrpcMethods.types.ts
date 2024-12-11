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
interface RpcMethodParams {
  motor_id: number;
}

interface RpcMethodType<Params, Result> {
  params: Params & RpcMethodParams;
  result: Result;
}

export type RpcMethods = {
  [CommandType.START]: RpcMethodType<undefined, boolean>;
  [CommandType.STOP]: RpcMethodType<undefined, boolean>;
  [CommandType.SET_RUNLEVEL]: RpcMethodType<{ runlevel: number }, boolean>;
  [CommandType.READ_ENCODER_VALUE_CARRY]: RpcMethodType<undefined, number>;
  [CommandType.READ_ENCODED_VALUE_ADDITION]: RpcMethodType<undefined, number>;
  [CommandType.READ_MOTOR_SPEED]: RpcMethodType<undefined, number>;
  [CommandType.READ_NUM_PULSES_RECEIVED]: RpcMethodType<undefined, number>;
  [CommandType.READ_IO_PORT_STATUS]: RpcMethodType<undefined, boolean>;
  [CommandType.READ_MOTOR_SHAFT_ANGLE_ERROR]: RpcMethodType<undefined, number>;
  [CommandType.READ_EN_PINS_STATUS]: RpcMethodType<undefined, boolean>;
  [CommandType.READ_GO_BACK_TO_ZERO_STATUS_WHEN_POWER_ON]: RpcMethodType<
    undefined,
    boolean
  >;
  [CommandType.RELEASE_MOTOR_SHAFT_LOCKED_PROTECTION_STATE]: RpcMethodType<
    undefined,
    boolean
  >;
  [CommandType.READ_MOTOR_SHAFT_PROTECTION_STATE]: RpcMethodType<
    undefined,
    boolean
  >;
  [CommandType.RESTORE_DEFAULT_PARAMETERS]: RpcMethodType<undefined, boolean>;
  [CommandType.RESTART]: RpcMethodType<undefined, boolean>;
  [CommandType.MOTOR_CALIBRATION]: RpcMethodType<undefined, boolean>;
  [CommandType.SET_WORK_MODE]: RpcMethodType<{ mode: number }, boolean>;
  [CommandType.SET_WORKING_CURRENT]: RpcMethodType<
    { current: number },
    boolean
  >;
  [CommandType.SET_SUBDIVISIONS]: RpcMethodType<
    { subdivisions: number },
    boolean
  >;
  [CommandType.SET_EN_PIN_CONFIG]: RpcMethodType<{ config: number }, boolean>;
  [CommandType.SET_MOTOR_ROTATION_DIRECTION]: RpcMethodType<
    { direction: number },
    boolean
  >;
  [CommandType.SET_AUTO_TURN_OFF_SCREEN]: RpcMethodType<
    { timeout: number },
    boolean
  >;
  [CommandType.SET_MOTOR_SHAFT_LOCKED_ROTOR_PROTECTION]: RpcMethodType<
    { protection: boolean },
    boolean
  >;
  [CommandType.SET_SUBDIVISION_INTERPOLATION]: RpcMethodType<
    { interpolation: boolean },
    boolean
  >;
  [CommandType.SET_CAN_BITRATE]: RpcMethodType<{ bitrate: number }, boolean>;
  [CommandType.SET_CAN_ID]: RpcMethodType<{ id: number }, boolean>;
  [CommandType.SET_GROUP_ID]: RpcMethodType<{ id: number }, boolean>;
  [CommandType.SET_KEY_LOCK_ENABLE]: RpcMethodType<
    { enable: boolean },
    boolean
  >;
  [CommandType.SET_HOME]: RpcMethodType<undefined, boolean>;
  [CommandType.GO_HOME]: RpcMethodType<undefined, boolean>;
  [CommandType.SET_CURRENT_AXIS_TO_ZERO]: RpcMethodType<undefined, boolean>;
  [CommandType.SET_MODE0]: RpcMethodType<{ mode: number }, boolean>;
  [CommandType.SET_HOLDING_CURRENT]: RpcMethodType<
    { current: number },
    boolean
  >;
  [CommandType.SET_LIMIT_PORT_REMAP]: RpcMethodType<{ remap: number }, boolean>;
  [CommandType.QUERY_MOTOR_STATUS]: RpcMethodType<undefined, boolean>;
  [CommandType.ENABLE_MOTOR]: RpcMethodType<{ enable: boolean }, boolean>;
  [CommandType.RUN_MOTOR_RELATIVE_MOTION_BY_AXIS]: RpcMethodType<
    {
      position: number;
      direction: boolean;
      speed: number;
      acceleration: number;
    },
    boolean
  >;
  [CommandType.RUN_MOTOR_ABSOLUTE_MOTION_BY_AXIS]: RpcMethodType<
    { axis: number; motion: number },
    boolean
  >;
  [CommandType.RUN_MOTOR_SPEED_MODE]: RpcMethodType<{ speed: number }, boolean>;
  [CommandType.EMERGENCY_STOP]: RpcMethodType<undefined, boolean>;
  [CommandType.RUN_MOTOR_RELATIVE_MOTION_BY_PULSES]: RpcMethodType<
    { pulses: number },
    boolean
  >;
  [CommandType.RUN_MOTOR_ABSOLUTE_MOTION_BY_PULSES]: RpcMethodType<
    { pulses: number },
    boolean
  >;
  [CommandType.SAVE_CLEAN_IN_SPEED_MODE]: RpcMethodType<undefined, boolean>;
  [CommandType.UNKNOWN_COMMAND]: RpcMethodType<undefined, boolean>;
  [CommandType.LAST_SEEN]: RpcMethodType<undefined, boolean>;
};

export type ParamsType<Method extends keyof RpcMethods> =
  RpcMethods[Method] extends {
    params: infer P;
  }
    ? P
    : never;
