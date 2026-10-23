import { describe, expect, it } from "vitest";
import { visualLtr, visualRtl } from "./bidi";

describe("visualRtl", () => {
  it("reverses Hebrew into visual order", () => {
    expect(visualRtl("שלום")).toBe("םולש");
  });

  it("keeps numbers readable", () => {
    expect(visualRtl("יום ה׳ בשעה 14:00")).toBe("14:00 העשב ׳ה םוי");
  });

  it("puts a hyphen before a number on the Hebrew side", () => {
    expect(visualRtl("ב-14:00")).toBe("14:00-ב");
    expect(visualRtl("איחר ב-7 דקות")).toBe("תוקד 7-ב רחיא");
  });

  it("keeps Latin names, hyphens and dashes inside them included", () => {
    expect(visualRtl("ביי Jean-Luc")).toBe("Jean-Luc ייב");
    expect(visualRtl("יצאה מTeam — Ops")).toBe("Team — Opsמ האצי");
  });
});

describe("visualLtr", () => {
  it("reverses only the Hebrew runs", () => {
    expect(visualLtr("Bye דנה")).toBe("Bye הנד");
    expect(visualLtr("דנה כהן left Ops")).toBe("ןהכ הנד left Ops");
  });
});
