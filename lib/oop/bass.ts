import {
  BASS_Init,
  BASS_Free,
  BASS_SetConfig,
  BASS_GetDevice,
} from "../bindings.ts";
import { GetBASSErrorCode } from "../utilities.ts";
import { DESKTOP_WINDOW_HANDLE, GetDeviceInfo } from "./oop.ts";
import { BASS_DEVICE_STEREO, BASSInitFlags } from "../flags.ts";
import { Options } from "../mod.ts";
import { DeviceInfo } from "../types/DeviceInfo.ts";

export interface BASSInitParams {
  freq: number;
  device: number;
  flags: BASSInitFlags;
  windowHandle: number;
  isVerbose?: boolean;
}

enum LoggingLevel {
  ERROR = "ERROR",
  LOG = "LOG",
  WARNING = "WARNING",
}

/* 
    Base Class for all of BASS functionality. 
    TODO: Melt brain by thinking about multithreading.
    TODO: Think about tracking initialized devices.
*/
export class BASS {
  private _deviceInfo: DeviceInfo | undefined;
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

  public get DeviceName(): string {
    return this._deviceInfo?.Name ?? "Unknown Device";
  }

  private _flags: BASSInitFlags = 0;
  public get Flags(): BASSInitFlags {
    return this._flags;
  }
  public set Flags(value: BASSInitFlags) {
    this._flags = value;
  }

  private _windowHandle: number = DESKTOP_WINDOW_HANDLE;
  public get WindowHandle(): number {
    return this._windowHandle;
  }
  public set WindowHandle(value: number) {
    this._windowHandle = value;
  }

  constructor(
    initParams: BASSInitParams = {
      device: -1,
      flags: BASS_DEVICE_STEREO,
      windowHandle: DESKTOP_WINDOW_HANDLE,
      freq: 44100,
      isVerbose: true,
    }
  ) {
    this.Frequency = initParams.freq;
    this.Flags = initParams.flags;
    this.Device = initParams.device;
    this.WindowHandle = initParams.windowHandle;
    this.IsVerbose = initParams.isVerbose ?? true;
    this.Init();
  }

  // (Re-)initializes BASS.
  Init() {
    this.Free();
    // Activate Unicode encoding.
    BASS_SetConfig(Options.BASS_CONFIG_UNICODE, 1);
    // Initializing the library
    let success = false;
    try {
      success = BASS_Init(
        this.Device,
        this.Frequency,
        this.Flags,
        this.WindowHandle,
        null
      );
    } catch (error: unknown) {
      this.speak(
        `Critical error during BASS initialization: ${
          (error as Error).message
        }`,
        LoggingLevel.ERROR
      );
    } finally {
      if (!success) {
        this.speak("Could not initialize BASS!", LoggingLevel.ERROR);
        this.speak(
          `BASS Error Code: ${GetBASSErrorCode()}`,
          LoggingLevel.ERROR
        );
      } else {
        const deviceId = BASS_GetDevice();
        // Translate BASS_Init device number to real device id
        this.Device = deviceId;
        // Create a new DeviceInfo instance to hold device information.
        this._deviceInfo = GetDeviceInfo(this.Device);
        this.speak(
          `BASS was initialized: ${this.DeviceName}, ${this.Frequency}, ${this.Flags}, ${this.WindowHandle}`,
          LoggingLevel.LOG
        );
      }
    }
  }

  /* 
    This will free all resources allocated by BASS.
    Therefore you must call Init() before using any of BASS functionality again.
   */
  Free() {
    if (!BASS_Free()) {
      this.speak(
        `Failed to free BASS resources: Error Code: ${GetBASSErrorCode()}`,
        LoggingLevel.ERROR
      );
    }
  }

  /***
   * Writes a message to the console.
   * Will be suppressed if IsVerbose is false.
   */
  speak(text: string, level: LoggingLevel) {
    if (this.IsVerbose) {
      switch (level) {
        case LoggingLevel.ERROR:
          console.error(text);
          break;
        case LoggingLevel.LOG:
          console.log(text);
          break;
        case LoggingLevel.WARNING:
          console.warn(text);
          break;
      }
    }
  }
}
