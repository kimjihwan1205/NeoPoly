import type { AIBoardPlan } from "./components/AIBoardOrganizer";

function unique<T>(items: T[], key: (item: T) => string): T[] {
  return Array.from(new Map(items.map((item) => [key(item), item])).values());
}
export function mergeBoardPlans(current: AIBoardPlan | null, next: AIBoardPlan, replace: boolean): AIBoardPlan {
  if (!current || replace) return next;
  const oldGroups = current.groups.filter((group) => group.id !== "ungrouped");
  const groupedIds = new Set(oldGroups.flatMap((group) => group.noteIds));
  const codes = new Set(oldGroups.map((group) => group.code));
  let index = 1;
  const added = next.groups.filter((group) => group.id !== "ungrouped").map((group) => {
    while (codes.has(`G${index}`)) index++;
    const code = `G${index++}`; codes.add(code);
    const noteIds = group.noteIds.filter((id) => !groupedIds.has(id));
    noteIds.forEach((id) => groupedIds.add(id));
    return { ...group, id: `group-${noteIds.join("-")}`, code, noteIds };
  }).filter((group) => group.noteIds.length > 0);
  return {
    groups: [...oldGroups, ...added],
    relations: unique([...current.relations, ...next.relations], (item) => [item.fromId, item.toId].sort((a, b) => a - b).join("-")),
    duplicates: unique([...current.duplicates, ...next.duplicates], (item) => [...item.noteIds].sort((a, b) => a - b).join("-")),
    recommendations: unique([...current.recommendations, ...next.recommendations], (item) => `${item.noteId}-${item.assetId}`),
  };
}
