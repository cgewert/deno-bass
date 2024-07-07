/*
 *  This example shows how to stream a file from internet sources.
 */
import {
  BASS_ChannelPlay,
  BASS_DEVICE_STEREO,
  BASS_Init,
  BASS_StreamCreateURL,
  ToCString,
} from "../mod.ts";

BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
const url = ToCString("http://us4.internet-radio.com:8193/stream");
const streamHandle = BASS_StreamCreateURL(url, 0, 0, null, null);
if (streamHandle == 0) {
  console.log("An error occured while loading the stream! Exiting.");
  Deno.exit(-1);
}
BASS_ChannelPlay(streamHandle, false);
console.log("Press <Ctrl+C> to quit!");

while (true) {}
