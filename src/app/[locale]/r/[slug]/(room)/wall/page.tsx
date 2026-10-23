import { FEATURE_KEYS } from "@/core/config/features.const";
import { FarewellWall } from "@/features/room/components/FarewellWall";
import { featurePage } from "@/shared/utils/featurePage";
import { onEveryRequest } from "@/shared/utils/onEveryRequest";

export default onEveryRequest(featurePage(FEATURE_KEYS.room, FarewellWall));
