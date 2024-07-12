import { BASS_ChannelGetAttribute, BASS_ErrorGetCode } from "./bindings.ts";
import { Errors, Flags, Types } from "./mod.ts";

// C like lambdas
export const HIWORD = (x: number) => x & 0xffff0000;
export const LOWORD = (x: number) => x & 0x0000ffff;

export const ToCString = (x: string) => new TextEncoder().encode(x + "\0");

// Error handling
export const GetBASSErrorCode = () => {
  const error = BASS_ErrorGetCode();
  return ErrorCodeToString(error);
};

// Lambdas for testing audio device flags
export const IsMicrophone = (x: Types.DeviceInfo) =>
  Boolean(x.Flags & Flags.BASS_DEVICE_TYPE_MICROPHONE);
export const IsHeadphone = (x: Types.DeviceInfo) =>
  Boolean(x.Flags & Flags.BASS_DEVICE_TYPE_HEADPHONES);
export const IsEnabled = (x: Types.DeviceInfo) =>
  Boolean(x.Flags & Flags.BASS_DEVICE_ENABLED);
export const CreatePointerX64 = (data: Uint8Array, offset: number) => {
  // Create a 64-Bit Pointer based on the array buffer
  return Deno.UnsafePointer.create(
    new BigUint64Array(data.subarray(offset, offset + 8).buffer)[0]
  ) as Deno.PointerObject;
};

// Query Channel Flag
export const QueryChannelAttributeValue = (
  streamHandle: number,
  attrib: number
) => {
  let retval = 0.0;
  let out = new Uint8Array(8);
  if (BASS_ChannelGetAttribute(streamHandle, attrib, out)) {
    retval = new DataView(out.buffer).getFloat32(0, true);
  }
  return retval.toFixed(2);
};

// Error code lambdas
export const ErrorCodeToString = (errorCode: number) =>
  Errors.ERROR_MAP.get(errorCode);
