import {
  BASS_Init,
  BASS_Free,
  BASS_SetConfig,
  BASS_GetDevice,
  BASS_GetConfigPtr,
  BASS_SetConfigPtr,
  BASS_GetCPU,
  BASS_ErrorGetCode,
  BASS_IsStarted,
  BASS_StreamCreateFile,
  BASS_ChannelStart,
} from "../bindings.ts";
import { GetBASSErrorCode, PointerToString, ToCString } from "../utilities.ts";
import { DESKTOP_WINDOW_HANDLE, GetDeviceInfo } from "./oop.ts";
import {
  BASS_DEVICE_STEREO,
  BASS_SAMPLE_FLOAT,
  BASSInitFlags,
} from "../flags.ts";
import { Options } from "../mod.ts";
import { DeviceInfo } from "../types/DeviceInfo.ts";
import { BASSInfo } from "../types/BASSInfo.ts";
import { BASS_OK } from "../errors.ts";
import { DeviceStatus } from "../modes.ts";

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
*/
export class BASS {
  private _deviceInfo: DeviceInfo | undefined;
  private _bassInfo: BASSInfo | undefined;
  private _isVerbose: boolean = true;
  // Stores all active channels by their handle
  private _channels: Array<number> = [];
  // Determines if class instance will print output to the console.
  public get IsVerbose(): boolean {
    return this._isVerbose;
  }
  public set IsVerbose(value: boolean) {
    this._isVerbose = value;
  }

  public get CPU(): number {
    return BASS_GetCPU();
  }

  public get DeviceStatus(): DeviceStatus {
    return BASS_IsStarted() as DeviceStatus;
  }

  public get HasDeviceStarted(): boolean {
    return (
      this.DeviceStatus === DeviceStatus.STARTED_PLAYING ||
      this.DeviceStatus === DeviceStatus.STARTED_NOT_PLAYING
    );
  }

  // The number of available speakers
  public get Speakers(): number {
    return this._bassInfo?.bassInfo.speakers ?? 0;
  }

  // The output rate.
  public get Frequency(): number {
    return this._bassInfo?.bassInfo.freq ?? 0;
  }

  private _device: number = 0;
  public get Device(): number {
    return this._device;
  }
  // BASS allows values for devices ranging from -1 (default device) to n
  public set Device(value: number) {
    if (value < -1) throw new Error("Value must be >= -1!");
    this._device = value;

    // Automatically re-init BASS when the Device property is set
    //this.Init();
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

  /**
   * Retrieves or sets the filename of the loaded BASS library.
   * Default is an empty string.
   */
  private _fileName: string = "";
  public get FileName(): string {
    this._fileName = PointerToString(
      BASS_GetConfigPtr(Options.BASS_CONFIG_FILENAME) as Deno.PointerObject
    );
    return this._fileName;
  }
  public set FileName(value: string) {
    this._fileName = value;
    BASS_SetConfigPtr(Options.BASS_CONFIG_FILENAME, ToCString(value));
  }

  constructor(
    initParams: BASSInitParams = {
      device: -1, // -1 means the default device and is allowed in a call to BASS_init()
      flags: BASS_DEVICE_STEREO,
      windowHandle: DESKTOP_WINDOW_HANDLE,
      freq: 44100,
      isVerbose: true,
    }
  ) {
    this.Flags = initParams.flags;
    this.Device = initParams.device;
    this.WindowHandle = initParams.windowHandle;
    this.IsVerbose = initParams.isVerbose ?? true;
    // Activate Unicode encoding.
    BASS_SetConfig(Options.BASS_CONFIG_UNICODE, 1);
    this.Init(initParams);
    this.getBASSInfo();
  }

  // (Re-)initializes BASS.
  Init(params: BASSInitParams) {
    if (this.HasDeviceStarted) this.Free();
    // Initializing the library
    let success = false;
    try {
      success = BASS_Init(
        this.Device,
        params.freq,
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
        // Translate BASS_Init device number to real device id because -1 can be used only in calls to BASS_init()
        this.Device = deviceId;
        // Create a new DeviceInfo instance to hold device information.
        this._deviceInfo = GetDeviceInfo(this.Device);
      }
    }
  }

  /* 
    This will free all resources allocated by BASS.
    Therefore you must call Init() before using any of BASS functionality again.
   */
  public Free() {
    if (!BASS_Free()) {
      this.speak(
        `Failed to free BASS resources: Error Code: ${GetBASSErrorCode()}`,
        LoggingLevel.ERROR
      );
    }
  }

  public GetLastError(asString: boolean): number | string {
    return asString ? (GetBASSErrorCode() as string) : BASS_ErrorGetCode();
  }

  private getBASSInfo(): void {
    if (this._bassInfo === undefined) {
      this._bassInfo = new BASSInfo();
    }
    // Update the BASSInfo structure with actual data.
    this._bassInfo.readValuesFromStruct();
  }

  // Creates a stream from a MP3, MP2, MP1, OGG, WAV, AIFF or plugin supported file.
  public StreamFromFile(
    filePath: string,
    offset: number = 0,
    length: number = 0,
    flags: number = BASS_SAMPLE_FLOAT
  ): boolean {
    if (this.HasDeviceStarted) {
      const hstream = BASS_StreamCreateFile(
        false,
        ToCString(filePath),
        BigInt(offset),
        BigInt(length),
        flags
      );
      // Create a channel for the stream and add the channel handle to the channel list
      if (BASS_ErrorGetCode() === BASS_OK && BASS_ChannelStart(hstream)) {
        this._channels.push(hstream);
        return BASS_ErrorGetCode() === BASS_OK;
      } else {
        this.speak(
          `Failed to create stream for file: ${filePath}`,
          LoggingLevel.ERROR
        );
        this.speak(
          `BASS Error Code: ${GetBASSErrorCode()}, Streamhandle: ${hstream}`,
          LoggingLevel.ERROR
        );
        return false;
      }
    }
    // BASS_Init was not called previously
    this.speak(
      `Call BASS_init() before using any BASS streaming functions!`,
      LoggingLevel.ERROR
    );
    return false;
  }

  /***
   * Writes a message to the console.
   * Will be suppressed if IsVerbose is false.
   */
  public speak(text: string, level: LoggingLevel) {
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
