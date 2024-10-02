/*
 *  This example shows how to activate unicode encoding option
 *  and how to retrieve a device info object for an audio device specified by
 *  a given index.
 *  Also some utility lambdas can be used to retrieve specific device capabilities.
 */

import { BASS_SetConfig } from "../../lib/bindings.ts";
import { BASS_CONFIG_UNICODE } from "../../lib/options.ts";
import { DeviceInfo } from "../../lib/types/DeviceInfo.ts";
import { IsHeadphone, IsMicrophone, IsEnabled } from "../../lib/utilities.ts";

// Activate unicode encoding in the bass audio library.
BASS_SetConfig(BASS_CONFIG_UNICODE, 1);
// Get Device Info for the "no sound" device (always index 0).
const deviceInfo = new DeviceInfo(0);

console.log("Read Device Name: ", deviceInfo.Name);
console.log("Read Device Driver: ", deviceInfo.Driver);
console.log("Device Flags: ", deviceInfo.Flags.toString(16));
// Test different audio device flags with utility lambdas
console.log("Device is a headphone device: ", IsHeadphone(deviceInfo));
console.log("Device is a microphone device: ", IsMicrophone(deviceInfo));
console.log("Device is enabled: ", IsEnabled(deviceInfo));
