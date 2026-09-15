import assert from "node:assert/strict";
import { test } from "node:test";
import { mergeBoardPlans } from "./boardState";
import type { AIBoardPlan } from "./components/AIBoardOrganizer";

const group = (id: string, code: string, noteIds: number[]) => ({
  id, code, noteIds, title: id, rationale: "검증용",
});
const plan = (groups: AIBoardPlan["groups"]): AIBoardPlan => ({
  groups, relations: [], duplicates: [], recommendations: [],
});

test("ungrouped-only organization preserves old groups and avoids duplicate memberships/codes", () => {
  const current = plan([group("kept", "G1", [1, 2]), group("ungrouped", "U", [3, 4])]);
  const next = plan([group("next", "A", [2, 3]), group("overlap", "B", [3, 4])]);
  const result = mergeBoardPlans(current, next, false);
  assert.deepEqual(result.groups[0], current.groups[0]);
  assert.deepEqual(result.groups.map((item) => item.noteIds), [[1, 2], [3], [4]]);
  assert.equal(new Set(result.groups.map((item) => item.code)).size, 3);
  assert.deepEqual(current.groups[1].noteIds, [3, 4]);
});

test("include-existing mode replaces the plan; empty new groups are not introduced by merging", () => {
  const current = plan([group("kept", "A", [1, 2])]);
  const next = plan([group("new", "B", [1, 2])]);
  assert.equal(mergeBoardPlans(current, next, true), next);
  assert.equal(mergeBoardPlans(null, next, false), next);
  assert.deepEqual(mergeBoardPlans(current, next, false).groups, current.groups);
});

test("merging deduplicates reversed links, duplicate pairs and image recommendations", () => {
  const current = plan([]);
  current.relations = [{ id: "old", fromId: 1, toId: 2, label: "연관", score: 80 }];
  current.duplicates = [{ id: "old", noteIds: [1, 2], score: 80, reason: "유사" }];
  current.recommendations = [{ id: "old", noteId: 1, assetId: 7, source: "Discover", reason: "참고" }];
  const next = plan([]);
  next.relations = [{ ...current.relations[0], id: "new", fromId: 2, toId: 1 }];
  next.duplicates = [{ ...current.duplicates[0], id: "new", noteIds: [2, 1] }];
  next.recommendations = [{ ...current.recommendations[0], id: "new" }];
  const result = mergeBoardPlans(current, next, false);
  assert.equal(result.relations.length, 1);
  assert.equal(result.duplicates.length, 1);
  assert.equal(result.recommendations.length, 1);
});
