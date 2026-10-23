// The games' content agrees with itself: every picture's things can be named, and the name the game
// shows is a guess it accepts, in both languages; every icon a picture draws is on disk.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { pictureGameStrings } from "@/features/games/components/PictureGame/PictureGame.strings";
import { pictureGameStringsEn } from "@/features/games/components/PictureGame/PictureGame.strings.en";
import { matches } from "@/features/games/utils/answers";
import { PICTURES } from "./pictures.const";

const THING_NAMES = { he: pictureGameStrings.things, en: pictureGameStringsEn.things };
const things = PICTURES.flatMap((p) => [p.decoy, p.truth]);

describe("the pictures", () => {
  for (const [locale, names] of Object.entries(THING_NAMES))
    it(`accept each thing's own name in ${locale} as a right guess`, () => {
      for (const { thing, answers } of things)
        expect(matches(names[thing], answers), `${thing}: "${names[thing]}"`).toBe(true);
    });

  it("draw only icons that are in public/picture-game", () => {
    const icons = new Set(PICTURES.flatMap((p) => [...p.top, ...p.bottom].map((l) => l.icon)));
    for (const icon of icons)
      expect(existsSync(join(process.cwd(), "public/picture-game", `${icon}.svg`)), icon).toBe(true);
  });

  it("each have a different id", () => {
    expect(new Set(PICTURES.map((p) => p.id)).size).toBe(PICTURES.length);
  });
});
