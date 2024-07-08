import { Utilities } from "../mod.ts";

export class ID3v1Struct {
  private _pointerView: Deno.UnsafePointerView;

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

  private _genre: number; // Genre number. The number can be translated to a genre, using the list at id3.org.

  public get Genre(): number {
    return this._genre;
  }
  public set Genre(value: number) {
    this._genre = value;
  }

  // Size of ID3v1 tag struct
  public static SIZE = 128;

  public static OFFSET_ID = 0;
  public static OFFSET_TITLE = 3;
  public static OFFSET_ARTIST = 33;
  public static OFFSET_ALBUM = 63;
  public static OFFSET_YEAR = 93;
  public static OFFSET_COMMENT = 97;
  public static OFFSET_GENRE = 127;

  constructor(tagPointer: Deno.UnsafePointer) {
    this._id = "";
    this._title = "";
    this._artist = "";
    this._album = "";
    this._year = "";
    this._comment = "";
    this._genre = 0;
    this._pointerView = new Deno.UnsafePointerView(tagPointer);
    this.readValuesFromStruct(tagPointer);
  }

  public get Data() {
    return this._id3Struct;
  }

  /* Update class properties with values read from pointer. */
  private readValuesFromStruct(tagPointer: Deno.UnsafePointer) {
    // Reading name string from c pointer to struct.
    this.Album = this.readCStringFromPointer(ID3v1Struct.OFFSET_ALBUM);
    this.Artist = this.readCStringFromPointer(ID3v1Struct.OFFSET_ARTIST);
    this.Year = this.readCStringFromPointer(ID3v1Struct.OFFSET_YEAR);
    this.Comment = this.readCStringFromPointer(ID3v1Struct.OFFSET_COMMENT);
    this.Title = this.readCStringFromPointer(ID3v1Struct.OFFSET_TITLE);
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
