import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./App.tsx", import.meta.url), "utf8");
const panelStart = source.indexOf("{/* Bottom Floating Panel */}");
assert.notEqual(panelStart, -1);
const panel = source.slice(panelStart, source.indexOf("</AnimatePresence>", panelStart));

test("home panel keeps mobile stacking and desktop columns with a two-column tablet layout", () => {
  assert.match(panel, /grid-cols-1 gap-8 md:grid-cols-2 md:max-xl:gap-6 xl:grid-cols-12/);
  assert.match(panel, /md:col-span-2 md:max-xl:space-y-3 xl:col-span-6/);
  assert.equal((panel.match(/md:max-xl:space-y-3 xl:col-span-3/g) ?? []).length, 2);
});

test("home panel caps tablet height and limits compact thumbnails to the tablet breakpoint", () => {
  assert.match(panel, /max-h-\[88dvh\]/);
  assert.match(panel, /md:max-h-\[75dvh\]/);
  assert.match(panel, /xl:max-h-\[82dvh\]/);
  assert.match(panel, /aspect-\[16\/10\] md:max-xl:aspect-auto md:max-xl:h-\[clamp\(88px,11dvh,112px\)\]/);
  assert.equal((panel.match(/overflow-y-auto/g) ?? []).length, 1);
});
