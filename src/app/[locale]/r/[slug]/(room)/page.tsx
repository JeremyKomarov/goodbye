import { FEATURE_KEYS } from "@/core/config/features.const";
import { VoteSection } from "@/features/room/components/VoteSection";
import { featurePage } from "@/shared/utils/featurePage";
import { onEveryRequest } from "@/shared/utils/onEveryRequest";

export default onEveryRequest(featurePage(FEATURE_KEYS.room, VoteSection));
