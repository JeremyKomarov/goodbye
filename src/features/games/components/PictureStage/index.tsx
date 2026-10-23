"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  ICON_BOUNDS, type IconLayer, type PicturePuzzle, TOP_SHOWN,
} from "@/features/games/content/pictures.const";
import { cn } from "@/shared/utils/cn";
import { pictureStageClasses } from "./PictureStage.classes";

/** Scale `s`, then shift by (tx, ty), all in % of the stage. */
type Zoom = { s: number; tx: number; ty: number };
const NO_ZOOM: Zoom = { s: 1, tx: 0, ty: 0 };
// How much of the stage an honest picture fills once revealed.
const FILL = 80;

/** The zoom that centres the drawn part of the layers and fills `FILL`% of the stage. */
function frame(layers: readonly IconLayer[]): Zoom {
  let [l, t, r, b] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const layer of layers) {
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

function Layer({ layer, zoom = NO_ZOOM, isZooming = false }: {
  layer: IconLayer;
  zoom?: Zoom;
  isZooming?: boolean;
}) {
  const { s, tx, ty } = zoom;
  return (
    <Image
      src={`/picture-game/${layer.icon}.svg`}
      alt=""
      width={128}
      height={128}
      unoptimized
      draggable={false}
      className={cn(pictureStageClasses.icon, isZooming && pictureStageClasses.zooming)}
      style={{
        left: `${tx + s * layer.x}%`,
        top: `${ty + s * layer.y}%`,
        width: `${s * layer.size}%`,
        transform: `rotate(${layer.rotate ?? 0}deg) scaleX(${layer.flip ? -1 : 1})`,
      }}
    />
  );
}

interface PictureStageProps {
  puzzle: PicturePuzzle;
  /** % of the picture's height not under the curtain; 100 reveals it all. */
  shown: number;
  /** The picture really is its top thing: no bottom part, and it is framed whole once shown. */
  honest: boolean;
  /** Already translated: what a screen reader hears for the picture. */
  label: string;
}

/**
 * One picture stitched from two unrelated parts — `top` clipped to the strip, `bottom` to the
 * rest — under a curtain that drops as `shown` grows. Always laid out left to right, so the
 * icons' positions are never mirrored.
 */
export function PictureStage({ puzzle, shown, honest, label }: PictureStageProps) {
  const isFull = shown >= 100;
  // The curtain starts at the strip's edge and slides down by the extra part now shown.
  const drop = ((Math.min(shown, 100) - TOP_SHOWN) / (100 - TOP_SHOWN)) * 100;

  return (
    <div
      dir="ltr"
      role="img"
      aria-label={label}
      className={pictureStageClasses.root}
      style={{ background: `var(--picture-${puzzle.id})` }}
    >
      {honest ? (
        <div className={pictureStageClasses.layer}>
          {puzzle.top.map((layer, i) => (
            <Layer key={i} layer={layer} zoom={isFull ? frame(puzzle.top) : NO_ZOOM} isZooming />
          ))}
        </div>
      ) : (
        <>
          <div
            className={pictureStageClasses.layer}
            style={{ clipPath: `inset(${TOP_SHOWN}% 0 0 0)` }}
          >
            {puzzle.bottom.map((layer, i) => (
              <Layer key={i} layer={layer} />
            ))}
          </div>
          <div
            className={pictureStageClasses.layer}
            style={{ clipPath: `inset(0 0 ${100 - TOP_SHOWN}% 0)` }}
          >
            {puzzle.top.map((layer, i) => (
              <Layer key={i} layer={layer} />
            ))}
          </div>
        </>
      )}
      <motion.div
        className={pictureStageClasses.curtain}
        style={{ top: `${TOP_SHOWN}%` }}
        initial={false}
        animate={{ y: isFull ? "105%" : `${drop}%` }}
        transition={{ duration: 0.6, ease: [0.6, 0, 0.4, 1] }}
        aria-hidden
      >
        {!isFull && <span className={pictureStageClasses.mark}>?</span>}
      </motion.div>
    </div>
  );
}
