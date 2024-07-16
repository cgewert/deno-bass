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

// TODO: resolve module root directory before opening binary
// Do not use relative path here
export const library = Deno.dlopen(".\\bass.dll", {
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
  BASS_ChannelSetAttribute: {
    parameters: [DWORD, DWORD, c_float],
    result: c_bool,
  },
  // Sets the value of a channel's attribute.
  BASS_ChannelSetAttributeEx: {
    parameters: [DWORD, DWORD, buffer, DWORD],
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

  BASS_ChannelGetTags: { parameters: [DWORD, DWORD], result: "buffer" },

  // Initialization, etc...
  BASS_ErrorGetCode: { parameters: [], result: c_int_32 },
  BASS_Free: { parameters: [], result: c_bool },
  BASS_GetVolume: { parameters: [], result: c_float },
  BASS_GetVersion: { parameters: [], result: DWORD },
  BASS_GetDevice: { parameters: [], result: c_int_32 },
  BASS_GetDeviceInfo: {
    parameters: [DWORD, "buffer"],
    result: c_bool,
  },
  BASS_GetCPU: { parameters: [], result: c_float },
  BASS_Init: {
    parameters: [c_int_64, DWORD, DWORD, HWND, c_ptr],
    result: c_bool,
  },
  // Checks if the output has been started and is active.
  BASS_IsStarted: { parameters: [], result: DWORD },
  BASS_Pause: { parameters: [], result: c_bool },
  BASS_SetVolume: { parameters: ["f32"], result: c_bool },
  BASS_Start: { parameters: [], result: c_bool },
  BASS_Stop: { parameters: [], result: c_bool },

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
