import { BASS_ChannelGetTags } from "../bindings.ts";
import { BASS_OK, ERROR_MAP } from "../errors.ts";
import { BASS_TAG_ID3 } from "../tags.ts";
import { GetBASSErrorCode } from "../utilities.ts";

export const ID3_GENRE_MAP: Map<number, string> = new Map([
  [0, "Blues"],
  [1, "Classic rock"],
  [2, "Country"],
  [3, "Dance"],
  [4, "Disco"],
  [5, "Funk"],
  [6, "Grunge"],
  [7, "Hip-hop"],
  [8, "Jazz"],
  [9, "Metal"],
  [10, "New age"],
  [11, "Oldies"],
  [12, "Other"],
  [13, "Pop"],
  [14, "Rhythm and blues"],
  [15, "Rap"],
  [16, "Reggae"],
  [17, "Rock"],
  [18, "Techno"],
  [19, "Industrial"],
  [20, "Alternative"],
  [21, "Ska"],
  [22, "Death metal"],
  [23, "Pranks"],
  [24, "Soundtrack"],
  [25, "Euro-techno"],
  [26, "Ambient"],
  [27, "Trip-hop"],
  [28, "Vocal"],
  [29, "Jazz & funk"],
  [30, "Fusion"],
  [31, "Trance"],
  [32, "Classical"],
  [33, "Instrumental"],
  [34, "Acid"],
  [35, "House"],
  [36, "Game"],
  [37, "Sound clip"],
  [38, "Gospel"],
  [39, "Noise"],
  [40, "Alternative rock"],
  [41, "Bass"],
  [42, "Soul"],
  [43, "Punk"],
  [44, "Space"],
  [45, "Meditative"],
  [46, "Instrumental pop"],
  [47, "Instrumental rock"],
  [48, "Ethnic"],
  [49, "Gothic"],
  [50, "Darkwave"],
  [51, "Techno-industrial"],
  [52, "Electronic"],
  [53, "Pop-folk"],
  [54, "Eurodance"],
  [55, "Dream"],
  [56, "Southern rock"],
  [57, "Comedy"],
  [58, "Cult"],
  [59, "Gangsta"],
  [60, "Top 40"],
  [61, "Christian rap"],
  [62, "Pop/funk"],
  [63, "Jungle music"],
  [64, "Native US"],
  [65, "Cabaret"],
  [66, "New wave"],
  [67, "Psychedelic"],
  [68, "Rave"],
  [69, "Showtunes"],
  [70, "Trailer"],
  [71, "Lo-fi"],
  [72, "Tribal"],
  [73, "Acid punk"],
  [74, "Acid jazz"],
  [75, "Polka"],
  [76, "Retro"],
  [77, "Musical"],
  [78, "Rock 'n' roll"],
  [79, "Hard rock"],
  [80, "Folk"],
  [81, "Folk rock"],
  [82, "National folk"],
  [83, "Swing"],
  [84, "Fast fusion"],
  [85, "Bebop"],
  [86, "Latin"],
  [87, "Revival"],
  [88, "Celtic"],
  [89, "Bluegrass"],
  [90, "Avantgarde"],
  [91, "Gothic rock"],
  [92, "Progressive rock"],
  [93, "Psychedelic rock"],
  [94, "Symphonic rock"],
  [95, "Slow rock"],
  [96, "Big band"],
  [97, "Chorus"],
  [98, "Easy listening"],
  [99, "Acoustic"],
  [100, "Humour"],
  [101, "Speech"],
  [102, "Chanson"],
  [103, "Opera"],
  [104, "Chamber music"],
  [105, "Sonata"],
  [106, "Symphony"],
  [107, "Booty bass"],
  [108, "Primus"],
  [109, "Porn groove"],
  [110, "Satire"],
  [111, "Slow jam"],
  [112, "Club"],
  [113, "Tango"],
  [114, "Samba"],
  [115, "Folklore"],
  [116, "Ballad"],
  [117, "Power ballad"],
  [118, "Rhythmic Soul"],
  [119, "Freestyle"],
  [120, "Duet"],
  [121, "Punk rock"],
  [122, "Drum solo"],
  [123, "A cappella"],
  [124, "Euro-house"],
  [125, "Dance hall"],
  [126, "Goa music"],
  [127, "Drum & bass"],
  [128, "Club-house"],
  [129, "Hardcore techno"],
  [130, "Terror"],
  [131, "Indie"],
  [132, "Britpop"],
  [133, "Negerpunk"],
  [134, "Polsk punk"],
  [135, "Beat"],
  [136, "Christian gangsta rap"],
  [137, "Heavy metal"],
  [138, "Black metal"],
  [139, "Crossover"],
  [140, "Contemporary Christian"],
  [141, "Christian rock"],
  [142, "Merengue"],
  [143, "Salsa"],
  [144, "Thrash metal"],
  [145, "Anime"],
  [146, "Jpop"],
  [147, "Synthpop"],
  [148, "Christmas"],
  [149, "Art rock"],
  [150, "Baroque"],
  [151, "Bhangra"],
  [152, "Big beat"],
  [153, "Breakbeat"],
  [154, "Chillout"],
  [155, "Downtempo"],
  [156, "Dub"],
  [157, "EBM"],
  [158, "Eclectic"],
  [159, "Electro"],
  [160, "Electroclash"],
  [161, "Emo"],
  [162, "Experimental"],
  [163, "Garage"],
  [164, "Global"],
  [165, "IDM"],
  [166, "Illbient"],
  [167, "Industro-Goth"],
  [168, "Jam Band"],
  [169, "Krautrock"],
  [170, "Leftfield"],
  [171, "Lounge"],
  [172, "Math rock"],
  [173, "New romantic"],
  [174, "Nu-breakz"],
  [175, "Post-punk"],
  [176, "Post-rock"],
  [177, "Psytrance"],
  [178, "Shoegaze"],
  [179, "Space rock"],
  [180, "Trop rock"],
  [181, "World music"],
  [182, "Neoclassical"],
  [183, "Audiobook"],
  [184, "Audio theatre"],
  [185, "Neue Deutsche Welle"],
  [186, "Podcast"],
  [187, "Indie rock"],
  [188, "G-Funk"],
  [189, "Dubstep"],
  [190, "Garage rock"],
  [191, "Psybient"],
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
