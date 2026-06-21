import assert from "node:assert/strict";
import {
  createFallbackConfirmedModuleSession,
  parseTurnaroundModuleSession,
} from "./turnaroundModuleSession";

assert.equal(parseTurnaroundModuleSession(null), null);
assert.equal(parseTurnaroundModuleSession("{broken"), null);

const restored = parseTurnaroundModuleSession(
  JSON.stringify({
    isModuleScanComplete: true,
    isModuleListConfirmed: true,
    moduleParts: [{ id: "weapon" }],
    generatedModules: ["weapon"],
    moduleSets: [{ id: "set-01" }],
    selectedPart: "weapon",
    moduleDrafts: {},
    moduleNameInputs: {},
    newSetTag: "습격",
  }),
);

assert.equal(restored?.isModuleScanComplete, true);
assert.equal(restored?.isModuleListConfirmed, true);
assert.deepEqual(restored?.generatedModules, ["weapon"]);

const fallback = createFallbackConfirmedModuleSession(
  [{ id: "weapon" }, { id: "shoulder" }],
  [{ id: "set-01" }],
  { weapon: { label: "무기" } },
  { weapon: "무기" },
  "해골 전사",
);

assert.equal(fallback.isModuleScanComplete, true);
assert.equal(fallback.isModuleListConfirmed, true);
assert.deepEqual(fallback.generatedModules, ["weapon", "shoulder"]);

console.log("모델링에서 돌아올 때 모듈 리스트 확정 상태를 복원합니다.");
