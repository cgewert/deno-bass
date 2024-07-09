import { BASS_ChannelGetTags } from "../bindings.ts";
import { BASS_OK, ERROR_MAP } from "../errors.ts";
import { BASS_TAG_ID3 } from "../tags.ts";
import { GetBASSErrorCode } from "../utilities.ts";

export const ID3_GENRE_MAP: Map<number, string> = new Map([
  [1, "Blues"],
  [2, "Classic rock"],
  [3, "Country"],
  [4, "Dance"],
  [5, "Disco"],
  [6, "Funk"],
  [7, "Grunge"],
  [8, "Hip-hop"],
  [9, "Jazz"],
  [10, "Metal"],
  [11, "New age"],
  [12, "Oldies"],
  [13, "Other"],
  [14, "Pop"],
  [15, "Rhythm and blues"],
  [16, "Rap"],
  [17, "Reggae"],
  [18, "Rock"],
  [19, "Techno"],
  [20, "Industrial"],
]);

export class ID3v1Tag {
  private _pointerView: Deno.UnsafePointerView;
  private _pointer: Deno.UnsafePointer;
  private _streamHandle: number;

  private _id: string; // ID3v1 tag identifier... "TAG".

  public get Id(): string {
    return this._id;
  }

  public set Id(value: string) {
    this._id = value;
  }

  private _title: string; // Song title.

  public get Title(): string {
    return this._title;
  }
  public set Title(value: string) {
    this._title = value;
  }

  private _artist: string; // Artist name.

  public get Artist(): string {
    return this._artist;
  }
  public set Artist(value: string) {
    this._artist = value;
  }

  private _album: string; // Album title.

  public get Album(): string {
    return this._album;
  }
  public set Album(value: string) {
    this._album = value;
  }

  private _year: string; // Year.

  public get Year(): string {
    return this._year;
  }
  public set Year(value: string) {
    this._year = value;
  }

  private _comment: string; // Comment. If the 30th character is non-null whilst the 29th character is null, then the 30th character is the track number and the comment is limited to the first 28 characters.

  public get Comment(): string {
    return this._comment;
  }
  public set Comment(value: string) {
    this._comment = value;
  }

  private _genre: string; // Genre number. The number can be translated to a genre, using the list at id3.org.

  public get Genre(): string {
    return this._genre;
  }
  public set Genre(value: string) {
    this._genre = value;
  }

  private _genreId: number;

  public get GenreId(): number {
    return this._genreId;
  }
  public set GenreId(value: number) {
    this._genreId = value;
    this.Genre = ID3_GENRE_MAP.get(value) ?? "";
  }

  public static OFFSET_ID = 0;
  public static OFFSET_TITLE = 3;
  public static OFFSET_ARTIST = 33;
  public static OFFSET_ALBUM = 63;
  public static OFFSET_YEAR = 93;
  public static OFFSET_COMMENT = 97;
  public static OFFSET_GENRE = 127;

  constructor(streamHandle: number) {
    this._id = "";
    this._title = "";
    this._artist = "";
    this._album = "";
    this._year = "";
    this._comment = "";
    this._genreId = 0;
    this._genre = "";
    this._streamHandle = streamHandle;
    this.loadTag();
  }

  private async loadTag() {
    try {
      this._pointer = BASS_ChannelGetTags(this._streamHandle, BASS_TAG_ID3);
      const tagError = GetBASSErrorCode();
      if (tagError != ERROR_MAP.get(BASS_OK)) {
        console.log("Error while reading ID3v1 tag: ", tagError);
      }

      this._pointerView = new Deno.UnsafePointerView(this._pointer);
      this.readValuesFromStruct();
    } catch (error: any) {
      console.log("Unexpected error happened while reading ID3v1 Tag: ", error);
    }
  }

  /* Update class properties with values read from pointer. */
  private readValuesFromStruct(): void {
    this.Album = this.readCStringFromPointer(ID3v1Tag.OFFSET_ALBUM);
    this.Artist = this.readCStringFromPointer(ID3v1Tag.OFFSET_ARTIST);
    this.Year = this.readCStringFromPointer(ID3v1Tag.OFFSET_YEAR);
    this.Comment = this.readCStringFromPointer(ID3v1Tag.OFFSET_COMMENT);
    this.Title = this.readCStringFromPointer(ID3v1Tag.OFFSET_TITLE);
    this.GenreId = this.readCInt32FromPointer(ID3v1Tag.OFFSET_GENRE);
  }

  private readCInt32FromPointer(offset: number): number {
    let readNumber = 0;

    try {
      readNumber = this._pointerView.getInt32(offset);
    } catch (err) {
      console.log("Error while getting Int32 from pointer: ", err);
    }

    return readNumber;
  }

  private readCStringFromPointer(offset: number): string {
    let readString = "";

    try {
      readString = this._pointerView.getCString(offset);
    } catch (err) {
      console.log("Error while getting string from pointer: ", err);
    }

    return readString;
  }
}
