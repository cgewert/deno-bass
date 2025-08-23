import { Channel } from "./Channel.ts";

export class Stream extends Channel {
  public constructor(handle: number) {
    super(handle);
  }
}
