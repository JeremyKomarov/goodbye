import { afterEach, describe, expect, it, vi } from "vitest";
import { forgetAdminToken, loadAdminToken, saveAdminToken } from "./adminTokens";

afterEach(() => vi.unstubAllGlobals());

describe("admin tokens", () => {
  it("keeps a token per room under the original app's key", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      setItem: (key: string, value: string) => store.set(key, value),
      getItem: (key: string) => store.get(key) ?? null,
      removeItem: (key: string) => store.delete(key),
    });
    saveAdminToken("abc23456", "secret");
    expect(store.get("exit-admin:abc23456")).toBe("secret");
    expect(loadAdminToken("abc23456")).toBe("secret");
    forgetAdminToken("abc23456");
    expect(loadAdminToken("abc23456")).toBeNull();
  });

  it("does nothing, and finds nothing, where storage refuses", () => {
    const refuse = () => {
      throw new Error("SecurityError");
    };
    vi.stubGlobal("localStorage", { setItem: refuse, getItem: refuse, removeItem: refuse });
    expect(() => saveAdminToken("abc23456", "secret")).not.toThrow();
    expect(loadAdminToken("abc23456")).toBeNull();
    expect(() => forgetAdminToken("abc23456")).not.toThrow();
  });
});
