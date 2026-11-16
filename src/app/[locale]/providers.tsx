"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { useState, type ReactNode } from "react";

/**
 * One query client per browser tab — created in state, so a render never makes a second one. And
 * every page's script-driven motion follows the visitor's reduced-motion setting, as the CSS does
 * (`tokens.scss`): a step or a bubble arrives in place, with its fade only.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QueryClientProvider>
  );
}
