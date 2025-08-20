import { BASS_INFO } from "../bassTypes.ts";
import { BASS_GetInfo } from "../bindings.ts";
import { GetBASSErrorCode } from "../utilities.ts";

export class BASSInfo {
  private _datastruct: Uint8Array;

  public bassInfo: BASS_INFO = {
    flags: 0,
    hwsize: 0,
    hwfree: 0,
    freesam: 0,
    free3d: 0,
    minrate: 0,
    maxrate: 0,
    eax: false,
    minbuf: 0,
    dsver: 0,
    latency: 0,
    initflags: 0,
    speakers: 0,
    freq: 0,
  };

  // Size of c struct BASS_INFO in bytes
  public static SIZE = 54;

  public static OFFSET_FLAGS = 0;
  public static OFFSET_HWSIZE = 4;
  public static OFFSET_HWFREE = 8;
  public static OFFSET_FREESAM = 12;
  public static OFFSET_FREE3D = 16;
  public static OFFSET_MINRATE = 20;
  public static OFFSET_MAXRATE = 24;
  public static OFFSET_EAX = 28;
  public static OFFSET_MINBUF = 29;
  public static OFFSET_DSVER = 33;
  public static OFFSET_LATENCY = 37;
  public static OFFSET_INITFLAGS = 41;
  public static OFFSET_SPEAKERS = 45;
  public static OFFSET_FREQ = 49;

  constructor() {
    this._datastruct = new Uint8Array(BASSInfo.SIZE);
    this.update();
    //console.log(this.toString());
  }

  public get DataStruct() {
    return this._datastruct;
  }

  public get DataView() {
    return new DataView(this._datastruct.buffer);
  }

  public update() {
    if (!BASS_GetInfo(this._datastruct)) {
      console.error(
        "Error while reading current device Info: ",
        GetBASSErrorCode()
      );
    } else {
      this.readValuesFromStruct();
    }
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const dv = this.DataView;

    this.bassInfo.flags = dv.getUint32(BASSInfo.OFFSET_FLAGS);
    this.bassInfo.hwsize = dv.getUint32(BASSInfo.OFFSET_HWSIZE);
    this.bassInfo.hwfree = dv.getUint32(BASSInfo.OFFSET_HWFREE);
    this.bassInfo.freesam = dv.getUint32(BASSInfo.OFFSET_FREESAM);
    this.bassInfo.free3d = dv.getUint32(BASSInfo.OFFSET_FREE3D);
    this.bassInfo.minrate = dv.getUint32(BASSInfo.OFFSET_MINRATE);
    this.bassInfo.maxrate = dv.getUint32(BASSInfo.OFFSET_MAXRATE);
    //this.bassInfo.eax = dv.getBool(BASSInfo.OFFSET_EAX);
    this.bassInfo.minbuf = dv.getUint32(BASSInfo.OFFSET_MINBUF);
    this.bassInfo.dsver = dv.getUint32(BASSInfo.OFFSET_DSVER);
    this.bassInfo.latency = dv.getUint32(BASSInfo.OFFSET_LATENCY);
    this.bassInfo.initflags = dv.getUint32(BASSInfo.OFFSET_INITFLAGS);
    this.bassInfo.speakers = dv.getUint32(BASSInfo.OFFSET_SPEAKERS, true);
    this.bassInfo.freq = dv.getUint32(BASSInfo.OFFSET_FREQ);
  }

  public toString() {
    return `
      <BASSInfo>:{
        ${this.bassInfo.flags}
        ${this.bassInfo.hwsize}
        ${this.bassInfo.hwfree}
        ${this.bassInfo.freesam}
        ${this.bassInfo.free3d}
        ${this.bassInfo.minrate}
        ${this.bassInfo.maxrate}
        ${this.bassInfo.eax}
        Minbuf: ${this.bassInfo.minbuf}
        DirectSound Version: ${this.bassInfo.dsver}
        Latency: ${this.bassInfo.latency}
        Init flags: ${this.bassInfo.initflags}
        Available speakers: ${this.bassInfo.speakers}
        Sample Rate: ${this.bassInfo.freq}
      }
    `;
  }
}
