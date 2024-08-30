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

export abstract class BaseAudioEffect {
  protected _datastruct: Uint8Array;

  public abstract SIZE;

  public get DataStruct() {
    return this._datastruct;
  }

  public get DataView() {
    const pointer = Deno.UnsafePointer.of(
      this._datastruct
    ) as Deno.PointerObject;
    return new Deno.UnsafePointerView(pointer);
  }

  public abstract readValuesFromStruct();
  public abstract toString();
}

export class AudioEffectEcho extends BaseAudioEffect {
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

  public SIZE = 20;
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
    super();
    this._datastruct = new Uint8Array(this.SIZE);
    this._wetDryMix = 0.0;
    this._feedback = 0.0;
    this._leftDelay = 0.0;
    this._rightDelay = 0.0;
    this._panDelay = false;
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const dataView = this.DataView;
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

export class AudioEffectChorus extends BaseAudioEffect {
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

  public SIZE = 28;

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
    super();
    this._datastruct = new Uint8Array(this.SIZE);
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
    const dataView = this.DataView;
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

export class AudioEffectCompressor extends BaseAudioEffect {
  // Output gain of signal after compression, in the range from -60 to 60. The default value is 0 dB.
  public _gain: number;
  // Time before compression reaches its full value, in the range from 0.01 to 500. The default value is 10 ms.
  public _attack: number;
  // Speed at which compression is stopped after input drops below fThreshold, in the range from 50 to 3000. The default value is 200 ms.
  public _release: number;
  // Point at which compression begins, in decibels, in the range from -60 to 0. The default value is -20 dB.
  public _threshold: number;
  // Compression ratio, in the range from 1 to 100. The default value is 3, which means 3:1 compression.
  public _ratio: number;
  // Time after fThreshold is reached before attack phase is started, in milliseconds, in the range from 0 to 4. The default value is 4 ms.
  public _predelay: number;

  public SIZE = 24;

  public static OFFSET_GAIN = 0;
  public static OFFSET_ATTACK = 4;
  public static OFFSET_RELEASE = 8;
  public static OFFSET_THRESHOLD = 12;
  public static OFFSET_RATIO = 16;
  public static OFFSET_PREDELAY = 20;

  constructor() {
    super();
    this._datastruct = new Uint8Array(this.SIZE);
    this._gain = 0.0;
    this._attack = 0.0;
    this._release = 0.0;
    this._threshold = 0.0;
    this._ratio = 0.0;
    this._predelay = 0.0;
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const dataView = this.DataView;
    this._gain = dataView.getFloat32(AudioEffectCompressor.OFFSET_GAIN);
    this._attack = dataView.getFloat32(AudioEffectCompressor.OFFSET_ATTACK);
    this._release = dataView.getFloat32(AudioEffectCompressor.OFFSET_RELEASE);
    this._threshold = dataView.getFloat32(
      AudioEffectCompressor.OFFSET_THRESHOLD
    );
    this._ratio = dataView.getFloat32(AudioEffectCompressor.OFFSET_RATIO);
    this._predelay = dataView.getFloat32(AudioEffectCompressor.OFFSET_PREDELAY);
  }

  public toString() {
    return `
      <AudioEffectCompressor>:{
        ${this._gain},
        ${this._attack},
        ${this._release},
        ${this._threshold},
        ${this._ratio},
        ${this._predelay},
      }
    `;
  }
}

export class AudioEffectDistortion extends BaseAudioEffect {
  // Amount of signal change after distortion, in the range from -60 through 0. The default value is -18 dB.
  public _gain = 0.0;
  // Percentage of distortion intensity, in the range in the range from 0 through 100. The default value is 15 percent.
  public _edge = 0.0;
  // Center frequency of harmonic content addition, in the range from 100 through 8000. The default value is 2400 Hz.
  public _postEQCenterFrequency = 0.0;
  // Width of frequency band that determines range of harmonic content addition, in the range from 100 through 8000. The default value is 2400 Hz.
  public _postEQBandwidth = 0.0;
  // Filter cutoff for high-frequency harmonics attenuation, in the range from 100 through 8000. The default value is 8000 Hz.
  public _preLowpassCutoff = 0.0;

  public constructor() {
    super();
    this._datastruct = new Uint8Array(this.SIZE);
  }

  public SIZE = 20;

  public static OFFSET_GAIN = 0;
  public static OFFSET_EDGE = 4;
  public static OFFSET_POSTEQCENTERFREQUENCY = 8;
  public static OFFSET_POSTEQBANDWIDTH = 12;
  public static OFFSET_PRELOWPASSCUTOFF = 16;

  public readValuesFromStruct() {
    const dataView = this.DataView;
    this._gain = dataView.getFloat32(AudioEffectDistortion.OFFSET_GAIN);
    this._edge = dataView.getFloat32(AudioEffectDistortion.OFFSET_EDGE);
    this._postEQCenterFrequency = dataView.getFloat32(
      AudioEffectDistortion.OFFSET_POSTEQCENTERFREQUENCY
    );
    this._postEQBandwidth = dataView.getFloat32(
      AudioEffectDistortion.OFFSET_POSTEQBANDWIDTH
    );
    this._preLowpassCutoff = dataView.getFloat32(
      AudioEffectDistortion.OFFSET_PRELOWPASSCUTOFF
    );
  }

  public toString() {
    return `
    <AudioEffectDistortion>:{
      ${this._gain},
      ${this._edge},
      ${this._postEQCenterFrequency},
      ${this._postEQBandwidth},
      ${this._preLowpassCutoff},
    }
  `;
  }
}

export class AudioEffectFlanger extends BaseAudioEffect {
  // Ratio of wet (processed) signal to dry (unprocessed) signal. Must be in the range from 0 through 100 (all wet). The default value is 50.
  public _wetDryMix;
  // Percentage by which the delay time is modulated by the low-frequency oscillator (LFO). Must be in the range from 0 through 100. The default value is 100.
  public _depth;
  // Percentage of output signal to feed back into the effect's input, in the range from -99 to 99. The default value is -50.
  public _feedback;
  // Frequency of the LFO, in the range from 0 to 10. The default value is 0.25.
  public _frequency;
  // Waveform of the LFO... 0 = triangle, 1 = sine. By default, the waveform is sine.
  public _waveform;
  // Number of milliseconds the input is delayed before it is played back, in the range from 0 to 4. The default value is 2 ms.
  public _delay;
  // Phase differential between left and right LFOs, one of BASS_DX8_PHASE_NEG_180, BASS_DX8_PHASE_NEG_90, BASS_DX8_PHASE_ZERO, BASS_DX8_PHASE_90 and BASS_DX8_PHASE_180. The default value is BASS_DX8_PHASE_ZERO.
  public _phase;

  public constructor() {
    super();
    this._datastruct = new Uint8Array(this.SIZE);
  }

  public SIZE = 28;

  public static OFFSET_WETDRYMIX = 0;
  public static OFFSET_DEPTH = 4;
  public static OFFSET_FEEDBACK = 8;
  public static OFFSET_FREQUENCY = 12;
  public static OFFSET_WAVEFORM = 16;
  public static OFFSET_DELAY = 20;
  public static OFFSET_PHASE = 24;

  public readValuesFromStruct() {
    const dataView = this.DataView;
    this._wetDryMix = dataView.getFloat32(AudioEffectFlanger.OFFSET_WETDRYMIX);
    this._depth = dataView.getFloat32(AudioEffectFlanger.OFFSET_DEPTH);
    this._feedback = dataView.getFloat32(AudioEffectFlanger.OFFSET_FEEDBACK);
    this._frequency = dataView.getFloat32(AudioEffectFlanger.OFFSET_FREQUENCY);
    this._waveform = dataView.getInt32(AudioEffectFlanger.OFFSET_WAVEFORM);
    this._delay = dataView.getFloat32(AudioEffectFlanger.OFFSET_DELAY);
    this._phase = dataView.getInt32(AudioEffectFlanger.OFFSET_PHASE);
  }

  public toString() {
    return `
    <AudioEffectFlanger>:{
      ${this._wetDryMix},
      ${this._depth},
      ${this._feedback},
      ${this._frequency},
      ${this._waveform},
      ${this._delay},
      ${this._phase}
    }
  `;
  }
}

export class AudioEffectGargle extends BaseAudioEffect {
  // Rate of modulation, in Hertz. Must be in the range from 1 through 1000. The default value is 20.
  private _rateHz: number;
  // Shape of the modulation waveform... 0 = triangle, 1 = square. By default, the waveform is triangle.
  private _waveShape: number;

  public SIZE = 8;

  public static OFFSET_RATE_HZ = 0;
  public static OFFSET_WAVE_SHAPE = 4;

  public get RateHz() {
    return this._rateHz;
  }
  public get WaveShape() {
    return this._waveShape;
  }

  constructor() {
    super();
    this._datastruct = new Uint8Array(this.SIZE);
    this._rateHz = 0;
    this._waveShape = 0;
  }

  public get DataStruct() {
    return this._datastruct;
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const dataView = this.DataView;
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

export class AudioEffectReverb extends BaseAudioEffect {
  // Input gain of signal, in decibels (dB), in the range from -96 through 0. The default value is 0 dB.
  public _inGain = 0.0;
  // Reverb mix, in dB, in the range from -96 through 0. The default value is 0 dB.
  public _reverbMix = 0.0;
  // Reverb time, in milliseconds, in the range from 0.001 through 3000. The default value is 1000.
  public _reverbTime = 0.0;
  // High-frequency reverb time ratio, in the range from 0.001 through 0.999. The default value is 0.001.
  public _highFreqRTRatio = 0.0;

  public SIZE = 16;

  public static OFFSET_INGAIN = 0;
  public static OFFSET_REVERBMIX = 4;
  public static OFFSET_REVERBTIME = 8;
  public static OFFSET_HIGHFREQRTRATIO = 12;

  constructor() {
    super();
    this._datastruct = new Uint8Array(this.SIZE);
  }

  public get DataStruct() {
    return this._datastruct;
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const dataView = this.DataView;
    this._inGain = dataView.getFloat32(AudioEffectReverb.OFFSET_INGAIN);
    this._reverbMix = dataView.getFloat32(AudioEffectReverb.OFFSET_REVERBMIX);
    this._reverbTime = dataView.getFloat32(AudioEffectReverb.OFFSET_REVERBTIME);
    this._highFreqRTRatio = dataView.getFloat32(
      AudioEffectReverb.OFFSET_HIGHFREQRTRATIO
    );
  }

  public toString() {
    return `
      <AudioEffectReverb>:{
        ${this._inGain},
        ${this._reverbMix},
        ${this._reverbTime},
        ${this._highFreqRTRatio},
      }
    `;
  }
}

// typedef struct {
//   float fTarget;
//   float fCurrent;
//   float fTime;
//   DWORD lCurve;
// } BASS_FX_VOLUME_PARAM;
