// Utility lambdas mimicking c macros

export const HIWORD = (x: number) => x & 0xffff0000;
export const LOWORD = (x: number) => x & 0x0000ffff;
