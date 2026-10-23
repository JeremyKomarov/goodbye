import { landingKeys } from "@/features/landing/strings/landing.keys.const";

export type WizardCode = keyof typeof landingKeys.codes;

/**
 * The server code an error carries, if the wizard has a sentence for it; `undefined` for anything
 * else — a schema's own type ("too_small"), or a code it doesn't know.
 */
export function wizardCode(type: string | number | undefined): WizardCode | undefined {
  return typeof type === "string" && Object.hasOwn(landingKeys.codes, type)
    ? (type as WizardCode)
    : undefined;
}
