import type { ExitSummary } from "@/shared/types/summary.types";
import type { ExitSummaryDto } from "./summary.dto";

export function mapExitSummaryDto(dto: ExitSummaryDto): ExitSummary {
  return {
    voterCount: dto.voter_count,
    messageCount: dto.message_count,
    loved: dto.loved && {
      name: dto.loved.display_name,
      body: dto.loved.body,
      reactions: dto.loved.reactions,
    },
    isDrawn: dto.drawn,
    leadingSlot: dto.leading_slot === null ? null : Date.parse(dto.leading_slot),
  };
}
