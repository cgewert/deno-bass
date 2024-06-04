/*
 *  Example of BASS_GetDeviceInfo usage.
 */

import { DeviceInfo } from "../lib/types/DeviceInfo.ts";
import { IsHeadphone, IsMicrophone, IsEnabled } from "../mod.ts";

// Get Device Info for the "no sound" device.
const deviceInfo = new DeviceInfo(0);
console.log("Read Device Name: ", deviceInfo.Name);
console.log("Read Device Driver: ", deviceInfo.Driver);
console.log("Device Flags: ", deviceInfo.Flags.toString(16));
// Test different audio device flags with utility lambdas
console.log("Device is a headphone device: ", IsHeadphone(deviceInfo));
console.log("Device is a microphone device: ", IsMicrophone(deviceInfo));
console.log("Device is enabled: ", IsEnabled(deviceInfo));
