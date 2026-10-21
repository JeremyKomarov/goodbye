/** A modifier that deliberately has no rule — so "intentionally nothing" and "misspelled" differ. */
export const NO_CLASS = "";

type ClassTree = { readonly [key: string]: string | undefined | ClassTree };

/**
 * Wraps a component's class map. A CSS Module returns `undefined` for a name with no rule, which
 * renders nothing; in development this throws naming the key instead (02-COMPONENTS.md §2).
 */
export function classMap<T extends ClassTree>(component: string, map: T): T {
  if (process.env.NODE_ENV !== "production") assertDefined(component, map, []);
  return map;
}

function assertDefined(component: string, tree: ClassTree, path: string[]) {
  for (const [key, value] of Object.entries(tree)) {
    const at = [...path, key];
    if (value === undefined)
      throw new Error(`${component}: class "${at.join(".")}" has no rule in its stylesheet`);
    if (typeof value === "object") assertDefined(component, value, at);
  }
}
