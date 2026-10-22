export const TAB_BAR_VARIANTS = {
  // The phone's bottom bar: icon over label.
  bar: "bar",
  // A wide screen's chat list, like WhatsApp Web: icon, label, a live line under it, a meta.
  list: "list",
} as const;

export type TabBarVariant = (typeof TAB_BAR_VARIANTS)[keyof typeof TAB_BAR_VARIANTS];
