import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PREVIEW_SIZE } from "@/core/constants/api-endpoints.const";
import { localeDirection, type Locale } from "@/core/i18n/routing";
import { visualLtr, visualRtl } from "@/shared/utils/bidi";

// The card is drawn without the stylesheet, so its colours are the tokens' values, copied here:
// --neutral-950, -900, -800, -100, --accent-pill and --accent-exit (core/styles/tokens.scss).
const OG_COLORS = {
  page: "#0b141a",
  badge: "#111b21",
  pill: "#202c33",
  text: "#e9edef",
  pillText: "#ffd279",
  exit: "#f15c6d",
};

// The big lines shrink to fit: Karantina is narrow, about 0.42em a letter.
const LINE_SIZE_MAX = 150;
const LINE_WIDTH = 1020;
const LETTER_EM = 0.42;

export interface CardText {
  pill: string;
  /** Two short lines; the last in the exit red. */
  lines: string[];
  /** The red "exit group" badge under them. */
  badge: string;
}

/**
 * The link preview: a pill, big lines, and WhatsApp's red "Exit group" — in the reader's direction.
 * Satori has no bidi, so every line is put into visual order first.
 */
export async function renderCard(locale: Locale, { pill, lines, badge }: CardText) {
  const font = await readFile(join(process.cwd(), "assets/Karantina-Bold.ttf"));
  const isRtl = localeDirection(locale) === "rtl";
  const visual = isRtl ? visualRtl : visualLtr;
  const longest = Math.max(...lines.map((line) => line.length));
  const size = Math.min(LINE_SIZE_MAX, Math.floor(LINE_WIDTH / (longest * LETTER_EM)));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: isRtl ? "flex-end" : "flex-start",
          justifyContent: "center",
          padding: "0 90px",
          background: OG_COLORS.page,
          color: OG_COLORS.text,
          fontFamily: "Karantina",
        }}
      >
        <div
          style={{
            display: "flex",
            background: OG_COLORS.pill,
            color: OG_COLORS.pillText,
            fontSize: 44,
            padding: "10px 28px",
            borderRadius: 18,
            marginBottom: 28,
          }}
        >
          {visual(pill)}
        </div>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              fontSize: size,
              lineHeight: 0.86,
              color: i === lines.length - 1 ? OG_COLORS.exit : OG_COLORS.text,
            }}
          >
            {visual(line)}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            marginTop: 44,
            background: OG_COLORS.badge,
            color: OG_COLORS.exit,
            fontSize: 52,
            padding: "14px 36px",
            borderRadius: 24,
          }}
        >
          {visual(badge)}
        </div>
      </div>
    ),
    { ...PREVIEW_SIZE, fonts: [{ name: "Karantina", data: font, weight: 700, style: "normal" }] },
  );
}
