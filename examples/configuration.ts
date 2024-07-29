/*
 *  This example shows how to read or set bass configuration settings.
 */

import { BASS_GetConfig, BASS_SetConfig } from "../lib/bindings.ts";
import { Options } from "../lib/mod.ts";

// Reading the desired configuration value => Should be 0 by default
let configValue: number = BASS_GetConfig(Options.BASS_CONFIG_UNICODE);
console.log(
  "Before setting the value its old value is: ",
  configValue.toString(16)
);

// Writing a new value 1 to the configuration
BASS_SetConfig(Options.BASS_CONFIG_UNICODE, 1);

// Reading the set value again => Should be 1 now
configValue = BASS_GetConfig(Options.BASS_CONFIG_UNICODE);
console.log(
  "After setting the value its new value is: ",
  configValue.toString(16)
);
