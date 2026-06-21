import { Check, ChevronDown } from "lucide-react";
import {
  getWorkflowProgress,
  WORKFLOW_PROGRESS_SECTIONS,
  type WorkflowProgressSection,
  type WorkflowProgressStep,
} from "../workflowProgress";

type WorkflowProgressProps = {
  section: WorkflowProgressSection;
  currentStep: WorkflowProgressStep;
};

export default function WorkflowProgress({
  section,
  currentStep,
}: WorkflowProgressProps) {
  const definition = WORKFLOW_PROGRESS_SECTIONS[section];
  const progress = getWorkflowProgress(section, currentStep);

  return (
    <details className="group relative">
      <summary className="flex h-9 cursor-pointer list-none items-center gap-3 rounded-lg border border-transparent bg-transparent px-2.5 text-[14px] text-neutral-400 transition hover:bg-white/5 hover:text-white [&::-webkit-details-marker]:hidden">
        <span className="font-medium">{progress.sectionLabel}</span>
        <span className="text-neutral-500">
          {progress.currentNumber}/{progress.total}
        </span>
        <span className="flex items-center gap-1">
          {definition.steps.map((step, index) => (
            <span
              key={step.id}
              className={`h-1.5 rounded-full transition-all ${
                index === progress.currentIndex
                  ? "w-4 bg-[#E0A12E]"
                  : index < progress.currentIndex
                    ? "w-1.5 bg-[#4ADE80]"
                    : "w-1.5 bg-[#343842]"
              }`}
            />
          ))}
        </span>
        <ChevronDown className="h-4 w-4 text-neutral-500 transition group-open:rotate-180" />
      </summary>

      <div className="absolute right-0 top-[44px] z-[120] w-[250px] rounded-xl border border-[#2A2E36] bg-[#0A0B0D] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
        <p className="px-1 pb-2 text-[14px] font-medium text-neutral-400">
          {definition.label}
        </p>
        <div className="space-y-1">
          {definition.steps.map((step, index) => {
            const isComplete = index < progress.currentIndex;
            const isCurrent = index === progress.currentIndex;

            return (
              <div
                key={step.id}
                className={`flex h-10 items-center gap-3 rounded-lg px-2.5 ${
                  isCurrent ? "bg-[#E0A12E]/10" : ""
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    isComplete
                      ? "border-[#4ADE80]/40 bg-[#4ADE80]/10 text-[#4ADE80]"
                      : isCurrent
                        ? "border-[#E0A12E] bg-[#E0A12E] text-black"
                        : "border-[#343842] bg-[#111317] text-neutral-600"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={`text-[14px] font-medium ${
                    isCurrent
                      ? "text-[#E0A12E]"
                      : isComplete
                        ? "text-neutral-300"
                        : "text-neutral-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}
