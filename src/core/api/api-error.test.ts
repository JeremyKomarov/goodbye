import { describe, expect, it } from "vitest";
import { API_ERROR_CODES, API_ERROR_STATUS, ApiError, toApiError } from "./api-error";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("toApiError", () => {
  it("reads the code from the body, not the status", async () => {
    const error = await toApiError(json({ error: { code: "name_taken", field: "name" } }, 409));
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe(API_ERROR_CODES.name_taken);
    expect(error.field).toBe("name");
  });

  it("tells two codes that share a status apart", async () => {
    const closed = await toApiError(json({ error: { code: "voting_closed" } }, 409));
    const taken = await toApiError(json({ error: { code: "name_taken" } }, 409));
    expect(closed.code).not.toBe(taken.code);
  });

  it("falls back to the status for a body that is not ours", async () => {
    expect((await toApiError(new Response("<html>", { status: 502 }))).code).toBe("upstream_failed");
    expect((await toApiError(new Response("", { status: 418 }))).code).toBe("internal");
  });

  it("never carries a sentence in its message", async () => {
    const error = await toApiError(json({ error: { code: "forbidden" } }, 403));
    expect(error.message).toBe("forbidden (403)");
  });
});

describe("API_ERROR_STATUS", () => {
  it("has a status for every code", () => {
    for (const code of Object.values(API_ERROR_CODES)) expect(API_ERROR_STATUS[code]).toBeTypeOf("number");
  });
});
