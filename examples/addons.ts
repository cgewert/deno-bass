/* Loading addons and parsing info from them. */

import { BASS_Init, BASS_PluginLoad } from "../lib/bindings.ts";
import { BASS_DEVICE_STEREO } from "../lib/flags.ts";
import { GetBASSErrorCode, ToCString } from "../lib/utilities.ts";
import { SEPARATOR } from "std/path/mod.ts";

const defaultDevice = -1;
const frequency = 44100;
const windowHandle = 0;

let success = BASS_Init(
  defaultDevice,
  frequency,
  BASS_DEVICE_STEREO,
  windowHandle,
  null
);

const cwd = Deno.cwd() + SEPARATOR;
const ADDON_FILENAME = cwd + "bassloud.dll/";
console.log("Addon File: ", ADDON_FILENAME);
let handle = BASS_PluginLoad(ToCString(ADDON_FILENAME), 0);

if (handle != 0) {
  // Plugin successfully loaded.
  console.log("Loaded Plugin: ", ADDON_FILENAME);
} else {
  console.error("Could not load plugin.");
  console.error(GetBASSErrorCode());
}
