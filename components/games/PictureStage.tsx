"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  ICON_BOUNDS,
  type Layer,
  type PicturePuzzle,
  TOP_SHOWN,
} from "@/lib/content/pictures";

/** Scale `s` then shift by (tx, ty), all in % of the stage. */
type Zoom = { s: number; tx: number; ty: number };
const NO_ZOOM: Zoom = { s: 1, tx: 0, ty: 0 };
/** How much of the stage an honest picture fills once revealed. */
const FILL = 80;

/** The zoom that centers the drawn part of `layers` and fills FILL% of the stage. */
function frame(layers: Layer[]): Zoom {
  let l = Infinity;
  let t = Infinity;
  let r = -Infinity;
  let b = -Infinity;
  for (const layer of layers) {
    if ("rect" in layer) {
      const q = layer.rect;
      l = Math.min(l, q.x);
      t = Math.min(t, q.y);
      r = Math.max(r, q.x + q.w);
      b = Math.max(b, q.y + q.h);
      continue;
    }
    const [bl, bt, br, bb] = ICON_BOUNDS[layer.icon] ?? [0, 0, 1, 1];
    const [left, right] = layer.flip ? [1 - br, 1 - bl] : [bl, br];
    l = Math.min(l, layer.x + layer.size * left);
    t = Math.min(t, layer.y + layer.size * bt);
    r = Math.max(r, layer.x + layer.size * right);
    b = Math.max(b, layer.y + layer.size * bb);
  }
  const s = Math.min(FILL / (r - l), FILL / (b - t));
  return { s, tx: 50 - (s * (l + r)) / 2, ty: 50 - (s * (t + b)) / 2 };
}

function LayerView({
  layer,
  zoom = NO_ZOOM,
  className = "",
}: {
  layer: Layer;
  zoom?: Zoom;
  className?: string;
}) {
  const { s, tx, ty } = zoom;
  if ("rect" in layer) {
    const r = layer.rect;
    return (
      <div
        className={`absolute ${className}`}
        style={{
          left: `${tx + s * r.x}%`,
          top: `${ty + s * r.y}%`,
          width: `${s * r.w}%`,
          height: `${s * r.h}%`,
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
      className={`pointer-events-none absolute h-auto max-w-none select-none ${className}`}
      style={{
        left: `${tx + s * layer.x}%`,
        top: `${ty + s * layer.y}%`,
        width: `${s * layer.size}%`,
        transform: `rotate(${layer.rotate ?? 0}deg) scaleX(${layer.flip ? -1 : 1})`,
      }}
    />
  );
}

/**
 * One picture stitched from two unrelated parts: `top` is clipped to the top strip
 * and `bottom` to everything below it. A curtain covers the picture below `shown`
 * (% of its height) and slides down as `shown` grows; at 100 everything is visible.
 * An `honest` picture has the same top strip, but it really is the top thing: no
 * bottom part, and once revealed the camera pulls back to frame the whole of it.
 * Always laid out LTR so icon positions aren't mirrored.
 */
export function PictureStage({
  puzzle,
  shown,
  honest = false,
  className = "",
}: {
  puzzle: PicturePuzzle;
  shown: number;
  honest?: boolean;
  className?: string;
}) {
  const full = shown >= 100;
  // The curtain starts at the strip line; slide it down by the extra part now shown.
  const drop = ((Math.min(shown, 100) - TOP_SHOWN) / (100 - TOP_SHOWN)) * 100;
  const answer = honest ? puzzle.decoy : puzzle.truth;
  return (
    <div
      dir="ltr"
      role="img"
      aria-label={
        full ? `התמונה המלאה: ${answer.label}` : `חלק מתמונה (${shown}% ממנה)`
      }
      className={`relative aspect-square overflow-hidden rounded-3xl shadow-2xl ${className}`}
      style={{ background: puzzle.bg }}
    >
      {honest ? (
        <div className="absolute inset-0">
          {puzzle.top.map((layer, i) => (
            <LayerView
              key={i}
              layer={layer}
              zoom={full ? frame(puzzle.top) : NO_ZOOM}
              className="transition-[left,top,width,height] delay-500 duration-700 ease-[cubic-bezier(0.6,0,0.4,1)] motion-reduce:transition-none"
            />
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}

      {/* The curtain over the rest of the picture. */}
      <motion.div
        aria-hidden
        className="hatch absolute inset-x-0 bottom-0 grid place-items-center border-t-4 border-pill bg-raised"
        style={{ top: `${TOP_SHOWN}%` }}
        initial={false}
        animate={{ y: full ? "105%" : `${drop}%` }}
        transition={{ duration: 0.6, ease: [0.6, 0, 0.4, 1] }}
      >
        {!full && (
          <span className="font-display text-[clamp(3rem,16vw,6rem)] font-bold leading-none text-mute/25">
            ?
          </span>
        )}
      </motion.div>
    </div>
  );
}
