import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { visualRtl } from "@/lib/bidi";

export const OG_SIZE = { width: 1200, height: 630 };

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
