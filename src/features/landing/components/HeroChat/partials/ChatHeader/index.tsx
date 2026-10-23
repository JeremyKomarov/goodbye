import { chatHeaderClasses } from "./ChatHeader.classes";

/** The group's name and its members, the way WhatsApp heads a group chat. Decorative, like the chat. */
export function ChatHeader({ title, members }: { title: string; members: string }) {
  return (
    <div className={chatHeaderClasses.root} aria-hidden>
      <div className={chatHeaderClasses.avatar}>
        🚀
      </div>
      <div className={chatHeaderClasses.text}>
        <div className={chatHeaderClasses.title}>{title}</div>
        <div className={chatHeaderClasses.members}>{members}</div>
      </div>
    </div>
  );
}
