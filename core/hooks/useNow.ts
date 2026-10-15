"use client";

import { useSyncExternalStore } from "react";

// One shared ticker for every countdown on the page.
let current = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((l) => l());
    }, 250);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  if (!current) current = Date.now();
  return current;
}

/** Current time in ms, refreshed 4×/s. Returns 0 during SSR and hydration. */
export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}
