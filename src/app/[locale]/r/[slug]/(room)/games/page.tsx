import { FEATURE_KEYS } from "@/core/config/features.const";
import { GamesHub } from "@/features/games/components/GamesHub";
import { featurePage } from "@/shared/utils/featurePage";

export default featurePage(FEATURE_KEYS.games, GamesHub);
