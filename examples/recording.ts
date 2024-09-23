/*
    This example shows how to use bass for recording audio.
*/
import {
  BASS_ChannelPlay,
  BASS_ChannelStop,
  BASS_Init,
  BASS_RecordFree,
  BASS_RecordGetDevice,
  BASS_RecordGetDeviceInfo,
  BASS_RecordGetInfo,
  BASS_RecordGetInputName,
  BASS_RecordInit,
  BASS_RecordStart,
  BASS_SampleCreate,
  BASS_SampleFree,
  BASS_SampleGetChannel,
  BASS_SampleSetData,
  BASS_SetConfig,
} from "../lib/bindings.ts";
import { buffer, c_bool, DWORD, HRECORD } from "../lib/ctypes.ts";
import {
  BASS_DEVICE_ENABLED,
  BASS_DEVICE_STEREO,
  BASS_SAMPLE_LOOP,
  DSCAPS_CERTIFIED,
  DSCAPS_EMULDRIVER,
} from "../lib/flags.ts";
import { Options } from "../lib/mod.ts";
import { DeviceInfo } from "../lib/types/DeviceInfo.ts";
import { RecordInfo } from "../lib/types/RecordInfo.ts";
import {
  GetBASSErrorCode,
  IsMicrophone,
  PointerToString,
} from "../lib/utilities.ts";

// -1 will map to the os default recording device.
const DEVICE = -1;
const RECORDING_RATE = 44100;
// Open file to save the data to.
const file = await Deno.open("./sampleData.wav", {
  write: true,
  create: true,
  read: true,
});

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

// Get Input name for master input
try {
  console.log(
    PointerToString(BASS_RecordGetInputName(-1) as Deno.PointerObject)
  );
} catch (error) {
  console.error("Could not read master input string: ", error);
}
// Create function pointer for record data processing.
const callBack = Deno.UnsafeCallback.threadSafe(
  {
    parameters: [HRECORD, buffer, DWORD, buffer],
    result: c_bool,
  } as const,
  // User defined callback to process recorded data.
  // Gets called in 100ms intervals.
  function (
    _handle: number,
    buffer: Deno.PointerValue,
    length: number,
    _userData: Deno.PointerValue
  ) {
    // Write sample data to hard disk
    try {
      // Get buffer data from pointer
      const dataView = new Deno.UnsafePointerView(buffer as Deno.PointerObject);
      file.write(new Uint8Array(dataView.getArrayBuffer(length, 0))).then(
        (x: Number) => {
          console.log("Written bytes: ", x);
          return true;
        },
        () => false
      );
    } catch (error) {
      console.error(error);
    }

    return true; // Continue recording
  }
);

// Start recording
const { sampleRate, channels, flags, userdata } = {
  sampleRate: RECORDING_RATE,
  channels: 2,
  flags: 0,
  userdata: null,
};
console.log("STARTING RECORDING");

const recordHandle = BASS_RecordStart(
  sampleRate,
  channels,
  flags,
  callBack.pointer,
  userdata
);

// Record approx. 5 seconds.
setTimeout(() => {
  callBack.unref();
  // Stop Recording
  if (recordHandle) {
    console.log("STOPPING RECORDING");
    BASS_ChannelStop(recordHandle);
  } else {
    console.log("No record handle could be initialized!");
  }
  callBack.close();
  // Always free all initialized recording devices before exiting the program.
  BASS_RecordFree();
  // Load sample data from file and get file size
  const fs = file.statSync();
  const buf = new Uint8Array(fs.size);
  // After recording set the file pointer to file start position
  file.seek(0, Deno.SeekMode.Start);
  console.log("Read bytes: ", file.readSync(buf));

  BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);

  const sample = BASS_SampleCreate(
    fs.size,
    RECORDING_RATE,
    2,
    1,
    BASS_SAMPLE_LOOP
  );
  if (sample == 0) {
    console.log(GetBASSErrorCode());
  }

  BASS_SampleSetData(sample, buf);
  // Playback sample data
  const channelHandle = BASS_SampleGetChannel(sample, 0);
  console.log("Channel Handle: ", channelHandle);

  if (channelHandle) {
    console.log("Playback starts!");
    BASS_ChannelPlay(channelHandle, false);
    console.log("Press ctrl+c to exit!");
    while (true) {}
  }
  // Free samples resources after usage
  BASS_SampleFree(sample);
}, 5000);
