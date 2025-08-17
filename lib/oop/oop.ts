import { BASS_GetDeviceInfo } from "../bindings.ts";
import { DeviceInfo } from "../types/mod.ts";

export const DESKTOP_WINDOW_HANDLE = 0;

/**
 * Returns the name of the audio device identified by its device id.
 * @param device number
 * @returns A string containing a human readable device name.
 */
export function GetDeviceName(device: number): string {
  const deviceInfo = GetDeviceInfo(device);
  return deviceInfo.Name.substring(0);
}

export function GetDeviceInfo(device: number): DeviceInfo {
  const deviceInfo = new DeviceInfo(device);
  BASS_GetDeviceInfo(device, deviceInfo.Infostruct);
  deviceInfo.readValuesFromStruct();
  return deviceInfo;
}
