import * as assertions from "std/assert/mod.ts";
//import { DeviceInfo } from "../../lib/types/DeviceInfo.ts";

const DISABLE_SUITE = true;

Deno.test({
  name: "FOOBAR1",
  ignore: DISABLE_SUITE,
  fn() {
    assertions.assertEquals(true, true);
  },
});

Deno.test({
  name: "FOOBAR2",
  fn() {
    assertions.assertEquals(true, true);
  },
});

//describe("DeviceInfo", () => {
// it("should return 1 as DeviceFlags value for the NoSound Device", () => {
//   const noSoundDevice = 0;
//   const deviceInfo = new DeviceInfo(noSoundDevice);
//   const expectedValue = 1;
//   const realValue = deviceInfo.Flags;
//   assertions.assertEquals(expectedValue, realValue);
// });
// it("should NOT return 1 as DeviceFlags value for other devices than the NoSound Device", () => {
//   const SoundDevice = 1;
//   const deviceInfo = new DeviceInfo(SoundDevice);
//   const notExpectedValue = 1;
//   const realValue = deviceInfo.Flags;
//   assertions.assertNotEquals(notExpectedValue, realValue);
// });
//});
