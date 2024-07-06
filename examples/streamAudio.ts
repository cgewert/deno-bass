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
  BASS_STREAM_AUTOFREE,
  library,
  BASS_OK,
  BASS_ChannelStop,
  BASS_GetVolume,
  BASS_CONFIG_HANDLES,
  BASS_GetConfig,
  BASS_ChannelSetAttribute,
  BASS_ATTRIB_VOL,
} from "../mod.ts";

BASS_SetConfig(BASS_CONFIG_UNICODE, 1);
BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
let error = BASS_ErrorGetCode();
if (error != BASS_OK) {
  console.log("Can't initialize BASS! ", ErrorCodeToString(error));
}
console.log("Initialized BASS...");

// Enumerate all audio devices.
//let deviceInfo = new DeviceInfo();
/*for (let a = 0; BASS_GetDeviceInfo(a, deviceInfo.Infostruct); a++) {
  deviceInfo.readValuesFromStruct();
  console.log("Audio Device found: ", deviceInfo.Name);
}*/

const fileNameBuffer = new TextEncoder().encode(
  "E:\\Programmieren\\deno-tutorial\\ffi\\001-c\\track.mp3"
);

BASS_StreamCreateFile(
  false,
  fileNameBuffer,
  0,
  0,
  BASS_SAMPLE_FLOAT | BASS_STREAM_AUTOFREE
).then(
  (handle) => {
    let bassError = BASS_ErrorGetCode();

    if (bassError != BASS_OK) {
      console.log("Error while opening Stream: ");
      console.log(ErrorCodeToString(bassError));
      console.log("Handle: ", handle);
    } else {
      console.log("Opened Stream File!");
      console.log("Stream Handle: ", handle);
      play(handle);
    }
  },
  (_createError) => {
    console.log("Something unexpected happened!?: ", _createError);
  }
);

function play(streamHandle: number) {
  // Set volume for the playing channel stream
  if (!BASS_ChannelSetAttribute(streamHandle, BASS_ATTRIB_VOL, 0.05)) {
    console.error("Could not set the channels volume!");
  }
  let retval = BASS_GetConfig(BASS_CONFIG_HANDLES);
  console.log("Open Stream handles: ", retval);
  if (BASS_ChannelPlay(streamHandle, true)) {
    console.log("Playing audio.");
  } else {
    console.log(
      "Could not play channel: ",
      ErrorCodeToString(BASS_ErrorGetCode())
    );
  }
  while (true) {}
  BASS_ChannelStop(streamHandle);
  BASS_ChannelFree(streamHandle);
  BASS_Free();
  library.close();
}
