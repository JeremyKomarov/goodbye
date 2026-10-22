import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { loginEmail } from "@/core/constants/login.const";
import { LoginCodeInputSchema, type LoginCodeDto } from "@/features/room/api/login-code.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { requireCaller } from "@/server/auth/bearer";
import { newLoginCode } from "@/server/auth/login-code";
import { findLoginCode, saveLoginCode } from "@/server/db/login-codes.repo";
import { setLoginPassword } from "@/server/db/users.repo";

const ROUTE = "/api/me/login-code";

// The caller's code, per user rather than per room: the anonymous session is the browser's, so
// one code brings a player back into every room they are in. A new code becomes their password,
// which signs out all their sessions; the caller signs straight back in with it (`created`).
export const POST = handlingApiErrors(ROUTE, async (request: Request) => {
  const caller = await requireCaller(request);
  const parsed = LoginCodeInputSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE });

  if (!parsed.data.fresh) {
    const saved = await findLoginCode(caller.userId);
    if (saved) return NextResponse.json({ code: saved, created: false } satisfies LoginCodeDto);
  }

  const code = newLoginCode();
  await setLoginPassword(caller.userId, loginEmail(caller.userId), code);
  await saveLoginCode(caller.userId, code);
  return NextResponse.json({ code, created: true } satisfies LoginCodeDto);
});
