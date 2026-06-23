import assert from "node:assert/strict";
import {
  createGeneratedProject,
  filterActiveConsistencyIssues,
  getInitialTurnaroundTab,
  getInitialModuleSelection,
  getTurnaroundHeaderPresentation,
  getTurnaroundHeaderTabState,
  requestModelGeneration,
  requestTurnaroundFlow,
  resolveImageWorkflowNextStep,
} from "./workflowState";

const issues = [{ id: "a" }, { id: "b" }, { id: "c" }];

assert.deepEqual(
  filterActiveConsistencyIssues(
    issues,
    new Set(["a"]),
    new Set(["b"]),
  ).map((issue) => issue.id),
  ["c"],
);

const project = createGeneratedProject("오크 전사 최종본", 4, 500000);
assert.equal(project.name, "오크 전사 최종본");
assert.equal(project.status, "Completed");
assert.deepEqual(project.viewerImages, [
  "/images/orc_3DF/orc_00_3dF01.png",
  "/images/orc_3DF/orc_00_3dF02.png",
  "/images/orc_3DF/orc_00_3dF03.png",
  "/images/orc_3DF/orc_00_3dF04.png",
]);
assert.equal(project.tags.includes("#4개모듈세트"), true);
assert.equal(project.tags.includes("#500K"), true);

const savedPreviewProject = createGeneratedProject(
  "정찰 장비 오크",
  4,
  150000,
  {
    representativeImage: "/images/orc_3DF/orc_04_3dF02.png",
    viewerImages: [
      "/images/orc_3DF/orc_04_3dF01.png",
      "/images/orc_3DF/orc_04_3dF02.png",
      "/images/orc_3DF/orc_04_3dF03.png",
      "/images/orc_3DF/orc_04_3dF04.png",
    ],
    moduleSetTitle: "부족 정찰 세트",
    renderImage: "/images/Discover_in_orc01.png",
    renderPrompt: "orc render prompt",
    sourceImages: ["/images/orc/orc_create01.png"],
    moduleSetImages: [
      "/images/orc_3DF/orc_01_3dF01.png",
      "/images/orc_3DF/orc_02_3dF01.png",
      "/images/orc_3DF/orc_03_3dF01.png",
      "/images/orc_3DF/orc_04_3dF01.png",
    ],
    finalModelImage: "/images/Discover_in_orc04.png",
  },
);
assert.equal(savedPreviewProject.image, "/images/orc_3DF/orc_04_3dF02.png");
assert.equal(savedPreviewProject.listImage, "/images/orc_3DF/orc_04_3dF02.png");
assert.deepEqual(savedPreviewProject.viewerImages, [
  "/images/orc_3DF/orc_04_3dF01.png",
  "/images/orc_3DF/orc_04_3dF02.png",
  "/images/orc_3DF/orc_04_3dF03.png",
  "/images/orc_3DF/orc_04_3dF04.png",
]);
assert.equal(savedPreviewProject.tags.includes("#부족정찰세트"), true);
assert.deepEqual(savedPreviewProject.workflowAssets, {
  renderImage: "/images/Discover_in_orc01.png",
  renderPrompt: "orc render prompt",
  sourceImages: ["/images/orc/orc_create01.png"],
  moduleSetImages: [
    "/images/orc_3DF/orc_01_3dF01.png",
    "/images/orc_3DF/orc_02_3dF01.png",
    "/images/orc_3DF/orc_03_3dF01.png",
    "/images/orc_3DF/orc_04_3dF01.png",
  ],
  finalModelImage: "/images/Discover_in_orc04.png",
});
assert.equal(getInitialModuleSelection(undefined), "");
assert.equal(getInitialModuleSelection("weapon"), "weapon");

assert.deepEqual(getTurnaroundHeaderTabState(false, false, "turnaround"), {
  showModularTab: false,
  isModularTabDisabled: true,
});
assert.deepEqual(getTurnaroundHeaderTabState(true, false, "turnaround"), {
  showModularTab: true,
  isModularTabDisabled: true,
});
assert.deepEqual(getTurnaroundHeaderTabState(true, true, "turnaround"), {
  showModularTab: true,
  isModularTabDisabled: false,
});
assert.deepEqual(getTurnaroundHeaderTabState(false, false, "modular"), {
  showModularTab: true,
  isModularTabDisabled: false,
});
assert.deepEqual(
  getTurnaroundHeaderPresentation(true, false, "turnaround"),
  {
    mode: "title",
    title: "턴어라운드",
  },
);
assert.deepEqual(
  getTurnaroundHeaderPresentation(false, true, "modular"),
  {
    mode: "title",
    title: "이미지 모듈화",
  },
);
assert.deepEqual(
  getTurnaroundHeaderPresentation(true, true, "turnaround"),
  {
    mode: "switcher",
    title: "턴어라운드",
  },
);

assert.deepEqual(resolveImageWorkflowNextStep(true, false), {
  page: "turnaround",
  startTab: "turnaround",
});
assert.deepEqual(resolveImageWorkflowNextStep(false, true), {
  page: "turnaround",
  startTab: "modular",
});
assert.deepEqual(resolveImageWorkflowNextStep(false, false), {
  page: "modeling_generation",
  startTab: null,
});
assert.equal(
  getInitialTurnaroundTab(
    null,
    JSON.stringify({ startTab: "modular", isModularSelected: true }),
  ),
  "modular",
);
assert.equal(
  getInitialTurnaroundTab("turnaround", JSON.stringify({ startTab: "modular" })),
  "turnaround",
);

const modelRequestEntries: Array<[string, string]> = [];
requestModelGeneration(
  {
    setItem(key, value) {
      modelRequestEntries.push([key, value]);
    },
  },
  "modular",
);
assert.deepEqual(modelRequestEntries, [
  ["neopoly:model-generation-request", "modular"],
]);

const flowStorageChanges = {
  removed: [] as string[],
  saved: [] as Array<[string, string]>,
};
requestTurnaroundFlow(
  {
    removeItem(key) {
      flowStorageChanges.removed.push(key);
    },
    setItem(key, value) {
      flowStorageChanges.saved.push([key, value]);
    },
  },
  {
    startTab: "modular",
    isTurnaroundSelected: false,
    isModularSelected: true,
  },
);
assert.deepEqual(flowStorageChanges.removed, [
  "neopoly:return-to-turnaround-tab",
]);
assert.deepEqual(flowStorageChanges.saved, [
  [
    "neopoly:turnaround-flow",
    JSON.stringify({
      startTab: "modular",
      isTurnaroundSelected: false,
      isModularSelected: true,
    }),
  ],
]);

console.log("워크플로우 완료 상태와 프로젝트 생성 정보가 올바릅니다.");
