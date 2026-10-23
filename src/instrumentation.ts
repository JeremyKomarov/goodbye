// The server's start: error reporting, when a DSN is set (`shared/utils/errorReporting.ts`).
import { reportRequestError, startErrorReporting } from "@/shared/utils/errorReporting";

export async function register() {
  await startErrorReporting();
}

export const onRequestError = reportRequestError;
