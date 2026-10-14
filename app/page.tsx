import { CreateRoom } from "@/components/landing/CreateRoom";
import { HeroChat } from "@/components/landing/HeroChat";

const STEPS = [
  {
    title: "פותחים חדר",
    text: "בוחרים באילו ימים ושעות מוכנים לצאת, ומתי ההצבעה נסגרת.",
  },
  {
    title: "שולחים לקבוצה",
    text: "כל אחד נכנס עם שם, בוחר שעה, ורואה בזמן אמת איך כולם מצביעים.",
  },
  {
    title: "יוצאים בזמן",
    text: "השעה המנצחת ננעלת, ספירה לאחור מתחילה, ובסוף לוחצים יציאה מול כולם.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-8 px-5 pb-16 pt-12">
      <header>
        <h1 className="font-display text-[5.5rem] font-bold leading-[0.82] tracking-tight">
          מתי לצאת
          <br />
          מהקבוצה?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/80">
          פוטרתם, התפטרתם או שפשוט נמאס? פותחים חדר, שולחים קישור לקבוצה של
          העבודה, וכולם מצביעים באיזו שעה תצאו. בינתיים יש משחקים, עובדות
          מצחיקות וקיר פרידה.
        </p>
      </header>

      <HeroChat />

      <CreateRoom />

      <section aria-labelledby="how" className="mt-4">
        <h2 id="how" className="mb-4 text-lg font-semibold">
          איך זה עובד
        </h2>
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="font-display text-4xl leading-none text-kraft">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold">{step.title}</div>
                <p className="text-ink/70">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
