// WhatsApp-style sender name colors, picked by hashing the user id.
const NAME_COLORS = ["#fc9775", "#53bdeb", "#a5b337", "#e26ab6", "#ffd279", "#7f66ff", "#25d366", "#ff8a8c"];

export function nameColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return NAME_COLORS[Math.abs(h) % NAME_COLORS.length];
}

export function initial(name: string) {
  return Array.from(name.trim())[0] ?? "?";
}
