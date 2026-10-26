import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const hitRateLimit = vi.fn<(key: string, windowSeconds: number, max: number) => Promise<boolean>>();
vi.mock("@/server/db/rate-limits.repo", () => ({ hitRateLimit }));
const { callerIp, requireWithinLimit } = await import("./rate-limit.server");

const budget = { name: "wall", windowSeconds: 60, max: 5 };
const request = (headers: Record<string, string>) => new Request("http://test", { headers });

describe("callerIp", () => {
  it("reads the first entry of x-forwarded-for", () => {
    expect(callerIp(request({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip, then to one shared key", () => {
    expect(callerIp(request({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8");
    expect(callerIp(request({}))).toBe("unknown");
  });
});

describe("requireWithinLimit", () => {
  it("counts under the budget's name and the caller, and passes within budget", async () => {
    hitRateLimit.mockResolvedValueOnce(true);
    await expect(requireWithinLimit(budget, "u1")).resolves.toBeUndefined();
    expect(hitRateLimit).toHaveBeenLastCalledWith("wall:u1", 60, 5);
  });

  it("throws rate_limited once the budget is spent", async () => {
    hitRateLimit.mockResolvedValueOnce(false);
    await expect(requireWithinLimit(budget, "u1")).rejects.toMatchObject({
      code: "rate_limited",
      status: 429,
    });
  });

  it("lets a failed count fail the request, not pass it", async () => {
    hitRateLimit.mockRejectedValueOnce(Object.assign(new Error(), { code: "upstream_failed" }));
    await expect(requireWithinLimit(budget, "u1")).rejects.toMatchObject({ code: "upstream_failed" });
  });
});
