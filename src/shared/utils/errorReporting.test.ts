import { describe, expect, it, vi } from "vitest";
import { reportedOnServer } from "./errorReporting";

// No DSN: nothing here may load the SDK.
vi.mock("@/core/config/env", () => ({ env: {} }));

describe("reportedOnServer", () => {
  it("is true for an error the server rendered, which carries a digest", () => {
    expect(reportedOnServer(Object.assign(new Error("x"), { digest: "123" }))).toBe(true);
  });

  it("is false for an error thrown in the browser", () => {
    expect(reportedOnServer(new Error("x"))).toBe(false);
  });

  it("is false for a thrown value that is not an Error", () => {
    expect(reportedOnServer({ digest: "123" })).toBe(false);
    expect(reportedOnServer("boom")).toBe(false);
  });
});
