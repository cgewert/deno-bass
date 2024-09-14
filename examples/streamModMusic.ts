/*
 *  This example shows how to play a *.mod music file.
 */

import {
  BASS_ChannelBytes2Seconds,
  BASS_ChannelGetLength,
  BASS_ChannelIsActive,
  BASS_ChannelPlay,
  BASS_ChannelSetAttribute,
  BASS_ErrorGetCode,
  BASS_Init,
  BASS_MusicLoad,
  BASS_SetConfig,
  library,
} from "../lib/bindings.ts";
import { BASS_ATTRIB_VOL } from "../lib/channelAttributes.ts";
import { BASS_DEVICE_STEREO, BASS_MUSIC_AUTOFREE } from "../lib/flags.ts";
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
const FILE_NAME = "./examples/space_debris.mod";
const FLAGS = BASS_MUSIC_AUTOFREE;

BASS_SetConfig(BASS_CONFIG_UNICODE, 1);
BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
console.log("Initialized BASS... ", GetBASSErrorCode());
const fileNameBuffer = ToCString(
  // Insert a valid path to your mp3 file here
  FILE_NAME
);
const musicHandle = BASS_MusicLoad(false, fileNameBuffer, 0, 0, FLAGS, 0);

if (musicHandle != 0) {
  console.log("Loaded music file successfully...");
  play(musicHandle);
} else {
  console.log("Could not load music file!");
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

  let playBackLength = BASS_ChannelGetLength(handle, BASS_POS_BYTE);
  if (playBackLength == -1) {
    console.error(
      "Error while retrieving channels playback position: ",
      ErrorCodeToString(BASS_ErrorGetCode())
    );
    Deno.exit(-1);
  }
  playBackLength = BASS_ChannelBytes2Seconds(handle, playBackLength);
  console.log("Music file playback length: ", playBackLength);

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
