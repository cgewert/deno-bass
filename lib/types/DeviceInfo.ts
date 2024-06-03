export class DeviceInfo {
  public static SIZE = 24;
  public Infostruct: Uint8Array;

  public get Name() {
    if (this.Infostruct) {
      const deviceNamePointer = Deno.UnsafePointer.create(
        Number(new BigUint64Array(this.Infostruct.subarray(0, 8).buffer)[0])
      );
      let name = "";
      try {
        name = Deno.UnsafePointerView.getCString(deviceNamePointer);
      } catch (err) {
        console.log("Error while getting device info: ", err);
      }

      return name;
    } else {
      // Infostruct was null or undefined and must be initialized first.
      return "";
    }
  }

  public get Flags() {
    if (this.Infostruct) {
      return new DataView(this.Infostruct.buffer).getUint32(16, true);
    } else {
      // Infostruct was null or undefined and must be initialized first.
      return 0;
    }
  }

  public get Driver() {
    if (this.Infostruct) {
      const driverIdentificationPointer = Deno.UnsafePointer.create(
        Number(new BigUint64Array(this.Infostruct.subarray(8, 8).buffer)[0])
      );
      let driverIdentification = "";
      try {
        driverIdentification = Deno.UnsafePointerView.getCString(
          driverIdentificationPointer
        );
      } catch (err) {
        console.log("Error while getting device info: ", err);
      }

      return driverIdentification;
    } else {
      // Infostruct was null or undefined and must be initialized first.
      return "";
    }
  }

  constructor() {
    this.Infostruct = new Uint8Array(DeviceInfo.SIZE);
  }
}
