export type RequestState = "idle" | "loading" | "error" | "success";
export type FinalRequestState = "error" | "success";

export enum requestState {
  idle = "idle",
  loading = "loading",
  error = "error",
  success = "success",
}

export enum finalRequestState {
  error = requestState.error,
  success = requestState.success,
}
