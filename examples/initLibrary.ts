/*
 *  This example shows how to initialize the library.
 *  Some library functions can be called without initializing,
 *  but BASS_Init has to be called before playing any audio.
 */

import { BASS_DEVICE_STEREO } from "../lib/flags.ts";
import { BASS_Free, BASS_Init } from "../mod.ts";

/*
 *   Use BASS_Init to initialize the audio library.
 *   -1 will be a pointer to the default audio device.
 *   0 will be a handle to the desktop window.
 */

const defaultDevice = -1;
const frequency = 44100;
const windowHandle = 0;

let success = BASS_Init(
  defaultDevice,
  frequency,
  BASS_DEVICE_STEREO,
  windowHandle,
  null
);
console.log("Initialized Default Audio Device: ", success);

// Between switching devices we call BASS_Free to free all used resources.
BASS_Free();

success = BASS_Init(888, frequency, BASS_DEVICE_STEREO, windowHandle, null);
console.log("Initialized Banana Audio Device: ", success);
BASS_Free();
