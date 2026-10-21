import { describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({ enabled: false }));
vi.mock("@/core/config/features.const", () => ({ isFeatureEnabled: () => flags.enabled }));
vi.mock("@/shared/components/ComingSoon", () => ({ ComingSoon: () => null }));

const { featurePage } = await import("./featurePage");
const { ComingSoon } = await import("@/shared/components/ComingSoon");

function Screen(_: { slug: string }) {
  return null;
}

describe("featurePage", () => {
  it("renders the disabled shell while the flag is off", () => {
    flags.enabled = false;
    expect(featurePage("room", Screen)({ slug: "a" }).type).toBe(ComingSoon);
  });

  it("renders the disabled shell for a feature with no screen yet, even if on", () => {
    flags.enabled = true;
    expect(featurePage("room")({}).type).toBe(ComingSoon);
  });

  it("renders the screen with the page's props once the flag is on", () => {
    flags.enabled = true;
    const page = featurePage("room", Screen)({ slug: "a" });
    expect(page.type).toBe(Screen);
    expect(page.props).toEqual({ slug: "a" });
  });
});
