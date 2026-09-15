import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("studio cards do not capture pointers before a mouse drag begins", () => {
  const source = readFileSync(new URL("./AIStudioPage.tsx", import.meta.url), "utf8");
  const start = source.slice(source.indexOf("const handleContinueDragStart"), source.indexOf("const handleContinueDragMove"));
  const move = source.slice(source.indexOf("const handleContinueDragMove"), source.indexOf("const finishContinueDrag"));
  assert.doesNotMatch(start, /setPointerCapture/);
  assert.match(start, /event\.pointerType !== "mouse"/);
  assert.match(move, /Math\.abs\(deltaX\) > 4[\s\S]*setPointerCapture/);
});
