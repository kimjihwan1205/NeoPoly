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
assert.equal(project.tags.includes("#4개모듈세트"), true);
assert.equal(project.tags.includes("#500K"), true);
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
