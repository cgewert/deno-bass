import {
  DWORD,
  HWND,
  QWORD,
  c_bool,
  c_float,
  c_int_32,
  c_int_64,
  c_ptr,
} from "./ctypes.ts";

export const library = Deno.dlopen(".\\binaries\\win64\\bass.dll", {
  BASS_GetDevice: { parameters: [], result: c_int_32 },
  BASS_GetDeviceInfo: {
    parameters: [DWORD, "buffer"],
    result: c_bool,
  },
  BASS_GetCPU: { parameters: [], result: c_float },
  BASS_ErrorGetCode: { parameters: [], result: c_int_32 },
  BASS_Init: {
    parameters: [c_int_64, DWORD, DWORD, HWND, c_ptr],
    result: c_bool,
  },
  BASS_StreamCreateFile: {
    parameters: [c_bool, "buffer", c_int_64, c_int_64, c_int_32],
    result: c_int_64,
    nonblocking: true,
  },
  BASS_Free: { parameters: [], result: c_bool },
  BASS_ChannelPlay: { parameters: [QWORD, c_bool], result: c_bool },
  BASS_ChannelFree: { parameters: [QWORD], result: c_bool },
  BASS_SetVolume: { parameters: ["f32"], result: c_bool },
  BASS_SetConfig: { parameters: [DWORD, DWORD], result: c_bool },
  BASS_ChannelGetLevel: { parameters: ["i64"], result: DWORD },
  BASS_GetVersion: { parameters: [], result: DWORD },
} as const);

// Classic C Style API
export const BASS_Init = library.symbols.BASS_Init;
export const BASS_Free = library.symbols.BASS_Free;
export const BASS_StreamCreateFile = library.symbols.BASS_StreamCreateFile;
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
