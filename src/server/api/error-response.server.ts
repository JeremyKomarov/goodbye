import "server-only";
import { NextResponse } from "next/server";
import {
  API_ERROR_CODES,
  API_ERROR_STATUS,
  ApiError,
  type ApiErrorBody,
  type ApiErrorCode,
} from "@/core/api/api-error";

interface ApiErrorOptions {
  route: string;
  field?: string;
}

/** A failure response: the code, and the status that code answers with (03-DATA.md §2). */
export function apiError(code: ApiErrorCode, { route, field }: ApiErrorOptions) {
  if (API_ERROR_STATUS[code] >= 500) console.error(`[${route}] ${code}`);
  const body: ApiErrorBody = { error: { code, ...(field ? { field } : {}) } };
  return NextResponse.json(body, { status: API_ERROR_STATUS[code] });
}

/** Wraps a handler so a thrown ApiError keeps its code and anything else becomes `internal`. */
export function handlingApiErrors<Args extends unknown[]>(
  route: string,
  handler: (...args: Args) => Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ApiError) return apiError(error.code, { route, field: error.field });
      console.error(`[${route}]`, error);
      return apiError(API_ERROR_CODES.internal, { route });
    }
  };
}
