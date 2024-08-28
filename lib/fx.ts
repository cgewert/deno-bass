/* 
  IMPORTANT NOTE:  
  On Windows all FX effects are supported,
  on other platforms all effects will be software emulated,
  except for COMPRESSOR, GARGLE, and I3DL2REVERB which are not supported.
*/

// BASS_ChannelSetFX effect types
export const BASS_FX_DX8_CHORUS = 0;
export const BASS_FX_DX8_COMPRESSOR = 1;
export const BASS_FX_DX8_DISTORTION = 2;
export const BASS_FX_DX8_ECHO = 3;
export const BASS_FX_DX8_FLANGER = 4;
export const BASS_FX_DX8_GARGLE = 5;
export const BASS_FX_DX8_I3DL2REVERB = 6;
export const BASS_FX_DX8_PARAMEQ = 7;
export const BASS_FX_DX8_REVERB = 8;
export const BASS_FX_VOLUME = 9;

export const BASS_DX8_PHASE_NEG_180 = 0;
export const BASS_DX8_PHASE_NEG_90 = 1;
export const BASS_DX8_PHASE_ZERO = 2;
export const BASS_DX8_PHASE_90 = 3;
export const BASS_DX8_PHASE_180 = 4;

export enum AudioEffect {
  FX_DX8_CHORUS = BASS_FX_DX8_CHORUS,
  FX_DX8_COMPRESSOR = BASS_FX_DX8_COMPRESSOR,
  FX_DX8_DISTORTION = BASS_FX_DX8_DISTORTION,
  FX_DX8_ECHO = BASS_FX_DX8_ECHO,
  FX_DX8_FLANGER = BASS_FX_DX8_FLANGER,
  FX_DX8_GARGLE = BASS_FX_DX8_GARGLE,
  FX_DX8_I3DL2REVERB = BASS_FX_DX8_I3DL2REVERB,
  FX_DX8_PARAMEQ = BASS_FX_DX8_PARAMEQ,
  FX_DX8_REVERB = BASS_FX_DX8_REVERB,
  FX_VOLUME = BASS_FX_VOLUME,
}

export class AudioEffectEcho {
  private _datastruct: Uint8Array;

  // Ratio of wet (processed) signal to dry (unprocessed) signal. Must be in the range from 0 through 100 (all wet). The default value is 50.
  private _wetDryMix: number;
  // Percentage of output fed back into input, in the range from 0 through 100. The default value is 50.
  private _feedback: number;
  // Delay for left channel, in milliseconds, in the range from 1 through 2000. The default value is 500 ms.
  private _leftDelay: number;
  // Delay for right channel, in milliseconds, in the range from 1 through 2000. The default value is 500 ms.
  private _rightDelay: number;
  // Value that specifies whether to swap left and right delays with each successive echo. The default value is FALSE, meaning no swap.
  private _panDelay: boolean;

  public static SIZE = 20;

  public static OFFSET_WETDRYMIX = 0;
  public static OFFSET_FEEDBACK = 4;
  public static OFFSET_LEFTDELAY = 8;
  public static OFFSET_RIGHTDELAY = 12;
  public static OFFSET_PANDELAY = 16;

  public get WetDryMix() {
    return this._wetDryMix;
  }
  public get Feedback() {
    return this._feedback;
  }
  public get LeftDelay() {
    return this._leftDelay;
  }
  public get RightDelay() {
    return this._rightDelay;
  }
  public get PanDelay() {
    return this._panDelay;
  }

  constructor() {
    this._datastruct = new Uint8Array(AudioEffectEcho.SIZE);
    this._wetDryMix = 0.0;
    this._feedback = 0.0;
    this._leftDelay = 0.0;
    this._rightDelay = 0.0;
    this._panDelay = false;
  }

  public get DataStruct() {
    return this._datastruct;
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const pointer = Deno.UnsafePointer.of(
      this._datastruct
    ) as Deno.PointerObject;
    const dataView = new Deno.UnsafePointerView(pointer);

    this._wetDryMix = dataView.getFloat32(AudioEffectEcho.OFFSET_WETDRYMIX);
    this._feedback = dataView.getFloat32(AudioEffectEcho.OFFSET_FEEDBACK);
    this._leftDelay = dataView.getFloat32(AudioEffectEcho.OFFSET_LEFTDELAY);
    this._rightDelay = dataView.getFloat32(AudioEffectEcho.OFFSET_RIGHTDELAY);
    this._panDelay = dataView.getBool(AudioEffectEcho.OFFSET_PANDELAY);
  }

  public toString() {
    return `
      <AudioEffectEcho>:{
        ${this._wetDryMix},
        ${this._feedback},
        ${this._leftDelay},
        ${this._rightDelay},
        ${this._panDelay}
      }
    `;
  }
}

export class AudioEffectChorus {
  private _datastruct: Uint8Array;
  // Ratio of wet (processed) signal to dry (unprocessed) signal. Must be in the range from 0 through 100 (all wet). The default value is 50.
  private _wetDryMix: number;
  // Percentage by which the delay time is modulated by the low-frequency oscillator (LFO). Must be in the range from 0 through 100. The default value is 10.
  private _depth: number;
  //Percentage of output signal to feed back into the effect's input, in the range from -99 to 99. The default value is 25.
  private _feedback: number;
  // Frequency of the LFO, in the range from 0 to 10. The default value is 1.1.
  private _frequency: number;
  // Waveform of the LFO : 0 = triangle, 1 = sine. By default, the waveform is sine.
  private _waveForm: number;
  // Number of milliseconds the input is delayed before it is played back, in the range from 0 to 20. The default value is 16 ms.
  private _delay: number;
  // Phase differential between left and right LFOs, one of BASS_DX8_PHASE_NEG_180, BASS_DX8_PHASE_NEG_90, BASS_DX8_PHASE_ZERO, BASS_DX8_PHASE_90 and BASS_DX8_PHASE_180. The default value is BASS_DX8_PHASE_90
  private _phase: number;

  public static SIZE = 28;

  public static OFFSET_WETDRYMIX = 0;
  public static OFFSET_DEPTH = 4;
  public static OFFSET_FEEDBACK = 8;
  public static OFFSET_FREQUENCY = 12;
  public static OFFSET_WAVEFORM = 16;
  public static OFFSET_DELAY = 20;
  public static OFFSET_PHASE = 24;

  public get WetDryMix() {
    return this._wetDryMix;
  }
  public get Depth() {
    return this._depth;
  }
  public get Feedback() {
    return this._feedback;
  }
  public get Frequency() {
    return this._frequency;
  }
  public get Waveform() {
    return this._waveForm;
  }
  public get Delay() {
    return this._delay;
  }
  public get Phase() {
    return this._phase;
  }

  constructor() {
    this._datastruct = new Uint8Array(AudioEffectChorus.SIZE);
    this._wetDryMix = 0.0;
    this._feedback = 0.0;
    this._depth = 0.0;
    this._frequency = 0.0;
    this._waveForm = 0;
    this._phase = 0;
    this._delay = 0.0;
  }

  public get DataStruct() {
    return this._datastruct;
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const pointer = Deno.UnsafePointer.of(
      this._datastruct
    ) as Deno.PointerObject;
    const dataView = new Deno.UnsafePointerView(pointer);

    this._wetDryMix = dataView.getFloat32(AudioEffectChorus.OFFSET_WETDRYMIX);
    this._feedback = dataView.getFloat32(AudioEffectChorus.OFFSET_FEEDBACK);
    this._depth = dataView.getFloat32(AudioEffectChorus.OFFSET_DEPTH);
    this._frequency = dataView.getFloat32(AudioEffectChorus.OFFSET_FREQUENCY);
    this._waveForm = dataView.getInt32(AudioEffectChorus.OFFSET_WAVEFORM);
    this._phase = dataView.getInt32(AudioEffectChorus.OFFSET_PHASE);
    this._delay = dataView.getFloat32(AudioEffectChorus.OFFSET_DELAY);
  }

  public toString() {
    return `
      <AudioEffectChorus>:{
        ${this._wetDryMix},
        ${this._feedback},
        ${this._depth},
        ${this._frequency},
        ${this._waveForm},
        ${this._phase},
        ${this._delay}
      }
    `;
  }
}

/* COMPRESSOR */
// typedef struct {
//   float fGain;
//   float fAttack;
//   float fRelease;
//   float fThreshold;
//   float fRatio;
//   float fPredelay;
// } BASS_DX8_COMPRESSOR;

/* DISTORTION */
// typedef struct {
//   float fGain;
//   float fEdge;
//   float fPostEQCenterFrequency;
//   float fPostEQBandwidth;
//   float fPreLowpassCutoff;
// } BASS_DX8_DISTORTION;

// typedef struct {
//   float fWetDryMix;
//   float fDepth;
//   float fFeedback;
//   float fFrequency;
//   DWORD lWaveform;
//   float fDelay;
//   DWORD lPhase;
// } BASS_DX8_FLANGER;

export class AudioEffectGargle {
  private _datastruct: Uint8Array;

  // Rate of modulation, in Hertz. Must be in the range from 1 through 1000. The default value is 20.
  private _rateHz: number;
  // Shape of the modulation waveform... 0 = triangle, 1 = square. By default, the waveform is triangle.
  private _waveShape: number;

  public static SIZE = 8;

  public static OFFSET_RATE_HZ = 0;
  public static OFFSET_WAVE_SHAPE = 4;

  public get RateHz() {
    return this._rateHz;
  }
  public get WaveShape() {
    return this._waveShape;
  }

  constructor() {
    this._datastruct = new Uint8Array(AudioEffectGargle.SIZE);
    this._rateHz = 0;
    this._waveShape = 0;
  }

  public get DataStruct() {
    return this._datastruct;
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const pointer = Deno.UnsafePointer.of(
      this._datastruct
    ) as Deno.PointerObject;
    const dataView = new Deno.UnsafePointerView(pointer);

    this._rateHz = dataView.getInt32(AudioEffectGargle.OFFSET_RATE_HZ);
    this._waveShape = dataView.getInt32(AudioEffectGargle.OFFSET_WAVE_SHAPE);
  }

  public toString() {
    return `
      <AudioEffectGargle>:{
        ${this._rateHz},
        ${this._waveShape}
      }
    `;
  }
}

// typedef struct {
//   int lRoom;
//   int lRoomHF;
//   float flRoomRolloffFactor;
//   float flDecayTime;
//   float flDecayHFRatio;
//   int lReflections;
//   float flReflectionsDelay;
//   int lReverb;
//   float flReverbDelay;
//   float flDiffusion;
//   float flDensity;
//   float flHFReference;
// } BASS_DX8_I3DL2REVERB;

// typedef struct {
//   float fCenter;
//   float fBandwidth;
//   float fGain;
// } BASS_DX8_PARAMEQ;

// typedef struct {
//   float fInGain;
//   float fReverbMix;
//   float fReverbTime;
//   float fHighFreqRTRatio;
// } BASS_DX8_REVERB;

// typedef struct {
//   float fTarget;
//   float fCurrent;
//   float fTime;
//   DWORD lCurve;
// } BASS_FX_VOLUME_PARAM;
