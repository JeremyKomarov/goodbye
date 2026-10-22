import { useTranslations } from "next-intl";
import { cn } from "@/shared/utils/cn";
import { voteLegendClasses } from "./VoteLegend.classes";
import { VOTE_LEGEND_NAMESPACE, voteLegendKeys } from "./VoteLegend.keys.const";

const SHADES = [1, 2, 3, 4, 5] as const;

/** Fewer votes … more: the heatmap's five shades. */
export function VoteLegend() {
  const t = useTranslations(VOTE_LEGEND_NAMESPACE);

  return (
    <div className={voteLegendClasses.root} aria-hidden>
      <span>{t(voteLegendKeys.fewer)}</span>
      {SHADES.map((shade) => (
        <span
          key={shade}
          className={cn(voteLegendClasses.swatch, voteLegendClasses.shade[shade])}
        />
      ))}
      <span>{t(voteLegendKeys.more)}</span>
    </div>
  );
}
