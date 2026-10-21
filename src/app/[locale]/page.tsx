// The one honest thing to render before anything is built. Phase 01 replaces this route: the
// app shell, the feature registry, and a page built with featurePage() (.agents/docs/04-FEATURES.md §2).
export default function Home() {
  return (
    <main style={{ padding: "3rem", maxWidth: "40rem" }}>
      <h1>{"Goodbye"}</h1>
      <p>Nothing is built yet. That is not a bug — it is where the project starts.</p>
      <p>
        <code>plan/01-foundation.md</code> is the one phase the framework prescribes. Mark step
        01.1 in progress, write <code>plan/NOW.md</code>, and begin.
      </p>
    </main>
  );
}
