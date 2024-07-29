/*
 *  This example shows how to enumerate all audio devices.
 *  As long as BASS_GetDeviceInfo() returns true a next device can be
 *  queried with a follow up call to BASS_GetDeviceInfo()
 *  and an incremented device index.
 *  When BASS_GetDeviceInfo() returns false, no further device is available.
 *  Attention: When BASS_GetDeviceInfo() returns false the BASS_DEVICE error
 *  code will be set.
 */

import { BASS_GetDeviceInfo, BASS_SetConfig } from "../lib/bindings.ts";
import { Options } from "../lib/mod.ts";
import { DeviceInfo } from "../lib/types/DeviceInfo.ts";

// Activate Unicode encoding.
BASS_SetConfig(Options.BASS_CONFIG_UNICODE, 1);

// If a device info object is created with an empty constructor parameter
// use readValuesFromStruct() to update the device info objects properties.
let deviceInfo = new DeviceInfo();
// Each device has a unique device index starting with 0.
let deviceIndex = 0;

while (BASS_GetDeviceInfo(deviceIndex, deviceInfo.Infostruct)) {
  // Update class properties
  deviceInfo.readValuesFromStruct();
  console.log("Audio Device found: ", deviceInfo.Name);
  deviceIndex++;
}
