import { connection } from "next/server";
import { type ComponentType, Suspense } from "react";

async function RequestTime() {
  await connection();
  return null;
}

/**
 * Marks a page as rendered on every request, for a layout whose metadata reads the database: with
 * Cache Components, Next asks the page itself to say so. The marker renders nothing, inside its
 * own `<Suspense>`, so the rest of the page still prerenders.
 */
export function onEveryRequest<Props extends object>(Page: ComponentType<Props>) {
  function EveryRequestPage(props: Props) {
    return (
      <>
        <Page {...props} />
        <Suspense>
          <RequestTime />
        </Suspense>
      </>
    );
  }
  EveryRequestPage.displayName = "onEveryRequest";
  return EveryRequestPage;
}
