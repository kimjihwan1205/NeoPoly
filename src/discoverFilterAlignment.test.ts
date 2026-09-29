import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./App.tsx", import.meta.url), "utf8");
const sectionStart = source.indexOf("function DiscoverSection(");
const sectionEnd = source.indexOf("function Sidebar(", sectionStart);
const sectionSource = source.slice(sectionStart, sectionEnd);

test("compact filter control stays at the right edge before the tablet breakpoint", () => {
  assert.match(sectionSource, /sm:flex-1 sm:flex-row sm:items-end sm:gap-8 md:flex-none/);
  assert.match(sectionSource, /mb-\[-2px\] flex min-w-0 flex-1 items-end gap-2/);
  assert.match(sectionSource, /aria-label="필터 열기"[\s\S]*h-11 w-11 shrink-0/);
});

test("tablet filter row continues to right-align the full filter action", () => {
  assert.match(sectionSource, /hidden h-8 min-w-0 flex-1 items-center justify-end[\s\S]*md:flex/);
});
