/**
 * The shape a translation must have: the source strings' keys, with any text. A missing or extra
 * key in a translation is a type error, so a locale cannot fall behind silently.
 */
export type StringsOf<T> = { [K in keyof T]: T[K] extends string ? string : StringsOf<T[K]> };
