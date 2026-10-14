import { notFound } from "next/navigation";
import { PictureStage } from "@/components/games/PictureStage";
import { PICTURES } from "@/lib/content/pictures";

// Dev-only gallery for tuning "מה בתמונה?" scenes. Not available in production.
export default function PicturesPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-6 p-6">
      {PICTURES.map((p) => (
        <section key={p.id} className="rounded-2xl bg-panel p-3">
          <h2 className="mb-2 text-sm">
            {p.id}: {p.decoy.label} → {p.truth.label} ({p.quarter})
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <PictureStage puzzle={p} revealed={false} />
            <PictureStage puzzle={p} revealed />
          </div>
        </section>
      ))}
    </main>
  );
}
