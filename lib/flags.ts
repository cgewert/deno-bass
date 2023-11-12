// BASS Channel Flags
export const BASS_SAMPLE_FLOAT = 256; // 32 bit floating-point
export const BASS_SAMPLE_LOOP = 4; // looped

// BASS_Init flags
export const BASS_DEVICE_8BITS = 1; // unused
export const BASS_DEVICE_MONO = 2; // mono
export const BASS_DEVICE_3D = 4; // unused
export const BASS_DEVICE_16BITS = 8; // limit output to 16-bit
export const BASS_DEVICE_REINIT = 128; // reinitialize
export const BASS_DEVICE_LATENCY = 0x100; // unused
export const BASS_DEVICE_CPSPEAKERS = 0x400; // unused
export const BASS_DEVICE_SPEAKERS = 0x800; // force enabling of speaker assignment
export const BASS_DEVICE_NOSPEAKER = 0x1000; // ignore speaker arrangement
export const BASS_DEVICE_DMIX = 0x2000; // use ALSA "dmix" plugin
export const BASS_DEVICE_FREQ = 0x4000; // set device sample rate
export const BASS_DEVICE_STEREO = 0x8000; // limit output to stereo
export const BASS_DEVICE_HOG = 0x10000; // hog/exclusive mode
export const BASS_DEVICE_AUDIOTRACK = 0x20000; // use AudioTrack output
export const BASS_DEVICE_DSOUND = 0x40000; // use DirectSound output
export const BASS_DEVICE_SOFTWARE = 0x80000; // disable hardware/fastpath output
