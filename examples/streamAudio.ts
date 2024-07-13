/*
 *  This example shows how to play a MP3 audio file.
 *
 */

import {
  BASS_ChannelBytes2Seconds,
  BASS_ChannelFlags,
  BASS_ChannelFree,
  BASS_ChannelGetAttributeEx,
  BASS_ChannelGetLength,
  BASS_ChannelGetPosition,
  BASS_ChannelPlay,
  BASS_ChannelSetAttribute,
  BASS_ChannelSetAttributeEx,
  BASS_ChannelStop,
  BASS_ErrorGetCode,
  BASS_Free,
  BASS_GetConfig,
  BASS_Init,
  BASS_SetConfig,
  BASS_StreamCreateFile,
  library,
} from "../lib/bindings.ts";
import {
  BASS_ATTRIB_BITRATE,
  BASS_ATTRIB_FREQ,
  BASS_ATTRIB_USER,
  BASS_ATTRIB_VOL,
} from "../lib/channelAttributes.ts";
import { BASS_OK } from "../lib/errors.ts";
import { BASS_DEVICE_STEREO, BASS_SAMPLE_LOOP } from "../lib/flags.ts";
import { BASS_POS_BYTE } from "../lib/modes.ts";
import { BASS_CONFIG_UNICODE, BASS_CONFIG_HANDLES } from "../lib/options.ts";
import { ID3v1Tag } from "../lib/types/ID3v1Tag.ts";
import {
  ErrorCodeToString,
  QueryChannelAttributeValue,
  ToCString,
  UInt8BufferToString,
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
  if (!BASS_ChannelSetAttribute(streamHandle, BASS_ATTRIB_VOL, 0.4)) {
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

  // Try to write user data to a channel
  const userDataWritten = ToCString("FOOBAR");
  let userDataRead = new Uint8Array(userDataWritten.length);
  writeUserDataToChannel(streamHandle, userDataWritten);

  // Try to read user data from a channel
  const returnedDataSize = readUserDataFromChannel(
    streamHandle,
    userDataRead,
    userDataWritten.length
  );
  console.log(
    "Written bytes of user data to channel: ",
    userDataWritten.length
  );
  console.log("Read user data bytes from channel: ", returnedDataSize);
  const userDataString = UInt8BufferToString(userDataRead);
  console.log("Read user data from channel: ", userDataString);

  console.log("Reading ID3v1 tag from MP3 file!");
  const metaData = new ID3v1Tag(streamHandle);
  console.log("Album: ", metaData.Album);
  console.log("Artist: ", metaData.Artist);
  console.log("Title: ", metaData.Title);
  console.log("Year: ", metaData.Year);
  console.log("Comment: ", metaData.Comment);
  console.log("Genre ID: ", metaData.GenreId);
  console.log("Genre: ", metaData.Genre);
  let playBackLength = BASS_ChannelGetLength(streamHandle, BASS_POS_BYTE);
  if (playBackLength == -1) {
    console.error(
      "Error while retrieving channels playback position: ",
      ErrorCodeToString(BASS_ErrorGetCode())
    );
    Deno.exit(-1);
  }
  playBackLength = BASS_ChannelBytes2Seconds(streamHandle, playBackLength);
  let step = true;
  let bitrate = QueryChannelAttributeValue(streamHandle, BASS_ATTRIB_BITRATE);
  let frequency = QueryChannelAttributeValue(streamHandle, BASS_ATTRIB_FREQ);
  console.log("Stream Bitrate: ", bitrate, " Frequency: ", frequency);
  while (true) {
    let position = BASS_ChannelGetPosition(streamHandle, BASS_POS_BYTE);
    if (position == -1) {
      console.error(
        "Error while retrieving channels playback position: ",
        ErrorCodeToString(BASS_ErrorGetCode())
      );
    } else {
      let seconds = BASS_ChannelBytes2Seconds(streamHandle, position);
      console.log(
        "Position: ",
        seconds.toFixed(2),
        " / ",
        playBackLength.toFixed(2)
      );
      // After 5 seconds try to activate the loop channel flag
      if (seconds > 5.0 && step) {
        const flags = BASS_ChannelFlags(
          streamHandle,
          BASS_SAMPLE_LOOP,
          BASS_SAMPLE_LOOP
        );
        console.log("WAS LOOP SET: ", Boolean(flags & BASS_SAMPLE_LOOP));
        step = false;
      }
    }
    const end = Date.now() + 1_000;
    while (Date.now() < end);
  }
  BASS_ChannelStop(streamHandle);
  BASS_ChannelFree(streamHandle);
  BASS_Free();
  library.close();
}

function writeUserDataToChannel(streamHandle: number, data: Uint8Array) {
  console.log("Writing user bytes to channel...");

  if (
    !BASS_ChannelSetAttributeEx(
      streamHandle,
      BASS_ATTRIB_USER,
      data,
      data.length
    )
  ) {
    console.error("Error while writing user data to the channel.");
  }
}

function readUserDataFromChannel(
  streamHandle: number,
  out: Uint8Array,
  size: number
) {
  console.log("Reading user bytes from channel...");
  let dataSize = BASS_ChannelGetAttributeEx(
    streamHandle,
    BASS_ATTRIB_USER,
    out,
    size
  );
  if (dataSize == 0)
    console.error("Error while reading user data from the channel.");
  return dataSize;
}
