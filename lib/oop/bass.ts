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
  BASS_SetDevice,
  BASS_ChannelPause,
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
import { Stream } from "./Stream.ts";
import { StreamFactory } from "./factories/StreamFactory.ts";

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
  private _frequency: number = 44100;
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
    return this._frequency;
  }
  public set Frequency(value: number) {
    if (value <= 0) return;
    this._frequency = value;
  }

  private _device: number = 0;
  public get Device(): number {
    return this._device;
  }
  // -1      Default device
  // 0       No Sound
  // 1..n    First real device
  public set Device(value: number) {
    if (value < -1) throw new Error("Value must be >= -1!");
    value = Math.abs(value); // Make -1 to 1 to get the first real device as default device
    this.speak(
      "Setting device from " + this._device + " to " + value,
      LoggingLevel.LOG
    );
    // Prevent reinitialization of already initialized devices
    if (value === this._device) return;
    this._device = value;
    const di = GetDeviceInfo(value);
    if (!di.IsInitialized) {
      if (
        !BASS_Init(value, this.Frequency, this.Flags, this.WindowHandle, null)
      ) {
        throw new Error(
          "Failed to initialize BASS with device " +
            value +
            " Error: " +
            GetBASSErrorCode()
        );
      }
      this.speak(`Initialized device successfully: ${value}`, LoggingLevel.LOG);
    }
    if (!BASS_SetDevice(value)) {
      throw new Error(
        "Failed to set device " + value + " Error: " + GetBASSErrorCode()
      );
    } else {
      // Update Device Info
      this._deviceInfo = di;
    }
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
    this._device = initParams.device;
    this.Frequency = initParams.freq;
    this.WindowHandle = initParams.windowHandle;
    this.IsVerbose = initParams.isVerbose ?? true;
    // Activate Unicode encoding.
    BASS_SetConfig(Options.BASS_CONFIG_UNICODE, 1);
    this.Init();
    this.getBASSInfo();
  }

  // (Re-)initializes BASS.
  Init() {
    if (this.HasDeviceStarted) this.Free();
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

  /**
   * Creates a stream from a MP3, MP2, MP1, OGG, WAV, AIFF or plugin supported file.
   * @param filePath The path to the file to stream.
   * @param autoplay Whether to start playback automatically.
   * @param offset The starting position in the file (in bytes).
   * @param length The length of the file to stream (in bytes).
   * @param flags Flags to modify the stream behavior.
   * @returns The handle of the created stream, or null on failure.
   */
  public StreamFromFile(
    filePath: string,
    autoplay: boolean = true,
    offset: number = 0,
    length: number = 0,
    flags: number = BASS_SAMPLE_FLOAT
  ): Stream | null {
    if (this.HasDeviceStarted) {
      const stream = StreamFactory.createFileStream(
        filePath,
        offset,
        length,
        flags
      );
      if (BASS_ErrorGetCode() === BASS_OK && stream?.start()) {
        this._channels.push(stream!.Handle);
        // If autoplay is false set the stream on "paused"
        if (!autoplay) {
          if (!stream.pause()) {
            this.speak(
              `Failed to pause stream for file: ${filePath}`,
              LoggingLevel.ERROR
            );
          }
        }
        return stream;
      } else {
        this.speak(
          `Failed to create stream for file: ${filePath}`,
          LoggingLevel.ERROR
        );
        this.speak(
          `BASS Error Code: ${GetBASSErrorCode()}, Streamhandle: ${stream}`,
          LoggingLevel.ERROR
        );
        return null;
      }
    }
    // BASS_Init was not called previously
    this.speak(
      `Call BASS_init() before using any BASS streaming functions!`,
      LoggingLevel.ERROR
    );
    return null;
  }

  public Pause(): boolean {
    return true;
  }

  public Start(): boolean {
    return true;
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
