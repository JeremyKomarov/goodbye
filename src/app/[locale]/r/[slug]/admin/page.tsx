import type { Metadata } from "next";
import { Suspense } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { AdminScreen } from "@/features/admin/components/AdminScreen";
import { featurePage } from "@/shared/utils/featurePage";

// The host's page is nobody's search result.
export const metadata: Metadata = { robots: { index: false, follow: false } };

type AdminPageProps = PageProps<"/[locale]/r/[slug]/admin">;

// The slug is the request's, so it is read inside <Suspense>; the token is only in the browser,
// so everything else happens there.
async function LoadedAdmin({ params }: AdminPageProps) {
  return <AdminScreen slug={(await params).slug} />;
}

function AdminPage(props: AdminPageProps) {
  return (
    <Suspense>
      <LoadedAdmin {...props} />
    </Suspense>
  );
}

export default featurePage(FEATURE_KEYS.admin, AdminPage);
