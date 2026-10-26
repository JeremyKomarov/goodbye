import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { hitRateLimit } from "@/server/db/rate-limits.repo";

// The write routes' budgets are counted in Postgres (docs/DECISIONS.md #15): by the caller's
// session where there is one, by IP where there isn't. A limiter that can't reach the database
// throws `upstream_failed` from the repo — it never lets the write through.

export interface RateBudget {
  /** The name the counts are kept under, one per route and action. */
  name: string;
  windowSeconds: number;
  max: number;
}

const MINUTE = 60;
const HOUR = 3600;

/** Each write route's budget. Opening a room is by IP; everything else is by session. */
export const RATE_BUDGETS = {
  createRoom: { name: "create-room", windowSeconds: HOUR, max: 5 },
  wallPost: { name: "wall-post", windowSeconds: 10 * MINUTE, max: 30 },
  reaction: { name: "reaction", windowSeconds: MINUTE, max: 60 },
  vote: { name: "vote", windowSeconds: MINUTE, max: 60 },
  score: { name: "score", windowSeconds: MINUTE, max: 20 },
  loginCode: { name: "login-code", windowSeconds: HOUR, max: 5 },
} as const satisfies Record<string, RateBudget>;

/** The caller's IP as Vercel saw it: the first entry of `x-forwarded-for`. */
export function callerIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

/** Takes one hit on `who` against `budget`. Throws `rate_limited` once the budget is spent. */
export async function requireWithinLimit(budget: RateBudget, who: string): Promise<void> {
  const within = await hitRateLimit(`${budget.name}:${who}`, budget.windowSeconds, budget.max);
  if (!within) throw new ApiError(API_ERROR_CODES.rate_limited, 429);
}
