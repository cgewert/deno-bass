// BASS Channel flags
export const BASS_SAMPLE_8BITS = 1; // 8 bits
export const BASS_SAMPLE_FLOAT = 256; // 32 bit floating-point
export const BASS_SAMPLE_MONO = 2; // mono
export const BASS_SAMPLE_LOOP = 4; // looped
export const BASS_SAMPLE_3D = 8; // 3D functionality
export const BASS_SAMPLE_SOFTWARE = 16; // unused
export const BASS_SAMPLE_MUTEMAX = 32; // mute at max distance (3D only)
export const BASS_SAMPLE_VAM = 64; // unused
export const BASS_SAMPLE_FX = 128; // unused
export const BASS_SAMPLE_OVER_VOL = 0x10000; // override lowest volume
export const BASS_SAMPLE_OVER_POS = 0x20000; // override longest playing
export const BASS_SAMPLE_OVER_DIST = 0x30000; // override furthest from listener (3D only)

export const BASS_STREAM_PRESCAN = 0x20000; // scan file for accurate seeking and length
export const BASS_STREAM_AUTOFREE = 0x40000; // automatically free the stream when it stops/ends
export const BASS_STREAM_RESTRATE = 0x80000; // restrict the download rate of internet file stream

export const BASS_MUSIC_AUTOFREE = BASS_STREAM_AUTOFREE; // Automatically free the music when playback ends. Note that some musics have infinite loops, so never actually end on their own.
export const BASS_MUSIC_NONINTER = 0x10000; // non-interpolated sample mixing
export const BASS_MUSIC_SINCINTER = 0x800000; // sinc interpolated sample mixing
export const BASS_MUSIC_POSRESET = 0x8000; // stop all notes when moving position
export const BASS_MUSIC_POSRESETEX = 0x400000; // stop all notes and reset bmp/etc when moving position
export const BASS_MUSIC_STOPBACK = 0x80000; // stop the music on a backwards jump effect
export const BASS_MUSIC_RAMP = 0x200; // normal ramping
export const BASS_MUSIC_RAMPS = 0x400; // sensitive ramping
export const BASS_MUSIC_SURROUND = 0x800; // surround sound
export const BASS_MUSIC_SURROUND2 = 0x1000; // surround sound (mode 2)
export const BASS_MUSIC_FT2MOD = 0x2000; // play .MOD as FastTracker 2 does
export const BASS_MUSIC_PT1MOD = 0x4000; // play .MOD as ProTracker 1 does

export const BASS_STREAMPROC_END = 0x80000000; // end of user stream flag

// BASS_ChannelGetData flags
export const BASS_DATA_AVAILABLE = 0; // query how much data is buffered
export const BASS_DATA_NOREMOVE = 0x10000000; // flag: don't remove data from recording buffer
export const BASS_DATA_FIXED = 0x20000000; // unused
export const BASS_DATA_FLOAT = 0x40000000; // flag: return floating-point sample data
export const BASS_DATA_FFT256 = 0x80000000; // 256 sample FFT
export const BASS_DATA_FFT512 = 0x80000001; // 512 FFT
export const BASS_DATA_FFT1024 = 0x80000002; // 1024 FFT
export const BASS_DATA_FFT2048 = 0x80000003; // 2048 FFT
export const BASS_DATA_FFT4096 = 0x80000004; // 4096 FFT
export const BASS_DATA_FFT8192 = 0x80000005; // 8192 FFT
export const BASS_DATA_FFT16384 = 0x80000006; // 16384 FFT
export const BASS_DATA_FFT32768 = 0x80000007; // 32768 FFT
export const BASS_DATA_FFT_INDIVIDUAL = 0x10; // FFT flag: FFT for each channel, else all combined
export const BASS_DATA_FFT_NOWINDOW = 0x20; // FFT flag: no Hanning window
export const BASS_DATA_FFT_REMOVEDC = 0x40; // FFT flag: pre-remove DC bias
export const BASS_DATA_FFT_COMPLEX = 0x80; // FFT flag: return complex data
export const BASS_DATA_FFT_NYQUIST = 0x100; // FFT flag: return extra Nyquist value

// BASS_ChannelGetLevelEx flags
export const BASS_LEVEL_MONO = 1; // get mono level
export const BASS_LEVEL_STEREO = 2; // get stereo level
export const BASS_LEVEL_RMS = 4; // get RMS levels
export const BASS_LEVEL_VOLPAN = 8; // apply VOL/PAN attributes to the levels
export const BASS_LEVEL_NOREMOVE = 16; // don't remove data from recording buffer

// Speaker assignment flags
export const BASS_SPEAKER_LEFT = 0x10000000; // modifier: left
export const BASS_SPEAKER_RIGHT = 0x20000000; // modifier: right
export const BASS_SPEAKER_FRONT = 0x1000000; // front speakers
export const BASS_SPEAKER_REAR = 0x2000000; // rear speakers
export const BASS_SPEAKER_CENLFE = 0x3000000; // center & LFE speakers (5.1)
export const BASS_SPEAKER_SIDE = 0x4000000; // side speakers (7.1)
export const BASS_SPEAKER_FRONTLEFT = BASS_SPEAKER_FRONT | BASS_SPEAKER_LEFT;
export const BASS_SPEAKER_FRONTRIGHT = BASS_SPEAKER_FRONT | BASS_SPEAKER_RIGHT;
export const BASS_SPEAKER_REARLEFT = BASS_SPEAKER_REAR | BASS_SPEAKER_LEFT;
export const BASS_SPEAKER_REARRIGHT = BASS_SPEAKER_REAR | BASS_SPEAKER_RIGHT;
export const BASS_SPEAKER_CENTER = BASS_SPEAKER_CENLFE | BASS_SPEAKER_LEFT;
export const BASS_SPEAKER_LFE = BASS_SPEAKER_CENLFE | BASS_SPEAKER_RIGHT;
export const BASS_SPEAKER_SIDELEFT = BASS_SPEAKER_SIDE | BASS_SPEAKER_LEFT;
export const BASS_SPEAKER_SIDERIGHT = BASS_SPEAKER_SIDE | BASS_SPEAKER_RIGHT;

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

// BASS_ChannelSlideAttribute flags
export const BASS_SLIDE_LOG = 0x1000000;
