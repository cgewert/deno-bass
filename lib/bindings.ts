import {
  DWORD,
  HDSP,
  HFX,
  HMUSIC,
  HPLUGIN,
  HRECORD,
  HSAMPLE,
  HSTREAM,
  HSYNC,
  HWND,
  QWORD,
  buffer,
  c_bool,
  c_double,
  c_float,
  c_int_32,
  c_ptr,
  c_void,
} from "./ctypes.ts";
import { SEPARATOR } from "std/path/mod.ts";

const BASS_INSTALL_FOLDER = Deno.env.get("BASS_INSTALL_FOLDER");
if (BASS_INSTALL_FOLDER !== undefined)
  console.info("Using environment variable for BASS : ", BASS_INSTALL_FOLDER);

// Platform specific initialization
let osSpecificLibPath = BASS_INSTALL_FOLDER
  ? `${BASS_INSTALL_FOLDER}${SEPARATOR}`
  : "";

switch (Deno.build.os) {
  case "windows":
    osSpecificLibPath += "bass.dll";
    break;
  case "linux":
    osSpecificLibPath = "libbass.so";
    break;
  case "darwin":
    osSpecificLibPath = "libbass.dylib";
    break;
  default:
    break;
}

export const library = Deno.dlopen(osSpecificLibPath, {
  // Streams

  // Creates a user sample stream.
  BASS_StreamCreate: {
    parameters: [
      DWORD, // frequency
      DWORD, // channels
      DWORD, // flags
      "function", // function pointer to streamproc callback
      buffer, // user data that will be passed to the callback as arg
    ],
    result: HSTREAM,
    nonblocking: true,
  },
  BASS_StreamCreateFile: {
    parameters: [c_bool, "buffer", QWORD, QWORD, DWORD],
    result: HSTREAM,
  },
  /* Creates a sample stream from an MP3, MP2, MP1, OGG, WAV, AIFF or 
  plugin supported file via user callback functions. */
  BASS_StreamCreateFileUser: {
    parameters: [
      DWORD, // system
      DWORD, // flags
      "function", // callback
      buffer, // user data to pass to the callback
    ],
    result: HSTREAM,
    nonblocking: true,
  },
  BASS_StreamCreateURL: {
    parameters: [buffer, c_int_32, c_int_32, buffer, buffer],
    result: HSTREAM,
    nonblocking: false,
  },
  // Frees a sample stream's resources, including any sync/DSP/FX it has.
  BASS_StreamFree: {
    parameters: [HSTREAM], // handle
    result: c_bool,
  },
  // Retrieves the file position/status of a stream.
  BASS_StreamGetFilePosition: {
    parameters: [HSTREAM, DWORD], // handle, mode
    result: QWORD,
  },
  // Adds sample data to a "push" stream.
  BASS_StreamPutData: {
    parameters: [HSTREAM, buffer, DWORD], // handle, buffer, length
    result: DWORD,
  },
  // Adds data to a "push buffered" user file stream's buffer.
  BASS_StreamPutFileData: {
    parameters: [HSTREAM, buffer, DWORD], // handle, buffer, length
    result: DWORD,
  },

  // 3D

  // Applies changes made to the 3D system.
  BASS_Apply3D: { parameters: [], result: c_void },
  // Retrieves the factors that affect the calculations of 3D sound.
  BASS_Get3DFactors: { parameters: [buffer, buffer, buffer], result: c_bool },
  // Retrieves the position, velocity, and orientation of the listener.
  BASS_Get3DPosition: {
    parameters: [buffer, buffer, buffer, buffer],
    result: c_bool,
  },
  // Sets the factors that affect the calculations of 3D sound.
  BASS_Set3DFactors: {
    parameters: [c_float, c_float, c_float],
    result: c_bool,
  },
  // Sets the position, velocity, and orientation of the listener (ie. the player).
  BASS_Set3DPosition: {
    parameters: [buffer, buffer, buffer, buffer],
    result: c_bool,
  },

  // Channel Functions

  // Translates a byte position into time (seconds), based on a channel's format.
  BASS_ChannelBytes2Seconds: { parameters: [DWORD, QWORD], result: c_double },
  BASS_ChannelFlags: { parameters: [DWORD, DWORD, DWORD], result: DWORD },
  BASS_ChannelFree: { parameters: [DWORD], result: c_bool },
  // Retrieves the 3D attributes of a sample, stream, or MOD music channel with 3D functionality.
  BASS_ChannelGet3DAttributes: {
    parameters: [DWORD, DWORD, buffer, buffer, buffer, buffer, buffer],
    result: c_bool,
  },
  // Retrieves the 3D position of a sample, stream, or MOD music channel with 3D functionality.
  BASS_ChannelGet3DPosition: {
    parameters: [DWORD, buffer, buffer, buffer],
    result: c_bool,
  },
  BASS_ChannelGetAttribute: {
    parameters: [DWORD, DWORD, buffer],
    result: c_bool,
  },
  // Retrieves the value of a channel's attribute.
  BASS_ChannelGetAttributeEx: {
    parameters: [DWORD, DWORD, buffer, DWORD],
    result: DWORD,
  },
  // Retrieves the immediate sample data (or an FFT representation of it) of a sample channel, stream, MOD music, or recording channel.
  BASS_ChannelGetData: {
    parameters: [DWORD, buffer, DWORD],
    result: DWORD,
  },
  // Retrieves the device that a channel is using.
  BASS_ChannelGetDevice: {
    parameters: [DWORD],
    result: DWORD,
  },
  // Retrieves information on a channel.
  BASS_ChannelGetInfo: {
    parameters: [DWORD, buffer], // BASS_CHANNELINFO pointer
    result: c_bool,
  },
  BASS_ChannelGetLength: { parameters: [DWORD, DWORD], result: QWORD },
  // Retrieves the level (peak amplitude) of a sample, stream, MOD music, or recording channel.
  BASS_ChannelGetLevel: { parameters: ["i64"], result: DWORD },
  // Retrieves the level of a sample, stream, MOD music, or recording channel.
  BASS_ChannelGetLevelEx: {
    parameters: [DWORD, buffer, c_float, DWORD],
    result: c_bool,
  },
  // Retrieves the current position of a channel.
  BASS_ChannelGetPosition: { parameters: [DWORD, DWORD], result: QWORD },
  // Retrieves tags/headers from a channel.
  BASS_ChannelGetTags: { parameters: [DWORD, DWORD], result: buffer },
  // Checks if a sample, stream, or MOD music is active (playing) or stalled. Can also check if a recording is in progress.
  BASS_ChannelIsActive: {
    parameters: [DWORD],
    result: DWORD,
  },
  // Checks if an attribute (or any attribute) of a sample, stream, or MOD music is sliding.
  BASS_ChannelIsSliding: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  // Locks a stream, MOD music or recording channel to the current thread.
  BASS_ChannelLock: { parameters: [DWORD, c_bool], result: c_bool },
  // Pauses a sample, stream, MOD music, or recording.
  BASS_ChannelPause: { parameters: [QWORD], result: c_bool },
  // Starts/resumes playback of a sample, stream, MOD music, or a recording.
  BASS_ChannelPlay: { parameters: [DWORD, c_bool], result: c_bool },
  // Removes a DSP function from a stream, MOD music, or recording channel.
  BASS_ChannelRemoveDSP: {
    parameters: [HDSP, buffer],
    result: c_bool,
  },
  // Removes an effect on a stream, MOD music, or recording channel.
  BASS_ChannelRemoveFX: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  // Removes a links between two MOD music or stream channels.
  BASS_ChannelRemoveLink: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  // Removes a synchronizer from a MOD music, stream or recording channel.
  BASS_ChannelRemoveSync: {
    parameters: [DWORD, HSYNC],
    result: c_bool,
  },
  // Translates a time (seconds) position into bytes, based on a channel's format.
  BASS_ChannelSeconds2Bytes: {
    parameters: [DWORD, c_double],
    result: QWORD,
  },
  // Sets the 3D attributes of a sample, stream, or MOD music channel with 3D functionality.
  BASS_ChannelSet3DAttributes: {
    parameters: [
      DWORD,
      c_int_32,
      c_float,
      c_float,
      c_int_32,
      c_int_32,
      c_float,
    ],
    result: c_bool,
  },
  // Sets the 3D position of a sample, stream, or MOD music channel with 3D functionality.
  BASS_ChannelSet3DPosition: {
    parameters: [DWORD, buffer, buffer, buffer],
    result: c_bool,
  },
  // Sets the value of a channel's attribute.
  BASS_ChannelSetAttribute: {
    parameters: ["u32", DWORD, c_float],
    result: c_bool,
  },
  // Sets the value of a channel's attribute.
  BASS_ChannelSetAttributeEx: {
    parameters: [DWORD, DWORD, buffer, DWORD],
    result: c_bool,
  },
  // Changes the device that a stream, MOD music or sample is using.
  BASS_ChannelSetDevice: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  // Sets up a user DSP function on a stream, MOD music, or recording channel.
  BASS_ChannelSetDSP: {
    parameters: [DWORD, buffer, buffer, c_int_32],
    result: HDSP,
  },
  // Sets an effect on a stream, MOD music, or recording channel.
  BASS_ChannelSetFX: {
    parameters: [DWORD, DWORD, c_int_32],
    result: HFX,
  },
  // Links two MOD music or stream channels together.
  BASS_ChannelSetLink: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  // Sets the current position of a channel.
  BASS_ChannelSetPosition: {
    parameters: [DWORD, QWORD, DWORD],
    result: c_bool,
  },
  // Sets up a synchronizer on a MOD music, stream or recording channel.
  BASS_ChannelSetSync: {
    parameters: [DWORD, DWORD, QWORD, buffer, buffer],
    result: HSYNC,
  },
  // Slides a channel's attribute from its current value to a new value.
  BASS_ChannelSlideAttribute: {
    parameters: [DWORD, DWORD, c_float, DWORD],
    result: c_bool,
  },
  // Starts/resumes playback of a sample, stream, MOD music, or a recording.
  BASS_ChannelStart: { parameters: [DWORD], result: c_bool },
  // Stops a sample, stream, MOD music, or recording.
  BASS_ChannelStop: { parameters: [DWORD], result: c_bool },
  // Updates the playback buffer of a stream or MOD music.
  BASS_ChannelUpdate: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },

  // Initialization, etc...
  BASS_ErrorGetCode: { parameters: [], result: c_int_32 },
  BASS_Free: { parameters: [], result: c_bool },
  BASS_GetCPU: { parameters: [], result: c_float },
  BASS_GetDevice: { parameters: [], result: c_int_32 },
  BASS_GetDeviceInfo: {
    parameters: [DWORD, buffer],
    result: c_bool,
  },
  // Retrieves information on the device being used.
  BASS_GetInfo: {
    parameters: [buffer],
    result: c_bool,
  },
  BASS_GetVersion: { parameters: [], result: DWORD },
  BASS_GetVolume: { parameters: [], result: c_float },
  BASS_Init: {
    parameters: [c_int_32, DWORD, DWORD, HWND, c_ptr],
    result: c_bool,
  },
  // Checks if the output has been started and is active.
  BASS_IsStarted: { parameters: [], result: DWORD },
  BASS_Pause: { parameters: [], result: c_bool },
  // Sets the device to use for subsequent calls in the current thread.
  BASS_SetDevice: { parameters: [DWORD], result: c_bool },
  BASS_SetVolume: { parameters: ["f32"], result: c_bool },
  BASS_Start: { parameters: [], result: c_bool },
  BASS_Stop: { parameters: [], result: c_bool },
  // Updates the HSTREAM and HMUSIC channel playback buffers.
  BASS_Update: { parameters: [DWORD], result: c_bool },

  // Config

  // Retrieves the value of a config option.
  BASS_GetConfig: { parameters: [DWORD], result: DWORD },
  // Retrieves the value of a pointer config option.
  BASS_GetConfigPtr: { parameters: [DWORD], result: buffer },
  // Sets the value of a config option.
  BASS_SetConfig: { parameters: [DWORD, DWORD], result: c_bool },
  // Sets the value of a pointer config option.
  BASS_SetConfigPtr: { parameters: [DWORD, buffer], result: c_bool },

  // Plugins

  // Enables or disables an add-on.
  BASS_PluginEnable: { parameters: [HPLUGIN, c_bool], result: c_bool },
  // Unplugs an add-on.
  BASS_PluginFree: { parameters: [HPLUGIN], result: c_bool },
  // Retrieves information on a plugin.
  BASS_PluginGetInfo: { parameters: [HPLUGIN], result: buffer },
  // Enables or disables an add-on.
  BASS_PluginLoad: { parameters: [buffer, DWORD], result: HPLUGIN },

  // Effects

  // Retrieves the parameters of an effect.
  BASS_FXGetParameters: { parameters: [HFX, buffer], result: c_bool },
  // Resets the state of an effect or all effects on a channel.
  BASS_FXReset: { parameters: [DWORD], result: c_bool },
  // Sets the parameters of an effect.
  BASS_FXSetParameters: { parameters: [HFX, buffer], result: c_bool },
  // Sets the priority of an effect or DSP function, which determines its position in the DSP chain.
  BASS_FXSetPriority: { parameters: [DWORD, c_int_32], result: c_bool },

  // Music

  // Loads a MOD music file.
  BASS_MusicLoad: {
    parameters: [
      c_bool, // mem
      buffer, // file
      QWORD, // offset
      DWORD, // length
      DWORD, // flags
      DWORD, // freq
    ],
    result: HMUSIC,
  },
  // Frees a MOD music's resources, including any sync/DSP/FX it has.
  BASS_MusicFree: { parameters: [HMUSIC], result: c_bool },

  // Samples

  // Creates a new sample.
  BASS_SampleCreate: {
    parameters: [
      DWORD, // length
      DWORD, // freq
      DWORD, // channels
      DWORD, // max
      DWORD, // flags
    ],
    result: HSAMPLE,
  },

  // Frees a sample's resources.
  BASS_SampleFree: {
    parameters: [
      HSAMPLE, // sample handle
    ],
    result: c_bool,
  },
  // Creates/initializes a playback channel for a sample.
  BASS_SampleGetChannel: {
    parameters: [
      HSAMPLE, // sample handle
      DWORD, // flags
    ],
    result: DWORD,
  },
  // Retrieves all of a sample's existing channels.
  BASS_SampleGetChannels: {
    parameters: [
      HSAMPLE, // sample handle
      buffer, // pointer to HCHANNEL array
    ],
    result: DWORD,
  },
  // Retrieves a copy of a sample's data.
  BASS_SampleGetData: {
    parameters: [
      HSAMPLE, // sample handle
      buffer, // pointer to HCHANNEL array
    ],
    result: c_bool,
  },
  // Retrieves a sample's default attributes and other information.
  BASS_SampleGetInfo: {
    parameters: [
      HSAMPLE, // sample handle
      buffer, // pointer to BASS_SAMPLE array
    ],
    result: c_bool,
  },
  // Loads a WAV, AIFF, MP3, MP2, MP1, OGG or plugin supported sample.
  BASS_SampleLoad: {
    parameters: [
      c_bool, // mem
      buffer, // file
      QWORD, // offset
      DWORD, // length
      DWORD, // max
      DWORD, // flags
    ],
    result: HSAMPLE,
  },
  // Sets a sample's data.
  BASS_SampleSetData: {
    parameters: [
      HSAMPLE, // sample handle
      buffer, // pointer to data buffer
    ],
    result: c_bool,
  },
  // Sets a sample's default attributes.
  BASS_SampleSetInfo: {
    parameters: [
      HSAMPLE, // sample handle
      buffer, // pointer to array
    ],
    result: c_bool,
  },
  // Stops and frees all of a sample's channels (HCHANNEL).
  BASS_SampleStop: {
    parameters: [
      HSAMPLE, // sample handle
    ],
    result: c_bool,
  },
  // Recording

  // Frees all resources used by the recording device.
  BASS_RecordFree: {
    parameters: [],
    result: c_bool,
  },
  // Retrieves the recording device setting of the current thread.
  BASS_RecordGetDevice: {
    parameters: [],
    result: DWORD,
  },
  // Retrieves information on a recording device.
  BASS_RecordGetDeviceInfo: {
    parameters: [
      DWORD, // device
      buffer, // device info
    ],
    result: c_bool,
  },
  // Retrieves information on the recording device being used.
  BASS_RecordGetInfo: {
    parameters: [
      buffer, // record info
    ],
    result: c_bool,
  },
  // Retrieves the current settings of a recording input source.
  BASS_RecordGetInput: {
    parameters: [
      c_int_32, // input
      buffer, // pointer to a float variable taking the volume value
    ],
    result: DWORD,
  },
  // Retrieves the text description of a recording input source.
  BASS_RecordGetInputName: {
    parameters: [
      c_int_32, // The input to get the description of... 0 = first, -1 = master.
    ],
    result: buffer,
  },
  // Initializes a recording device.
  BASS_RecordInit: {
    parameters: [c_int_32],
    result: c_bool,
  },
  // Sets the recording device to use for subsequent calls in the current thread.
  BASS_RecordSetDevice: {
    parameters: [DWORD],
    result: c_bool,
  },
  // Adjusts the settings of a recording input source.
  BASS_RecordSetInput: {
    parameters: [
      c_int_32, // The input to adjust the settings of... 0 = first, -1 = master.
      DWORD /* The new setting... a combination of these flags.
      BASS_INPUT_OFF	Disable the input. This flag cannot be used when the device supports only one input at a time.
      BASS_INPUT_ON	Enable the input. If the device only allows one input at a time, then any previously enabled input will be disabled by this. */,
      c_float, // The volume level... 0 (silent) to 1 (max), less than 0 = leave current.
    ],
    result: c_bool,
  },
  // Starts recording.
  BASS_RecordStart: {
    parameters: [
      DWORD, // The sample rate to record at... 0 = device's current sample rate.
      DWORD, // The number of channels... 1 = mono, 2 = stereo, etc. 0 = device's current channel count.
      DWORD, // Flags
      "function", // Record proc pointer
      buffer, // user data
    ],
    result: HRECORD,
  },
} as const);

// Classic C Style API
export const BASS_Init = library.symbols.BASS_Init;
export const BASS_Free = library.symbols.BASS_Free;
export const BASS_StreamCreateFile = library.symbols.BASS_StreamCreateFile;
export const BASS_StreamCreateURL = library.symbols.BASS_StreamCreateURL;
export const BASS_ChannelPlay = library.symbols.BASS_ChannelPlay;
export const BASS_ErrorGetCode = library.symbols.BASS_ErrorGetCode;
export const BASS_SetVolume = library.symbols.BASS_SetVolume;
export const BASS_ChannelFree = library.symbols.BASS_ChannelFree;
export const BASS_GetDevice = library.symbols.BASS_GetDevice;
export const BASS_GetDeviceInfo = library.symbols.BASS_GetDeviceInfo;
export const BASS_GetCPU = library.symbols.BASS_GetCPU;
export const BASS_ChannelGetLevel = library.symbols.BASS_ChannelGetLevel;
export const BASS_GetVersion = library.symbols.BASS_GetVersion;
export const BASS_SetConfig = library.symbols.BASS_SetConfig;
export const BASS_GetConfig = library.symbols.BASS_GetConfig;
export const BASS_ChannelStop = library.symbols.BASS_ChannelStop;
export const BASS_ChannelPause = library.symbols.BASS_ChannelPause;
export const BASS_ChannelStart = library.symbols.BASS_ChannelStart;
export const BASS_GetVolume = library.symbols.BASS_GetVolume;
export const BASS_ChannelSetAttribute =
  library.symbols.BASS_ChannelSetAttribute;
export const BASS_ChannelGetTags = library.symbols.BASS_ChannelGetTags;
export const BASS_ChannelBytes2Seconds =
  library.symbols.BASS_ChannelBytes2Seconds;
export const BASS_ChannelGetPosition = library.symbols.BASS_ChannelGetPosition;
export const BASS_ChannelGetLength = library.symbols.BASS_ChannelGetLength;
export const BASS_ChannelFlags = library.symbols.BASS_ChannelFlags;
export const BASS_ChannelGetAttribute =
  library.symbols.BASS_ChannelGetAttribute;
export const BASS_ChannelGetAttributeEx =
  library.symbols.BASS_ChannelGetAttributeEx;
export const BASS_ChannelSetAttributeEx =
  library.symbols.BASS_ChannelSetAttributeEx;
export const BASS_Start = library.symbols.BASS_Start;
export const BASS_IsStarted = library.symbols.BASS_IsStarted;
export const BASS_Stop = library.symbols.BASS_Stop;
export const BASS_Pause = library.symbols.BASS_Pause;
export const BASS_ChannelGetInfo = library.symbols.BASS_ChannelGetInfo;
export const BASS_ChannelGetData = library.symbols.BASS_ChannelGetData;
export const BASS_ChannelGetDevice = library.symbols.BASS_ChannelGetDevice;
export const BASS_ChannelGetLevelEx = library.symbols.BASS_ChannelGetLevelEx;
export const BASS_ChannelIsActive = library.symbols.BASS_ChannelIsActive;
export const BASS_ChannelIsSliding = library.symbols.BASS_ChannelIsSliding;
export const BASS_ChannelSlideAttribute =
  library.symbols.BASS_ChannelSlideAttribute;
export const BASS_ChannelLock = library.symbols.BASS_ChannelLock;
export const BASS_ChannelUpdate = library.symbols.BASS_ChannelUpdate;
export const BASS_Update = library.symbols.BASS_Update;
export const BASS_ChannelSetDevice = library.symbols.BASS_ChannelSetDevice;
export const BASS_ChannelSetFX = library.symbols.BASS_ChannelSetFX;
export const BASS_ChannelRemoveFX = library.symbols.BASS_ChannelRemoveFX;
export const BASS_GetInfo = library.symbols.BASS_GetInfo;
export const BASS_SetDevice = library.symbols.BASS_SetDevice;
export const BASS_ChannelSetPosition = library.symbols.BASS_ChannelSetPosition;
export const BASS_ChannelGet3DAttributes =
  library.symbols.BASS_ChannelGet3DAttributes;
export const BASS_ChannelGet3DPosition =
  library.symbols.BASS_ChannelGet3DPosition;
export const BASS_ChannelRemoveDSP = library.symbols.BASS_ChannelRemoveDSP;
export const BASS_ChannelRemoveLink = library.symbols.BASS_ChannelRemoveLink;
export const BASS_ChannelRemoveSync = library.symbols.BASS_ChannelRemoveSync;
export const BASS_ChannelSeconds2Bytes =
  library.symbols.BASS_ChannelSeconds2Bytes;
export const BASS_ChannelSet3DAttributes =
  library.symbols.BASS_ChannelSet3DAttributes;
export const BASS_ChannelSet3DPosition =
  library.symbols.BASS_ChannelSet3DPosition;
export const BASS_ChannelSetDSP = library.symbols.BASS_ChannelSetDSP;
export const BASS_ChannelSetLink = library.symbols.BASS_ChannelSetLink;
export const BASS_ChannelSetSync = library.symbols.BASS_ChannelSetSync;
export const BASS_GetConfigPtr = library.symbols.BASS_GetConfigPtr;
export const BASS_SetConfigPtr = library.symbols.BASS_SetConfigPtr;
export const BASS_PluginEnable = library.symbols.BASS_PluginEnable;
export const BASS_PluginFree = library.symbols.BASS_PluginFree;
export const BASS_PluginGetInfo = library.symbols.BASS_PluginGetInfo;
export const BASS_PluginLoad = library.symbols.BASS_PluginLoad;
export const BASS_Apply3D = library.symbols.BASS_Apply3D;
export const BASS_Get3DFactors = library.symbols.BASS_Get3DFactors;
export const BASS_Get3DPosition = library.symbols.BASS_Get3DPosition;
export const BASS_Set3DFactors = library.symbols.BASS_Set3DFactors;
export const BASS_Set3DPosition = library.symbols.BASS_Set3DPosition;
export const BASS_FXGetParameters = library.symbols.BASS_FXGetParameters;
export const BASS_FXReset = library.symbols.BASS_FXReset;
export const BASS_FXSetParameters = library.symbols.BASS_FXSetParameters;
export const BASS_FXSetPriority = library.symbols.BASS_FXSetPriority;
export const BASS_StreamGetFilePosition =
  library.symbols.BASS_StreamGetFilePosition;
export const BASS_StreamFree = library.symbols.BASS_StreamFree;
export const BASS_StreamPutData = library.symbols.BASS_StreamPutData;
export const BASS_StreamPutFileData = library.symbols.BASS_StreamPutFileData;
export const BASS_MusicLoad = library.symbols.BASS_MusicLoad;
export const BASS_MusicFree = library.symbols.BASS_MusicFree;
export const BASS_RecordFree = library.symbols.BASS_RecordFree;
export const BASS_RecordInit = library.symbols.BASS_RecordInit;
export const BASS_RecordGetDevice = library.symbols.BASS_RecordGetDevice;
export const BASS_RecordSetDevice = library.symbols.BASS_RecordSetDevice;
export const BASS_RecordGetDeviceInfo =
  library.symbols.BASS_RecordGetDeviceInfo;
export const BASS_RecordGetInfo = library.symbols.BASS_RecordGetInfo;
export const BASS_RecordGetInput = library.symbols.BASS_RecordGetInput;
export const BASS_RecordGetInputName = library.symbols.BASS_RecordGetInputName;
export const BASS_RecordSetInput = library.symbols.BASS_RecordSetInput;
export const BASS_RecordStart = library.symbols.BASS_RecordStart;
export const BASS_SampleCreate = library.symbols.BASS_SampleCreate;
export const BASS_SampleFree = library.symbols.BASS_SampleFree;
export const BASS_SampleSetData = library.symbols.BASS_SampleSetData;
export const BASS_SampleLoad = library.symbols.BASS_SampleLoad;
export const BASS_SampleGetChannel = library.symbols.BASS_SampleGetChannel;
export const BASS_SampleGetChannels = library.symbols.BASS_SampleGetChannels;
export const BASS_SampleGetData = library.symbols.BASS_SampleGetData;
export const BASS_SampleGetInfo = library.symbols.BASS_SampleGetInfo;
export const BASS_SampleSetInfo = library.symbols.BASS_SampleSetInfo;
export const BASS_SampleStop = library.symbols.BASS_SampleStop;
export const BASS_StreamCreate = library.symbols.BASS_StreamCreate;
export const BASS_StreamCreateFileUser =
  library.symbols.BASS_StreamCreateFileUser;
