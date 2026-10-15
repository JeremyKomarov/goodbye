import { exitEvent, icsFile } from "@/core/calendar";
import { siteUrl } from "@/core/site";
import { getRoomBySlug } from "@/core/supabase/server";

/** The locked exit hour as a calendar file (Apple Calendar, Outlook, most phones). */
export async function GET(_request: Request, ctx: RouteContext<"/r/[slug]/exit.ics">) {
  const { slug } = await ctx.params;
  const room = await getRoomBySlug(slug);
  const event = room && exitEvent(room, `${siteUrl()}/r/${room.slug}`);
  if (!event) return new Response("השעה עוד לא ננעלה", { status: 404 });
  return new Response(icsFile(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="exit-${slug}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
