/** `card` stacks rich options with a check mark; `segment` lays short ones side by side. */
export const CHOICE_GROUP_VARIANTS = {
  card: "card",
  segment: "segment",
} as const;

export type ChoiceGroupVariant = (typeof CHOICE_GROUP_VARIANTS)[keyof typeof CHOICE_GROUP_VARIANTS];
