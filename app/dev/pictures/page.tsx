import styles from "./page.module.scss";
import { notFound } from "next/navigation";
import { PictureStage } from "@/features/games/components/PictureStage/PictureStage";
import { PICTURES } from "@/core/content/pictures";

// Dev-only gallery for tuning "מה בתמונה?" scenes. Not available in production.
export default function PicturesPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className={styles.view1}>
      {PICTURES.map((p) => (
        <section key={p.id} className={styles.view2}>
          <h2 className={styles.view3}>
            {p.id}: {p.decoy.label} → {p.truth.label}
          </h2>
          <div className={styles.view4}>
            <PictureStage puzzle={p} shown={25} />
            <PictureStage puzzle={p} shown={100} />
            <PictureStage puzzle={p} shown={100} honest />
          </div>
        </section>
      ))}
    </main>
  );
}
