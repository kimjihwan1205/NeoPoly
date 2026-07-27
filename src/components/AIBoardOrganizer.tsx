import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleAlert,
  Copy,
  FolderKanban,
  ImagePlus,
  Link2,
  Network,
  RefreshCw,
  Sparkles,
  Unlink,
  Wand2,
  X,
} from "lucide-react";
import type { NoteItem } from "./NotesPage";

export type BoardReferenceCandidate = {
  id: number;
  title: string;
  image: string;
};

type BoardGroup = {
  id: string;
  code: string;
  title: string;
  rationale: string;
  noteIds: number[];
};

type BoardRelation = {
  id: string;
  fromId: number;
  toId: number;
  label: string;
  score: number;
};

type BoardDuplicate = {
  id: string;
  noteIds: [number, number];
  score: number;
  reason: string;
};

type BoardRecommendation = {
  id: string;
  noteId: number;
  assetId: number;
  source: "내 레퍼런스" | "Discover";
  reason: string;
};

export type AIBoardPlan = {
  groups: BoardGroup[];
  relations: BoardRelation[];
  duplicates: BoardDuplicate[];
  recommendations: BoardRecommendation[];
};

type OrganizerTab = "groups" | "relations" | "duplicates" | "references";

const GROUP_DEFINITIONS = [
  {
    code: "A",
    title: "캐릭터 개발",
    rationale: "캐릭터의 실루엣, 의상과 장비를 중심으로 묶었습니다.",
    keywords: ["엘프", "오크", "전사", "스트릿", "캐릭터", "궁수", "의상", "갑옷", "코뿔소", "장비"],
  },
  {
    code: "B",
    title: "크리처 설계",
    rationale: "생물 구조와 움직임, 탈것 설정을 한 흐름으로 정리했습니다.",
    keywords: ["와이번", "공룡", "크리처", "날개", "탈것", "안장", "비행"],
  },
  {
    code: "C",
    title: "산업 에셋",
    rationale: "산업 구조물과 모듈형 에셋 제작 노트를 연결했습니다.",
    keywords: ["포스코", "산업", "철골", "건축", "에셋", "모듈", "선박", "설비"],
  },
] as const;

const TAB_ITEMS: Array<{
  id: OrganizerTab;
  label: string;
  description: string;
  icon: typeof FolderKanban;
}> = [
  { id: "groups", label: "그룹 제안", description: "프로젝트와 세부 주제", icon: FolderKanban },
  { id: "relations", label: "연관 노트", description: "맥락과 연결 이유", icon: Network },
  { id: "duplicates", label: "유사 노트", description: "중복 가능성 비교", icon: Copy },
  { id: "references", label: "이미지 추천", description: "보드와 Discover", icon: ImagePlus },
];

const compactTitle = (title: string) =>
  title
    .replace(/\s*(콘셉트|컨셉트|컨셉|콘셉트|정리|참고|노트|구조|모듈)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const searchableText = (note: NoteItem) =>
  [note.title, note.desc, ...note.tags].join(" ").replaceAll("#", "").toLowerCase();

const tokenize = (note: NoteItem) =>
  new Set(
    searchableText(note)
      .split(/[\s,/·]+/)
      .map((token) => token.trim().replace(/(으로|에서|과|와|을|를|의|에)$/g, ""))
      .filter((token) => token.length >= 2 && !["노트입니다", "정리한", "참고", "작업"].includes(token)),
  );

const similarity = (first: NoteItem, second: NoteItem) => {
  const firstTokens = tokenize(first);
  const secondTokens = tokenize(second);
  const intersection = [...firstTokens].filter((token) => secondTokens.has(token)).length;
  const union = new Set([...firstTokens, ...secondTokens]).size;
  return union === 0 ? 0 : intersection / union;
};

const sharedTopic = (first: NoteItem, second: NoteItem, fallback: string) => {
  const sharedTag = first.tags.find((tag) => second.tags.includes(tag));
  if (sharedTag) return `${sharedTag.replace("#", "")} 주제`;
  const commonWord = [...tokenize(first)].find((token) => tokenize(second).has(token));
  return commonWord ? `${commonWord} 요소` : fallback;
};

export function buildAIBoardPlan(
  notes: NoteItem[],
  references: BoardReferenceCandidate[],
  savedReferenceIds: Set<number>,
): AIBoardPlan {
  const assignments = new Map<string, number[]>();
  GROUP_DEFINITIONS.forEach((definition) => assignments.set(definition.code, []));

  notes.forEach((note) => {
    const haystack = searchableText(note);
    const scored = GROUP_DEFINITIONS.map((definition) => ({
      definition,
      score: definition.keywords.reduce(
        (total, keyword) => total + (haystack.includes(keyword.toLowerCase()) ? 1 : 0),
        0,
      ),
    })).sort((a, b) => b.score - a.score);
    const target = scored[0]?.score ? scored[0].definition.code : GROUP_DEFINITIONS[0].code;
    assignments.get(target)?.push(note.id);
  });

  const groups = GROUP_DEFINITIONS.flatMap((definition) => {
    const noteIds = assignments.get(definition.code) ?? [];
    if (noteIds.length === 0) return [];
    return [
      {
        id: `group-${definition.code.toLowerCase()}`,
        code: definition.code,
        title: definition.title,
        rationale: definition.rationale,
        noteIds,
      },
    ];
  });

  const noteById = new Map(notes.map((note) => [note.id, note]));
  const groupByNote = new Map<number, BoardGroup>();
  groups.forEach((group) => group.noteIds.forEach((noteId) => groupByNote.set(noteId, group)));

  const relationCandidates: BoardRelation[] = [];
  for (let firstIndex = 0; firstIndex < notes.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < notes.length; secondIndex += 1) {
      const first = notes[firstIndex];
      const second = notes[secondIndex];
      const firstGroup = groupByNote.get(first.id);
      const secondGroup = groupByNote.get(second.id);
      const overlap = similarity(first, second);
      const sameGroup = firstGroup?.id === secondGroup?.id;
      if (!sameGroup && overlap < 0.08) continue;
      const score = Math.min(96, Math.round((sameGroup ? 66 : 48) + overlap * 120));
      relationCandidates.push({
        id: `relation-${first.id}-${second.id}`,
        fromId: first.id,
        toId: second.id,
        label: sharedTopic(first, second, firstGroup?.title ?? "연관 주제"),
        score,
      });
    }
  }

  const relations = relationCandidates.sort((a, b) => b.score - a.score).slice(0, 10);
  const duplicates = relationCandidates
    .filter((relation) => {
      const first = noteById.get(relation.fromId);
      const second = noteById.get(relation.toId);
      if (!first || !second) return false;
      const firstTitleTokens = new Set(
        first.title.split(/\s+/).map((token) => token.replace(/(정리|참고|노트|구조)$/g, "")),
      );
      const hasSharedTitleTopic = second.title
        .split(/\s+/)
        .map((token) => token.replace(/(정리|참고|노트|구조)$/g, ""))
        .some((token) => token.length >= 2 && firstTitleTokens.has(token));
      const hasSamePrimaryTag = Boolean(first.tags[0] && first.tags[0] === second.tags[0]);
      return (hasSharedTitleTopic || hasSamePrimaryTag) && similarity(first, second) >= 0.06;
    })
    .slice(0, 3)
    .map((relation) => ({
      id: `duplicate-${relation.fromId}-${relation.toId}`,
      noteIds: [relation.fromId, relation.toId] as [number, number],
      score: Math.max(72, relation.score),
      reason: `${relation.label}가 반복되어 하나의 흐름으로 연결할 수 있습니다.`,
    }));

  const recommendations: BoardRecommendation[] = notes.slice(0, 6).flatMap((note) => {
    const directMatch = references.find((asset) => asset.id === note.id);
    const keywordMatch = references.find(
      (asset) =>
        asset.id !== note.id &&
        searchableText(note).includes(asset.title.replace(/\s+/g, "").toLowerCase()),
    );
    const candidate = directMatch ?? keywordMatch ?? references[(note.id - 1) % Math.max(references.length, 1)];
    if (!candidate) return [];
    const keyTopic = note.tags[0]?.replace("#", "") ?? compactTitle(note.title);
    return [
      {
        id: `recommendation-${note.id}-${candidate.id}`,
        noteId: note.id,
        assetId: candidate.id,
        source: savedReferenceIds.has(candidate.id) ? "내 레퍼런스" : "Discover",
        reason: `${keyTopic}의 형태와 분위기를 구체화하는 데 적합합니다.`,
      },
    ];
  });

  return { groups, relations, duplicates, recommendations };
}

interface AIBoardOrganizerProps {
  notes: NoteItem[];
  references: BoardReferenceCandidate[];
  savedReferenceIds: Set<number>;
  onClose: () => void;
  onApply: (plan: AIBoardPlan) => void;
}

export function AIBoardOrganizer({
  notes,
  references,
  savedReferenceIds,
  onClose,
  onApply,
}: AIBoardOrganizerProps) {
  const initialPlan = useMemo(
    () => buildAIBoardPlan(notes, references, savedReferenceIds),
    [notes, references, savedReferenceIds],
  );
  const [phase, setPhase] = useState<"analyzing" | "review">("analyzing");
  const [analysisStage, setAnalysisStage] = useState(0);
  const [activeTab, setActiveTab] = useState<OrganizerTab>("groups");
  const [groups, setGroups] = useState(initialPlan.groups);
  const [selectedGroupIds, setSelectedGroupIds] = useState(
    () => new Set(initialPlan.groups.map((group) => group.id)),
  );
  const [selectedRecommendationIds, setSelectedRecommendationIds] = useState(
    () => new Set(initialPlan.recommendations.slice(0, 4).map((item) => item.id)),
  );
  const [activeRelationNoteId, setActiveRelationNoteId] = useState(
    initialPlan.groups[0]?.noteIds[0] ?? notes[0]?.id ?? 0,
  );
  const [duplicateActions, setDuplicateActions] = useState<Record<string, "link" | "keep">>(
    () => Object.fromEntries(initialPlan.duplicates.map((item) => [item.id, "link"])),
  );

  const noteById = useMemo(() => new Map(notes.map((note) => [note.id, note])), [notes]);
  const referenceById = useMemo(
    () => new Map(references.map((reference) => [reference.id, reference])),
    [references],
  );
  useEffect(() => {
    const stageTimers = [
      window.setTimeout(() => setAnalysisStage(1), 420),
      window.setTimeout(() => setAnalysisStage(2), 860),
      window.setTimeout(() => setAnalysisStage(3), 1260),
      window.setTimeout(() => setPhase("review"), 1680),
    ];
    return () => stageTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const toggleRecommendation = (recommendationId: string) => {
    setSelectedRecommendationIds((current) => {
      const next = new Set(current);
      if (next.has(recommendationId)) next.delete(recommendationId);
      else next.add(recommendationId);
      return next;
    });
  };

  const applyPlan = () => {
    const activeGroups = groups.filter((group) => selectedGroupIds.has(group.id));
    const activeNoteIds = new Set(activeGroups.flatMap((group) => group.noteIds));
    onApply({
      groups: activeGroups,
      relations: initialPlan.relations.filter(
        (relation) => activeNoteIds.has(relation.fromId) && activeNoteIds.has(relation.toId),
      ),
      duplicates: initialPlan.duplicates.filter(
        (duplicate) =>
          duplicateActions[duplicate.id] === "link" &&
          duplicate.noteIds.every((noteId) => activeNoteIds.has(noteId)),
      ),
      recommendations: initialPlan.recommendations.filter((recommendation) =>
        selectedRecommendationIds.has(recommendation.id),
      ),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-0 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AI 보드 정리"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.985, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex h-full w-full max-w-[1440px] flex-col overflow-hidden border-[#2A2E36] bg-[#090A0C] shadow-[0_28px_90px_rgba(0,0,0,0.68)] sm:h-[min(900px,calc(100dvh-32px))] sm:rounded-xl sm:border"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[#20232A] bg-[#0D0F12] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[18px] font-semibold text-white sm:text-[20px]">
                  AI 보드 정리
                </h2>
                <span className="hidden rounded-full border border-[#343842] px-2 py-0.5 text-[11px] text-text-tertiary sm:inline">
                  BETA
                </span>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-text-tertiary sm:text-[13px]">
                노트의 내용과 레퍼런스를 바탕으로 정리 방법을 제안합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition hover:bg-white/5 hover:text-white"
            aria-label="AI 보드 정리 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <AnimatePresence mode="wait">
          {phase === "analyzing" ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-0 flex-1 items-center justify-center px-5"
            >
              <div className="w-full max-w-[560px]">
                <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                  <motion.span
                    className="absolute inset-0 rounded-full border border-brand-primary/25"
                    animate={{ scale: [0.85, 1.12], opacity: [0.8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                  />
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-[#050505] shadow-[0_0_36px_rgba(224,161,46,0.22)]">
                    <Wand2 className="h-7 w-7" />
                  </span>
                </div>
                <p className="text-center text-[13px] font-medium uppercase tracking-[0.16em] text-brand-primary">
                  Board intelligence
                </p>
                <h3 className="mt-3 text-center text-[24px] font-semibold text-white sm:text-[28px]">
                  작업 맥락을 읽고 있습니다
                </h3>
                <div className="mt-8 overflow-hidden rounded-full bg-[#1C1F25]">
                  <motion.div
                    className="h-1.5 rounded-full bg-brand-primary"
                    animate={{ width: `${Math.min(100, (analysisStage + 1) * 25)}%` }}
                    transition={{ duration: 0.36, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    `${notes.length}개 노트의 제목과 내용을 분석`,
                    "공통 주제와 프로젝트 흐름 탐색",
                    "중복 가능성과 연관 관계 비교",
                    "내 레퍼런스와 Discover 이미지 매칭",
                  ].map((label, index) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 text-[14px] transition ${
                        index <= analysisStage ? "text-text-primary" : "text-text-tertiary/45"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          index < analysisStage
                            ? "border-brand-primary bg-brand-primary text-[#050505]"
                            : index === analysisStage
                              ? "border-brand-primary text-brand-primary"
                              : "border-[#343842]"
                        }`}
                      >
                        {index < analysisStage ? (
                          <Check className="h-3 w-3 stroke-[3]" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        )}
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-0 flex-1 flex-col lg:flex-row"
            >
              <aside className="hidden w-[240px] shrink-0 border-r border-[#20232A] bg-[#0B0D10] p-4 lg:block">
                <div className="mb-4 rounded-lg border border-brand-primary/20 bg-brand-primary/[0.06] p-4">
                  <p className="text-[12px] font-medium text-brand-primary">분석 완료</p>
                  <p className="mt-1 text-[14px] leading-5 text-text-secondary">
                    {notes.length}개 노트에서 {groups.length}개의 작업 그룹을 찾았습니다.
                  </p>
                </div>
                <nav className="space-y-1" aria-label="AI 분석 결과">
                  {TAB_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                          active
                            ? "bg-[#1A1D23] text-white"
                            : "text-text-tertiary hover:bg-[#12151A] hover:text-white"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${active ? "text-brand-primary" : ""}`} />
                        <span>
                          <span className="block text-[14px] font-medium">{item.label}</span>
                          <span className="mt-0.5 block text-[11px] text-text-tertiary">
                            {item.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </aside>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#20232A] px-4 py-3 scrollbar-hide lg:hidden">
                  {TAB_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`shrink-0 rounded-full border px-3 py-2 text-[13px] font-medium ${
                        activeTab === item.id
                          ? "border-brand-primary/50 bg-brand-primary/10 text-brand-primary"
                          : "border-[#2A2E36] text-text-tertiary"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                  {activeTab === "groups" && (
                    <GroupReview
                      groups={groups}
                      notes={notes}
                      selectedGroupIds={selectedGroupIds}
                      onToggle={toggleGroup}
                      onRename={(groupId, title) =>
                        setGroups((current) =>
                          current.map((group) => (group.id === groupId ? { ...group, title } : group)),
                        )
                      }
                    />
                  )}
                  {activeTab === "relations" && (
                    <RelationReview
                      notes={notes}
                      relations={initialPlan.relations}
                      activeNoteId={activeRelationNoteId}
                      onActiveNoteChange={setActiveRelationNoteId}
                    />
                  )}
                  {activeTab === "duplicates" && (
                    <DuplicateReview
                      notes={notes}
                      duplicates={initialPlan.duplicates}
                      actions={duplicateActions}
                      onAction={(duplicateId, action) =>
                        setDuplicateActions((current) => ({ ...current, [duplicateId]: action }))
                      }
                    />
                  )}
                  {activeTab === "references" && (
                    <ReferenceReview
                      recommendations={initialPlan.recommendations}
                      noteById={noteById}
                      referenceById={referenceById}
                      selectedIds={selectedRecommendationIds}
                      onToggle={toggleRecommendation}
                    />
                  )}
                </div>

                <footer className="flex shrink-0 flex-col gap-3 border-t border-[#20232A] bg-[#0D0F12] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="flex items-center gap-2 text-[12px] leading-5 text-text-tertiary">
                    <CircleAlert className="h-4 w-4 shrink-0" />
                    적용 전까지 기존 보드는 변경되지 않습니다.
                  </p>
                  <button
                    type="button"
                    onClick={applyPlan}
                    disabled={selectedGroupIds.size === 0}
                    className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 text-[14px] font-semibold text-[#050505] transition hover:bg-[#EDB33F] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    선택한 정리 적용
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </footer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function GroupReview({
  groups,
  notes,
  selectedGroupIds,
  onToggle,
  onRename,
}: {
  groups: BoardGroup[];
  notes: NoteItem[];
  selectedGroupIds: Set<string>;
  onToggle: (groupId: string) => void;
  onRename: (groupId: string, title: string) => void;
}) {
  const noteById = new Map(notes.map((note) => [note.id, note]));
  return (
    <section>
      <div className="mb-6 max-w-[720px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-primary">
          Structure proposal
        </p>
        <h3 className="mt-2 text-[24px] font-semibold text-white">
          프로젝트 흐름을 {groups.length}개의 그룹으로 나눴어요
        </h3>
        <p className="mt-2 text-[14px] leading-6 text-text-tertiary">
          그룹명은 바로 수정할 수 있으며, 제외한 그룹은 기존 위치에 유지됩니다.
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {groups.map((group) => {
          const selected = selectedGroupIds.has(group.id);
          return (
            <article
              key={group.id}
              className={`overflow-hidden rounded-xl border transition ${
                selected
                  ? "border-brand-primary/45 bg-[#111318]"
                  : "border-[#252932] bg-[#0D0F12] opacity-55"
              }`}
            >
              <div className="flex items-start gap-3 border-b border-[#242832] p-4">
                <button
                  type="button"
                  onClick={() => onToggle(group.id)}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border ${
                    selected
                      ? "border-brand-primary bg-brand-primary text-[#050505]"
                      : "border-[#3A3F49] text-transparent"
                  }`}
                  aria-label={`${group.title} ${selected ? "제외" : "포함"}`}
                  aria-pressed={selected}
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-primary/10 px-2 py-1 text-[11px] font-semibold text-brand-primary">
                      PROJECT {group.code}
                    </span>
                    <span className="text-[12px] text-text-tertiary">{group.noteIds.length}개 노트</span>
                  </div>
                  <input
                    value={group.title}
                    onChange={(event) => onRename(group.id, event.target.value)}
                    className="mt-3 w-full border-0 bg-transparent p-0 text-[18px] font-semibold text-white outline-none focus:text-brand-primary"
                    aria-label={`${group.code} 그룹명`}
                  />
                  <p className="mt-1 text-[13px] leading-5 text-text-tertiary">{group.rationale}</p>
                </div>
              </div>
              <div className="space-y-2 p-3">
                {group.noteIds.map((noteId, index) => {
                  const note = noteById.get(noteId);
                  if (!note) return null;
                  return (
                    <div
                      key={note.id}
                      className="flex items-center gap-3 rounded-lg border border-[#242832] bg-[#0B0D10] p-2.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1B1E24] text-[11px] font-semibold text-brand-primary">
                        {group.code}{index + 1}
                      </span>
                      {note.images[0] && (
                        <img
                          src={note.images[0]}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-md object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-white">
                          {compactTitle(note.title)}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-text-tertiary">
                          {note.tags.slice(0, 2).join(" · ")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RelationReview({
  notes,
  relations,
  activeNoteId,
  onActiveNoteChange,
}: {
  notes: NoteItem[];
  relations: BoardRelation[];
  activeNoteId: number;
  onActiveNoteChange: (noteId: number) => void;
}) {
  const noteById = new Map(notes.map((note) => [note.id, note]));
  const activeNote = noteById.get(activeNoteId);
  const connected = relations
    .filter((relation) => relation.fromId === activeNoteId || relation.toId === activeNoteId)
    .slice(0, 3);

  return (
    <section>
      <div className="mb-5 max-w-[720px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-primary">
          Focused relation map
        </p>
        <h3 className="mt-2 text-[24px] font-semibold text-white">필요할 때만 관계를 보여줍니다</h3>
        <p className="mt-2 text-[14px] leading-6 text-text-tertiary">
          노트를 선택하면 가장 강한 연결만 표시해 복잡한 선이 보드를 덮지 않도록 했습니다.
        </p>
      </div>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {notes.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => onActiveNoteChange(note.id)}
            className={`shrink-0 rounded-full border px-3 py-2 text-[12px] font-medium ${
              activeNoteId === note.id
                ? "border-brand-primary/60 bg-brand-primary/10 text-brand-primary"
                : "border-[#2A2E36] text-text-tertiary hover:text-white"
            }`}
          >
            {compactTitle(note.title)}
          </button>
        ))}
      </div>

      <div className="hidden h-[430px] overflow-hidden rounded-xl border border-[#252932] bg-[#0B0D10] md:block">
        {activeNote && connected.length > 0 ? (
          <div className="relative h-full">
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#3A3F49_1px,transparent_1px)] [background-size:20px_20px]" />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {connected.map((relation, index) => {
                const targetY = 18 + index * 32;
                return (
                  <motion.path
                    key={relation.id}
                    d={`M 35 50 C 50 50, 50 ${targetY}, 65 ${targetY}`}
                    fill="none"
                    stroke="#E0A12E"
                    strokeWidth="0.42"
                    strokeDasharray="1.4 1.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  />
                );
              })}
            </svg>
            <RelationNode
              note={activeNote}
              className="absolute left-[5%] top-1/2 w-[30%] -translate-y-1/2 border-brand-primary/60 shadow-[0_0_30px_rgba(224,161,46,0.12)]"
              eyebrow="선택한 노트"
            />
            {connected.map((relation, index) => {
              const targetId = relation.fromId === activeNoteId ? relation.toId : relation.fromId;
              const target = noteById.get(targetId);
              if (!target) return null;
              return (
                <div
                  key={relation.id}
                  className="absolute right-[5%] w-[30%]"
                  style={{ top: `${7 + index * 32}%` }}
                >
                  <RelationNode note={target} eyebrow={relation.label} />
                  <span className="absolute -left-14 top-1/2 -translate-y-1/2 rounded-full border border-brand-primary/30 bg-[#0B0D10] px-2 py-1 text-[10px] font-semibold text-brand-primary">
                    {relation.score}%
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-[14px] text-text-tertiary">
            이 노트에서 강한 연결을 찾지 못했습니다.
          </div>
        )}
      </div>

      <div className="space-y-3 md:hidden">
        {connected.map((relation) => {
          const targetId = relation.fromId === activeNoteId ? relation.toId : relation.fromId;
          const target = noteById.get(targetId);
          if (!target) return null;
          return (
            <div key={relation.id} className="rounded-xl border border-[#252932] bg-[#101216] p-4">
              <div className="flex items-center gap-3">
                <Link2 className="h-4 w-4 shrink-0 text-brand-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-white">{target.title}</p>
                  <p className="mt-1 text-[12px] text-text-tertiary">{relation.label}</p>
                </div>
                <span className="text-[12px] font-semibold text-brand-primary">{relation.score}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RelationNode({
  note,
  eyebrow,
  className = "",
}: {
  note: NoteItem;
  eyebrow: string;
  className?: string;
}) {
  return (
    <article className={`rounded-xl border border-[#30343D] bg-[#13161B] p-4 ${className}`}>
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-brand-primary">{eyebrow}</p>
      <div className="mt-2 flex items-center gap-3">
        {note.images[0] && (
          <img
            src={note.images[0]}
            alt=""
            className="h-12 w-12 shrink-0 rounded-md object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="min-w-0">
          <h4 className="line-clamp-2 text-[13px] font-semibold text-white">{note.title}</h4>
          <p className="mt-1 truncate text-[11px] text-text-tertiary">{note.tags.slice(0, 2).join(" · ")}</p>
        </div>
      </div>
    </article>
  );
}

function DuplicateReview({
  notes,
  duplicates,
  actions,
  onAction,
}: {
  notes: NoteItem[];
  duplicates: BoardDuplicate[];
  actions: Record<string, "link" | "keep">;
  onAction: (duplicateId: string, action: "link" | "keep") => void;
}) {
  const noteById = new Map(notes.map((note) => [note.id, note]));
  return (
    <section>
      <div className="mb-6 max-w-[720px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-primary">
          Similarity check
        </p>
        <h3 className="mt-2 text-[24px] font-semibold text-white">삭제하지 않고 비교부터 합니다</h3>
        <p className="mt-2 text-[14px] leading-6 text-text-tertiary">
          유사한 노트는 연결 대상으로만 제안하며, 원본 내용은 그대로 유지됩니다.
        </p>
      </div>
      <div className="space-y-4">
        {duplicates.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-[#30343D] bg-[#0D0F12] px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#181B20] text-brand-primary">
              <Check className="h-5 w-5" />
            </span>
            <h4 className="mt-4 text-[16px] font-semibold text-white">겹치는 노트가 없습니다</h4>
            <p className="mt-2 max-w-[420px] text-[13px] leading-5 text-text-tertiary">
              현재 보드의 노트는 서로 다른 내용을 담고 있어 별도 유지하는 편이 좋습니다.
            </p>
          </div>
        ) : duplicates.map((duplicate) => {
          const first = noteById.get(duplicate.noteIds[0]);
          const second = noteById.get(duplicate.noteIds[1]);
          if (!first || !second) return null;
          return (
            <article key={duplicate.id} className="rounded-xl border border-[#252932] bg-[#101216] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#B97848]/35 bg-[#B97848]/10 px-2.5 py-1 text-[11px] font-semibold text-[#E0A77D]">
                    유사 {duplicate.score}%
                  </span>
                  <span className="text-[12px] text-text-tertiary">{duplicate.reason}</span>
                </div>
                <div className="flex rounded-lg border border-[#2A2E36] bg-[#0B0D10] p-1">
                  {[
                    ["link", "연결 유지"],
                    ["keep", "별도 유지"],
                  ].map(([action, label]) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => onAction(duplicate.id, action as "link" | "keep")}
                      className={`rounded-md px-3 py-2 text-[12px] font-medium ${
                        actions[duplicate.id] === action
                          ? "bg-[#242832] text-white"
                          : "text-text-tertiary"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                {[first, second].map((note) => (
                  <div key={note.id} className="rounded-lg border border-[#242832] bg-[#0B0D10] p-4">
                    <h4 className="text-[14px] font-semibold text-white">{note.title}</h4>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-text-tertiary">{note.desc}</p>
                    <p className="mt-3 text-[11px] text-brand-primary">{note.tags.slice(0, 3).join(" · ")}</p>
                  </div>
                ))}
                <Link2 className="mx-auto hidden h-5 w-5 text-brand-primary md:block" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ReferenceReview({
  recommendations,
  noteById,
  referenceById,
  selectedIds,
  onToggle,
}: {
  recommendations: BoardRecommendation[];
  noteById: Map<number, NoteItem>;
  referenceById: Map<number, BoardReferenceCandidate>;
  selectedIds: Set<string>;
  onToggle: (recommendationId: string) => void;
}) {
  return (
    <section>
      <div className="mb-6 max-w-[720px]">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-primary">
          Reference matching
        </p>
        <h3 className="mt-2 text-[24px] font-semibold text-white">노트의 맥락에 맞는 이미지를 찾았어요</h3>
        <p className="mt-2 text-[14px] leading-6 text-text-tertiary">
          저장한 레퍼런스를 우선하고, 부족한 부분은 Discover 작품으로 보완합니다.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recommendations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#30343D] bg-[#0D0F12] p-8 text-center sm:col-span-2 xl:col-span-3">
            <p className="text-[14px] font-medium text-white">추천할 이미지를 찾지 못했습니다.</p>
            <p className="mt-2 text-[12px] text-text-tertiary">레퍼런스를 더 추가한 뒤 다시 분석해보세요.</p>
          </div>
        ) : recommendations.map((recommendation) => {
          const note = noteById.get(recommendation.noteId);
          const reference = referenceById.get(recommendation.assetId);
          const selected = selectedIds.has(recommendation.id);
          if (!note || !reference) return null;
          return (
            <article
              key={recommendation.id}
              className={`overflow-hidden rounded-xl border bg-[#101216] transition ${
                selected ? "border-brand-primary/50" : "border-[#252932] opacity-65"
              }`}
            >
              <button
                type="button"
                onClick={() => onToggle(recommendation.id)}
                className="block w-full text-left"
                aria-pressed={selected}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#08090B]">
                  <img
                    src={reference.image}
                    alt={reference.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                    {recommendation.source}
                  </span>
                  <span
                    className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border ${
                      selected
                        ? "border-brand-primary bg-brand-primary text-[#050505]"
                        : "border-white/30 bg-black/50 text-transparent"
                    }`}
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-medium text-brand-primary">
                    {compactTitle(note.title)}에 추천
                  </p>
                  <h4 className="mt-1.5 text-[14px] font-semibold text-white">{reference.title}</h4>
                  <p className="mt-2 text-[12px] leading-5 text-text-tertiary">{recommendation.reason}</p>
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

interface AIOrganizedBoardProps {
  plan: AIBoardPlan;
  notes: NoteItem[];
  references: BoardReferenceCandidate[];
  onOpenNote: (noteId: number) => void;
  onRefine: () => void;
  onReset: () => void;
  onDissolveGroup: (groupId: string) => void;
  onDisconnectRelation: (relationId: string) => void;
}

export function AIOrganizedBoard({
  plan,
  notes,
  references,
  onOpenNote,
  onRefine,
  onReset,
  onDissolveGroup,
  onDisconnectRelation,
}: AIOrganizedBoardProps) {
  const [focusedNoteId, setFocusedNoteId] = useState<number | null>(null);
  const noteById = useMemo(() => new Map(notes.map((note) => [note.id, note])), [notes]);
  const referenceById = useMemo(
    () => new Map(references.map((reference) => [reference.id, reference])),
    [references],
  );
  const focusedRelations = focusedNoteId
    ? plan.relations.filter(
        (relation) => relation.fromId === focusedNoteId || relation.toId === focusedNoteId,
      )
    : [];
  const relatedNoteIds = new Set(
    focusedRelations.map((relation) =>
      relation.fromId === focusedNoteId ? relation.toId : relation.fromId,
    ),
  );
  const boardGridClass =
    plan.groups.length === 1
      ? "min-w-0 max-w-[560px] grid-cols-1"
      : plan.groups.length === 2
        ? "min-w-[620px] grid-cols-2"
        : "min-w-[920px] grid-cols-3";
  const activeGroupCount = plan.groups.filter((group) => group.id !== "ungrouped").length;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#20232A] bg-[#090A0C]">
      <header className="shrink-0 border-b border-[#20232A] bg-[#0D0F12] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-[#050505]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-semibold text-white">AI 정리된 보드</h2>
                <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] font-semibold text-brand-primary">
                  {activeGroupCount} GROUPS
                </span>
              </div>
              <p className="mt-1 text-[13px] text-text-tertiary">
                관련 노트는 같은 프로젝트 흐름으로 묶고 추천 레퍼런스를 연결했습니다.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReset}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#2A2E36] px-4 text-[13px] font-medium text-text-secondary transition hover:text-white xl:flex-none"
            >
              <RefreshCw className="h-4 w-4" />
              원래 보기
            </button>
            <button
              type="button"
              onClick={onRefine}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-brand-primary/35 bg-brand-primary/10 px-4 text-[13px] font-medium text-brand-primary transition hover:border-brand-primary/60 xl:flex-none"
            >
              <Wand2 className="h-4 w-4" />
              다시 정리
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {focusedNoteId && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 14 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3 rounded-lg border border-brand-primary/20 bg-brand-primary/[0.05] p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-2">
                  <Network className="h-4 w-4 shrink-0 text-brand-primary" />
                  <p className="truncate text-[13px] font-medium text-white">
                    {noteById.get(focusedNoteId)?.title}
                  </p>
                </div>
                <ChevronRight className="hidden h-4 w-4 shrink-0 text-text-tertiary sm:block" />
                <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto scrollbar-hide">
                  {focusedRelations.length > 0 ? (
                    focusedRelations.map((relation) => {
                      const targetId =
                        relation.fromId === focusedNoteId ? relation.toId : relation.fromId;
                      return (
                        <div
                          key={relation.id}
                          className="flex shrink-0 items-center overflow-hidden rounded-full border border-brand-primary/25 bg-[#111318]"
                        >
                          <button
                            type="button"
                            onClick={() => setFocusedNoteId(targetId)}
                            className="px-3 py-1.5 text-[11px] text-text-secondary hover:text-white"
                          >
                            {compactTitle(noteById.get(targetId)?.title ?? "")} · {relation.label}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onDisconnectRelation(relation.id);
                              if (focusedRelations.length === 1) setFocusedNoteId(null);
                            }}
                            className="flex h-7 w-8 items-center justify-center border-l border-brand-primary/20 text-text-tertiary transition hover:bg-red-500/10 hover:text-red-300"
                            aria-label={`${noteById.get(targetId)?.title ?? "연관 노트"} 연결 끊기`}
                            title="연결 끊기"
                          >
                            <Unlink className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-[11px] text-text-tertiary">연결된 노트가 없습니다.</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setFocusedNoteId(null)}
                  className="self-end text-[11px] text-text-tertiary hover:text-white sm:self-auto"
                >
                  관계 보기 닫기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-5">
        <div className={`grid h-full gap-4 ${boardGridClass}`}>
          {plan.groups.map((group) => {
            const isUngrouped = group.id === "ungrouped";
            const groupRecommendations = plan.recommendations.filter((recommendation) =>
              group.noteIds.includes(recommendation.noteId),
            );
            return (
              <section
                key={group.id}
                className={`flex min-h-0 flex-col overflow-hidden rounded-xl border bg-[#0D0F12] ${
                  isUngrouped ? "border-dashed border-[#343842]" : "border-[#252932]"
                }`}
              >
                <div className="shrink-0 border-b border-[#252932] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded px-2 py-1 text-[10px] font-semibold ${
                        isUngrouped
                          ? "bg-[#22262D] text-text-tertiary"
                          : "bg-brand-primary/10 text-brand-primary"
                      }`}
                    >
                      {isUngrouped ? "UNGROUPED" : `PROJECT ${group.code}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-text-tertiary">{group.noteIds.length} NOTES</span>
                      {!isUngrouped && (
                        <button
                          type="button"
                          onClick={() => onDissolveGroup(group.id)}
                          className="flex h-7 items-center gap-1 rounded-md border border-[#343842] px-2 text-[10px] font-medium text-text-tertiary transition hover:border-red-400/35 hover:bg-red-500/5 hover:text-red-300"
                          aria-label={`${group.title} 그룹 해제`}
                        >
                          <Unlink className="h-3 w-3" />
                          그룹 해제
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="mt-3 text-[17px] font-semibold text-white">{group.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-text-tertiary">
                    {group.rationale}
                  </p>
                </div>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 custom-scrollbar">
                  {group.noteIds.map((noteId, index) => {
                    const note = noteById.get(noteId);
                    if (!note) return null;
                    const relationCount = plan.relations.filter(
                      (relation) => relation.fromId === noteId || relation.toId === noteId,
                    ).length;
                    const isFocused = focusedNoteId === noteId;
                    const isRelated = relatedNoteIds.has(noteId);
                    const isDimmed = focusedNoteId !== null && !isFocused && !isRelated;
                    const isDuplicate = plan.duplicates.some((duplicate) =>
                      duplicate.noteIds.includes(noteId),
                    );
                    return (
                      <article
                        key={note.id}
                        className={`rounded-lg border bg-[#12151A] p-3 transition ${
                          isFocused
                            ? "border-brand-primary shadow-[0_0_24px_rgba(224,161,46,0.12)]"
                            : isRelated
                              ? "border-brand-primary/45"
                              : "border-[#272B33]"
                        } ${isDimmed ? "opacity-35" : "opacity-100"}`}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenNote(note.id)}
                          className="block w-full text-left"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1C2027] text-[10px] font-semibold text-brand-primary">
                              {isUngrouped ? `N${index + 1}` : `${group.code}${index + 1}`}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h4 className="line-clamp-2 text-[13px] font-semibold leading-5 text-white">
                                {note.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-text-tertiary">
                                {note.desc}
                              </p>
                            </div>
                            {note.images[0] && (
                              <img
                                src={note.images[0]}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded-md object-cover"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                        </button>
                        <div className="mt-3 flex items-center gap-2 border-t border-[#242832] pt-2.5">
                          {relationCount > 0 && (
                            <button
                              type="button"
                              onClick={() => setFocusedNoteId(isFocused ? null : note.id)}
                              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium ${
                                isFocused
                                  ? "bg-brand-primary text-[#050505]"
                                  : "bg-[#1C2027] text-text-secondary hover:text-white"
                              }`}
                            >
                              <Link2 className="h-3 w-3" />
                              연결 {relationCount}
                            </button>
                          )}
                          {isDuplicate && (
                            <span className="rounded-md bg-[#B97848]/10 px-2 py-1 text-[10px] font-medium text-[#E0A77D]">
                              유사 노트
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  })}

                  {groupRecommendations.length > 0 && (
                    <div className="rounded-lg border border-dashed border-[#343842] bg-[#0A0C0F] p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <ImagePlus className="h-3.5 w-3.5 text-brand-primary" />
                        <p className="text-[11px] font-medium text-white">AI 추천 레퍼런스</p>
                      </div>
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {groupRecommendations.map((recommendation) => {
                          const reference = referenceById.get(recommendation.assetId);
                          if (!reference) return null;
                          return (
                            <div key={recommendation.id} className="w-[92px] shrink-0">
                              <img
                                src={reference.image}
                                alt={reference.title}
                                className="h-16 w-full rounded-md object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <p className="mt-1 truncate text-[9px] text-text-tertiary">
                                {recommendation.source}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
