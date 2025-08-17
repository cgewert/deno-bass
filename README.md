# 🔊 deno-bass 🔊

Autor: Christian Gewert <cgewert@gmail.com>

## Description

A wrapper providing the BASS C API in Deno.

## Deno Bindings for the BASS audio Engine

Bass Audio is made by [un4seen developments](https://www.un4seen.com/)

## Usage

👷 WARNING THIS LIBRARY IS UNDER HEAVY CONSTRUCTION  
AND IS SUBJECT TO CHANGE  
HAVE THIS IN MIND BEFORE USING IT 🚧

There is no release yet!

1. One can import the module easily directly from Github:

```sh
import { BASS, Types, Options } from "https://raw.githubusercontent.com/cgewert/deno-bass/master/lib/mod.ts";
```

2. To use this lib you need a compiled shared library, specific for your platform installed globally. You can download it from [un4seen developments](https://www.un4seen.com/) website. For Windows this would be placing bass.dll into windows/system32 folder.
You can also set up an environment variable named
**BASS_INSTALL_FOLDER** which points to a folder where you have installed the shared library file:
BASS_INSTALL_FOLDER="C:\foobar"

### Important notes

WIP: This lib is under heavy construction, use on your own risk!

You have to provide the correct shared library for your platform yourself. Download Sources are provided on un4seen developments website.

Because FFI is an unstable Deno feature you have to run your code with --allow-ffi and --unstable flags provided:

```sh
$ deno --allow-env --allow-ffi --unstable-ffi yourscript.ts
```

### Test coverage

Use Deno to run tests:

```sh
$ deno test --allow-env --allow-ffi --unstable-ffi
```

### State of the lib

All functions from the original bass library should exist and be usable.
If you find bugs feel free to report them by opening an issue.
Currently the functional C Library is being mirrored but future versions will
introduce an OOP variant of the API.
If you want to participate please feel free to open pull requests.
If you need an introduction how to use this lib have a look in the examples folder.
