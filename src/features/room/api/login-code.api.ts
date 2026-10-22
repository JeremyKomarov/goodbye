import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { sessionHeaders } from "@/core/supabase/session";
import { LoginCodeDtoSchema, LoginCodeInputSchema, type LoginCodeInput } from "./login-code.dto";

export async function fetchLoginCode(input: LoginCodeInput) {
  const response = await fetch(API_ENDPOINTS.me.loginCode, {
    method: "POST",
    headers: { "content-type": "application/json", ...(await sessionHeaders()) },
    body: JSON.stringify(LoginCodeInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);

  return LoginCodeDtoSchema.parse(await response.json());
}
