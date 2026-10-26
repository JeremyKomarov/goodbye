import { describe, expect, it, vi } from "vitest";

vi.mock("@/core/supabase/session", () => ({}));
vi.mock("@/features/room/api/login-code.api", () => ({}));

const { keepAndSignIn } = await import("./useLoginCode");

const USER = "11111111-1111-1111-1111-111111111111";

function steps(created: boolean) {
  const order: string[] = [];
  return {
    order,
    steps: {
      fetchLoginCode: vi.fn(async () => {
        order.push("fetch");
        return { code: "ABCD2345", created };
      }),
      saveLoginCode: vi.fn(() => void order.push("save")),
      signInWithCode: vi.fn(async () => void order.push("sign in")),
    },
  };
}

describe("keepAndSignIn", () => {
  it("keeps a new code on the device before signing back in with it", async () => {
    const { order, steps: s } = steps(true);
    await expect(keepAndSignIn(USER, true, s)).resolves.toBe("ABCD2345");
    expect(order).toEqual(["fetch", "save", "sign in"]);
  });

  it("keeps a code it already had, and stays signed in", async () => {
    const { order, steps: s } = steps(false);
    await keepAndSignIn(USER, false, s);
    expect(order).toEqual(["fetch", "save"]);
  });

  it("still keeps the code when the sign-in fails", async () => {
    const { steps: s } = steps(true);
    s.signInWithCode.mockRejectedValue(new Error("closed"));
    await expect(keepAndSignIn(USER, true, s)).rejects.toThrow();
    expect(s.saveLoginCode).toHaveBeenCalledWith(USER, "ABCD2345");
  });
});
