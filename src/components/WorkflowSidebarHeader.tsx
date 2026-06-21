import type { ReactNode } from "react";
import { WORKFLOW_SIDEBAR_HEADER_CLASS } from "../workflowLayout";

type WorkflowSidebarHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function WorkflowSidebarHeader({
  title,
  description,
  action,
}: WorkflowSidebarHeaderProps) {
  return (
    <header className={WORKFLOW_SIDEBAR_HEADER_CLASS}>
      <div className="min-w-0">
        <h2 className="truncate text-[16px] font-medium text-white">{title}</h2>
        {description && (
          <p className="mt-0.5 truncate text-[14px] text-neutral-500">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
