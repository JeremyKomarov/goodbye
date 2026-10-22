import { env } from "@/core/config/env";

// An optional bot check before anonymous sign-in, with Cloudflare Turnstile — ported from the
// original. Off unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set and captcha is on in Supabase Auth.
// The widget only appears if Cloudflare wants the visitor to tick a box.

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface Turnstile {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      language?: string;
      appearance?: "always" | "execute" | "interaction-only";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback"?: () => void;
    },
  ) => string;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let loading: Promise<void> | null = null;

function loadScript() {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("turnstile"));
    };
    document.head.append(script);
  });
  return loading;
}

/** A Turnstile token, or undefined when captcha is off or failed (sign-in then reports it). */
export async function captchaToken(language: string): Promise<string | undefined> {
  const sitekey = env.turnstileSiteKey;
  if (!sitekey) return undefined;
  try {
    await loadScript();
  } catch {
    return undefined;
  }
  const turnstile = window.turnstile;
  if (!turnstile) return undefined;

  return new Promise((resolve) => {
    // Pinned above everything, centred near the bottom, outside React's tree.
    const box = document.createElement("div");
    Object.assign(box.style, {
      position: "fixed",
      insetInline: "0",
      bottom: "1.5rem",
      zIndex: "60",
      display: "flex",
      justifyContent: "center",
    });
    document.body.append(box);
    let id = "";
    const finish = (token: string | undefined) => {
      if (id) turnstile.remove(id);
      box.remove();
      resolve(token);
    };
    id = turnstile.render(box, {
      sitekey,
      language,
      appearance: "interaction-only",
      callback: (token) => finish(token),
      "error-callback": () => finish(undefined),
      "expired-callback": () => finish(undefined),
    });
  });
}
