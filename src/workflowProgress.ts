export type WorkflowProgressSection = "image" | "modeling";
export type ImageWorkflowStep = "prompt" | "image-generation" | "turnaround" | "modular";
export type ModelingWorkflowStep = "generate" | "remesh" | "texture";
export type WorkflowProgressStep = ImageWorkflowStep | ModelingWorkflowStep;

export type WorkflowProgressItem = {
  id: WorkflowProgressStep;
  label: string;
};

export const WORKFLOW_PROGRESS_SECTIONS: Record<
  WorkflowProgressSection,
  { label: string; steps: WorkflowProgressItem[] }
> = {
  image: {
    label: "이미지 제작",
    steps: [
      { id: "prompt", label: "프롬프트 작성" },
      { id: "image-generation", label: "이미지 생성" },
      { id: "turnaround", label: "턴어라운드" },
      { id: "modular", label: "모듈화" },
    ],
  },
  modeling: {
    label: "3D 모델링",
    steps: [
      { id: "generate", label: "3D 생성" },
      { id: "remesh", label: "리메시" },
      { id: "texture", label: "텍스처 최적화" },
    ],
  },
};

export const getWorkflowProgress = (
  section: WorkflowProgressSection,
  currentStep: WorkflowProgressStep,
) => {
  const definition = WORKFLOW_PROGRESS_SECTIONS[section];
  const currentIndex = Math.max(
    0,
    definition.steps.findIndex((step) => step.id === currentStep),
  );

  return {
    sectionLabel: definition.label,
    currentIndex,
    currentNumber: currentIndex + 1,
    total: definition.steps.length,
  };
};
