export { BASS_SAMPLE_FLOAT, BASS_SAMPLE_LOOP } from "./lib/flags.ts";
export { BASS_OK } from "./lib/errors.ts";
export {
  BASS_Init,
  BASS_Free,
  BASS_StreamCreateFile,
  BASS_ChannelPlay,
  BASS_ErrorGetCode,
  BASS_SetVolume,
  BASS_ChannelFree,
  BASS_GetDevice,
  BASS_GetDeviceInfo,
  BASS_GetCPU,
  BASS_ChannelGetLevel,
  library,
} from "./lib/bindings.ts";
