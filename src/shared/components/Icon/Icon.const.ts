import {
  CalendarPlus,
  ChartNoAxesColumn,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  Copy,
  Gamepad2,
  KeyRound,
  Languages,
  Lock,
  LockOpen,
  LogOut,
  MessageCircle,
  Minus,
  PartyPopper,
  Plus,
  SendHorizontal,
  SmilePlus,
  Settings,
  Share2,
  Trash2,
  Trophy,
  Undo2,
  Users,
  X,
} from "lucide-react";

// The map IS the source of truth; the union of valid names is derived (02-COMPONENTS.md §6a).
export const ICONS = {
  vote: ChartNoAxesColumn,
  games: Gamepad2,
  wall: MessageCircle,
  board: Trophy,
  admin: Settings,
  users: Users,
  exit: LogOut,
  close: X,
  back: ChevronLeft,
  scrollDown: ChevronDown,
  send: SendHorizontal,
  copy: Copy,
  check: Check,
  checkDouble: CheckCheck,
  party: PartyPopper,
  language: Languages,
  lock: Lock,
  unlock: LockOpen,
  undo: Undo2,
  trash: Trash2,
  key: KeyRound,
  calendar: CalendarPlus,
  less: Minus,
  more: Plus,
  share: Share2,
  react: SmilePlus,
} as const;

export type IconName = keyof typeof ICONS;

/** `name={ICON_NAMES.close}` — a caller never types the string. */
export const ICON_NAMES = Object.fromEntries(Object.keys(ICONS).map((name) => [name, name])) as {
  readonly [Name in IconName]: Name;
};

/**
 * Glyphs that point along the reading direction. They are drawn for LTR and flipped under
 * `dir="rtl"`, so "back" points right in Hebrew (docs/DECISIONS.md #3).
 */
export const MIRRORED_ICONS: ReadonlySet<IconName> = new Set<IconName>(["back", "send", "undo"]);

export const ICON_SIZES = { sm: 16, md: 20, lg: 24 } as const;

export type IconSize = keyof typeof ICON_SIZES;
