import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Satori lays text out left-to-right with no bidi support, so Hebrew lines are
 * reversed into visual order here. Runs of digits and Latin are flipped back.
 * Keep each line short: wrapping would break the visual order.
 */
export function visualRtl(line: string) {
  const reversed = Array.from(line).reverse().join("");
  return reversed.replace(/[0-9A-Za-z:.,'׳?!()\-\s]*[0-9A-Za-z][0-9A-Za-z:.,'׳\-]*/g, (run) => {
    const trimmed = run.trim();
    if (!trimmed) return run;
    const lead = run.slice(0, run.indexOf(trimmed));
    const trail = run.slice(run.indexOf(trimmed) + trimmed.length);
    return lead + Array.from(trimmed).reverse().join("") + trail;
  });
}

export async function renderCard({ lines, pill, accent = "#e9edef" }: { lines: string[]; pill: string; accent?: string }) {
  const font = await readFile(join(process.cwd(), "assets/Karantina-Bold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0 90px",
          background: "#0b141a",
          color: "#e9edef",
          fontFamily: "Karantina",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#202c33",
            color: "#ffd279",
            fontSize: 44,
            padding: "10px 28px",
            borderRadius: 18,
            marginBottom: 28,
          }}
        >
          {visualRtl(pill)}
        </div>
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", fontSize: 150, lineHeight: 0.86, color: i === lines.length - 1 ? accent : "#e9edef" }}>
            {visualRtl(line)}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 44,
            background: "#111b21",
            color: "#f15c6d",
            fontSize: 52,
            padding: "14px 36px",
            borderRadius: 24,
          }}
        >
          {visualRtl("יציאה מהקבוצה")}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Karantina", data: font, weight: 700, style: "normal" }] },
  );
}
