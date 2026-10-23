import type { GameRecord } from "@/shared/types/records.types";
import type { RecordsDto } from "./records.dto";

export function mapRecordsDto(dto: RecordsDto): GameRecord[] {
  return dto.records.map((r) => ({
    game: r.game,
    userId: r.user_id,
    name: r.display_name,
    score: r.score,
  }));
}
