export type LoadingIndicatorSize = "sm" | "md" | "lg";
export type LoadingIndicatorTone = "brand" | "current";

export const LOADING_INDICATOR_SIZE_CLASSES: Record<LoadingIndicatorSize, string> = {
  sm: "h-4 w-4",
  md: "h-7 w-7",
  lg: "h-9 w-9",
};

export const getLoadingIndicatorColorClass = (tone: LoadingIndicatorTone) =>
  tone === "brand" ? "text-brand-primary" : "text-current";
