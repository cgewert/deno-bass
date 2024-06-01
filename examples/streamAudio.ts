import { BASS_DEVICE_STEREO } from "../lib/flags.ts";
import {
  BASS_Init,
  BASS_GetDeviceInfo,
  BASS_StreamCreateFile,
  BASS_SAMPLE_FLOAT,
  BASS_ErrorGetCode,
  BASS_SetVolume,
  BASS_ChannelPlay,
  BASS_GetCPU,
  BASS_ChannelGetLevel,
  BASS_ChannelFree,
  BASS_Free,
  library,
} from "../mod.ts";

let initialization = BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);

// Enumerate all audio devices.
let deviceInfo = new Uint8Array(24); // Mimicking BASS_DEVICEINFO struct
for (let a = 0; BASS_GetDeviceInfo(a, deviceInfo); a++) {
  const deviceNamePointer = Deno.UnsafePointer.create(
    Number(new BigUint64Array(deviceInfo.subarray(0, 8).buffer)[0])
  );
  let name = "";
  try {
    name = Deno.UnsafePointerView.getCString(deviceNamePointer);

    // Read and create a JavaScript string from the `char *` pointer.
    console.log("Audio Device found: ", name);
  } catch (err) {
    console.log("Error while enumerating audio devices: ", err);
  }
}
console.log("Initialized: ", initialization);
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
