"use client";

import { useId } from "react";
import { Icon, ICON_NAMES } from "@/shared/components/Icon";
import { cn } from "@/shared/utils/cn";
import { choiceGroupClasses } from "./ChoiceGroup.classes";
import { CHOICE_GROUP_VARIANTS, type ChoiceGroupVariant } from "./ChoiceGroup.const";
import type { ChoiceGroupProps, ChoiceOption } from "./ChoiceGroup.types";

/** Pick one of a few options — real radios, drawn as cards or as a segmented control. */
export function ChoiceGroup<Value extends string>({
  label,
  options,
  value,
  onChange,
  variant = CHOICE_GROUP_VARIANTS.card,
  isClearable = false,
}: ChoiceGroupProps<Value>) {
  const name = useId();
  const isCard = variant === CHOICE_GROUP_VARIANTS.card;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(choiceGroupClasses.root, choiceGroupClasses.variant[variant])}
    >
      {options.map((option) => {
        const isChosen = option.value === value;
        return (
          <label key={option.value} className={choiceGroupClasses.option}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isChosen}
              className={choiceGroupClasses.input}
              onChange={() => onChange(option.value)}
              onClick={() => isClearable && isChosen && onChange(null)}
            />
            {isCard && option.leading && (
              <span className={choiceGroupClasses.leading} aria-hidden>
                {option.leading}
              </span>
            )}
            <span className={choiceGroupClasses.text}>
              <span className={choiceGroupClasses.label}>{option.label}</span>
              {isCard && option.description && (
                <span className={choiceGroupClasses.description}>{option.description}</span>
              )}
            </span>
            {isCard && (
              <span className={choiceGroupClasses.mark} aria-hidden>
                {isChosen && <Icon name={ICON_NAMES.check} size="sm" />}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

export { CHOICE_GROUP_VARIANTS, type ChoiceGroupVariant, type ChoiceOption };
