export type TurnaroundComparisonViewId = "front" | "angle" | "side" | "back";

export const TURNAROUND_COMPARISON_VIEW_IDS: TurnaroundComparisonViewId[] = [
  "front",
  "angle",
  "side",
  "back",
];

export const getNextTurnaroundView = (
  currentViewId: TurnaroundComparisonViewId,
  direction: 1 | -1,
) => {
  const currentIndex = Math.max(0, TURNAROUND_COMPARISON_VIEW_IDS.indexOf(currentViewId));
  return TURNAROUND_COMPARISON_VIEW_IDS[
    (currentIndex + direction + TURNAROUND_COMPARISON_VIEW_IDS.length) %
      TURNAROUND_COMPARISON_VIEW_IDS.length
  ];
};
