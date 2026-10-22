import { FEATURE_KEYS } from "@/core/config/features.const";
import { VoteSection } from "@/features/room/components/VoteSection";
import { featurePage } from "@/shared/utils/featurePage";

export default featurePage(FEATURE_KEYS.room, VoteSection);
