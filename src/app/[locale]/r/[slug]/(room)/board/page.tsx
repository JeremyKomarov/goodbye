import { FEATURE_KEYS } from "@/core/config/features.const";
import { Board } from "@/features/room/components/Board";
import { featurePage } from "@/shared/utils/featurePage";
import { onEveryRequest } from "@/shared/utils/onEveryRequest";

export default onEveryRequest(featurePage(FEATURE_KEYS.room, Board));
