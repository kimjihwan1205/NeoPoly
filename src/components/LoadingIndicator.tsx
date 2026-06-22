import { Loader2 } from "lucide-react";
import {
  getLoadingIndicatorColorClass,
  LOADING_INDICATOR_SIZE_CLASSES,
  type LoadingIndicatorSize,
  type LoadingIndicatorTone,
} from "../loadingIndicatorStyles";

type LoadingIndicatorProps = {
  size?: LoadingIndicatorSize;
  tone?: LoadingIndicatorTone;
  label?: string;
  layout?: "inline" | "stacked";
  className?: string;
};

export default function LoadingIndicator({
  size = "sm",
  tone = "brand",
  label,
  layout = "inline",
  className = "",
}: LoadingIndicatorProps) {
  const spinner = (
    <Loader2
      aria-hidden="true"
      className={`${LOADING_INDICATOR_SIZE_CLASSES[size]} shrink-0 animate-spin ${getLoadingIndicatorColorClass(tone)}`}
    />
  );

  if (!label) return spinner;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center ${
        layout === "stacked" ? "flex-col gap-3 text-center" : "gap-2"
      } ${className}`}
    >
      {spinner}
      <span className="text-[15px] font-medium text-white">{label}</span>
    </div>
  );
}
