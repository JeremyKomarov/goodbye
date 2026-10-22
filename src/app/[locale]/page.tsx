import { FEATURE_KEYS } from "@/core/config/features.const";
import { LandingScreen } from "@/features/landing/components/LandingScreen";
import { featurePage } from "@/shared/utils/featurePage";

export default featurePage(FEATURE_KEYS.landing, LandingScreen);
