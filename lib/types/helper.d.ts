// Source - https://stackoverflow.com/questions/61132262/typescript-deep-partial
// Posted by Terry
// Retrieved 2025-11-05, License - CC BY-SA 4.0

declare type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
