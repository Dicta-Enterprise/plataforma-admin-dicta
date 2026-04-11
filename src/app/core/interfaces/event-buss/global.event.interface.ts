export interface GlobalEvent<T = unknown> {
  name: string;
  payload: T;
}
