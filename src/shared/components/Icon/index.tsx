import { cn } from "@/shared/utils/cn";
import { iconClasses } from "./Icon.classes";
import { ICON_NAMES, ICON_SIZES, ICONS, MIRRORED_ICONS, type IconName } from "./Icon.const";
import type { IconProps } from "./Icon.types";

/**
 * Every icon in the app renders through this; nothing else imports lucide-react
 * (02-COMPONENTS.md §6a). Always decorative — an icon-only control names itself.
 */
export function Icon({ name, size = "md", className }: IconProps) {
  const Glyph = ICONS[name];

  return (
    <Glyph
      size={ICON_SIZES[size]}
      className={cn(iconClasses.root, MIRRORED_ICONS.has(name) && iconClasses.mirrored, className)}
      aria-hidden
    />
  );
}

export { ICON_NAMES, type IconName };
