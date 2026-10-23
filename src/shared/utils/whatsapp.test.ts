import { describe, expect, it } from "vitest";
import { whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("carries the text, encoded, line breaks and Hebrew included", () => {
    expect(whatsappLink("היי\nhttps://x.y/r/a?b=1")).toBe(
      "https://wa.me/?text=%D7%94%D7%99%D7%99%0Ahttps%3A%2F%2Fx.y%2Fr%2Fa%3Fb%3D1",
    );
  });
});
