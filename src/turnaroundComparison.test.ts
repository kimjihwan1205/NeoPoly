import assert from "node:assert/strict";
import { getNextTurnaroundView } from "./turnaroundComparison";

assert.equal(getNextTurnaroundView("front", 1), "angle");
assert.equal(getNextTurnaroundView("angle", 1), "side");
assert.equal(getNextTurnaroundView("back", 1), "front");
assert.equal(getNextTurnaroundView("front", -1), "back");

console.log("턴어라운드 단일 이미지 전환 순서가 올바릅니다.");
