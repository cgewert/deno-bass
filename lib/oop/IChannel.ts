export interface IChannel {
  handle: number;

  free(): boolean;
  get Handle(): number;
  set Handle(value: number);
  play(restart: boolean): boolean;
  pause(): boolean;
  start(): boolean;
  stop(): boolean; // frees resources
}
