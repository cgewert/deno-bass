export type HFX = number; // effect handle
export type BASS_INFO = {
  flags: number;
  hwsize: number;
  hwfree: number;
  freesam: number;
  free3d: number;
  minrate: number;
  maxrate: number;
  eax: boolean;
  minbuf: number;
  dsver: number;
  latency: number;
  initflags: number;
  speakers: number;
  freq: number;
};
export type BASS_3DVECTOR = {
  x: number;
  y: number;
  z: number;
};
// type DWORD HMUSIC;		// MOD music handle
// type DWORD HSAMPLE;		// sample handle
// type DWORD HCHANNEL;		// sample playback handle
// type DWORD HSTREAM;		// sample stream handle
// type DWORD HRECORD;		// recording handle
// type DWORD HSYNC;		// synchronizer handle
// type DWORD HDSP;			// DSP handle
// type DWORD HPLUGIN;		// plugin handle
