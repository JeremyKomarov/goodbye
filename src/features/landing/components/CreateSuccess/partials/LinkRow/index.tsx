import { CopyButton } from "@/shared/components/CopyButton";
import { cn } from "@/shared/utils/cn";
import { linkRowClasses } from "./LinkRow.classes";
import { LINK_ROW_TONES, type LinkRowTone } from "./LinkRow.const";

/** A link to copy: what it is, the address on one line, and a copy button. */
export function LinkRow({
  label,
  url,
  tone = LINK_ROW_TONES.plain,
}: {
  label: string;
  url: string;
  tone?: LinkRowTone;
}) {
  return (
    <div className={cn(linkRowClasses.root, linkRowClasses.tone[tone])}>
      <div className={linkRowClasses.label}>{label}</div>
      <div className={linkRowClasses.box}>
        <span dir="ltr" className={linkRowClasses.url}>
          {url}
        </span>
        <CopyButton text={url} />
      </div>
    </div>
  );
}

export { LINK_ROW_TONES };
