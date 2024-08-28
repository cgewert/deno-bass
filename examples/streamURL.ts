/*
 *  This example shows how to stream a file from internet sources.
 */
import {
  BASS_Init,
  BASS_StreamCreateURL,
  BASS_ChannelPlay,
  BASS_ErrorGetCode,
  BASS_StreamGetFilePosition,
} from "../lib/bindings.ts";
import { BASS_DEVICE_STEREO } from "../lib/flags.ts";
import {
  BASS_FILEPOS_CONNECTED,
  StreamConnectionStatus,
} from "../lib/modes.ts";
import { ToCString, ErrorCodeToString } from "../lib/utilities.ts";

BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
const url = ToCString("http://uk3.internet-radio.com:8405/live");
const streamHandle = BASS_StreamCreateURL(url, 0, 0, null, null);
if (streamHandle == 0) {
  console.log("An error occured while loading the stream! Exiting.");
  console.log("BASS Error Code: ", ErrorCodeToString(BASS_ErrorGetCode()));
}
BASS_ChannelPlay(streamHandle, false);
console.log("Press <Ctrl+C> to quit!");

while (true) {
  var connected =
    BASS_StreamGetFilePosition(streamHandle, BASS_FILEPOS_CONNECTED) ==
    StreamConnectionStatus.CONNECTED;
  console.log("Is stream connected: ", connected);
  const end = Date.now() + 1_000;
  while (Date.now() < end);
}
