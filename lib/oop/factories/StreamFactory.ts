import { BASS_StreamCreateFile } from "../../bindings.ts";
import { BASS_SAMPLE_FLOAT } from "../../flags.ts";
import { ToCString } from "../../utilities.ts";
import { Stream } from "../Stream.ts";

export class StreamFactory {
  static createFileStream(
    filePath: string,
    offset: number = 0,
    length: number = 0,
    flags: number = BASS_SAMPLE_FLOAT
  ): Stream | null {
    const handle = BASS_StreamCreateFile(
      false,
      ToCString(filePath),
      BigInt(offset),
      BigInt(length),
      flags
    );
    if (handle) {
      const stream = new Stream(handle);
      return stream;
    }
    return null;
  }
}
