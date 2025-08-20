/*
    This example demonstrates how to make use of the deno-bass OOP API.
*/
import { BASS } from "../../lib/oop/bass.ts";

// Create an instance of the BASS class, this will automatically initialize bass on the current thread.
const bass = new BASS();

// You can suppress or activate console output by setting IsVerbose (defaults to true)
bass.IsVerbose = true;

// Retrieve BASS information from the class instance
console.log("BASS CPU Usage: " + bass.CPU);
console.log("BASS Library Filename: " + bass.FileName);
console.log("BASS Device Name: " + bass.DeviceName);
console.log("Device started? " + bass.HasDeviceStarted);

// Start streaming of a local file
const filePath =
  "C:\\Users\\cgewe\\Downloads\\horn_ost_mp3_1409180821\\Horn Original Soundtrack\\Austin Wintory - Horn - 14 The Knighting.mp3";

const success = bass.StreamFromFile(filePath);
if (success) {
  console.log("Streaming started successfully!");
  alert("Press ENTER to exit!");
} else {
  console.log("Failed to start streaming.");
  // Retrieves the last occured errorcode as string
  console.log(bass.GetLastError(true));
}

// Call Free() to release all reserved resources before exiting your application:
bass.Free();
