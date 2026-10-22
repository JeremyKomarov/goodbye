"use client";

import { useSyncExternalStore } from "react";

// One shared ticker for every countdown on the page, running only while something listens.
let current = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((notify) => notify());
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

/** The current time in ms, refreshed four times a second. 0 on the server and while hydrating. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}
