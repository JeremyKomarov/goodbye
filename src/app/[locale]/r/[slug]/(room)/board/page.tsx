import { FEATURE_KEYS } from "@/core/config/features.const";
import { Board } from "@/features/room/components/Board";
import { featurePage } from "@/shared/utils/featurePage";

export default featurePage(FEATURE_KEYS.room, Board);
