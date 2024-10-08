// BASS_ChannelGetLength / GetPosition / SetPosition modes
export const BASS_POS_BYTE = 0; // byte position
export const BASS_POS_MUSIC_ORDER = 1; // order.row position, MAKELONG(order,row)
export const BASS_POS_OGG = 3; // OGG bitstream number
export const BASS_POS_END = 0x10; // trimmed end position
export const BASS_POS_LOOP = 0x11; // loop start positiom
export const BASS_POS_FLUSH = 0x1000000; // flag: flush decoder/FX buffers
export const BASS_POS_RESET = 0x2000000; // flag: reset user file buffers
export const BASS_POS_RELATIVE = 0x4000000; // flag: seek relative to the current position
export const BASS_POS_INEXACT = 0x8000000; // flag: allow seeking to inexact position
export const BASS_POS_DECODE = 0x10000000; // flag: get the decoding (not playing) position
export const BASS_POS_DECODETO = 0x20000000; // flag: decode to the position instead of seeking
export const BASS_POS_SCAN = 0x40000000; // flag: scan to the position

// BASS_StreamGetFilePosition modes
export const BASS_FILEPOS_CURRENT = 0;
export const BASS_FILEPOS_DECODE = BASS_FILEPOS_CURRENT;
export const BASS_FILEPOS_DOWNLOAD = 1;
export const BASS_FILEPOS_END = 2;
export const BASS_FILEPOS_START = 3;
export const BASS_FILEPOS_CONNECTED = 4;
export const BASS_FILEPOS_BUFFER = 5;
export const BASS_FILEPOS_SOCKET = 6;
export const BASS_FILEPOS_ASYNCBUF = 7;
export const BASS_FILEPOS_SIZE = 8;
export const BASS_FILEPOS_BUFFERING = 9;
export const BASS_FILEPOS_AVAILABLE = 10;

export enum StreamConnectionStatus {
  NOT_CONNECTED = 0,
  CONNECTED = 1,
  RECONNECTING = 2,
}
