import styles from "./VoteLegend.module.scss";
import { RAMP } from "@/features/room/content/voteScale";

export function VoteLegend() {
  return (
      <div
        className={styles.view34}
        aria-hidden
      >
        <span>פחות קולות</span>
        {RAMP.map((c) => (
          <span
            key={c}
            className={styles.view35}
            style={{ background: c }}
          />
        ))}
        <span>יותר</span>
      </div>

  );
}
