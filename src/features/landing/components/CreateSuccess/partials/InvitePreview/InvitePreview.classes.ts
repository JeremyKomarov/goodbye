import styles from "./InvitePreview.module.scss";
import { classMap } from "@/shared/utils/classMap";

export const invitePreviewClasses = classMap("InvitePreview", {
  root: styles["invite-preview"],
  bubble: styles["invite-preview__bubble"],
  text: styles["invite-preview__text"],
  url: styles["invite-preview__url"],
});
