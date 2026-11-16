import {
  HOST_GENDERS, type HostGender, type LeaveReason,
} from "@/features/landing/api/rooms.dto";

/** What the chat shows before the host has touched the wizard: no story yet, as in the wizard. */
export const INITIAL_CHAT = {
  story: null as LeaveReason | null,
  hostName: "",
  hostGender: HOST_GENDERS.m as HostGender,
  groupName: "",
};
