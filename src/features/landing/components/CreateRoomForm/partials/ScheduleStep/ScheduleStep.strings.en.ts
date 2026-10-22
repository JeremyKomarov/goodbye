import type { StringsOf } from "@/core/i18n/strings.types";
import type { scheduleStepStrings } from "./ScheduleStep.strings";

export const scheduleStepStringsEn: StringsOf<typeof scheduleStepStrings> = {
  windowStart: "Starting on which day?",
  days: "How many days?",
  fewerDays: "Fewer days",
  moreDays: "More days",
  dayStartHour: "From",
  dayEndHour: "Until",
  votingClosesAt: "Voting closes at",
  openSlots:
    "🗳️ {count, plural, one {# hour} other {# hours}} to choose from (after voting closes)",
  noOpenSlots: "No hours are left after voting closes. Add days or close voting earlier.",
};
