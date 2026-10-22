import { FEATURE_KEYS } from "@/core/config/features.const";
import { FarewellWall } from "@/features/room/components/FarewellWall";
import { featurePage } from "@/shared/utils/featurePage";

export default featurePage(FEATURE_KEYS.room, FarewellWall);
