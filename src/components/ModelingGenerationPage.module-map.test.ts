import assert from "node:assert/strict";
import { getModelingPreviousTarget, MODULES } from "./ModelingGenerationPage";

assert.deepEqual(
  MODULES.map(({ label, itemNumber }) => ({ label, itemNumber })),
  [
    { label: "무기", itemNumber: "01" },
    { label: "어깨 갑옷", itemNumber: "02" },
    { label: "다리 보호대", itemNumber: "03" },
    { label: "벨트 장식", itemNumber: "04" },
    { label: "팔 보호대", itemNumber: "05" },
  ],
);

console.log("3D 장비 모듈 이미지와 이름 매핑이 올바릅니다.");

assert.equal(getModelingPreviousTarget("texture"), "remesh");
assert.equal(getModelingPreviousTarget("remesh"), "polish");
assert.equal(getModelingPreviousTarget("polish"), "generate");
assert.equal(getModelingPreviousTarget("generate"), "turnaround");

console.log("모델링 생성 첫 단계에서 이전 워크플로우로 돌아갑니다.");
