/*
 *  This example shows how to retrieve the library version.
 *  The HIWORD and LOWORD macros can be used to get Major Version or the Patch Version only.
 */

import { BASS_GetVersion } from "../../lib/bindings.ts";
import { HIWORD, LOWORD } from "../../lib/utilities.ts";

// Example for GetVersion usage
const version = BASS_GetVersion();
console.log("Retrieved BASS Version: ", version.toString(16));
console.log("HIWORD: ", HIWORD(version).toString(16));
console.log("LOWORD: ", LOWORD(version).toString(16));
