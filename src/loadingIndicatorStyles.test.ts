import assert from "node:assert/strict";
import {
  LOADING_INDICATOR_SIZE_CLASSES,
  getLoadingIndicatorColorClass,
} from "./loadingIndicatorStyles";

assert.deepEqual(LOADING_INDICATOR_SIZE_CLASSES, {
  sm: "h-4 w-4",
  md: "h-7 w-7",
  lg: "h-9 w-9",
});

assert.equal(getLoadingIndicatorColorClass("brand"), "text-brand-primary");
assert.equal(getLoadingIndicatorColorClass("current"), "text-current");

console.log("로딩 인디케이터 스타일 규칙이 올바릅니다.");
