"use client";

import { useEffect, useRef, useState } from "react";
import { StatusStories } from "@/features/room/components/StatusStories/StatusStories";
import styles from "./RoomLayout.module.scss";

export function Scroll({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={[styles.scroll, className].filter(Boolean).join(" ")}>{children}</div>;
}

/** Show the stories above the countdown only while both fit. */
export function StatusStack({ className, children }: { className: string; children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const box = boxRef.current!;
    const stories = storiesRef.current!;
    const hero = heroRef.current!;
    const observer = new ResizeObserver(() => {
      const position = stories.style.position;
      stories.style.position = "absolute";
      setFits(stories.offsetHeight <= box.clientHeight - hero.offsetHeight);
      stories.style.position = position;
    });
    for (const el of [box, stories, hero]) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={boxRef} className={[styles.statusStack, className].filter(Boolean).join(" ")}>
    <div ref={storiesRef} className={fits ? "" : styles.hiddenStories}><StatusStories /></div>
    <div ref={heroRef} className={styles.hero}>{children}</div>
  </div>;
}
