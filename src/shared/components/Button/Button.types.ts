import type { ButtonHTMLAttributes } from "react";
import type { IconName } from "@/shared/components/Icon";
import type { ButtonSize, ButtonVariant } from "./Button.const";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shown before the label. With no children, the button is icon-only and needs `aria-label`. */
  icon?: IconName;
  isLoading?: boolean;
  fullWidth?: boolean;
}
