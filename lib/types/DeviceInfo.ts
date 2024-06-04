import { BASS_GetDeviceInfo } from "../bindings.ts";

export class DeviceInfo {
  private _infostruct: Uint8Array;
  private _name: string;
  private _flags: number;
  private _driver: string;

  public static SIZE = 24;

  constructor(device_idx = 0) {
    this._name = "";
    this._driver = "";
    this._flags = 0;
    this._infostruct = new Uint8Array(DeviceInfo.SIZE);
    BASS_GetDeviceInfo(device_idx, this._infostruct);
    this.initProperties();
  }

  public get Name() {
    return this._name;
  }

  public set Name(value: string) {
    this._name = value;
  }

  public get Flags() {
    return this._flags;
  }

  public set Flags(value: number) {
    this._flags = value;
  }

  public get Driver() {
    return this._driver;
  }

  public set Driver(value: string) {
    this._driver = value;
  }

  private initProperties() {
    // Reading name string from c pointer to struct.
    const dataView = new DataView(this._infostruct.buffer);
    const deviceNamePointer = Deno.UnsafePointer.create(
      dataView.getBigUint64(0, true)
    ) as Deno.PointerObject;
    let name = "";
    try {
      name = Deno.UnsafePointerView.getCString(deviceNamePointer);
    } catch (err) {
      console.log("Error while getting device info: ", err);
    }
    this.Name = name;
    // Reading device driver
    const driverIdentificationPointer = Deno.UnsafePointer.create(
      new BigUint64Array(this._infostruct.subarray(8, 8).buffer)[0]
    ) as Deno.PointerObject;
    let driverIdentification = "";
    try {
      driverIdentification = Deno.UnsafePointerView.getCString(
        driverIdentificationPointer
      );
    } catch (err) {
      console.log("Error while getting device info: ", err);
    }
    this.Driver = driverIdentification;
    // Reading flags
    this.Flags = new DataView(this._infostruct.buffer).getUint32(16, true);
  }
}
