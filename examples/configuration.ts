/*
 *  This example shows how to read or set bass configuration settings.
 */

import {
  BASS_GetConfig,
  BASS_GetConfigPtr,
  BASS_SetConfig,
  BASS_SetConfigPtr,
} from "../lib/bindings.ts";
import { Options } from "../lib/mod.ts";
import { PointerToString, ToCString } from "../lib/utilities.ts";

// Reading the desired UNICODE configuration value => Should be 0 by default
let configValue: number = BASS_GetConfig(Options.BASS_CONFIG_UNICODE);
console.log(
  "Before setting the value its old value is: ",
  configValue.toString(16)
);

// Overriding the User Agent default value

BASS_SetConfigPtr(
  Options.BASS_CONFIG_NET_AGENT,
  ToCString("dexter_coding/1.0")
);

// Reading the User Agent config value
let userAgent: string = PointerToString(
  BASS_GetConfigPtr(Options.BASS_CONFIG_NET_AGENT) as Deno.PointerObject
);
console.log("User-Agent: ", userAgent);

// Writing a new value 1 to the UNICODE configuration
BASS_SetConfig(Options.BASS_CONFIG_UNICODE, 1);

// Reading the set UNICODE value again => Should be 1 now
configValue = BASS_GetConfig(Options.BASS_CONFIG_UNICODE);
console.log(
  "After setting the value its new value is: ",
  configValue.toString(16)
);
