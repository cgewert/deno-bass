export interface AllocatedPointer {
  array: Uint8Array;
  arrayBuffer: BufferSource;
  dataView: DataView;
  pointer: Deno.PointerObject;
  pointerView: Deno.UnsafePointerView;
}

export function createAllocatedPointer(
  memSize: number
): AllocatedPointer | false {
  const sourceData = new Uint8Array(memSize);
  const sourceDataView = new DataView(sourceData.buffer);
  const pointer = Deno.UnsafePointer.of(sourceData.buffer);
  if (pointer == null) {
    console.error("Could not create a pointer object! ");
    return false;
  }

  const pointerView = new Deno.UnsafePointerView(pointer);
  const result: AllocatedPointer = {
    array: sourceData,
    arrayBuffer: sourceData.buffer,
    dataView: sourceDataView,
    pointer,
    pointerView,
  };

  return result;
}
