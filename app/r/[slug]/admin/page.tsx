import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPanel } from "@/features/room/components/AdminPanel/AdminPanel";

export const metadata: Metadata = {
  title: "ניהול החדר",
  robots: { index: false },
};

export default function AdminPage({ params }: PageProps<"/r/[slug]/admin">) {
  return (
    <Suspense>
      {params.then(({ slug }) => (
        <AdminPanel slug={slug} />
      ))}
    </Suspense>
  );
}
