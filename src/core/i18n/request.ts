import { locale as rootLocale } from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { messages } from "./messages";
import { isLocale, routing } from "./routing";

// Resolves the active locale and its dictionary for each request (02-COMPONENTS.md §9). The locale
// is the hidden [locale] root param the proxy rewrote to; reading it through next/root-params keeps
// every page prerenderable, where a header read would not (docs/DECISIONS.md #6).
export default getRequestConfig(async () => {
  const requested = await rootLocale();
  const locale = isLocale(requested) ? requested : routing.defaultLocale;
  return { locale, messages: messages[locale] };
});
