import { describe, expect, it } from "vitest";
import { CreateRoomInputSchema } from "@/features/landing/api/rooms.dto";
import { FORM_STEPS } from "@/features/landing/components/CreateRoomForm/CreateRoomForm.const";
import { wizardCode } from "./wizardErrors";

describe("wizardCode", () => {
  it("knows the handler's codes the wizard words", () => {
    expect(wizardCode("close_time_in_past")).toBe("close_time_in_past");
  });

  it("is nothing for a schema's own error, an unknown code or no type", () => {
    expect(wizardCode("too_small")).toBeUndefined();
    expect(wizardCode("toString")).toBeUndefined();
    expect(wizardCode(3)).toBeUndefined();
    expect(wizardCode(undefined)).toBeUndefined();
  });
});

describe("FORM_STEPS", () => {
  it("asks for every field the schema checks, but those the wizard fills itself", () => {
    const asked = FORM_STEPS.flatMap((step) => step.fields);
    const filled = ["timezone", "locale"];
    expect([...asked, ...filled].sort()).toEqual(Object.keys(CreateRoomInputSchema.shape).sort());
  });
});
