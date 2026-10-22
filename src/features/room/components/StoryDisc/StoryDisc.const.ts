export const STORY_DISC_SIZES = { sm: "sm", md: "md", lg: "lg" } as const;
export type StoryDiscSize = (typeof STORY_DISC_SIZES)[keyof typeof STORY_DISC_SIZES];
