import type { GameId } from "@/core/types";

export const TILES: { id: GameId; art: string; blurb: string; accent: string }[] = [
  {
    id: "runaway",
    art: "🚪",
    blurb: "הכפתור בורח. כמה מהר תתפסו אותו?",
    accent: "var(--color-exit)",
  },
  {
    id: "trivia",
    art: "🧠",
    blurb: "10 שאלות על וואטסאפ, משרדים ואנשים שפוטרו והצליחו",
    accent: "var(--color-kraft)",
  },
  {
    id: "catch",
    art: "🔔",
    blurb: "פוצצו התראות לפני שהן קוברות אתכם. רק לא את הבוס",
    accent: "var(--color-tick)",
  },
  {
    id: "picture",
    art: "🖼️",
    blurb: "רואים רבע תמונה ובטוחים שזה ברור. ואז רואים את השאר",
    accent: "var(--color-pill)",
  },
];
