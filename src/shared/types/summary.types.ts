/** The goodbye that drew the most reactions. */
export interface LovedMessage {
  name: string;
  body: string;
  reactions: number;
}

/** What the room adds up to — the finale's numbers, and the ones the host sends the group. */
export interface ExitSummary {
  voterCount: number;
  messageCount: number;
  loved: LovedMessage | null;
  isDrawn: boolean;
  /** The hour alone in the lead while none is locked, as epoch ms. */
  leadingSlot: number | null;
}
