export const MODEL_GENERATION_REQUEST_KEY = "neopoly:model-generation-request";
export const PROJECT_STORAGE_KEY = "neopoly_projects_v3";

export type TurnaroundTab = "turnaround" | "modular";

export function resolveImageWorkflowNextStep(
  isTurnaroundSelected: boolean,
  isModularSelected: boolean,
): { page: "turnaround" | "modeling_generation"; startTab: TurnaroundTab | null } {
  if (isTurnaroundSelected) {
    return { page: "turnaround", startTab: "turnaround" };
  }
  if (isModularSelected) {
    return { page: "turnaround", startTab: "modular" };
  }
  return { page: "modeling_generation", startTab: null };
}

export function getInitialTurnaroundTab(
  returnTab: string | null,
  rawFlowState: string | null,
): TurnaroundTab {
  if (returnTab === "turnaround" || returnTab === "modular") return returnTab;
  if (!rawFlowState) return "turnaround";

  try {
    const flowState = JSON.parse(rawFlowState) as { startTab?: TurnaroundTab };
    return flowState.startTab === "modular" ? "modular" : "turnaround";
  } catch {
    return "turnaround";
  }
}

export function requestModelGeneration(
  storage: Pick<Storage, "setItem">,
  source = "workflow",
) {
  storage.setItem(MODEL_GENERATION_REQUEST_KEY, source);
}

export function requestTurnaroundFlow<T>(
  storage: Pick<Storage, "setItem" | "removeItem">,
  flowState: T,
) {
  storage.removeItem("neopoly:return-to-turnaround-tab");
  storage.setItem("neopoly:turnaround-flow", JSON.stringify(flowState));
}

export function filterActiveConsistencyIssues<T extends { id: string }>(
  issues: T[],
  ignored: Set<string>,
  resolved: Set<string>,
) {
  return issues.filter(
    (issue) => !ignored.has(issue.id) && !resolved.has(issue.id),
  );
}

export function getInitialModuleSelection(restoredSelection?: string) {
  return restoredSelection || "";
}

export function getTurnaroundHeaderTabState(
  isModularSelected: boolean,
  isModularAccessible: boolean,
  activeTab: "turnaround" | "modular",
) {
  const isModularActive = activeTab === "modular";

  return {
    showModularTab: isModularSelected || isModularActive,
    isModularTabDisabled: !isModularAccessible && !isModularActive,
  };
}

export function getTurnaroundHeaderPresentation(
  isTurnaroundSelected: boolean,
  isModularSelected: boolean,
  activeTab: TurnaroundTab,
) {
  return {
    mode:
      isTurnaroundSelected && isModularSelected
        ? ("switcher" as const)
        : ("title" as const),
    title: activeTab === "modular" ? "이미지 모듈화" : "턴어라운드",
  };
}

export function createGeneratedProject(
  name: string,
  moduleSetCount: number,
  polygonCount: number,
  preview?: {
    representativeImage: string;
    viewerImages: string[];
    moduleSetTitle: string;
    renderImage?: string;
    renderPrompt?: string;
    sourceImages?: string[];
    moduleSetImages?: string[];
    finalModelImage?: string;
  },
) {
  const defaultImage = "/images/Discover_in_orc01.png";
  const defaultViewerImages = [
    "/images/orc_3DF/orc_00_3dF01.png",
    "/images/orc_3DF/orc_00_3dF02.png",
    "/images/orc_3DF/orc_00_3dF03.png",
    "/images/orc_3DF/orc_00_3dF04.png",
  ];
  const moduleSetTag = preview?.moduleSetTitle
    ? `#${preview.moduleSetTitle.replace(/\s+/g, "")}`
    : null;

  return {
    id: Date.now(),
    name: name.trim() || "새 3D 모델링",
    description:
      "AI Studio 풀 워크플로우에서 생성한 3D 모델링 프로젝트입니다.",
    status: "Completed",
    statusColor: "#4ADE80",
    date: new Date().toLocaleDateString("ko-KR"),
    image: preview?.representativeImage || defaultImage,
    listImage: preview?.representativeImage || defaultImage,
    viewerImages: preview?.viewerImages?.length
      ? preview.viewerImages
      : defaultViewerImages,
    workflowAssets: {
      renderImage: preview?.renderImage || "/images/Discover_in_orc01.png",
      renderPrompt: preview?.renderPrompt || "",
      sourceImages: preview?.sourceImages?.length
        ? preview.sourceImages
        : ["/images/orc/orc_create01.png"],
      moduleSetImages: preview?.moduleSetImages?.length
        ? preview.moduleSetImages
        : [
            "/images/orc_3DF/orc_01_3dF01.png",
            "/images/orc_3DF/orc_02_3dF01.png",
            "/images/orc_3DF/orc_03_3dF01.png",
            "/images/orc_3DF/orc_04_3dF01.png",
          ],
      finalModelImage: preview?.finalModelImage || "/images/Discover_in_orc04.png",
    },
    referenceImages: [
      "/images/orc_re/orc_re01.png",
      "/images/orc_re/orc_re02.jpg",
      "/images/orc_re/orc_re03.jpg",
      "/images/orc_re/orc_re04.jpg",
    ],
    tags: [
      "#오크",
      "#3D모델링",
      `#${moduleSetCount}개모듈세트`,
      `#${Math.round(polygonCount / 1000)}K`,
      ...(moduleSetTag ? [moduleSetTag] : []),
    ],
  };
}
