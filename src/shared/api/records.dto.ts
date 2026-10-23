import { z } from "zod";
import { GAME_IDS, type GameId, SCORE_RANGES } from "@/core/constants/games.const";

// The room's records — each player's best score per game — as the scores handler sends them, and
// a new score as a game sends it. A score outside its game's range never reaches the database.
export const RecordDtoSchema = z.object({
  game: z.enum(GAME_IDS),
  user_id: z.string(),
  display_name: z.string(),
  score: z.number().int(),
});

export const RecordsDtoSchema = z.object({ records: z.array(RecordDtoSchema) });

export const SubmitScoreInputSchema = z
  .object({ game: z.enum(GAME_IDS), score: z.number().int() })
  .refine(({ game, score }) => inRange(game, score), { path: ["score"] });

const inRange = (game: GameId, score: number) =>
  score >= SCORE_RANGES[game].min && score <= SCORE_RANGES[game].max;

export type RecordDto = z.infer<typeof RecordDtoSchema>;
export type RecordsDto = z.infer<typeof RecordsDtoSchema>;
export type SubmitScoreInput = z.infer<typeof SubmitScoreInputSchema>;
