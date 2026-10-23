import { ROOM_THEMES, type RoomTheme } from "@/shared/utils/roomTheme";

/** Drops per emoji: a shower, or a few that fade when the visitor prefers less motion. */
export const RAIN_DROPS = 16;
export const RAIN_DROPS_REDUCED = 4;
/** Drops on screen at most, so a burst of taps can't pile up. */
export const RAIN_MAX = 80;
/** A drop's longest fall, with its longest delay; it is removed after this. */
export const RAIN_LIFETIME_MS = 4500;

/**
 * Each theme's emoji (shared/utils/roomTheme.ts): `quick`, the wall composer's row to rain on
 * everyone; `party`, the header's button; `door`, rained on every open screen as the chosen hour
 * arrives.
 */
export const THEME_EMOJI: Record<RoomTheme, { quick: readonly string[]; party: string; door: string }> =
  {
    [ROOM_THEMES.classic]: { quick: ["👋", "😢", "🎉", "🫡", "❤️", "😂"], party: "🎉", door: "🚪" },
    [ROOM_THEMES.fired]: { quick: ["📦", "😢", "💼", "🫡", "❤️", "😂"], party: "📦", door: "🚪" },
    [ROOM_THEMES.quit]: { quick: ["🫡", "🥂", "🚀", "👏", "❤️", "😢"], party: "🥂", door: "🫡" },
    [ROOM_THEMES.fedUp]: { quick: ["💅", "🍿", "🔥", "🎭", "😂", "💀"], party: "💅", door: "🔥" },
  };
