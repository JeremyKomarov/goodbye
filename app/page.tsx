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

// One screen, no page scroll. Phones: headline, chat (fills what's left), button.
// Desktop: text and button on the right, chat on the left.
export default function Home() {
  return (
    <main className="mx-auto flex h-dvh max-w-md flex-col gap-5 overflow-hidden px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] short:gap-3 short:pt-4 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_26rem] lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-20 lg:gap-y-10 lg:px-10 lg:py-10">
      <header className="shrink-0 lg:col-start-1 lg:row-start-1 lg:self-end">
        <h1 className="font-display text-[min(5.5rem,22vw)] font-bold leading-[0.82] tracking-tight short:text-[3.75rem] lg:text-[8.5rem]">
          מתי לצאת
          <br />
          מהקבוצה?
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink/80 short:mt-2 short:text-[15px] short:leading-snug lg:mt-7 lg:max-w-xl lg:text-xl">
          פוטרתם, התפטרתם או שפשוט נמאס? פותחים חדר, שולחים קישור לקבוצה של
          העבודה, וכולם מצביעים באיזו שעה תצאו. בינתיים יש משחקים, עובדות
          מצחיקות וקיר פרידה.
        </p>
      </header>

      <div className="min-h-0 flex-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[min(42rem,calc(100dvh-5rem))] lg:flex-none">
        <HeroChat />
      </div>

      <div className="shrink-0 lg:col-start-1 lg:row-start-2 lg:max-w-md lg:self-start">
        <CreateRoom />
        <ol
          className="mt-10 hidden flex-col gap-4 lg:flex"
          aria-label="איך זה עובד"
        >
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
      </div>
    </main>
  );
}
