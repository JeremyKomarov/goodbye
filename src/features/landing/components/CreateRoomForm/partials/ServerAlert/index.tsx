import { useWizardErrors } from "@/features/landing/hooks/useWizardErrors";
import { serverAlertClasses } from "./ServerAlert.classes";

/** A failure from the server that belongs to no field. Nothing while there is none. */
export function ServerAlert() {
  const { server } = useWizardErrors();
  if (!server) return null;

  return (
    <p role="alert" className={serverAlertClasses.root}>
      {server}
    </p>
  );
}
