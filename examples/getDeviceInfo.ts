/*
 *  Example of BASS_GetDeviceInfo usage.
 */

import { DeviceInfo } from "../lib/types/DeviceInfo.ts";
import {
  BASS_GetDeviceInfo,
  IsHeadphone,
  IsMicrophone,
  IsEnabled,
} from "../mod.ts";

// Use BassDeviceInfo.Infostruct as a pointer for the BASS_GetDeviceInfo call.
const deviceInfo = new DeviceInfo();

// Get Device Info for the "no sound" device.
BASS_GetDeviceInfo(0, deviceInfo.Infostruct);
console.log("Read Device Name: ", deviceInfo.Name);
console.log("Read Device Driver: ", deviceInfo.Driver);
console.log("Device Flags: ", deviceInfo.Flags.toString(16));
// Test different audio device flags with utility lambdas
console.log("Device is a headphone device: ", IsMicrophone(deviceInfo));
console.log("Device is a microphone device: ", IsHeadphone(deviceInfo));
console.log("Device is enabled: ", IsEnabled(deviceInfo));
