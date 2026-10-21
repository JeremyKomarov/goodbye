type Strings = { readonly [key: string]: string | Strings };

export type KeysOf<T, Prefix extends string = ""> = {
  readonly [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : KeysOf<T[K], `${Prefix}${K}.`>;
};

/** Derives message keys from a strings object, so a key is never typed by hand (02-COMPONENTS.md §9). */
export function keysOf<T extends Strings>(strings: T): KeysOf<T> {
  return build(strings, "") as KeysOf<T>;
}

function build(strings: Strings, prefix: string): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(strings).map(([key, value]) => [
      key,
      typeof value === "string" ? `${prefix}${key}` : build(value, `${prefix}${key}.`),
    ]),
  );
}
