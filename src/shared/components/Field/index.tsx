import { useId } from "react";
import { cn } from "@/shared/utils/cn";
import { fieldClasses } from "./Field.classes";
import type { FieldProps } from "./Field.types";

/** A labelled text input or select, with helper or error text tied to it by `aria-describedby`. */
export function Field(props: FieldProps) {
  const autoId = useId();
  const id = props.id ?? autoId;
  const noteId = `${id}-note`;
  const { label, helper, error } = props;
  const note = error ?? helper;
  const controlProps = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": note ? noteId : undefined,
  };

  return (
    <div className={fieldClasses.root}>
      <label className={fieldClasses.label} htmlFor={id}>
        {label}
      </label>
      {props.as === "select" ? (
        <select
          {...omitFieldProps(props)}
          {...controlProps}
          className={cn(fieldClasses.control, fieldClasses.select, props.className)}
        />
      ) : (
        <input
          {...omitFieldProps(props)}
          {...controlProps}
          className={cn(fieldClasses.control, props.className)}
        />
      )}
      {note && (
        <p id={noteId} className={error ? fieldClasses.error : fieldClasses.helper}>
          {note}
        </p>
      )}
    </div>
  );
}

function omitFieldProps<P extends FieldProps>(props: P) {
  const { label: _label, helper: _helper, error: _error, as: _as, ...rest } = props;
  return rest;
}
