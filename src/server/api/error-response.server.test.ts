import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { apiError, handlingApiErrors } = await import("./error-response.server");
const { ApiError, API_ERROR_CODES } = await import("@/core/api/api-error");

describe("handlingApiErrors", () => {
  it("passes a response through", async () => {
    const handler = handlingApiErrors("/t", async () => new Response("ok"));
    expect(await (await handler()).text()).toBe("ok");
  });

  it("keeps a thrown ApiError's code and picks its status", async () => {
    const handler = handlingApiErrors("/t", async () => {
      throw new ApiError(API_ERROR_CODES.voting_closed, 0);
    });
    const response = await handler();
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: { code: "voting_closed" } });
  });

  it("turns anything else into internal, with no detail on the wire", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const handler = handlingApiErrors("/t", async () => {
      throw new Error("secret detail");
    });
    const response = await handler();
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("secret");
  });
});

describe("apiError", () => {
  it("names the field when there is one", async () => {
    const response = apiError(API_ERROR_CODES.invalid_input, { route: "/t", field: "name" });
    expect(await response.json()).toEqual({ error: { code: "invalid_input", field: "name" } });
  });
});
