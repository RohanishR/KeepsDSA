/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm
 * 
 * Takes previous repetition stats and a quality/confidence score to determine
 * the next interval, updated ease factor, and next review date.
 * 
 * @param confidenceScore 1-5 (1: Blackout, 2: Failed, 3: Hard, 4: Good, 5: Perfect)
 * @param previousInterval The previous interval in days
 * @param previousEaseFactor The previous ease factor (default 2.5)
 * @returns Object containing newInterval, newEaseFactor, and nextRevisionDate
 */
export function calculateSM2(
  confidenceScore: number,
  previousInterval: number = 0,
  previousEaseFactor: number = 2.5
) {
  let newInterval = 0;
  let newEaseFactor = previousEaseFactor;

  // If failed (score < 3), reset interval to 0 (or 1)
  if (confidenceScore < 3) {
    newInterval = 1;
    // Don't decrease ease factor on complete failure to avoid "ease hell"
    // or optionally decrease slightly: newEaseFactor = Math.max(1.3, previousEaseFactor - 0.2)
  } else {
    // SM-2 Ease Factor calculation
    // formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // we use score 1-5 which maps to q 1-5 in SM-2
    newEaseFactor = previousEaseFactor + (0.1 - (5 - confidenceScore) * (0.08 + (5 - confidenceScore) * 0.02));
    
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    // Interval calculation
    if (previousInterval === 0) {
      newInterval = 1;
    } else if (previousInterval === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(previousInterval * newEaseFactor);
    }
  }

  const nextRevisionDate = new Date();
  nextRevisionDate.setDate(nextRevisionDate.getDate() + newInterval);

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    nextRevisionDate,
  };
}
