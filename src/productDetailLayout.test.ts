import assert from "node:assert/strict";
import { PRODUCT_DETAIL_CONTAINER_CLASS } from "./productDetailLayout";

assert.match(PRODUCT_DETAIL_CONTAINER_CLASS, /pt-3/);
assert.match(PRODUCT_DETAIL_CONTAINER_CLASS, /sm:pt-4/);
assert.match(PRODUCT_DETAIL_CONTAINER_CLASS, /pb-8/);
assert.doesNotMatch(PRODUCT_DETAIL_CONTAINER_CLASS, /\bpy-8\b/);

console.log("제품 상세 페이지 상단 여백 규칙이 올바릅니다.");
