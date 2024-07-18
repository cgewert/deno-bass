import * as assertions from "std/assert/mod.ts";
import { describe, it } from "std/testing/bdd.ts";
import { ID3v1Tag } from "../../lib/types/ID3v1Tag.ts";
import { createAllocatedPointer } from "./utilities.ts";
import { expect, jest, test } from "npm:@jest/globals@latest";
import { BASS_ChannelGetTags } from "../../lib/bindings.ts";

jest.mock("../../lib/bindings.ts");

const writeStringToBuffer = (
  text: string,
  dataView: DataView,
  start: number
) => {
  for (let i = 0; i < text.length; i++) {
    dataView.setUint8(start + i, text[i].charCodeAt(0));
  }
};

describe("ID3v1Tag", () => {
  it("should return the correct meta data blocks", () => {
    const title = "House of the rising foobar\0";
    const artist = "Foobar";
    const comment = "Foo bar baz";
    const album = "Foobars greatest hits\0";
    const year = "1869";
    const id = "ID3";
    const genre = "1"; // Must be a number from 1 - 256

    const sourceData = createAllocatedPointer(ID3v1Tag.SIZE);
    if (sourceData) {
      writeStringToBuffer(album, sourceData.dataView, ID3v1Tag.OFFSET_ALBUM);
      console.log(
        "FAKE POINTER ALBUM: ",
        sourceData.pointerView.getCString(ID3v1Tag.OFFSET_ALBUM)
      );
      const tags = jest.mocked(BASS_ChannelGetTags);
      tags.mockReturnValue(sourceData.pointer);
    }

    const id3v1Tag = new ID3v1Tag(0);

    assertions.assertEquals(id3v1Tag.Album, album);
  });
});
