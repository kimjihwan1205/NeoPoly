export const MODEL_GENERATION_REQUEST_KEY = "neopoly:model-generation-request";
export const PROJECT_STORAGE_KEY = "neopoly_projects_v3";

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

export function createGeneratedProject(
  name: string,
  moduleSetCount: number,
  polygonCount: number,
) {
  return {
    id: Date.now(),
    name: name.trim() || "새 3D 모델링",
    description:
      "AI Studio 풀 워크플로우에서 생성한 3D 모델링 프로젝트입니다.",
    status: "Completed",
    statusColor: "#4ADE80",
    date: new Date().toLocaleDateString("ko-KR"),
    image: "/images/Discover_in_orc01.png",
    listImage: "/images/Discover_in_orc01.png",
    viewerImages: [
      "/images/Discover_in_orc01.png",
      "/images/Discover_in_orc02.png",
      "/images/Discover_in_orc03.png",
      "/images/Discover_in_orc04.png",
    ],
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
    ],
  };
}
