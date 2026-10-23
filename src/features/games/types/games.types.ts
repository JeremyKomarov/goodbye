/** What every game is given: one call when the round is over, with its score. */
export interface GameProps {
  onFinish: (score: number) => void;
}
