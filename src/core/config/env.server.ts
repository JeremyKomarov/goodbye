import "server-only";
import { z } from "zod";

// Private values, server only. The secret key bypasses row-level security, so it is read here
// and handed to server/db/ alone.
const ServerEnvSchema = z.object({ supabaseSecretKey: z.string().min(1) });

export const serverEnv = ServerEnvSchema.parse({
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
});
