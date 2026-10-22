import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/db/users.repo", () => ({
  userIdForAccessToken: async (token: string) => (token === "good" ? "u1" : null),
}));
const { bearerToken, requireCaller } = await import("./bearer");

const request = (authorization?: string) =>
  new Request("http://test", { headers: authorization ? { authorization } : {} });

describe("bearerToken", () => {
  it("reads the token after Bearer, in any case", () => {
    expect(bearerToken(request("Bearer abc"))).toBe("abc");
    expect(bearerToken(request("bearer abc"))).toBe("abc");
  });

  it("is null with no header or another scheme", () => {
    expect(bearerToken(request())).toBeNull();
    expect(bearerToken(request("Basic abc"))).toBeNull();
  });
});

describe("requireCaller", () => {
  it("answers the caller for a token Supabase accepts", async () => {
    await expect(requireCaller(request("Bearer good"))).resolves.toEqual({
      userId: "u1",
      accessToken: "good",
    });
  });

  it("throws unauthorized without a token, or with a rejected one", async () => {
    for (const header of [undefined, "Bearer bad"])
      await expect(requireCaller(request(header))).rejects.toMatchObject({ code: "unauthorized" });
  });
});
