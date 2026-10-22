import { describe, expect, it } from "vitest";
import { WallDtoSchema } from "./wall.dto";
import { mapWallDto } from "./wall.mapper";

const message = (id: number, userId: string, name: string, at: string) => ({
  id,
  user_id: userId,
  display_name: name,
  body: "bye",
  created_at: at,
});

describe("mapWallDto", () => {
  it("keeps the messages' order and folds reactions by message, then by person", () => {
    const wall = mapWallDto(
      WallDtoSchema.parse({
        messages: [
          message(1, "u1", "Dana", "2026-10-22T10:00:00Z"),
          message(2, "u2", "Yossi", "2026-10-22T10:01:00Z"),
        ],
        reactions: [
          { message_id: 1, user_id: "u2", emoji: "❤️" },
          { message_id: 1, user_id: "u3", emoji: "😂" },
        ],
      }),
    );
    expect(wall.messages.map((m) => m.name)).toEqual(["Dana", "Yossi"]);
    expect(wall.messages[0].createdAt).toBe(Date.UTC(2026, 9, 22, 10));
    expect(wall.reactions).toEqual({ 1: { u2: "❤️", u3: "😂" } });
  });

  it("refuses a reaction the database would not allow", () => {
    const parsed = WallDtoSchema.safeParse({
      messages: [],
      reactions: [{ message_id: 1, user_id: "u2", emoji: "💩" }],
    });
    expect(parsed.success).toBe(false);
  });
});
