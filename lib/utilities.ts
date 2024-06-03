// Utility lambdas mimicking c macros

import {
  BASS_DEVICE_ENABLED,
  BASS_DEVICE_TYPE_HEADPHONES,
  BASS_DEVICE_TYPE_MICROPHONE,
} from "./flags.ts";
import { DeviceInfo } from "./types/DeviceInfo.ts";

export const HIWORD = (x: number) => x & 0xffff0000;
export const LOWORD = (x: number) => x & 0x0000ffff;

// Lambdas for testing audio device flags
export const IsMicrophone = (x: DeviceInfo) =>
  Boolean(x.Flags & BASS_DEVICE_TYPE_MICROPHONE);
export const IsHeadphone = (x: DeviceInfo) =>
  Boolean(x.Flags & BASS_DEVICE_TYPE_HEADPHONES);
export const IsEnabled = (x: DeviceInfo) =>
  Boolean(x.Flags & BASS_DEVICE_ENABLED);
