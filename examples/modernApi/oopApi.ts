/*
    This example demonstrates how to make use of the deno-bass OOP API.
*/

import { BASS_DEVICE_STEREO } from "../../lib/flags.ts";
import { BASS, BASSInitParams } from "../../lib/oop.ts";

// First define initialization parameter values
const initParams: BASSInitParams = {
  device: -1, // -1 is OS dependent default audio playback device
  flags: BASS_DEVICE_STEREO, // 2 playback channels
  freq: 44100, // 44.1 Khz sample rate
  windowHandle: 0, // 0 is the desktop window handle
};
// Create an instance of the BASS class, this will automatically initialize bass.
const bassInstance = new BASS(initParams);
// You can suppress or activate console output by setting IsVerbose (defaults to true)
bassInstance.IsVerbose = false;
// Call Free() to release all reserved resources:
// e.g. before closing the application.
bassInstance.Free();
// Switch the playback device by providing another value for the device property and calling Init().
bassInstance.Device = 0; // 0 is the NO SOUND device.
bassInstance.Init(); // Will automatically call Free() before initialization.
