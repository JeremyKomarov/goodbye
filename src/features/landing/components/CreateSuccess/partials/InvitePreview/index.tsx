import { Bubble, BUBBLE_SIDES } from "@/shared/components/Bubble";
import { invitePreviewClasses } from "./InvitePreview.classes";

/**
 * The invite as the host's own outgoing message, before it is sent: the words the group will read,
 * the room's address set as WhatsApp sets a link. No ticks — it has not been sent. The line above
 * it on the card says what it is.
 */
export function InvitePreview({ invite, url }: { invite: string; url: string }) {
  const at = invite.indexOf(url);
  const before = at === -1 ? invite : invite.slice(0, at);
  const after = at === -1 ? "" : invite.slice(at + url.length);

  return (
    <div className={invitePreviewClasses.root}>
      <Bubble side={BUBBLE_SIDES.out} className={invitePreviewClasses.bubble}>
        <p className={invitePreviewClasses.text}>
          {before}
          {at !== -1 && (
            <span dir="ltr" className={invitePreviewClasses.url}>
              {url}
            </span>
          )}
          {after}
        </p>
      </Bubble>
    </div>
  );
}
