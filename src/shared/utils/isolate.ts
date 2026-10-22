/**
 * Wraps text someone typed — a name, a group name — in Unicode direction isolates, so an English
 * name inside a Hebrew sentence cannot drag the numbers or punctuation beside it into its own
 * direction ("david, 490 נק׳").
 */
export function isolate(text: string): string {
  return `⁨${text}⁩`;
}
