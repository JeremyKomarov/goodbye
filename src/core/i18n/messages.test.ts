import { describe, expect, it } from "vitest";
import { messages } from "./messages";

type Tree = { [key: string]: string | Tree };

function leaves(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : leaves(value, `${prefix}${key}.`),
  );
}

describe("messages", () => {
  it("has the same keys in every locale", () => {
    expect(leaves(messages.en).sort()).toEqual(leaves(messages.he).sort());
  });

  it("has no empty string in any locale", () => {
    for (const [locale, tree] of Object.entries(messages)) {
      const empty = leaves(tree).filter((path) =>
        path.split(".").reduce<string | Tree>((node, key) => (node as Tree)[key], tree) === "",
      );
      expect(empty, locale).toEqual([]);
    }
  });
});
