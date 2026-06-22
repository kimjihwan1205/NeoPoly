import type { ReactNode } from "react";
import type {
  WorkflowProgressSection,
  WorkflowProgressStep,
} from "../workflowProgress";
import { WORKFLOW_HEADER_CLASS } from "../workflowLayout";
import WorkflowProgress from "./WorkflowProgress";

type WorkflowHeaderProps = {
  title: ReactNode;
  section: WorkflowProgressSection;
  currentStep: WorkflowProgressStep;
  actions?: ReactNode;
  className?: string;
};

export default function WorkflowHeader({
  title,
  section,
  currentStep,
  actions,
  className = "",
}: WorkflowHeaderProps) {
  return (
    <header className={`${WORKFLOW_HEADER_CLASS} ${className}`}>
      <div className="min-w-0">
        {typeof title === "string" ? (
          <h1 className="truncate text-[22px] font-medium tracking-tight text-white">
            {title}
          </h1>
        ) : (
          title
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {actions}
        <WorkflowProgress section={section} currentStep={currentStep} />
      </div>
    </header>
  );
}
