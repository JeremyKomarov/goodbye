// WhatsApp's share link: it opens WhatsApp with the text ready to send, to a chat the person picks.
const WHATSAPP_SHARE_URL = "https://wa.me/";

export function whatsappLink(text: string): string {
  return `${WHATSAPP_SHARE_URL}?text=${encodeURIComponent(text)}`;
}
