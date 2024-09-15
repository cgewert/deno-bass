/*
 *  This example shows how to play a sample file.
 */

import {
  BASS_ChannelBytes2Seconds,
  BASS_ChannelGetLength,
  BASS_ChannelIsActive,
  BASS_ChannelPlay,
  BASS_ChannelSetAttribute,
  BASS_ErrorGetCode,
  BASS_Init,
  BASS_SampleGetChannel,
  BASS_SampleLoad,
  BASS_SetConfig,
  library,
} from "../lib/bindings.ts";
import { BASS_ATTRIB_VOL } from "../lib/channelAttributes.ts";
import { BASS_DEVICE_STEREO } from "../lib/flags.ts";
import { BASS_POS_BYTE } from "../lib/modes.ts";
import { BASS_CONFIG_UNICODE } from "../lib/options.ts";
import {
  BASS_ACTIVE_PAUSED,
  BASS_ACTIVE_PAUSED_DEVICE,
  BASS_ACTIVE_PLAYING,
  BASS_ACTIVE_STOPPED,
} from "../lib/retvals.ts";
import {
  ErrorCodeToString,
  GetBASSErrorCode,
  ToCString,
} from "../lib/utilities.ts";
const FILE_NAME = "./examples/01.mp3";
const FLAGS = 0;

BASS_SetConfig(BASS_CONFIG_UNICODE, 1);
BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
console.log("Initialized BASS... ", GetBASSErrorCode());
const fileNameBuffer = ToCString(
  // Insert a valid path to your sample file here
  FILE_NAME
);
// BASS_SampleLoad Parameters
// mem: Play from memory
// file: filename
// offset: playback start from offset
// length
// max: number of simultaneous playbacks min 1 max 65535
// flags: flags combination
const sampleHandle = BASS_SampleLoad(false, fileNameBuffer, BigInt(0), 0, 1, 0);
// Before playing a sample a channel handle must be obtained which is being used with channel play.
const channelHandle = BASS_SampleGetChannel(sampleHandle, FLAGS);

if (channelHandle != 0) {
  console.log("Loaded sample file successfully...");
  play(channelHandle);
} else {
  console.log("Could not load sample file!");
  Deno.exit(1);
}

function play(handle: number) {
  // Set volume for the playing channel stream
  if (!BASS_ChannelSetAttribute(handle, BASS_ATTRIB_VOL, 0.04)) {
    console.error("Could not set the channels volume!");
  }

  if (BASS_ChannelPlay(handle, true)) {
    console.log("Playing audio.");
  } else {
    console.log(
      "Could not play channel: ",
      ErrorCodeToString(BASS_ErrorGetCode())
    );
  }
  console.log("Press <Ctrl+C> to exit!");

  let playBackLength: bigint | number = BASS_ChannelGetLength(
    handle,
    BASS_POS_BYTE
  );
  if (playBackLength == BigInt(-1)) {
    console.error(
      "Error while retrieving channels playback length position: ",
      ErrorCodeToString(BASS_ErrorGetCode())
    );
    Deno.exit(-1);
  }
  playBackLength = BASS_ChannelBytes2Seconds(handle, playBackLength);
  console.log("Sample file playback length: ", playBackLength);

  while (true) {
    const end = Date.now() + 1_000;
    while (Date.now() < end);

    // Check channels active state
    const isActive = BASS_ChannelIsActive(handle);
    switch (isActive) {
      case BASS_ACTIVE_PLAYING:
        console.log("PLAYING");
        break;
      case BASS_ACTIVE_PAUSED:
        console.log("CHANNEL PAUSED");
        break;
      case BASS_ACTIVE_PAUSED_DEVICE:
        console.log("DEVICE PAUSED");
        break;
      case BASS_ACTIVE_STOPPED:
        console.log("STOPPED");
        break;
      default:
        break;
    }
  }
  library.close();
}
