# 🔊 deno-bass 🔊

Autor: Christian Gewert <cgewert@gmail.com>

## Description

A wrapper providing the BASS C API in Deno.

## Deno Bindings for the BASS audio Engine

Bass Audio is made by [un4seen developments](https://www.un4seen.com/)

### Important notes

WIP: This lib is under heavy construction, use on your own risk!

You have to provide the correct shared library for your platform yourself. Download Sources are provided on un4seen developments website.

Because FFI is an unstable Deno feature you have to run your code with --allow-ffi and --unstable flags provided:

```sh
$ deno run --allow-ffi --unstable-ffi yourscript.ts
```

### Test coverage

Use Deno to run tests:

```sh
$ deno test --allow-ffi --unstable-ffi
```

### Bindings finished and usable

|Nr|Name|Done|
|-|-|-|
|1|BASS_Apply3D|❌|
|2|BASS_ChannelBytes2Seconds|✅|
|3|BASS_ChannelFlags|✅|
|4|BASS_ChannelFree|✅|
|5|BASS_ChannelGet3DAttributes|❌|
|6|BASS_ChannelGet3DPosition|❌|
|7|BASS_ChannelGetAttribute|✅|
|8|BASS_ChannelGetAttributeEx|✅|
|9|BASS_ChannelGetData|❌|
|10|BASS_ChannelGetDevice|❌|
|11|BASS_ChannelGetInfo|❌|
|12|BASS_ChannelGetLength|✅|
|13|BASS_ChannelGetLevel|✅|
|14|BASS_ChannelGetLevelEx|❌|
|15|BASS_ChannelGetPosition|✅|
|16|BASS_ChannelGetTags|✅|
|17|BASS_ChannelIsActive|❌|
|18|BASS_ChannelIsSliding|❌|
|19|BASS_ChannelLock|❌|
|20|BASS_ChannelPause|✅|
|21|BASS_ChannelPlay|✅|
|22|BASS_ChannelRemoveDSP|❌|
|23|BASS_ChannelRemoveFX|❌|
|24|BASS_ChannelRemoveLink|❌|
|25|BASS_ChannelRemoveSync|❌|
|26|BASS_ChannelSeconds2Bytes|❌|
|27|BASS_ChannelSet3DAttributes|❌|
|28|BASS_ChannelSet3DPosition|❌|
|29|BASS_ChannelSetAttribute|✅|
|30|BASS_ChannelSetAttributeEx|✅|
|31|BASS_ChannelSetDSP|❌|
|32|BASS_ChannelSetDevice|❌|
|33|BASS_ChannelSetFX|❌|
|34|BASS_ChannelSetLink|❌|
|35|BASS_ChannelSetPosition|❌|
|36|BASS_ChannelSetSync|❌|
|37|BASS_ChannelSlideAttribute|❌|
|38|BASS_ChannelStart|✅|
|39|BASS_ChannelStop|✅|
|40|BASS_ChannelUpdate|❌|
|41|BASS_ErrorGetCode|✅|
|42|BASS_FXGetParameters|❌|
|43|BASS_FXReset|❌|
|44|BASS_FXSetParameters|❌|
|45|BASS_FXSetPriority|❌|
|46|BASS_Free|✅|
|47|BASS_Get3DFactors|❌|
|48|BASS_Get3DPosition|❌|
|49|BASS_GetCPU|✅|
|50|BASS_GetConfig|✅|
|51|BASS_GetConfigPtr|❌|
|52|BASS_GetDSoundObject|❌|
|53|BASS_GetDevice|✅|
|54|BASS_GetDeviceInfo|✅|
|55|ASS_GetEAXParameters|❌|
|56|BASS_GetInfo|❌|
|57|BASS_GetVersion|✅|
|58|BASS_GetVolume|✅|
|59|BASS_Init|✅|
|60|BASS_IsStarted|❌|
|61|BASS_MusicFree|❌|
|62|BASS_MusicLoad|❌|
|63|BASS_Pause|❌|
|64|BASS_PluginEnable|❌|
|65|BASS_PluginFree|❌|
|66|BASS_PluginGetInfo|❌|
|67|BASS_PluginLoad|❌|
|68|BASS_RecordFree|❌|
|69|BASS_RecordGetDevice|❌|
|70|BASS_RecordGetDeviceInfo|❌|
|71|BASS_RecordGetInfo|❌|
|72|BASS_RecordGetInput|❌|
|73|BASS_RecordGetInputName|❌|
|74|BASS_RecordInit|❌|
|75|BASS_RecordSetDevice|❌|
|76|BASS_RecordSetInput|❌|
|77|BASS_RecordStart|❌|
|78|BASS_SampleCreate|❌|
|79|BASS_SampleFree|❌|
|80|BASS_SampleGetChannel|❌|
|81|BASS_SampleGetChannels|❌|
|82|BASS_SampleGetData|❌|
|83|BASS_SampleGetInfo|❌|
|84|BASS_SampleLoad|❌|
|85|BASS_SampleSetData|❌|
|86|BASS_SampleSetInfo|❌|
|87|BASS_SampleStop|❌|
|88|BASS_Set3DFactors|❌|
|90|BASS_Set3DPosition|❌|
|91|BASS_SetConfig|✅|
|92|BASS_SetConfigPtr|❌|
|93|BASS_SetDevice|❌|
|94|BASS_SetEAXParameters|❌|
|95|BASS_SetVolume|✅|
|96|BASS_Start|❌|
|97|BASS_Stop|❌|
|98|BASS_StreamCreate|❌|
|99|BASS_StreamCreateFile|✅|
|100|BASS_StreamCreateFileUser|❌|
|101|BASS_StreamCreateURL|✅|
|102|BASS_StreamFree|❌|
|103|BASS_StreamGetFilePosition|❌|
|104|BASS_StreamPutData|❌|
|105|BASS_StreamPutFileData|❌|
|106|BASS_Update|❌|
