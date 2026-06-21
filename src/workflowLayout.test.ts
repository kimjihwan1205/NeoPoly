import assert from "node:assert/strict";
import {
  WORKFLOW_HEADER_CLASS,
  WORKFLOW_SIDEBAR_HEADER_CLASS,
  WORKFLOW_SIDEBAR_WIDTH_CLASS,
} from "./workflowLayout";

assert.match(WORKFLOW_HEADER_CLASS, /h-\[64px\]/);
assert.match(WORKFLOW_HEADER_CLASS, /border-b/);
assert.match(WORKFLOW_SIDEBAR_HEADER_CLASS, /h-\[64px\]/);
assert.match(WORKFLOW_SIDEBAR_HEADER_CLASS, /px-5/);
assert.match(WORKFLOW_SIDEBAR_HEADER_CLASS, /border-b/);
assert.match(WORKFLOW_SIDEBAR_WIDTH_CLASS, /lg:w-\[420px\]/);
assert.match(WORKFLOW_SIDEBAR_WIDTH_CLASS, /xl:w-\[480px\]/);
assert.match(WORKFLOW_SIDEBAR_WIDTH_CLASS, /2xl:w-\[550px\]/);

console.log("워크플로우 헤더와 사이드바 레이아웃 규칙이 일관됩니다.");
