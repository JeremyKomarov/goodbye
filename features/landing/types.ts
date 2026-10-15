import type { Gender } from "@/core/types";

export type Draft = { hostName: string; groupName: string };

export type CreatedRoom = {
  slug: string;
  adminToken: string;
  hostName: string;
  gender: Gender;
};
