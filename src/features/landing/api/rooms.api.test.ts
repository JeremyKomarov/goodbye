import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/core/api/api-error";
import { createRoom } from "./rooms.api";
import type { CreateRoomInput } from "./rooms.dto";
import { mapCreatedRoomDto } from "./rooms.mapper";

const input: CreateRoomInput = {
  hostName: "Dana",
  hostGender: "f",
  groupName: "Product team",
  reason: null,
  timezone: "Asia/Jerusalem",
  windowStart: "2026-11-10",
  days: 2,
  dayStartHour: 9,
  dayEndHour: 22,
  votingClosesAt: "2026-11-10T05:00:00.000Z",
  locale: "he",
};

function answer(status: number, body: unknown) {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json(body, { status })));
}

afterEach(() => vi.unstubAllGlobals());

describe("createRoom", () => {
  it("parses the created room and maps it to camelCase", async () => {
    answer(201, { slug: "abc23456", admin_token: "secret" });
    expect(mapCreatedRoomDto(await createRoom(input))).toEqual({
      slug: "abc23456",
      adminToken: "secret",
    });
  });

  it("throws the handler's code and field, not a sentence", async () => {
    answer(422, { error: { code: "close_time_in_past", field: "votingClosesAt" } });
    const error = await createRoom(input).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: "close_time_in_past", field: "votingClosesAt" });
  });

  it("refuses to send what the handler would refuse", async () => {
    answer(201, {});
    await expect(createRoom({ ...input, dayEndHour: 9 })).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
});
