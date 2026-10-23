// Errors to Sentry, once `NEXT_PUBLIC_SENTRY_DSN` is set; without it nothing is loaded or sent.
// The SDK is imported on first use, so a page carries none of it until reporting is on.
import { env } from "@/core/config/env";

const sentry = () => import("@sentry/nextjs");

const options = env.sentryDsn
  ? {
      dsn: env.sentryDsn,
      environment: process.env.NODE_ENV,
      // Errors only: no tracing, no replays, and no IP addresses or cookies.
      tracesSampleRate: 0,
      sendDefaultPii: false,
    }
  : undefined;

export const isReporting = options !== undefined;

/** Starts the SDK — once per runtime, from `instrumentation.ts` and `instrumentation-client.ts`. */
export async function startErrorReporting() {
  if (options) (await sentry()).init(options);
}

/**
 * Whether the server already reported this error: one thrown while rendering on the server reaches
 * the client's error boundary with a `digest`, after `onRequestError` has sent it.
 */
export function reportedOnServer(error: unknown) {
  return error instanceof Error && "digest" in error && typeof error.digest === "string";
}

/** An error an error boundary caught; the SDK catches the uncaught ones itself. */
export async function reportError(error: unknown) {
  if (!options || reportedOnServer(error)) return;
  (await sentry()).captureException(error);
}

/** Next's `onRequestError`: an error thrown while answering a request, on the server. */
export async function reportRequestError(
  ...args: Parameters<Awaited<ReturnType<typeof sentry>>["captureRequestError"]>
) {
  if (options) (await sentry()).captureRequestError(...args);
}
