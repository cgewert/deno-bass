/*
 *  This example shows how to play a MP3 audio file.
 *
 */

import {
  BASS_ChannelBytes2Seconds,
  BASS_ChannelFlags,
  BASS_ChannelFree,
  BASS_ChannelGetAttributeEx,
  BASS_ChannelGetData,
  BASS_ChannelGetDevice,
  BASS_ChannelGetLength,
  BASS_ChannelGetLevelEx,
  BASS_ChannelGetPosition,
  BASS_ChannelIsActive,
  BASS_ChannelIsSliding,
  BASS_ChannelLock,
  BASS_ChannelPlay,
  BASS_ChannelRemoveFX,
  BASS_ChannelSetAttribute,
  BASS_ChannelSetAttributeEx,
  BASS_ChannelSetDevice,
  BASS_ChannelSetFX,
  BASS_ChannelSlideAttribute,
  BASS_ChannelStop,
  BASS_ChannelUpdate,
  BASS_ErrorGetCode,
  BASS_Free,
  BASS_GetConfig,
  BASS_Init,
  BASS_IsStarted,
  BASS_Pause,
  BASS_SetConfig,
  BASS_Start,
  BASS_Stop,
  BASS_StreamCreateFile,
  BASS_Update,
  library,
} from "../lib/bindings.ts";
import {
  BASS_ATTRIB_BITRATE,
  BASS_ATTRIB_FREQ,
  BASS_ATTRIB_USER,
  BASS_ATTRIB_VOL,
} from "../lib/channelAttributes.ts";
import { BASS_OK } from "../lib/errors.ts";
import {
  BASS_DATA_FFT2048,
  BASS_DATA_FFT256,
  BASS_DATA_FLOAT,
  BASS_DEVICE_STEREO,
  BASS_LEVEL_STEREO,
  BASS_SAMPLE_FLOAT,
  BASS_SAMPLE_LOOP,
} from "../lib/flags.ts";
import {
  BASS_FX_DX8_CHORUS,
  BASS_FX_DX8_COMPRESSOR,
  BASS_FX_DX8_ECHO,
  BASS_FX_DX8_GARGLE,
} from "../lib/fx.ts";
import { BASS_POS_BYTE } from "../lib/modes.ts";
import { BASS_CONFIG_UNICODE, BASS_CONFIG_HANDLES } from "../lib/options.ts";
import {
  BASS_ACTIVE_PAUSED,
  BASS_ACTIVE_PAUSED_DEVICE,
  BASS_ACTIVE_PLAYING,
  BASS_ACTIVE_STOPPED,
} from "../lib/retvals.ts";
import { ChannelInfo } from "../lib/types/ChannelInfo.ts";
import { ID3v1Tag } from "../lib/types/ID3v1Tag.ts";
import {
  ErrorCodeToString,
  GetBASSErrorCode,
  QueryChannelAttributeValue,
  ToCString,
  UInt8BufferToString,
} from "../lib/utilities.ts";

BASS_SetConfig(BASS_CONFIG_UNICODE, 1);
let isOutputStartedYet = BASS_Start();
if (!isOutputStartedYet)
  console.log("Output not yet started: ", GetBASSErrorCode());
else console.log("Output started successfully: ", GetBASSErrorCode());
if (BASS_IsStarted() == 0) console.log("Device not started yet...");
else console.log("Device was mysteriously started already!????");

BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
//BASS_Init(2, 44100, BASS_DEVICE_STEREO, 0, null);
console.log("Initialized BASS... ", GetBASSErrorCode());
if (BASS_IsStarted() == 0) console.log("Device not started yet...");
else console.log("Device was successfully started.");

isOutputStartedYet = BASS_Start();
if (!isOutputStartedYet)
  console.log("Output not yet started: ", GetBASSErrorCode());
else console.log("Output started successfully: ", GetBASSErrorCode());

const fileNameBuffer = ToCString(
  // Insert a valid path to your mp3 file here
  "E:/Programmieren/deno-tutorial/ffi/001-c/track.mp3"
);

BASS_StreamCreateFile(false, fileNameBuffer, 0, 0, BASS_SAMPLE_FLOAT).then(
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
  let step = true,
    step2 = true;
  let pauseTimer = 0;
  let bitrate = QueryChannelAttributeValue(streamHandle, BASS_ATTRIB_BITRATE);
  let frequency = QueryChannelAttributeValue(streamHandle, BASS_ATTRIB_FREQ);
  console.log("Stream Bitrate: ", bitrate, " Frequency: ", frequency);
  // Define an array for BASS_DATA_FFT256 float values
  let FFT_Data = new Uint8Array(128 * 4);
  // if (!BASS_ChannelLock(streamHandle, true))
  //   console.error("Could not create lock for streamhandle");
  // else {
  //   console.log("Created a lock for stream!");
  // }

  let handleFX = null;
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
        // if (!BASS_ChannelSetDevice(streamHandle, 6))
        //   console.error("Can't switch device: ", GetBASSErrorCode());
        handleFX = BASS_ChannelSetFX(streamHandle, BASS_FX_DX8_ECHO, 1);

        if (BASS_Update(200)) {
          console.log("Channels playback buffer was updated!");
        } else {
          console.error("Error updating playback buffer.");
          console.error(GetBASSErrorCode());
        }
        const flags = BASS_ChannelFlags(
          streamHandle,
          BASS_SAMPLE_LOOP,
          BASS_SAMPLE_LOOP
        );
        console.log("WAS LOOP SET: ", Boolean(flags & BASS_SAMPLE_LOOP));
        step = false;
        // Pause device playback after 5 seconds of playback.
        // BASS_Pause();
        pauseTimer = Date.now();
      }
      if (Date.now() > pauseTimer + 3_000 && step2 && !step) {
        step2 = false;
        //BASS_ChannelSetDevice(streamHandle, 1);
        BASS_ChannelRemoveFX(streamHandle, handleFX);
        BASS_FX_DX8_GARGLE;
        // Resume device playback after 8 seconds.
        BASS_Start();
        // Interpolate channels volume to a low level.
        BASS_ChannelSlideAttribute(
          streamHandle,
          BASS_ATTRIB_VOL,
          0.3,
          5 * 1000
        );
        const channelInfo = new ChannelInfo(streamHandle);
        console.log("Channel Info Frequency: ", channelInfo.Frequency);
        console.log(
          "Channel Info ChannelType: ",
          channelInfo.ChannelType.toString(16)
        );
        console.log("Channel Info File: ", channelInfo.Filename);
        console.log("Channel Info Flags: ", channelInfo.Flags.toString(16));
        console.log("Channel Info Audio Channels: ", channelInfo.Channels);
        console.log(
          "Channel Info Original Resolution: ",
          channelInfo.OriginalResolution
        );
      }
    }
    const end = Date.now() + 1_000;
    while (Date.now() < end);

    // Query channels FFT data
    BASS_ChannelGetData(streamHandle, FFT_Data, BASS_DATA_FFT256);
    //console.log("FFT Data: ", FFT_Data);

    // Check channels active state
    const isActive = BASS_ChannelIsActive(streamHandle);
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

    // Check for sliding attribs
    const isSliding = BASS_ChannelIsSliding(streamHandle, BASS_ATTRIB_VOL);
    console.log("Volume is sliding? ", isSliding);

    // Check which device is being used by playback channel
    let device_idx = -1;
    if ((device_idx = BASS_ChannelGetDevice(streamHandle)) == -1) {
      console.error("Querying channels device was not successful.");
    } else {
      console.log("Device number used by playback channel: ", device_idx);
    }

    // Test BASS_ChannelGetLevelEx
    const levelBuffer = new Uint8Array(2);
    if (
      BASS_ChannelGetLevelEx(streamHandle, levelBuffer, 1.0, BASS_LEVEL_STEREO)
    ) {
      console.log(
        "Volume levels: LEFT[",
        levelBuffer[0],
        "] RIGHT[",
        levelBuffer[1],
        "]"
      );
    } else {
      console.error("No volume");
    }
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
