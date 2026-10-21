import type { Messages } from "./messages";
import type { routing } from "./routing";

// Makes every `t()` key and every locale checked by tsc (02-COMPONENTS.md §9).
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
