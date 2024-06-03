// BASS Channel flags
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

// BASS Device flags

// The device is enabled. It will not be possible to initialize the device if this flag is not present.
export const BASS_DEVICE_ENABLED = 1;
// The device is the system default.
export const BASS_DEVICE_DEFAULT = 2;
// The device is initialized, ie. BASS_Init or BASS_RecordInit has been called.
export const BASS_DEVICE_INIT = 4;
// The device is a loopback recording device; it captures the sound from an output device. The corresponding output device can be identified by having the same driver value.
// The type of device may also be indicated in the high 8 bits (use BASS_DEVICE_TYPE_MASK to test), and can be one of the following. BASS_DEVICE_TYPE_DIGITAL An audio endpoint device that connects to an audio adapter through a connector for a digital interface of unknown type.
export const BASS_DEVICE_LOOPBACK = 8;
// The device is the system default communication device.
export const BASS_DEVICE_DEFAULTCOM = 128;
// An audio endpoint device that connects to an audio adapter through a DisplayPort connector.
export const BASS_DEVICE_TYPE_DISPLAYPORT = 0x40000000;
// The part of a telephone that is held in the hand and that contains a speaker and a microphone for two-way communication.
export const BASS_DEVICE_TYPE_HANDSET = 0x07000000;
// An audio endpoint device that connects to an audio adapter through a High-Definition Multimedia Interface (HDMI) connector.
export const BASS_DEVICE_TYPE_HDMI = 0x0a000000;
// A set of headphones.
export const BASS_DEVICE_TYPE_HEADPHONES = 0x04000000;
// An earphone or a pair of earphones with an attached mouthpiece for two-way communication.
export const BASS_DEVICE_TYPE_HEADSET = 0x06000000;
export const BASS_DEVICE_TYPE_DIGITAL = 0x08000000;
// An audio endpoint device that sends a line-level analog signal to a line-input jack on an audio adapter or that receives a line-level analog signal from a line-output jack on the adapter.
export const BASS_DEVICE_TYPE_LINE = 0x03000000;
// A microphone.
export const BASS_DEVICE_TYPE_MICROPHONE = 0x05000000;
// An audio endpoint device that the user accesses remotely through a network.
export const BASS_DEVICE_TYPE_NETWORK = 0x01000000;
// An audio endpoint device that connects to an audio adapter through a Sony/Philips Digital Interface (S/PDIF) connector.
export const BASS_DEVICE_TYPE_SPDIF = 0x09000000;
// A set of speakers.
export const BASS_DEVICE_TYPE_SPEAKERS = 0x02000000;
