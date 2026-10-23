import { notFound } from "next/navigation";

// A page that throws while rendering, so `error.tsx` can be seen and tested (`e2e/error.spec.ts`).
// Development only — a 404 in production, like the kit catalog.
export default function ThrowingPage(): never {
  if (process.env.NODE_ENV === "production") notFound();
  throw new Error("dev/error: thrown on purpose");
}
