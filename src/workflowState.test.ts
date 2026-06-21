import assert from "node:assert/strict";
import {
  createGeneratedProject,
  filterActiveConsistencyIssues,
  getInitialModuleSelection,
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

console.log("워크플로우 완료 상태와 프로젝트 생성 정보가 올바릅니다.");
