import { useTranslations } from "next-intl";
import { useFormState } from "react-hook-form";
import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { LANDING_NAMESPACE, landingKeys } from "@/features/landing/strings/landing.keys.const";

type FieldName = keyof typeof landingKeys.fields;
type CodeName = keyof typeof landingKeys.codes;

/** Where the wizard puts a server failure that belongs to no field. */
export const SERVER_ERROR = "root.server";

/**
 * The sentences for the wizard's errors. A server code set on a field (`close_time_in_past`) has
 * its own sentence, anything else on a field reads as the field's own; a failure that belongs to
 * no field reads as its code, or as "couldn't open the room".
 */
export function useWizardErrors() {
  const t = useTranslations(LANDING_NAMESPACE);
  const { errors } = useFormState<CreateRoomInput>();

  function field(name: FieldName): string | undefined {
    const type = errors[name]?.type;
    if (type === undefined) return undefined;
    return isCode(type) ? t(landingKeys.codes[type]) : t(landingKeys.fields[name]);
  }

  const serverType = errors.root?.server?.type;
  const server =
    serverType === undefined
      ? undefined
      : t(landingKeys.codes[isCode(serverType) ? serverType : "failed"]);

  return { field, server };
}

function isCode(type: string | number): type is CodeName {
  return typeof type === "string" && type in landingKeys.codes;
}
