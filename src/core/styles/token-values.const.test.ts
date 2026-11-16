import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TOKEN_VALUES } from "./token-values.const";

const scss = readFileSync(join(process.cwd(), "src/core/styles/tokens.scss"), "utf8");
const declared = new Map(
  [...scss.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)].map(([, name, value]) => [name, value.trim()]),
);

/** A token's value, following `var(--…)` to the value it ends at. */
function resolve(name: string): string | undefined {
  const value = declared.get(name);
  const alias = value?.match(/^var\(--([\w-]+)\)$/);
  return alias ? resolve(alias[1]) : value;
}

describe("TOKEN_VALUES", () => {
  it.each(Object.entries(TOKEN_VALUES))("%s is the stylesheet's value", (name, value) => {
    expect(resolve(name)).toBe(value);
  });
});
