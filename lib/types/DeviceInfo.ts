import { CreatePointerX64, BASS_GetDeviceInfo } from "../../mod.ts";

export class DeviceInfo {
  private _infostruct: Uint8Array;
  private _name: string;
  private _flags: number;
  private _driver: string;

  public static SIZE = 24;

  public static OFFSET_NAME = 0;
  public static OFFSET_DRIVER = 8;
  public static OFFSET_FLAGS = 16;

  constructor(device_idx = -1) {
    this._name = "";
    this._driver = "";
    this._flags = 0;
    this._infostruct = new Uint8Array(DeviceInfo.SIZE);
    if (device_idx > -1) {
      BASS_GetDeviceInfo(device_idx, this._infostruct);
      this.readValuesFromStruct();
    }
  }

  public get Infostruct() {
    return this._infostruct;
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

  /* Call after Infostruct was set or updated to read the values stored in the structure. */
  public readValuesFromStruct() {
    // Reading name string from c pointer to struct.
    const deviceNamePointer = CreatePointerX64(
      this._infostruct,
      DeviceInfo.OFFSET_NAME
    );
    let name = "";
    try {
      name = Deno.UnsafePointerView.getCString(deviceNamePointer);
    } catch (err) {
      console.log("Error while getting device info: ", err);
    }
    this.Name = name;
    // Reading device driver
    const driverIdentificationPointer = CreatePointerX64(
      this._infostruct,
      DeviceInfo.OFFSET_DRIVER
    );
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
    this.Flags = new DataView(this._infostruct.buffer).getUint32(
      DeviceInfo.OFFSET_FLAGS,
      true
    );
  }
}
