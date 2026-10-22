import { useTranslations } from "next-intl";
import {
  VOTE_HEATMAP_NAMESPACE, voteHeatmapKeys,
} from "@/features/room/components/VoteHeatmap/VoteHeatmap.keys.const";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { voteDetailClasses } from "./VoteDetail.classes";

export interface SlotDetail {
  /** The hour, already formatted — prefixed "Your vote:" when it is yours. */
  slot: string;
  votes: string;
  /** Who voted for it, joined and isolated. */
  names: string;
}

interface VoteDetailProps {
  error: string | null;
  detail: SlotDetail | null;
  /** What to read when no hour is pointed at and you haven't voted. */
  idle: string;
  /** Offered while your own vote is shown and voting is open. */
  onWithdraw?: () => void;
}

/** Under the grid: who voted for the hour pointed at (or for yours), or how voting works. */
export function VoteDetail({ error, detail, idle, onWithdraw }: VoteDetailProps) {
  const t = useTranslations(VOTE_HEATMAP_NAMESPACE);

  return (
    <div className={voteDetailClasses.root} aria-live="polite">
      {error ? (
        <span className={voteDetailClasses.error}>{error}</span>
      ) : detail ? (
        <>
          <div className={voteDetailClasses.slot}>
            {detail.slot}
            <span className={voteDetailClasses.count}>, {detail.votes}</span>
          </div>
          {(detail.names || onWithdraw) && (
            <div className={voteDetailClasses.row}>
              <span className={voteDetailClasses.names}>{detail.names}</span>
              {onWithdraw && (
                <Button
                  variant={BUTTON_VARIANTS.link}
                  className={voteDetailClasses.withdraw}
                  onClick={onWithdraw}
                >
                  {t(voteHeatmapKeys.withdraw)}
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <span className={voteDetailClasses.idle}>{idle}</span>
      )}
    </div>
  );
}
