import type { ReactNode } from "react";
import type { ChoiceGroupVariant } from "./ChoiceGroup.const";

export interface ChoiceOption<Value extends string> {
  value: Value;
  /** Already translated. */
  label: ReactNode;
  /** A second, quieter line — `card` only. */
  description?: ReactNode;
  /** Decorative, before the label — an emoji in a disc — `card` only. */
  leading?: ReactNode;
}

export interface ChoiceGroupProps<Value extends string> {
  /** Names the group for screen readers. Already translated. */
  label: string;
  options: readonly ChoiceOption<Value>[];
  value: Value | null;
  onChange: (value: Value | null) => void;
  variant?: ChoiceGroupVariant;
  /** Choosing the chosen option again clears the group to `null`. */
  isClearable?: boolean;
}
