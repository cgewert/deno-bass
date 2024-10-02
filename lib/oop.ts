import { BASS_Free, BASS_Init } from "./bindings.ts";
import {
  BASS_DEVICE_16BITS,
  BASS_DEVICE_AUDIOTRACK,
  BASS_DEVICE_DMIX,
  BASS_DEVICE_DSOUND,
  BASS_DEVICE_FREQ,
  BASS_DEVICE_MONO,
  BASS_DEVICE_NOSPEAKER,
  BASS_DEVICE_REINIT,
  BASS_DEVICE_SOFTWARE,
  BASS_DEVICE_SPEAKERS,
  BASS_DEVICE_STEREO,
} from "./flags.ts";
import { GetBASSErrorCode } from "./utilities.ts";

export const DESKTOP_WINDOW_HANDLE = 0;

export interface BASSInitParams {
  freq: number;
  device: number;
  flags: BASSInitFlags;
  windowHandle: number;
}

type LoggingLevel = "ERROR" | "LOG" | "WARNING";

// BASS Init flags must be a value inside this set or 0.
export type BASSInitFlags =
  | typeof BASS_DEVICE_16BITS
  | typeof BASS_DEVICE_MONO
  | typeof BASS_DEVICE_STEREO
  | typeof BASS_DEVICE_SPEAKERS
  | typeof BASS_DEVICE_NOSPEAKER
  | typeof BASS_DEVICE_FREQ
  | typeof BASS_DEVICE_DSOUND
  | typeof BASS_DEVICE_AUDIOTRACK
  | typeof BASS_DEVICE_DMIX
  | typeof BASS_DEVICE_SOFTWARE
  | typeof BASS_DEVICE_REINIT
  | 0;

/* 
    Base Class for all of BASS functionality. 
    TODO: Melt brain by thinking about multithreading.
    TODO: Think about tracking initialized devices.
*/
export class BASS {
  private _isVerbose: boolean = true;
  // Determines if class instance will print output to the console.
  public get IsVerbose(): boolean {
    return this._isVerbose;
  }
  public set IsVerbose(value: boolean) {
    this._isVerbose = value;
  }

  private _freq: number = 0;
  public get Frequency(): number {
    return this._freq;
  }
  public set Frequency(value: number) {
    this._freq = value;
  }

  private _device: number = 0;
  public get Device(): number {
    return this._device;
  }
  // Value range -1 - n
  public set Device(value: number) {
    if (value < -1) throw new Error("Value must be at least -1!");
    this._device = value;
  }

  private _flags: BASSInitFlags = 0;
  public get Flags(): BASSInitFlags {
    return this._flags;
  }
  public set Flags(value: BASSInitFlags) {
    this._flags = value;
  }

  private _windowHandle: number = DESKTOP_WINDOW_HANDLE;
  public get Windowhandle(): number {
    return this._windowHandle;
  }
  public set WindowHandle(value: number) {
    this._windowHandle = value;
  }

  constructor(initParams: BASSInitParams) {
    this.Frequency = initParams.freq;
    this.Device = initParams.device;
    this.Flags = initParams.flags;
    this.WindowHandle = initParams.windowHandle;
    this.Init();
  }

  // (Re-)initializes BASS.
  Init() {
    this.Free();
    // Initializing the library
    let success = false;
    try {
      success = BASS_Init(
        this.Device,
        this.Frequency,
        this.Flags,
        this.Windowhandle,
        null
      );
    } catch (error: unknown) {
      this.speak(
        `Critical error during BASS initialization: ${
          (error as Error).message
        }`,
        "ERROR"
      );
    } finally {
      if (!success) {
        this.speak("Could not initialize BASS!", "ERROR");
        this.speak(`BASS Error Code: ${GetBASSErrorCode()}`, "ERROR");
      } else {
        this.speak("BASS was initialized.", "LOG");
      }
    }
  }

  /* 
    This will free all resources allocated by BASS.
    Therefore you must call Init() before using any of BASS functionality again.
   */
  Free() {
    BASS_Free();
  }

  speak(text: string, level: LoggingLevel) {
    if (this.IsVerbose) {
      switch (level) {
        case "ERROR":
          console.error(text);
          break;
        case "LOG":
          console.log(text);
          break;
        case "WARNING":
          console.warn(text);
          break;
      }
    }
  }
}
