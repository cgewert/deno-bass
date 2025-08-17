/* Placing a listener in 3D space. */

import {
  BASS_Apply3D,
  BASS_ChannelPlay,
  BASS_ChannelSetAttribute,
  BASS_ErrorGetCode,
  BASS_Init,
  BASS_Set3DFactors,
  BASS_Set3DPosition,
  BASS_StreamCreateFile,
} from "../../lib/bindings.ts";
import { BASS_ATTRIB_VOL } from "../../lib/channelAttributes.ts";
import { BASS_OK } from "../../lib/errors.ts";
import {
  BASS_DEVICE_MONO,
  BASS_SAMPLE_3D,
  BASS_SAMPLE_LOOP,
} from "../../lib/flags.ts";
import { BASS3DVector } from "../../lib/types/BASS3DVector.ts";
import { ChannelInfo } from "../../lib/types/ChannelInfo.ts";
import {
  ErrorCodeToString,
  GetBASSErrorCode,
  ToCString,
} from "../../lib/utilities.ts";

const defaultDevice = -1;
const frequency = 44100;
const windowHandle = 0;
const VOLUME = 25.0;
const INCREMENT = 2.5; // meters per second

BASS_Init(defaultDevice, frequency, BASS_DEVICE_MONO, windowHandle, null);

// Audio source must be monoaural, enter a valid filepath here.
const fileNameBuffer = ToCString("..\\sounds\\bee.mp3");

// Streamed file must be flagged with 3D mode.
BASS_StreamCreateFile(
  false,
  fileNameBuffer,
  BigInt(0),
  BigInt(0),
  BASS_SAMPLE_3D | BASS_SAMPLE_LOOP
).then(
  (handle: number) => {
    let bassError = BASS_ErrorGetCode();

    if (bassError != BASS_OK) {
      console.log("Error while opening Stream: ");
      console.log(ErrorCodeToString(bassError));
    } else {
      console.log("Opened Stream File! Handle: ", handle);
      const channelInfo = new ChannelInfo(handle);
      console.log("Amount of channels: ", channelInfo.Channels);
      play(handle);
    }
  },
  (_createError) => {
    console.log("Something unexpected happened!?: ", _createError);
  }
);

function play(streamHandle: number) {
  // Set metric units, roll off factor and doppler factor
  BASS_Set3DFactors(1.0, 0.5, 1.0);
  BASS_Apply3D();

  // Setting streams volume level
  BASS_ChannelSetAttribute(streamHandle, BASS_ATTRIB_VOL, VOLUME);
  BASS_ChannelPlay(streamHandle, true);

  // Sound emmitter is starting at the right side and is moving to the left side
  const vector = new BASS3DVector(-25, 0, 0);
  //const velocity = new BASS3DVector(100, 0, 0);
  while (true) {
    if (!BASS_Set3DPosition(vector.DataStruct, null, null, null)) {
      console.error("Could not Set 3D Position: ");
      console.error(GetBASSErrorCode());
    }
    // Always call Apply3d after changing 3D attributes of a stream
    BASS_Apply3D();
    console.log("Sleeping 1 sec...");
    const end = Date.now() + 1_000;
    while (Date.now() < end);
    vector.X += INCREMENT;
    vector.Y += INCREMENT;
    console.log("New position: ", vector.Y);
  }
}
