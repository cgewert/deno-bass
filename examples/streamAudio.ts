/*
 *  This example shows how to play a MP3 audio file.
 *
 */

import {
  BASS_ChannelFree,
  BASS_ChannelGetTags,
  BASS_ChannelPlay,
  BASS_ChannelSetAttribute,
  BASS_ChannelStop,
  BASS_ErrorGetCode,
  BASS_Free,
  BASS_GetConfig,
  BASS_Init,
  BASS_SetConfig,
  BASS_StreamCreateFile,
  library,
} from "../lib/bindings.ts";
import { BASS_ATTRIB_VOL } from "../lib/channelAttributes.ts";
import { BASS_OK, ERROR_MAP } from "../lib/errors.ts";
import { BASS_DEVICE_STEREO } from "../lib/flags.ts";
import { BASS_CONFIG_UNICODE, BASS_CONFIG_HANDLES } from "../lib/options.ts";
import { BASS_TAG_ID3, BASS_TAG_ID3V2, BASS_TAG_ID3V2_2 } from "../lib/tags.ts";
import { ID3v1Struct } from "../lib/types/ID3v1Struct.ts";
import {
  CreatePointerX64,
  ErrorCodeToString,
  GetBASSErrorCode,
  ToCString,
} from "../lib/utilities.ts";

BASS_SetConfig(BASS_CONFIG_UNICODE, 1);
BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
let error = BASS_ErrorGetCode();
if (error != BASS_OK) {
  console.log("Can't initialize BASS! ", ErrorCodeToString(error));
}
console.log("Initialized BASS...");

const fileNameBuffer = ToCString(
  // Insert a valid path to your mp3 file here
  "E:/Programmieren/deno-tutorial/ffi/001-c/track.mp3"
);

BASS_StreamCreateFile(false, fileNameBuffer, 0, 0, 0).then(
  (handle: number) => {
    let bassError = BASS_ErrorGetCode();

    if (bassError != BASS_OK) {
      console.log("Error while opening Stream: ");
      console.log(ErrorCodeToString(bassError));
      console.log("Handle: ", handle);
    } else {
      console.log("Opened Stream File!");
      console.log("Stream Handle: ", handle.toString(16));
      play(handle);
    }
  },
  (_createError) => {
    console.log("Something unexpected happened!?: ", _createError);
  }
);

function play(streamHandle: number) {
  // Set volume for the playing channel stream
  if (!BASS_ChannelSetAttribute(streamHandle, BASS_ATTRIB_VOL, 0.5)) {
    console.error("Could not set the channels volume!");
  }
  let retval = BASS_GetConfig(BASS_CONFIG_HANDLES);
  console.log("Open Stream handles: ", retval);
  if (BASS_ChannelPlay(streamHandle, true)) {
    console.log("Playing audio.");
  } else {
    console.log(
      "Could not play channel: ",
      ErrorCodeToString(BASS_ErrorGetCode())
    );
  }
  console.log("Press <Ctrl+C> to exit!");
  let id3v1Pointer: Deno.UnsafePointer = BASS_ChannelGetTags(
    streamHandle,
    BASS_TAG_ID3
  );
  const tagError = GetBASSErrorCode();
  if (tagError != ERROR_MAP.get(BASS_OK)) {
    console.log("Error while reading tag: ", tagError);
  } else {
    console.log("Read id3 tag from mp3 file!");
    const metaData = new ID3v1Struct(id3v1Pointer);
    console.log("Album: ", metaData.Album);
    console.log("Artist: ", metaData.Artist);
    console.log("Title: ", metaData.Title);
    console.log("Year: ", metaData.Year);
    console.log("Comment: ", metaData.Comment);
  }

  while (true) {}
  BASS_ChannelStop(streamHandle);
  BASS_ChannelFree(streamHandle);
  BASS_Free();
  library.close();
}
