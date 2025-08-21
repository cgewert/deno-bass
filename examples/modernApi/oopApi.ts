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

const filePath =
  "C:\\Users\\cgewe\\Downloads\\horn_ost_mp3_1409180821\\Horn Original Soundtrack\\Austin Wintory - Horn - 14 The Knighting.mp3";
const filePath2 =
  "C:\\Users\\cgewe\\Downloads\\Danny_Baranowsky-Super_Meat_Boy-Digital_Special_Edition_Soundtrack-MP3\\Danny Baranowsky - Super Meat Boy! - Digital Special Edition Soundtrack - 04 Ballad of the Burning Squirrel (Ch 1 Dark World).mp3";

// Start streaming of a local file
const handle = bass.StreamFromFile(filePath);
if (handle) {
  console.log("Streaming started successfully!");
  // Use Pause() to pause streams, samples or music
  bass.Pause(handle);
  alert("Press ENTER to start playback!");
  // Use Start() to resume playback
  bass.Start(handle);
  // You can set the device to use for future channel playbacks
  try {
    bass.Frequency = 22050; // You can alter the playback frequency used for future playbacks
    bass.Device = 6;
  } catch (error: unknown) {
    console.error(error);
  } finally {
    // Create a second stream that will be played on the new device
    // This way you can stream multiple files simultaneously on different devices
    const secondHandle = bass.StreamFromFile(filePath2);
    if (secondHandle) {
      console.log(
        "Second streaming started successfully on device " +
          bass.DeviceName +
          "!"
      );
    } else {
      console.log("Failed to start second streaming.");
    }
  }
  alert("Press ENTER to exit the application!");
} else {
  console.log("Failed to start streaming.");
  // Retrieves the last occured errorcode as string
  console.log(bass.GetLastError(true));
}

// Call Free() to release all reserved resources before exiting your application:
bass.Free();
