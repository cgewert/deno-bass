import {
  BASS_ChannelPause,
  BASS_ChannelPlay,
  BASS_ChannelStart,
  BASS_ChannelStop,
} from "../bindings.ts";
import { IChannel } from "./IChannel.ts";

export class Channel implements IChannel {
  public handle: number;

  public constructor(handle: number) {
    this.handle = handle;
  }

  public free(): boolean {
    throw new Error("Method not implemented.");
  }
  public get Handle(): number {
    return this.handle;
  }
  public set Handle(value: number) {
    this.handle = value;
  }
  public play(restart: boolean): boolean {
    return BASS_ChannelPlay(this.handle, restart);
  }
  /**
   * Pauses a sample, stream, MOD music, or recording.
   * Error codes
   * BASS_ERROR_HANDLE handle is not a valid channel.
   * BASS_ERROR_DECODE handle is a decoding channel, so cannot be played or paused.
   * BASS_ERROR_NOPLAY The channel is not playing.
   * @returns True if successful, false otherwise.
   */
  public pause(): boolean {
    return BASS_ChannelPause(this.handle);
  }
  /**
   * Starts/resumes playback of a sample, stream, MOD music, or a recording.
   * Error codes
   * BASS_ERROR_HANDLE handle is not a valid channel.
   * BASS_ERROR_DECODE handle is a decoding channel, so cannot be played.
   * BASS_ERROR_START The output is paused/stopped, use BASS_Start to start it.
   * @returns True if successful, false otherwise.
   */
  public start(): boolean {
    return BASS_ChannelStart(this.handle);
  }
  public stop(): boolean {
    return BASS_ChannelStop(this.handle);
  }
}
