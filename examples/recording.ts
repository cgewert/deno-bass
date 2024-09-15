/*
    This example shows how to use bass for recording audio.
*/

import {
  BASS_RecordFree,
  BASS_RecordGetDevice,
  BASS_RecordGetDeviceInfo,
  BASS_RecordGetInfo,
  BASS_RecordInit,
  BASS_SetConfig,
} from "../lib/bindings.ts";
import {
  BASS_DEVICE_ENABLED,
  DSCAPS_CERTIFIED,
  DSCAPS_EMULDRIVER,
  WAVE_FORMAT_1M16,
  WAVE_FORMAT_2M08,
  WAVE_FORMAT_2S16,
  WAVE_FORMAT_4M08,
  WAVE_FORMAT_4S16,
} from "../lib/flags.ts";
import { Options } from "../lib/mod.ts";
import { DeviceInfo } from "../lib/types/DeviceInfo.ts";
import { RecordInfo } from "../lib/types/RecordInfo.ts";
import { GetBASSErrorCode, IsMicrophone } from "../lib/utilities.ts";

// -1 will map to the os default recording device.
const DEVICE = 4;

// Activate Unicode encoding.
BASS_SetConfig(Options.BASS_CONFIG_UNICODE, 1);

// Iterate over all recording devices and print out their names
let idx = 0;
const deviceInfo = new DeviceInfo();
console.log("Looking for recording hardware...");
while (BASS_RecordGetDeviceInfo(idx, deviceInfo.Infostruct)) {
  deviceInfo.readValuesFromStruct();
  if (deviceInfo.Flags & BASS_DEVICE_ENABLED && IsMicrophone(deviceInfo)) {
    console.log("Found device: ", idx, " : ", deviceInfo.Name);
  }
  idx++;
}

const success = BASS_RecordInit(DEVICE);

if (success != true) {
  console.log(
    "Error while initializing the recording device: ",
    GetBASSErrorCode()
  );
  Deno.exit();
}

// Get currents recording device info
const recordInfo = new RecordInfo();
// Get current threads recording device index
const currentDeviceIndex = BASS_RecordGetDevice();
if (currentDeviceIndex == -1) {
  console.error("Error getting current device index...");
} else {
  console.log("Using device index: ", currentDeviceIndex);
}
BASS_RecordGetDeviceInfo(currentDeviceIndex, deviceInfo.Infostruct);
deviceInfo.readValuesFromStruct();
BASS_RecordGetInfo(recordInfo.DataStruct);
recordInfo.readValuesFromStruct();
console.log("Using recording device: ", deviceInfo.Name);
console.log(
  "Microsoft certified? ",
  Boolean(recordInfo.Flags & DSCAPS_CERTIFIED)
);
console.log(
  "Hardware DirectSound support? ",
  Boolean(recordInfo.Flags & DSCAPS_EMULDRIVER)
);
console.log("Number of input sources: ", recordInfo.Inputs);
console.log("Current sample rate: ", recordInfo.Freq);
console.log("Single Instance: ", Boolean(recordInfo.SingleIn));
console.log("Formats: ", recordInfo.Formats);
console.log("Supported channels: ", Number(recordInfo.Formats & 0xff000000));

// Always free all initialized recording devices before exiting the program.
BASS_RecordFree();
