export const BUTTON_VARIANTS = {
  primary: "primary",
  secondary: "secondary",
  ghost: "ghost",
  danger: "danger",
  // A tappable phrase inside a line of text — "Hi Dana", "take back my vote". No box, no size.
  link: "link",
  // Around a visual of the caller's own — a status ring, a disc and its title. No box, no
  // decoration, and the children laid out by the caller's class, not the button's label row.
  bare: "bare",
} as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

export const BUTTON_SIZES = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];
