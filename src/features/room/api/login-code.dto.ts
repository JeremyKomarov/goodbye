import { z } from "zod";

// POST /api/me/login-code: the caller's code for coming in as themselves on another device. Made
// on first ask; `fresh` replaces it, and the old one stops working.
export const LoginCodeInputSchema = z.object({
  fresh: z.boolean().default(false),
});

/** `created`: the code is new, which signed every session out; the caller signs back in with it. */
export const LoginCodeDtoSchema = z.object({
  code: z.string(),
  created: z.boolean(),
});

/** Typed at the join gate by someone whose name is taken — maybe by them, on another device. */
export const SignInAsInputSchema = z.object({
  code: z.string().trim().min(1).max(12),
});

export type LoginCodeInput = z.input<typeof LoginCodeInputSchema>;
export type LoginCodeDto = z.infer<typeof LoginCodeDtoSchema>;
export type SignInAsInput = z.input<typeof SignInAsInputSchema>;
