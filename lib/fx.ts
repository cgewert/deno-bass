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

export enum AudioEffect {
  FX_DX8_CHORUS = 0,
  FX_DX8_COMPRESSOR = 1,
  FX_DX8_DISTORTION = 2,
  FX_DX8_ECHO = 3,
  FX_DX8_FLANGER = 4,
  FX_DX8_GARGLE = 5,
  FX_DX8_I3DL2REVERB = 6,
  FX_DX8_PARAMEQ = 7,
  FX_DX8_REVERB = 8,
  FX_VOLUME = 9,
}

export class AudioEffectEcho {
  private _datastruct: Uint8Array;

  private _wetDryMix: number;
  private _feedback: number;
  private _leftDelay: number;
  private _rightDelay: number;
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
