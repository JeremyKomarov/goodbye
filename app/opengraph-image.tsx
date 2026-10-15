import { OG_SIZE, renderCard } from "@/core/og";

export const alt = "מתי לצאת מהקבוצה?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderCard({ pill: "הקבוצה מחליטה, אתם יוצאים", lines: ["מתי לצאת", "מהקבוצה?"], accent: "#f15c6d" });
}
