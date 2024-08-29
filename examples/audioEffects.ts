// Demonstrates usage of audio effects on playback channels.

import {
  BASS_ChannelPlay,
  BASS_ChannelRemoveFX,
  BASS_ChannelSetAttribute,
  BASS_ChannelSetFX,
  BASS_FXGetParameters,
  BASS_Init,
  BASS_StreamCreateFile,
} from "../lib/bindings.ts";
import { BASS_ATTRIB_VOL } from "../lib/channelAttributes.ts";
import { BASS_DEVICE_STEREO } from "../lib/flags.ts";
import {
  AudioEffect,
  AudioEffectCompressor,
  AudioEffectDistortion,
} from "../lib/fx.ts";
import { ToCString } from "../lib/utilities.ts";

const VOLUME = 0.03;
// INSERT YOUR OWN FILENAME HERE
const FILENAME = ToCString("./examples/01.mp3");
// Effect handle
let hfx = 0;

BASS_Init(-1, 44100, BASS_DEVICE_STEREO, 0, null);
BASS_StreamCreateFile(false, FILENAME, 0, 0, 0).then((handle: number) => {
  BASS_ChannelSetAttribute(handle, BASS_ATTRIB_VOL, VOLUME);
  play(handle);
});

function play(handle: number) {
  const start = Date.now();
  let step = 0;
  BASS_ChannelPlay(handle, true);
  console.log("Hit CTRL-C to exit!");
  while (true) {
    if (Date.now() > start + 5_000 && step == 0) {
      console.log("Activating ECHO after 5 seconds.");
      // We activate an audio effect on the channel here.
      hfx = activateFX(handle, AudioEffect.FX_DX8_DISTORTION);
      const effectParams = new AudioEffectDistortion();
      // We read the params of an existing channel effect here.
      BASS_FXGetParameters(hfx, effectParams.DataStruct);
      effectParams.readValuesFromStruct();
      console.log("Effect Params: ", effectParams);
      step++;
    }
    if (Date.now() > start + 10_000 && step == 1) {
      console.log("Activating DISTORTION after 10 seconds.");
      hfx = activateFX(handle, AudioEffect.FX_DX8_DISTORTION);
      step++;
    }
    if (Date.now() > start + 15_000 && step == 2) {
      console.log("Activating GARGLE after 15 seconds.");
      hfx = activateFX(handle, AudioEffect.FX_DX8_GARGLE);
      step++;
    }
    if (Date.now() > start + 20_000 && step == 3) {
      console.log("Removing all effects after 20 seconds.");
      BASS_ChannelRemoveFX(handle, hfx);
      step++;
    }
    const end = Date.now() + 1_000;
    while (Date.now() < end);
  }
}

function activateFX(handle: number, effect: number) {
  // Deactivate previous audio effect set on this channel
  if (hfx != 0) BASS_ChannelRemoveFX(handle, hfx);
  // Activate an effect on the channel
  return BASS_ChannelSetFX(handle, effect, 1);
}
