import assert from "node:assert/strict";
import { isPersistentModelingWorkflowPage } from "./workflowPageCache";

assert.equal(isPersistentModelingWorkflowPage("turnaround"), true);
assert.equal(isPersistentModelingWorkflowPage("modeling_generation"), true);
assert.equal(isPersistentModelingWorkflowPage("full_workflow_chat"), false);
assert.equal(isPersistentModelingWorkflowPage("home"), false);

console.log("턴어라운드와 모델링 생성 페이지만 작업 상태 유지 대상으로 분류됩니다.");
