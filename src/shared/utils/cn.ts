type ClassValue = string | false | null | undefined;

/** Joins class references, dropping the falsy ones: `cn(classes.root, isOpen && classes.open)`. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
