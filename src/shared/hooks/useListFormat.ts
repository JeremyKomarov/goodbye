import { useLocale } from "next-intl";
import { useMemo } from "react";

/** Names joined the reader's way: "Dana, Noa and you", "דנה, נועה ואת/ה". */
export function useListFormat() {
  const locale = useLocale();
  return useMemo(() => {
    const format = new Intl.ListFormat(locale, { type: "conjunction" });
    return (items: string[]) => format.format(items);
  }, [locale]);
}
