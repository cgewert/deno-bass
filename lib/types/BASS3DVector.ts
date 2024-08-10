import { BASS_3DVECTOR } from "../bassTypes.ts";

export class BASS3DVector {
  private _datastruct: Uint8Array;
  private _dataView: DataView;

  public get X(): number {
    return this._vector.x;
  }

  public set X(value: number) {
    this._vector.x = value;
    this._dataView.setFloat32(BASS3DVector.OFFSET_X, value, true);
  }

  public get Y(): number {
    return this._vector.y;
  }

  public set Y(value: number) {
    this._vector.y = value;
    this._dataView.setFloat32(BASS3DVector.OFFSET_Y, value, true);
  }

  public get Z(): number {
    return this._vector.z;
  }

  public set Z(value: number) {
    this._vector.z = value;
    this._dataView.setFloat32(BASS3DVector.OFFSET_Z, value);
  }

  private _vector: BASS_3DVECTOR = {
    x: 0,
    y: 0,
    z: 0,
  };

  // Size of c struct BASS_INFO in bytes
  public static SIZE = 16;

  public static OFFSET_X = 0;
  public static OFFSET_Y = 4;
  public static OFFSET_Z = 8;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._datastruct = new Uint8Array(BASS3DVector.SIZE);
    this._dataView = new DataView(this._datastruct.buffer);
    this.X = x;
    this.Y = y;
    this.Z = z;
  }

  public get DataStruct() {
    return this._datastruct;
  }

  /* Call after datastruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const pointer = Deno.UnsafePointer.of(
      this._datastruct
    ) as Deno.PointerObject;
    const dataView: Deno.UnsafePointerView = new Deno.UnsafePointerView(
      pointer
    );

    this._vector.x = dataView.getFloat32(BASS3DVector.OFFSET_X);
    this._vector.y = dataView.getFloat32(BASS3DVector.OFFSET_Y);
    this._vector.z = dataView.getFloat32(BASS3DVector.OFFSET_Z);
  }

  public toString() {
    return `
      <BASS3DVector>:{
        ${this._vector.x},
        ${this._vector.y},
        ${this._vector.z}
      }
    `;
  }
}
