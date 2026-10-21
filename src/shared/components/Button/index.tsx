import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { cn } from "@/shared/utils/cn";
import { buttonClasses } from "./Button.classes";
import { BUTTON_SIZES, BUTTON_VARIANTS, type ButtonSize, type ButtonVariant } from "./Button.const";
import { BUTTON_NAMESPACE, buttonKeys } from "./Button.keys.const";
import type { ButtonProps } from "./Button.types";

export function Button({
  variant = BUTTON_VARIANTS.primary,
  size = BUTTON_SIZES.md,
  icon,
  isLoading = false,
  fullWidth = false,
  type = "button",
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const t = useTranslations(BUTTON_NAMESPACE);
  const iconOnly = icon !== undefined && children === undefined;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        buttonClasses.root,
        buttonClasses.variant[variant],
        buttonClasses.size[size],
        iconOnly && buttonClasses.iconOnly,
        isLoading && buttonClasses.loading,
        fullWidth && buttonClasses.fullWidth,
        className,
      )}
    >
      <span className={buttonClasses.label}>
        {icon && <Icon name={icon} size={size} />}
        {children}
      </span>
      {isLoading && (
        <>
          <span className={buttonClasses.spinner} aria-hidden />
          <span className={buttonClasses.loadingText}>{t(buttonKeys.loading)}</span>
        </>
      )}
    </button>
  );
}

export { BUTTON_SIZES, BUTTON_VARIANTS, type ButtonSize, type ButtonVariant };
