import { useCallback, useEffect, useRef } from "react";

// Others drop a typing signal after 4s, so it is renewed every 2s while the draft changes, and
// taken back after 2.5s without a keystroke.
const RENEW_MS = 2000;
const IDLE_MS = 2500;

/** Turns keystrokes in a draft into "is typing" on and off, without flooding the channel. */
export function useTypingSignal(send: (isTyping: boolean) => void) {
  const isTyping = useRef(false);
  const lastSent = useRef(0);
  const idle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const stop = useCallback(() => {
    clearTimeout(idle.current);
    if (!isTyping.current) return;
    isTyping.current = false;
    send(false);
  }, [send]);

  const onDraft = useCallback(
    (draft: string) => {
      clearTimeout(idle.current);
      if (!draft) return stop();
      const at = performance.now();
      if (!isTyping.current || at - lastSent.current > RENEW_MS) {
        isTyping.current = true;
        lastSent.current = at;
        send(true);
      }
      idle.current = setTimeout(stop, IDLE_MS);
    },
    [send, stop],
  );

  useEffect(() => stop, [stop]);

  return { onDraft, stop };
}
