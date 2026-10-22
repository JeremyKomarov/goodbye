// Names as the database compares them (norm_name() in the migrations): case and runs of spaces
// don't make a different name. Ported from the original's core/login.ts.

const normalize = (name: string) => name.trim().replace(/\s+/g, " ").toLowerCase();

export function sameName(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}
