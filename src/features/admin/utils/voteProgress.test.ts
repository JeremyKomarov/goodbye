import { describe, expect, it } from "vitest";
import type { AdminPlayer } from "@/features/admin/types/admin.types";
import { voteProgress } from "./voteProgress";

const player = (name: string, hasVoted: boolean, isHost = false): AdminPlayer => ({
  userId: name,
  name,
  isHost,
  code: null,
  hasVoted,
});

describe("voteProgress", () => {
  it("counts the guests and names who hasn't voted, leaving the host out", () => {
    const progress = voteProgress([
      player("Jeremy", false, true),
      player("Dana", true),
      player("Yossi", false),
      player("Noa", false),
    ]);
    expect(progress.total).toBe(3);
    expect(progress.voted).toBe(1);
    expect(progress.waiting.map((p) => p.name)).toEqual(["Yossi", "Noa"]);
  });

  it("is everyone in once each guest has voted", () => {
    expect(voteProgress([player("Dana", true), player("Noa", true)]).waiting).toEqual([]);
  });

  it("has no one to count with only the host in the room", () => {
    expect(voteProgress([player("Jeremy", false, true)])).toEqual({ total: 0, voted: 0, waiting: [] });
  });
});
