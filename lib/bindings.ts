import {
  DWORD,
  HWND,
  QWORD,
  buffer,
  c_bool,
  c_double,
  c_float,
  c_int_32,
  c_int_64,
  c_ptr,
} from "./ctypes.ts";
import { SEPARATOR } from "std/path/mod.ts";

// Platform specific initialization
let osSpecificLibPath = "";
switch(Deno.build.os){
  case "windows":
    osSpecificLibPath = `.${SEPARATOR}bass.dll`;
    break;
  case "linux":
    osSpecificLibPath = `.${SEPARATOR}libbass.so`;
    break;
  default:
    break;
};
if(osSpecificLibPath == "")
{
  console.error("Error detecting OS specific shared library.");
  Deno.exit(-1);
}
  

export const library = Deno.dlopen(osSpecificLibPath, {
  // Streams
  BASS_StreamCreateFile: {
    parameters: [c_bool, "buffer", c_int_64, c_int_64, c_int_32],
    result: c_int_32,
    nonblocking: true,
  },
  BASS_StreamCreateURL: {
    parameters: ["buffer", c_int_32, c_int_32, "buffer", "buffer"],
    result: c_int_32,
    nonblocking: false,
  },

  // Channel Functions

  // Translates a byte position into time (seconds), based on a channel's format.
  BASS_ChannelBytes2Seconds: { parameters: [DWORD, QWORD], result: c_double },
  BASS_ChannelFlags: { parameters: [DWORD, DWORD, DWORD], result: DWORD },
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
    parameters: [DWORD, buffer, QWORD],
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
  // Retrieves the level of a sample, stream, MOD music, or recording channel.
  BASS_ChannelGetLevelEx: {
    parameters: [DWORD, buffer, c_float, DWORD],
    result: c_bool,
  },
  //Checks if a sample, stream, or MOD music is active (playing) or stalled. Can also check if a recording is in progress.
  BASS_ChannelIsActive: {
    parameters: [DWORD],
    result: DWORD,
  },
  // Checks if an attribute (or any attribute) of a sample, stream, or MOD music is sliding.
  BASS_ChannelIsSliding: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  // Removes an effect on a stream, MOD music, or recording channel.
  BASS_ChannelRemoveFX: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  BASS_ChannelSetAttribute: {
    parameters: [DWORD, DWORD, c_float],
    result: c_bool,
  },
  // Changes the device that a stream, MOD music or sample is using.
  BASS_ChannelSetDevice: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  // Sets an effect on a stream, MOD music, or recording channel.
  BASS_ChannelSetFX: {
    parameters: [DWORD, DWORD, c_int_32],
    result: DWORD,
  },
  // Slides a channel's attribute from its current value to a new value.
  BASS_ChannelSlideAttribute: {
    parameters: [DWORD, DWORD, c_float, DWORD],
    result: c_bool,
  },
  // Sets the value of a channel's attribute.
  BASS_ChannelSetAttributeEx: {
    parameters: [DWORD, DWORD, buffer, DWORD],
    result: c_bool,
  },
  // Updates the playback buffer of a stream or MOD music.
  BASS_ChannelUpdate: {
    parameters: [DWORD, DWORD],
    result: c_bool,
  },
  BASS_ChannelGetLength: { parameters: [DWORD, DWORD], result: QWORD },
  BASS_ChannelGetPosition: { parameters: [DWORD, DWORD], result: QWORD },
  BASS_ChannelPlay: { parameters: [QWORD, c_bool], result: c_bool },
  BASS_ChannelStop: { parameters: [QWORD], result: c_bool },
  BASS_ChannelPause: { parameters: [QWORD], result: c_bool },
  BASS_ChannelStart: { parameters: [QWORD], result: c_bool },
  BASS_ChannelFree: { parameters: [QWORD], result: c_bool },
  BASS_ChannelGetLevel: { parameters: ["i64"], result: DWORD },
  // Locks a stream, MOD music or recording channel to the current thread.
  BASS_ChannelLock: { parameters: [DWORD, c_bool], result: c_bool },
  BASS_ChannelGetTags: { parameters: [DWORD, DWORD], result: buffer },

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
    parameters: [c_int_64, DWORD, DWORD, HWND, c_ptr],
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
  BASS_SetConfig: { parameters: [DWORD, DWORD], result: c_bool },
  BASS_GetConfig: { parameters: [DWORD], result: DWORD },
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
