/*
 *  Example of BASS_GetDeviceInfo usage.
 */

import { BassDeviceInfo } from "../lib/bass-types.ts";
import { BASS_GetDeviceInfo } from "../mod.ts";

// Use BassDeviceInfo.Infostruct as a pointer for the BASS_GetDeviceInfo call.
const deviceInfo1 = new BassDeviceInfo();
const deviceInfo2 = new BassDeviceInfo();

// Get Device Info for the "no sound" device.
let success = BASS_GetDeviceInfo(3, deviceInfo1.Infostruct);
console.log("Read Device Name: ", deviceInfo1.Name);
console.log("Read Device Driver: ", deviceInfo1.Driver);
//console.log("Device Flags: ", deviceInfo1.Flags);

// Get Device Info for the first audio device found.
success = BASS_GetDeviceInfo(2, deviceInfo2.Infostruct);
console.log("Read Device Name: ", deviceInfo2.Name);
console.log("Read Device Driver: ", deviceInfo2.Driver);
//console.log("Device Flags: ", deviceInfo2.Flags);
