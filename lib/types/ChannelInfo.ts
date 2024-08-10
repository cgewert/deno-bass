import { BASS_ChannelGetInfo } from "../bindings.ts";
import { BASS_CTYPE_STREAM_MP3 } from "../channelTypes.ts";
import { GetBASSErrorCode } from "../utilities.ts";

export class ChannelInfo {
  private _datastruct: Uint8Array;

  // Default sample rate.
  private _frequency = 0;
  public get Frequency(): number {
    return this._frequency;
  }
  public set Frequency(value: number) {
    this._frequency = value;
  }

  // Number of channels... 1=mono, 2=stereo, etc.
  private _channels = 0;
  public get Channels(): number {
    return this._channels;
  }
  public set Channels(value: number) {
    this._channels = value;
  }

  // A combination of flags
  private _flags = 0;
  public get Flags(): number {
    return this._flags;
  }
  public set Flags(value: number) {
    this._flags = value;
  }

  // The type of channel it is (see channelTypes.ts).
  private _channelType = 0;
  public get ChannelType(): number {
    return this._channelType;
  }
  public set ChannelType(value: number) {
    this._channelType = value;
  }

  /*    The original resolution (bits per sample)... 
        0 = undefined. If the original sample format is floating-point 
        then the BASS_ORIGRES_FLOAT flag will be set and the number 
        of bits will be in the LOWORD. 
    */
  private _originalResolution = 0;
  public get OriginalResolution(): number {
    return this._originalResolution;
  }
  public set OriginalResolution(value: number) {
    this._originalResolution = value;
  }

  /* 
        The plugin that is handling the channel... 
        0 = not using a plugin. 
        Note this is only available with streams 
        created using the plugin system via the standard 
        BASS stream creation functions, not those created by 
        add-on functions. Information on the plugin can be retrieved 
        via BASS_PluginGetInfo. 
    */
  private _plugin = 0;
  public get Plugin(): number {
    return this._plugin;
  }
  public set Plugin(value: number) {
    this._plugin = value;
  }

  /* 
        The sample that is playing on the channel.
        Only applicable when ctype is BASS_CTYPE_SAMPLE or 
        BASS_CTYPE_STREAM_SAMPLE. 
    */
  private _sample = 0;
  public get Sample(): number {
    return this._sample;
  }
  public set Sample(value: number) {
    this._sample = value;
  }

  // The filename associated with the channel. (HSTREAM only)
  private _filename = "";
  public get Filename(): string {
    return this._filename;
  }
  public set Filename(value: string) {
    this._filename = value;
  }

  // Returns true if channel is a streamed mp3.
  public IsMp3() {
    return this.ChannelType == BASS_CTYPE_STREAM_MP3;
  }

  // Size of c struct BASS_ChannelInfo in bytes
  public static SIZE = 40;

  public static OFFSET_FREQUENCY = 0;
  public static OFFSET_CHANNELS = 4;
  public static OFFSET_FLAGS = 8;
  public static OFFSET_CHANNEL_TYPE = 12;
  public static OFFSET_ORIGINAL_RESOLUTION = 16;
  public static OFFSET_PLUGIN = 20;
  public static OFFSET_SAMPLE = 24;
  public static OFFSET_FILENAME = 28;

  constructor(streamHandle: number) {
    this._datastruct = new Uint8Array(ChannelInfo.SIZE);
    if (!BASS_ChannelGetInfo(streamHandle, this._datastruct)) {
      console.error("Error while reading Channel Info: ", GetBASSErrorCode());
    } else {
      this.readValuesFromStruct();
    }
  }

  public get DataStruct() {
    return this._datastruct;
  }

  /* Call after Infostruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const pointer = Deno.UnsafePointer.of(
      this._datastruct
    ) as Deno.PointerObject;
    const dataView = new Deno.UnsafePointerView(pointer);

    this.Frequency = dataView.getInt32(ChannelInfo.OFFSET_FREQUENCY);
    this.Channels = dataView.getInt32(ChannelInfo.OFFSET_CHANNELS);
    this.Flags = dataView.getInt32(ChannelInfo.OFFSET_FLAGS);
    this.ChannelType = dataView.getInt32(ChannelInfo.OFFSET_CHANNEL_TYPE);
    this.Sample = dataView.getInt32(ChannelInfo.OFFSET_SAMPLE);
    this.Plugin = dataView.getInt32(ChannelInfo.OFFSET_PLUGIN);
    this.OriginalResolution = dataView.getInt32(
      ChannelInfo.OFFSET_ORIGINAL_RESOLUTION
    );
    try {
      this.Filename = Deno.UnsafePointerView.getCString(
        Deno.UnsafePointer.of(
          this.DataStruct.subarray(
            ChannelInfo.OFFSET_FILENAME,
            ChannelInfo.OFFSET_FILENAME + 4
          )
        ) as Deno.PointerObject
      );
    } catch (error) {
      console.error("Error while reading filename: ", error);
    }
  }
}
