"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { PicturePuzzle, Quarter } from "@/lib/content/pictures";

const QUARTERS: { q: Quarter; left: string; top: string }[] = [
  { q: "tl", left: "0%", top: "0%" },
  { q: "tr", left: "50%", top: "0%" },
  { q: "bl", left: "0%", top: "50%" },
  { q: "br", left: "50%", top: "50%" },
];

/**
 * A scene built from icons. Until `revealed`, three quarters are covered and only
 * `puzzle.quarter` shows; on reveal the covers flip away one after another.
 * Always laid out LTR so icon positions aren't mirrored.
 */
export function PictureStage({
  puzzle,
  revealed,
  className = "",
}: {
  puzzle: PicturePuzzle;
  revealed: boolean;
  className?: string;
}) {
  const shown = QUARTERS.find((q) => q.q === puzzle.quarter)!;
  const covers = QUARTERS.filter((q) => q.q !== puzzle.quarter);

  return (
    <div
      dir="ltr"
      role="img"
      aria-label={
        revealed ? `התמונה המלאה: ${puzzle.truth.label}` : "רבע מתוך תמונה"
      }
      className={`relative aspect-square overflow-hidden rounded-3xl shadow-2xl ${className}`}
      style={{ background: puzzle.bg }}
    >
      {puzzle.layers.map((layer, i) => (
        <Image
          key={i}
          src={`/picture-game/${layer.icon}.svg`}
          alt=""
          width={128}
          height={128}
          unoptimized
          draggable={false}
          className="pointer-events-none absolute h-auto select-none"
          style={{
            left: `${layer.x}%`,
            top: `${layer.y}%`,
            width: `${layer.size}%`,
            transform: `rotate(${layer.rotate ?? 0}deg) scaleX(${layer.flip ? -1 : 1})`,
          }}
        />
      ))}

      {covers.map((cover, i) => (
        <motion.div
          key={cover.q}
          aria-hidden
          className="hatch absolute grid place-items-center border border-night/50 bg-raised"
          style={{
            left: cover.left,
            top: cover.top,
            width: "50%",
            height: "50%",
            transformPerspective: 700,
          }}
          initial={false}
          animate={
            revealed ? { rotateY: -90, opacity: 0 } : { rotateY: 0, opacity: 1 }
          }
          transition={{
            duration: 0.45,
            delay: revealed ? 0.15 + i * 0.18 : 0,
            ease: "easeIn",
          }}
        >
          <span className="font-display text-[clamp(2.5rem,12vw,4.5rem)] font-bold leading-none text-mute/30">
            ?
          </span>
        </motion.div>
      ))}

      {/* Outline the visible quarter while it's the only thing on screen. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-[1.25rem] ring-4 ring-inset ring-pill"
        style={{
          left: shown.left,
          top: shown.top,
          width: "50%",
          height: "50%",
        }}
        initial={false}
        animate={{ opacity: revealed ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
