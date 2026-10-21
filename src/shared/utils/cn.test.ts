import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins the truthy classes and drops the rest", () => {
    expect(cn("a", false, "b", null, undefined, "", "c")).toBe("a b c");
  });

  it("returns an empty string for nothing", () => {
    expect(cn()).toBe("");
  });
});
