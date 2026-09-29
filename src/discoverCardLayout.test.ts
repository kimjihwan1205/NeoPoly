import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./App.tsx", import.meta.url), "utf8");
const cardStart = source.indexOf("function AssetCard(");
const cardEnd = source.indexOf("// --- Product Detail Page ---", cardStart);
const cardSource = source.slice(cardStart, cardEnd);

test("discover card titles can wrap to two lines across responsive overlays", () => {
  assert.equal((cardSource.match(/line-clamp-2 break-keep/g) ?? []).length, 2);
  assert.doesNotMatch(cardSource, /<(?:p|h3) className="truncate[^>]*>\s*\{asset\.title\}/);
});

test("desktop information overlay grows with a wrapped title", () => {
  assert.match(cardSource, /hidden min-h-\[56%\] flex-col/);
  assert.doesNotMatch(cardSource, /hidden h-\[56%\] flex-col/);
});
