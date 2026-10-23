import { z } from "zod";

// The error envelope, defined once (03-DATA.md §2). Servers return a code; the client turns it into
// a sentence through the strings layer. The code picks the status — a handler never does.
export const API_ERROR_CODES = {
  invalid_input: "invalid_input",
  unauthorized: "unauthorized",
  forbidden: "forbidden",
  not_found: "not_found",
  name_taken: "name_taken",
  wrong_login_code: "wrong_login_code",
  too_many_attempts: "too_many_attempts",
  too_fast: "too_fast",
  voting_closed: "voting_closed",
  games_closed: "games_closed",
  close_time_in_past: "close_time_in_past",
  no_slots_after_close: "no_slots_after_close",
  not_implemented: "not_implemented",
  upstream_failed: "upstream_failed",
  internal: "internal",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export const API_ERROR_STATUS: Record<ApiErrorCode, number> = {
  invalid_input: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  name_taken: 409,
  wrong_login_code: 401,
  too_many_attempts: 429,
  too_fast: 429,
  voting_closed: 409,
  games_closed: 409,
  close_time_in_past: 422,
  no_slots_after_close: 422,
  not_implemented: 501,
  upstream_failed: 502,
  internal: 500,
};

const CODES = Object.values(API_ERROR_CODES) as [ApiErrorCode, ...ApiErrorCode[]];

export const ApiErrorBodySchema = z.object({
  error: z.object({ code: z.enum(CODES), field: z.string().optional() }),
});

export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>;

/** The only error a frontend API call throws. `message` is a diagnostic — never rendered. */
export class ApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly status: number,
    readonly field?: string,
  ) {
    super(`${code} (${status})`);
    this.name = "ApiError";
  }
}

/** Reads the body's code; the status is only the fallback for a response no handler of ours sent. */
export async function toApiError(response: Response): Promise<ApiError> {
  const body = ApiErrorBodySchema.safeParse(await response.json().catch(() => null));
  if (body.success) return new ApiError(body.data.error.code, response.status, body.data.error.field);
  return new ApiError(codeFromStatus(response.status), response.status);
}

function codeFromStatus(status: number): ApiErrorCode {
  if (status === 401) return API_ERROR_CODES.unauthorized;
  if (status === 403) return API_ERROR_CODES.forbidden;
  if (status === 404) return API_ERROR_CODES.not_found;
  if (status === 429) return API_ERROR_CODES.too_many_attempts;
  if (status === 501) return API_ERROR_CODES.not_implemented;
  if (status === 502 || status === 503 || status === 504) return API_ERROR_CODES.upstream_failed;
  return API_ERROR_CODES.internal;
}
