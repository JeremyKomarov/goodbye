import { formatHour, formatWeekday, g } from "@/lib/hebrew";
import { OG_SIZE, renderCard } from "@/lib/og";
import { verdictText } from "@/lib/room-view";
import { getRoomBySlug } from "@/lib/supabase/server";

export const alt = "חדר הצבעה: מתי לצאת מהקבוצה";
export const size = OG_SIZE;
export const contentType = "image/png";

// The preview tells the story so far: the question, then the decision, then the verdict.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return renderCard({ pill: "החדר לא נמצא", lines: ["מתי לצאת", "מהקבוצה?"] });

  const name = room.host_name.slice(0, 14);
  const group = room.group_name.slice(0, 16);
  if (room.status === "exited") {
    return renderCard({
      pill: `${name} ${g(room.host_gender, "יצא", "יצאה")} מ${group}`,
      lines: [`ביי ${name}`, verdictText(room) ?? "זהו, נגמר"],
      accent: "#f15c6d",
    });
  }
  if (room.status === "locked" && room.locked_slot) {
    const at = Date.parse(room.locked_slot);
    return renderCard({
      pill: "הקבוצה החליטה",
      lines: [`${name} ${g(room.host_gender, "יוצא", "יוצאת")}`, `${formatWeekday(at, room.timezone)} בשעה ${formatHour(at, room.timezone)}`],
      accent: "#f15c6d",
    });
  }
  return renderCard({
    pill: "אתם מחליטים. נכנסים ומצביעים",
    lines: [`מתי ${name} ${g(room.host_gender, "יוצא", "יוצאת")}`, `מ${group}?`],
    accent: "#f15c6d",
  });
}
