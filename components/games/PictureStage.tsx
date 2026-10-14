"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  type Layer,
  type PicturePuzzle,
  TOP_SHOWN,
} from "@/lib/content/pictures";

function LayerView({ layer }: { layer: Layer }) {
  if ("rect" in layer) {
    const r = layer.rect;
    return (
      <div
        className="absolute"
        style={{
          left: `${r.x}%`,
          top: `${r.y}%`,
          width: `${r.w}%`,
          height: `${r.h}%`,
          background: r.fill,
          borderRadius: r.radius ? `${r.radius}px` : undefined,
          transform: r.rotate ? `rotate(${r.rotate}deg)` : undefined,
        }}
      />
    );
  }
  return (
    <Image
      src={`/picture-game/${layer.icon}.svg`}
      alt=""
      width={128}
      height={128}
      unoptimized
      draggable={false}
      className="pointer-events-none absolute h-auto max-w-none select-none"
      style={{
        left: `${layer.x}%`,
        top: `${layer.y}%`,
        width: `${layer.size}%`,
        transform: `rotate(${layer.rotate ?? 0}deg) scaleX(${layer.flip ? -1 : 1})`,
      }}
    />
  );
}

/**
 * One picture stitched from two unrelated parts: `top` is clipped to the top strip
 * and `bottom` to everything below it. Until `revealed`, a curtain hides the bottom;
 * on reveal it drops. Always laid out LTR so icon positions aren't mirrored.
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
  return (
    <div
      dir="ltr"
      role="img"
      aria-label={
        revealed
          ? `התמונה המלאה: ${puzzle.truth.label}`
          : "החלק העליון של תמונה"
      }
      className={`relative aspect-square overflow-hidden rounded-3xl shadow-2xl ${className}`}
      style={{ background: puzzle.bg }}
    >
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(${TOP_SHOWN}% 0 0 0)` }}
      >
        {puzzle.bottom.map((layer, i) => (
          <LayerView key={i} layer={layer} />
        ))}
      </div>
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 ${100 - TOP_SHOWN}% 0)` }}
      >
        {puzzle.top.map((layer, i) => (
          <LayerView key={i} layer={layer} />
        ))}
      </div>

      {/* The curtain over the rest of the picture. */}
      <motion.div
        aria-hidden
        className="hatch absolute inset-x-0 bottom-0 grid place-items-center border-t-4 border-pill bg-raised"
        style={{ top: `${TOP_SHOWN}%` }}
        initial={false}
        animate={revealed ? { y: "105%" } : { y: 0 }}
        transition={
          revealed
            ? { duration: 0.7, delay: 0.2, ease: [0.6, 0, 0.4, 1] }
            : { duration: 0 }
        }
      >
        <span className="font-display text-[clamp(3rem,16vw,6rem)] font-bold leading-none text-mute/25">
          ?
        </span>
      </motion.div>
    </div>
  );
}
