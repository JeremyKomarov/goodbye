import { g } from "@/lib/hebrew";
import { OG_SIZE, renderCard } from "@/lib/og";
import { getRoomBySlug } from "@/lib/supabase/server";

export const alt = "חדר הצבעה: מתי לצאת מהקבוצה";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return renderCard({ pill: "החדר לא נמצא", lines: ["מתי לצאת", "מהקבוצה?"] });

  const name = room.host_name.slice(0, 14);
  const group = room.group_name.slice(0, 16);
  if (room.status === "exited") {
    return renderCard({ pill: `${name} ${g(room.host_gender, "יצא", "יצאה")} מהקבוצה`, lines: [`ביי ${name}`, `מ${group}`], accent: "#f15c6d" });
  }
  return renderCard({
    pill: room.status === "voting" ? "אתם מחליטים. נכנסים ומצביעים" : "הקבוצה כבר החליטה",
    lines: [`מתי ${name} ${g(room.host_gender, "יוצא", "יוצאת")}`, `מ${group}?`],
    accent: "#f15c6d",
  });
}
