/*
    This example demonstrates how to make use of the deno-bass OOP API.
*/

import { BASS } from "../../lib/oop/bass.ts";

// Create an instance of the BASS class, this will automatically initialize bass.
const bassInstance = new BASS();
console.log("Initialized BASS using Device: " + bassInstance.DeviceName);
// You can suppress or activate console output by setting IsVerbose (defaults to true)
bassInstance.IsVerbose = false;
// Call Free() to release all reserved resources before exiting your application:
bassInstance.Free();
// Switch the playback device by providing another value for the device property and calling Init().
bassInstance.Device = 0; // 0 is the NO SOUND device.
bassInstance.Init();
console.log("Initialized BASS using Device: " + bassInstance.DeviceName);
bassInstance.Free();
