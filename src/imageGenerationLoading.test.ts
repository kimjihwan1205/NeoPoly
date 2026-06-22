import assert from "node:assert/strict";
import {
  IMAGE_GENERATION_LOADING_MS,
  startImageGenerationLoading,
} from "./imageGenerationLoading";

const events: string[] = [];
let scheduledDelay = 0;
let scheduledCallback: (() => void) | undefined;

startImageGenerationLoading({
  setLoading: (loading) => events.push(loading ? "loading" : "idle"),
  onComplete: () => events.push("complete"),
  schedule: (callback, delay) => {
    scheduledCallback = callback;
    scheduledDelay = delay;
    return 1;
  },
});

assert.deepEqual(events, ["loading"]);
assert.equal(scheduledDelay, IMAGE_GENERATION_LOADING_MS);

scheduledCallback?.();
assert.deepEqual(events, ["loading", "complete", "idle"]);

console.log("초기 이미지 생성 로딩 흐름이 올바릅니다.");
