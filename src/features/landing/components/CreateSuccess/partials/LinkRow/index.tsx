import { CopyButton } from "@/shared/components/CopyButton";
import { linkRowClasses } from "./LinkRow.classes";

/** A link to copy: what it is (unless a heading above says so), the address on one line, a copy button. */
export function LinkRow({ label, url }: { label?: string; url: string }) {
  return (
    <div className={linkRowClasses.root}>
      {label && <div className={linkRowClasses.label}>{label}</div>}
      <div className={linkRowClasses.box}>
        <span dir="ltr" className={linkRowClasses.url}>
          {url}
        </span>
        <CopyButton text={url} />
      </div>
    </div>
  );
}
