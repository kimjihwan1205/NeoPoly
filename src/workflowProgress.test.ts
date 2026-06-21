import assert from "node:assert/strict";
import { getWorkflowProgress } from "./workflowProgress";

assert.deepEqual(getWorkflowProgress("image", "prompt"), {
  sectionLabel: "이미지 제작",
  currentIndex: 0,
  currentNumber: 1,
  total: 4,
});

assert.deepEqual(getWorkflowProgress("image", "modular"), {
  sectionLabel: "이미지 제작",
  currentIndex: 3,
  currentNumber: 4,
  total: 4,
});

assert.deepEqual(getWorkflowProgress("modeling", "remesh"), {
  sectionLabel: "3D 모델링",
  currentIndex: 1,
  currentNumber: 2,
  total: 3,
});

console.log("워크플로우 구간별 진행 정보가 올바릅니다.");
