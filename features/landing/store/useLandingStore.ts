"use client";

import { create } from "zustand";
import type { Draft } from "@/features/landing/types";
import type { Reason } from "@/core/types";

type LandingState = {
  reason: Reason | null;
  theme: Reason;
  draft: Draft;
  pickReason: (reason: Reason | null) => void;
  setDraft: (draft: Draft) => void;
};

export const useLandingStore = create<LandingState>((set) => ({
  reason: "fired",
  theme: "fired",
  draft: { hostName: "", groupName: "" },
  pickReason: (reason) => set((state) => ({ reason, theme: reason ?? state.theme })),
  setDraft: (draft) => set({ draft }),
}));
