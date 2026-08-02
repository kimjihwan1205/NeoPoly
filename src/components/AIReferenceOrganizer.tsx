import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Images, Sparkles, Wand2, X } from "lucide-react";
import type { ReferenceAIGroup, ReferenceAsset } from "./ReferencePage";

const REFERENCE_GROUP_DEFINITIONS = [
  {
    code: "R1",
    title: "캐릭터 · 크리처",
    rationale: "인물, 전사와 생물 형태를 함께 비교하기 좋은 이미지입니다.",
    keywords: ["캐릭터", "전사", "기사", "오크", "엘프", "크리처", "괴물", "드래곤", "와이번", "공룡"],
  },
  {
    code: "R2",
    title: "갑옷 · 의상",
    rationale: "의상 실루엣과 재질, 장비 착용 구조를 중심으로 묶었습니다.",
    keywords: ["갑옷", "의상", "패션", "사제", "성직자", "사무라이", "마린"],
  },
  {
    code: "R3",
    title: "무기 · 장비",
    rationale: "무기 형태와 장비 디테일을 확인하기 좋은 이미지입니다.",
    keywords: ["무기", "검", "단검", "도끼", "총", "방패", "장비"],
  },
  {
    code: "R4",
    title: "환경 · 구조물",
    rationale: "배경 분위기와 공간, 구조물 설계 자료를 한 흐름으로 묶었습니다.",
    keywords: ["판타지", "숲", "성채", "요새", "환경", "건축", "빌딩", "주택", "산업", "구조"],
  },
] as const;

function buildReferenceGroups(assets: ReferenceAsset[]): ReferenceAIGroup[] {
  const assignments = new Map<string, number[]>(
    REFERENCE_GROUP_DEFINITIONS.map((definition) => [definition.code, []]),
  );

  assets.forEach((asset) => {
    const searchable = `${asset.title} ${asset.type ?? ""} ${asset.category ?? ""}`.toLowerCase();
    const scored = REFERENCE_GROUP_DEFINITIONS.map((definition) => ({
      definition,
      score: definition.keywords.reduce(
        (total, keyword) => total + (searchable.includes(keyword.toLowerCase()) ? 1 : 0),
        0,
      ),
    })).sort((first, second) => second.score - first.score);
    const best = scored[0];
    if (best?.score) assignments.get(best.definition.code)?.push(asset.id);
  });

  return REFERENCE_GROUP_DEFINITIONS.flatMap((definition) => {
    const assetIds = assignments.get(definition.code) ?? [];
    if (assetIds.length === 0) return [];
    return [{
      id: `reference-${definition.code.toLowerCase()}`,
      code: definition.code,
      title: definition.title,
      rationale: definition.rationale,
      assetIds,
    }];
  });
}

interface AIReferenceOrganizerProps {
  assets: ReferenceAsset[];
  onClose: () => void;
  onApply: (groups: ReferenceAIGroup[]) => void;
}

export default function AIReferenceOrganizer({
  assets,
  onClose,
  onApply,
}: AIReferenceOrganizerProps) {
  const groups = useMemo(() => buildReferenceGroups(assets), [assets]);
  const assetById = useMemo(() => new Map(assets.map((asset) => [asset.id, asset])), [assets]);
  const [phase, setPhase] = useState<"analyzing" | "review">("analyzing");
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(groups.map((group) => group.id)),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("review"), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleGroup = (groupId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-[115] flex items-center justify-center bg-black/75 p-0 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AI 레퍼런스 정리"
    >
      <div className="flex h-full w-full max-w-[1120px] flex-col overflow-hidden border-[#2A2E36] bg-[#090A0C] shadow-[0_28px_90px_rgba(0,0,0,0.68)] sm:h-[min(820px,calc(100dvh-32px))] sm:rounded-xl sm:border">
        <header className="flex shrink-0 items-center justify-between border-b border-[#242832] bg-[#0D0F12] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-[#050505]">
              <Images className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[19px] font-semibold text-white">AI 레퍼런스 정리</h2>
              <p className="mt-0.5 truncate text-[12px] text-text-tertiary">
                이미지 제목과 태그 정보를 비교해 컬렉션을 제안합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="AI 레퍼런스 정리 닫기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {phase === "analyzing" ? (
          <div className="flex min-h-0 flex-1 items-center justify-center px-5">
            <div className="w-full max-w-[520px] text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary text-[#050505] shadow-[0_0_36px_rgba(224,161,46,0.20)]">
                <Wand2 className="h-8 w-8" />
              </span>
              <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.16em] text-brand-primary">
                Visual grouping
              </p>
              <h3 className="mt-3 text-[24px] font-semibold text-white">
                {assets.length}개 이미지를 비교하고 있습니다
              </h3>
              <p className="mt-3 text-[14px] leading-6 text-text-tertiary">
                제목, 카테고리와 이미지 맥락을 바탕으로 함께 볼 자료를 찾습니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mb-5">
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-brand-primary">
                  Group proposal
                </p>
                <h3 className="mt-2 text-[24px] font-semibold text-white">
                  {groups.length}개의 레퍼런스 그룹을 제안합니다
                </h3>
                <p className="mt-2 text-[14px] text-text-tertiary">
                  적용하지 않은 그룹의 이미지는 미분류 영역에 그대로 남습니다.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {groups.map((group) => {
                  const selected = selectedIds.has(group.id);
                  const previews = group.assetIds
                    .slice(0, 4)
                    .map((assetId) => assetById.get(assetId))
                    .filter((asset): asset is ReferenceAsset => Boolean(asset));
                  return (
                    <article
                      key={group.id}
                      className={`overflow-hidden rounded-xl border transition ${
                        selected
                          ? "border-brand-primary/45 bg-[#111318]"
                          : "border-[#252932] bg-[#0D0F12] opacity-55"
                      }`}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.id)}
                          aria-pressed={selected}
                          aria-label={`${group.title} ${selected ? "제외" : "포함"}`}
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border ${
                            selected
                              ? "border-brand-primary bg-brand-primary text-[#050505]"
                              : "border-[#3A3F49] text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="rounded bg-brand-primary/10 px-2 py-1 text-[10px] font-semibold text-brand-primary">
                              {group.code}
                            </span>
                            <span className="text-[11px] text-text-tertiary">
                              {group.assetIds.length} IMAGES
                            </span>
                          </div>
                          <h4 className="mt-3 text-[17px] font-semibold text-white">{group.title}</h4>
                          <p className="mt-1 text-[12px] leading-5 text-text-tertiary">
                            {group.rationale}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 border-t border-[#242832] p-3">
                        {previews.map((asset) => (
                          <img
                            key={asset.id}
                            src={asset.image}
                            alt=""
                            className="aspect-square w-full rounded-md object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <footer className="flex shrink-0 flex-col gap-3 border-t border-[#242832] bg-[#0D0F12] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="flex items-center gap-2 text-[12px] text-text-tertiary">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                선택한 그룹만 레퍼런스 화면에 적용됩니다.
              </p>
              <button
                type="button"
                onClick={() => onApply(groups.filter((group) => selectedIds.has(group.id)))}
                disabled={selectedIds.size === 0}
                className="np-primary-action flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 text-[14px] font-semibold text-[#050505] transition hover:bg-[#EDB33F] disabled:cursor-not-allowed disabled:opacity-40"
              >
                선택한 정리 적용
                <ArrowRight className="h-4 w-4" />
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
