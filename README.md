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