import styles from "./RoomSkeleton.module.scss";

/** Mirrors the room's app shell (header, content, tabs; sidebar on desktop) so nothing jumps on load. */
export function RoomSkeleton() {
  return (
    <div className={styles.view1} aria-busy="true" aria-label="טוען את החדר">
      <div className={styles.view2}>
        <div className={styles.view3}>
          <SkeletonHeader />
          <div className={styles.view4} />
          <div className={styles.view5} />
        </div>
        <div className={styles.view6}>
          <div className={styles.view7}>
            <SkeletonHeader />
          </div>
          <div className={styles.view8} />
          <div className={styles.view9} />
          <div className={styles.view10} />
          <div className={styles.view11} />
        </div>
      </div>
    </div>
  );
}

function SkeletonHeader() {
  return (
    <div className={styles.view12}>
      <div className={styles.view13}>
        <div className={styles.view14} />
        <div className={styles.view15} />
      </div>
    </div>
  );
}
