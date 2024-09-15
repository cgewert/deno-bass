export class RecordInfo {
  private _flags: number;

  public get Flags(): number {
    return this._flags;
  }

  private _formats: number;

  public get Formats(): number {
    return this._formats;
  }

  private _inputs: number;

  public get Inputs(): number {
    return this._inputs;
  }

  private _singlein: boolean;

  public get SingleIn(): boolean {
    return this._singlein;
  }

  private _freq: number;

  public get Freq(): number {
    return this._freq;
  }

  private _dataStruct: Uint8Array;

  public static SIZE = 18;

  public static OFFSET_FLAGS = 0;
  public static OFFSET_FORMATS = 4;
  public static OFFSET_INPUTS = 8;
  public static OFFSET_SINGLEIN = 12;
  public static OFFSET_FREQ = 13;

  constructor() {
    this._flags = 0;
    this._formats = 0;
    this._inputs = 0;
    this._singlein = false;
    this._freq = 0;

    this._dataStruct = new Uint8Array(RecordInfo.SIZE);
  }

  public get DataView() {
    const pointer = Deno.UnsafePointer.of(
      this._dataStruct
    ) as Deno.PointerObject;

    return new Deno.UnsafePointerView(pointer);
  }

  public get DataStruct() {
    return this._dataStruct;
  }

  /* Call after dataStruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    const dataView = this.DataView;
    this._flags = dataView.getUint32(RecordInfo.OFFSET_FLAGS);
    this._formats = dataView.getUint32(RecordInfo.OFFSET_FORMATS);
    this._freq = dataView.getUint32(RecordInfo.OFFSET_FREQ);
    this._inputs = dataView.getUint32(RecordInfo.OFFSET_INPUTS);
    this._singlein = dataView.getBool(RecordInfo.OFFSET_SINGLEIN);
  }
}
