/** Drops per emoji: a shower, or a few that fade when the visitor prefers less motion. */
export const RAIN_DROPS = 16;
export const RAIN_DROPS_REDUCED = 4;
/** Drops on screen at most, so a burst of taps can't pile up. */
export const RAIN_MAX = 80;
/** A drop's longest fall, with its longest delay; it is removed after this. */
export const RAIN_LIFETIME_MS = 4500;

/** The emoji the wall's composer offers to rain on everyone. */
export const QUICK_EMOJI = ["👋", "😢", "🎉", "🫡", "❤️", "😂"] as const;
/** The header's button rains this. */
export const PARTY_EMOJI = "🎉";
/** Rained on every open screen as the chosen hour arrives. */
export const DOOR_EMOJI = "🚪";
