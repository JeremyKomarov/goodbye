"use client";

// The kit catalog: every shared primitive and variant on one page, for checking at 360, 768 and
// 1280px in both directions. Development only — a 404 in production, and not a registry entry
// (04-FEATURES.md §2). Labels are the variants' own names, not copy, so they are not translated.
import type { Route } from "next";
import { notFound } from "next/navigation";
import { useState, type ReactNode } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { roomPath } from "@/core/constants/routes.const";
import { Bubble, BUBBLE_SIDES } from "@/shared/components/Bubble";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { CopyButton } from "@/shared/components/CopyButton";
import { Field } from "@/shared/components/Field";
import { Icon, ICON_NAMES } from "@/shared/components/Icon";
import { LanguageSwitch } from "@/shared/components/LanguageSwitch";
import { Sheet } from "@/shared/components/Sheet";
import { Skeleton, SKELETON_SHAPES } from "@/shared/components/Skeleton";
import { SystemPill, SYSTEM_PILL_TONES } from "@/shared/components/SystemPill";
import { TabBar } from "@/shared/components/TabBar";
import { Ticks, TICK_STATES } from "@/shared/components/Ticks";
import { kitClasses } from "./kit.classes";

const demo = (key: Parameters<typeof roomPath>[0]) => roomPath(key, "demo") as Route;

export default function KitCatalogPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <main className={kitClasses.root}>
        <Section title="LanguageSwitch">
          <LanguageSwitch />
        </Section>

        <Section title="Icon">
          {Object.values(ICON_NAMES).map((name) => (
            <span key={name} title={name}>
              <Icon name={name} />
            </span>
          ))}
        </Section>

        {Object.values(BUTTON_SIZES).map((size) => (
          <Section key={size} title={`Button · ${size}`}>
            {Object.values(BUTTON_VARIANTS).map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
            <Button size={size} icon={ICON_NAMES.send}>
              icon
            </Button>
            <Button size={size} icon={ICON_NAMES.close} aria-label="icon only" />
            <Button size={size} isLoading>
              loading
            </Button>
            <Button size={size} disabled>
              disabled
            </Button>
          </Section>
        ))}
        <Section title="Button · fullWidth">
          <Button fullWidth>fullWidth</Button>
        </Section>

        <Section title="Field">
          <Field label="input" placeholder="placeholder" />
          <Field label="helper" helper="helper text" defaultValue="value" />
          <Field label="error" error="error text" defaultValue="value" />
          <Field as="select" label="select" defaultValue="b">
            <option value="a">a</option>
            <option value="b">b</option>
          </Field>
          <Field label="disabled" disabled defaultValue="value" />
        </Section>

        <Section title="Bubble">
          <div className={kitClasses.column}>
            <Bubble side={BUBBLE_SIDES.in} meta="21:40">
              in · tail
            </Bubble>
            <Bubble side={BUBBLE_SIDES.in} hasTail={false}>
              in · grouped, a much longer message that has to wrap onto a second line at
              phone width
            </Bubble>
            <Bubble
              side={BUBBLE_SIDES.out}
              meta={
                <>
                  21:41 <Ticks />
                </>
              }
            >
              out · tail
            </Bubble>
            <Bubble side={BUBBLE_SIDES.out} hasTail={false}>
              out · grouped
            </Bubble>
          </div>
        </Section>

        <Section title="SystemPill">
          {Object.values(SYSTEM_PILL_TONES).map((tone) => (
            <SystemPill key={tone} tone={tone}>
              {tone}
            </SystemPill>
          ))}
        </Section>

        <Section title="Ticks">
          {Object.values(TICK_STATES).map((state) => (
            <span key={state} className={kitClasses.row}>
              <Ticks state={state} /> {state}
            </span>
          ))}
        </Section>

        <Section title="CopyButton">
          <CopyButton text="https://example.com/r/demo" />
          <CopyButton text="https://example.com/r/demo" label="custom label" />
        </Section>

        <Section title="Sheet">
          <Button variant={BUTTON_VARIANTS.secondary} onClick={() => setSheetOpen(true)}>
            open
          </Button>
          <Sheet open={isSheetOpen} onClose={() => setSheetOpen(false)} title="Sheet">
            <div className={kitClasses.column}>
              <Field label="focus is trapped in here" />
              <Button onClick={() => setSheetOpen(false)}>close</Button>
            </div>
          </Sheet>
        </Section>

        <Section title="Skeleton">
          <div className={kitClasses.column}>
            <Skeleton shape={SKELETON_SHAPES.line} width="60%" />
            <Skeleton shape={SKELETON_SHAPES.line} />
            <Skeleton shape={SKELETON_SHAPES.block} />
          </div>
          <Skeleton shape={SKELETON_SHAPES.circle} />
        </Section>
      </main>

      <TabBar
        label="TabBar"
        items={[
          { href: "/dev/kit", icon: ICON_NAMES.vote, label: "current" },
          { href: demo(FEATURE_KEYS.games), icon: ICON_NAMES.games, label: "games" },
          { href: demo(FEATURE_KEYS.room), icon: ICON_NAMES.wall, label: "badge", badge: 3 },
          { href: demo(FEATURE_KEYS.admin), icon: ICON_NAMES.board, label: "99+", badge: 120 },
        ]}
      />
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={kitClasses.section}>
      <h2 className={kitClasses.heading}>{title}</h2>
      <div className={kitClasses.row}>{children}</div>
    </section>
  );
}
