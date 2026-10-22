import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes } from "react";

interface FieldBase {
  label: ReactNode;
  helper?: ReactNode;
  /** Already translated; shown instead of `helper` and marks the control invalid. */
  error?: ReactNode;
  /** The label is read out but not drawn — when the control's placeholder already says it. */
  isLabelHidden?: boolean;
}

export interface InputFieldProps extends FieldBase, InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
  ref?: Ref<HTMLInputElement>;
}

/** The `<option>`s are the children. */
export interface SelectFieldProps extends FieldBase, SelectHTMLAttributes<HTMLSelectElement> {
  as: "select";
  ref?: Ref<HTMLSelectElement>;
}

export type FieldProps = InputFieldProps | SelectFieldProps;
