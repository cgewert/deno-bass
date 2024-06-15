/*
 *  This example shows how to play a MP3 audio file.
 *
 */

import {
  BASS_SetConfig,
  BASS_CONFIG_UNICODE,
  BASS_Init,
  BASS_DEVICE_STEREO,
  DeviceInfo,
  BASS_GetDeviceInfo,
  BASS_StreamCreateFile,
  BASS_SAMPLE_FLOAT,
  BASS_ErrorGetCode,
  ErrorCodeToString,
  BASS_SetVolume,
  BASS_ChannelPlay,
  BASS_GetCPU,
  BASS_ChannelGetLevel,
  BASS_ChannelFree,
  BASS_Free,
  library,
} from "../mod.ts";

BASS_SetConfig(BASS_CONFIG_UNICODE, 1);
let initialization = BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
console.log("Initialized BASS: ", initialization);

// Enumerate all audio devices.
let deviceInfo = new DeviceInfo();
let error = 0;
for (let a = 0; BASS_GetDeviceInfo(a, deviceInfo.Infostruct); a++) {
  deviceInfo.readValuesFromStruct();
  console.log("Audio Device found: ", deviceInfo.Name);
}
// Bis hier hin alles tutti

try {
  const fileNameBuffer = new TextEncoder().encode(
    "E:\\Programmieren\\deno-tutorial\\ffi\\001-c\\track.mp3"
  );
  const streamHandle = BASS_StreamCreateFile(
    false,
    fileNameBuffer,
    0,
    0,
    BASS_SAMPLE_FLOAT
  );
  console.log("Streamhandle: ", streamHandle);
  error = BASS_ErrorGetCode();
  console.log(ErrorCodeToString(error));
  Deno.exit(error);
} catch (error) {}

if (streamHandle == 0) {
  console.log("Could not load stream: ", BASS_ErrorGetCode());
  Deno.exit(-1);
}
BASS_SetVolume(0.02);
if (BASS_ChannelPlay(streamHandle, true)) {
  // Wait for user input before terminating
  do {
    console.log("CPU load: ", BASS_GetCPU());
    let levels = BASS_ChannelGetLevel(streamHandle);
    let left = levels & 0x00ff;
    let right = levels & 0xff00;
    console.log("Left: ", left / 32768, " Right: ", right / 32768);
  } while (confirm("Do you want to proceed?"));
} else {
  console.log("Could not play channel: ", BASS_ErrorGetCode());
}
BASS_ChannelFree(streamHandle);
BASS_Free();
library.close();
