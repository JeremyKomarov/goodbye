// Optional bot check before anonymous sign-in, with Cloudflare Turnstile.
// Off unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set (and captcha is on in Supabase Auth).

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (
    el: HTMLElement,
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
};

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

/**
 * A Turnstile token for `signInAnonymously`, or undefined when captcha is off or
 * the check failed (sign-in then reports the error). The widget only shows up if
 * Cloudflare wants the visitor to tick a box.
 */
export async function captchaToken(): Promise<string | undefined> {
  if (!SITE_KEY) return undefined;
  try {
    await loadScript();
  } catch {
    return undefined;
  }
  const turnstile = window.turnstile;
  if (!turnstile) return undefined;

  return new Promise((resolve) => {
    const box = document.createElement("div");
    box.className = "fixed inset-x-0 bottom-6 z-[60] flex justify-center";
    document.body.append(box);
    let id = "";
    const finish = (token: string | undefined) => {
      if (id) turnstile.remove(id);
      box.remove();
      resolve(token);
    };
    id = turnstile.render(box, {
      sitekey: SITE_KEY,
      language: "he",
      appearance: "interaction-only",
      callback: (token) => finish(token),
      "error-callback": () => finish(undefined),
      "expired-callback": () => finish(undefined),
    });
  });
}
