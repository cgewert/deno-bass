// These types can be set on a playback channel.
// Use BASS_ChannelGetInfo to query a channels type.

// BASS_CHANNELINFO types
export const BASS_CTYPE_SAMPLE = 1;
export const BASS_CTYPE_RECORD = 2;
export const BASS_CTYPE_STREAM = 0x10000;
export const BASS_CTYPE_STREAM_VORBIS = 0x10002;
export const BASS_CTYPE_STREAM_OGG = 0x10002;
export const BASS_CTYPE_STREAM_MP1 = 0x10003;
export const BASS_CTYPE_STREAM_MP2 = 0x10004;
export const BASS_CTYPE_STREAM_MP3 = 0x10005;
export const BASS_CTYPE_STREAM_AIFF = 0x10006;
export const BASS_CTYPE_STREAM_CA = 0x10007;
export const BASS_CTYPE_STREAM_MF = 0x10008;
export const BASS_CTYPE_STREAM_AM = 0x10009;
export const BASS_CTYPE_STREAM_SAMPLE = 0x1000a;
export const BASS_CTYPE_STREAM_DUMMY = 0x18000;
export const BASS_CTYPE_STREAM_DEVICE = 0x18001;
export const BASS_CTYPE_STREAM_WAV = 0x40000; // WAVE flag (LOWORD=codec)
export const BASS_CTYPE_STREAM_WAV_PCM = 0x50001;
export const BASS_CTYPE_STREAM_WAV_FLOAT = 0x50003;
export const BASS_CTYPE_MUSIC_MOD = 0x20000;
export const BASS_CTYPE_MUSIC_MTM = 0x20001;
export const BASS_CTYPE_MUSIC_S3M = 0x20002;
export const BASS_CTYPE_MUSIC_XM = 0x20003;
export const BASS_CTYPE_MUSIC_IT = 0x20004;
export const BASS_CTYPE_MUSIC_MO3 = 0x00100; // MO3 flag

// Hashmap, mapping channel types to string representations
export const CHANNELTYPE_MAP: Map<number, string> = new Map([
  [BASS_CTYPE_STREAM_VORBIS, "OGG VORBIS"],
  [BASS_CTYPE_STREAM_MP1, "MPEG Layer 1"],
  [BASS_CTYPE_STREAM_MP2, "MPEG Layer 2"],
  [BASS_CTYPE_STREAM_MP3, "MPEG Layer 3"],
  [BASS_CTYPE_STREAM_AIFF, "Audio Interchange File Format"],
  [BASS_CTYPE_STREAM_WAV, "RIFF Wave / PCM RAW"],
]);
