import assert from "node:assert/strict";
import { test } from "node:test";
import { readJSON, writeJSON } from "./localStore";
import { parseNoteTags, upsertNote } from "./noteState";

test("local storage preserves intentionally empty lists and handles corrupt JSON", () => {
  assert.deepEqual(readJSON("notes", [1], { getItem: () => "[]" }), []);
  assert.deepEqual(readJSON("notes", [1], { getItem: () => "{" }), [1]);
  assert.deepEqual(readJSON("notes", [1], { getItem: () => null }), [1]);
});
test("quota failures return false instead of claiming a successful save", () => {
  assert.equal(writeJSON("notes", [], { setItem() { throw new Error("quota"); } }), false);
  let saved = "";
  assert.equal(writeJSON("notes", [1], { setItem(_, value) { saved = value; } }), true);
  assert.equal(saved, "[1]");
});
test("editing replaces only the selected note; tags are deduplicated", () => {
  const first = { id: 1, title: "원본" } as any;
  const second = { id: 2, title: "유지" } as any;
  const result = upsertNote([first, second], { ...first, title: "수정" });
  assert.equal(result.length, 2);
  assert.equal(result[1], second);
  assert.equal(result[0].title, "수정");
  assert.deepEqual(parseNoteTags("#갑옷, 전사 #갑옷"), ["#갑옷", "#전사"]);
});
