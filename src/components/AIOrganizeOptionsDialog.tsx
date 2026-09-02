import { Check, Layers3, Sparkles, X } from "lucide-react";

export type AIOrganizationScope = "ungrouped" | "all";
export type AIOrganizerTarget = "notes" | "references";

interface AIOrganizeOptionsDialogProps {
  target: AIOrganizerTarget;
  totalCount: number;
  groupedCount: number;
  onClose: () => void;
  onStart: (scope: AIOrganizationScope) => void;
}

export default function AIOrganizeOptionsDialog({
  target,
  totalCount,
  groupedCount,
  onClose,
  onStart,
}: AIOrganizeOptionsDialogProps) {
  const label = target === "notes" ? "노트" : "레퍼런스";
  const ungroupedCount = Math.max(0, totalCount - groupedCount);

  return (
    <div
      className="fixed inset-0 z-[115] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`AI ${label} 정리 옵션`}
    >
      <div className="w-full max-w-[620px] overflow-hidden rounded-xl border border-[#2A2E36] bg-[#0D0F12] shadow-[0_28px_90px_rgba(0,0,0,0.68)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#242832] px-5 py-5 sm:px-6">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-[#050505]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[20px] font-semibold text-white">AI {label} 정리</h2>
              <p className="mt-1 text-[13px] leading-5 text-text-tertiary">
                분석할 범위를 선택한 뒤 제안 내용을 확인하고 적용할 수 있습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`AI ${label} 정리 옵션 닫기`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-5 sm:p-6">
          <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg border border-[#252932] bg-[#101216] p-3 text-center">
            <div>
              <p className="text-[11px] text-text-tertiary">전체</p>
              <p className="mt-1 text-[18px] font-semibold text-white">{totalCount}</p>
            </div>
            <div className="border-x border-[#292D35]">
              <p className="text-[11px] text-text-tertiary">그룹됨</p>
              <p className="mt-1 text-[18px] font-semibold text-brand-primary">{groupedCount}</p>
            </div>
            <div>
              <p className="text-[11px] text-text-tertiary">미분류</p>
              <p className="mt-1 text-[18px] font-semibold text-white">{ungroupedCount}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onStart("ungrouped")}
              disabled={ungroupedCount === 0}
              className="group flex w-full items-start gap-4 rounded-xl border border-brand-primary/45 bg-brand-primary/[0.06] p-4 text-left transition hover:bg-brand-primary/[0.10] disabled:cursor-not-allowed disabled:border-[#2A2E36] disabled:bg-[#101216] disabled:opacity-45"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[#050505]">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-semibold text-white">기존 그룹 제외</span>
                  <span className="rounded-full bg-brand-primary/15 px-2 py-0.5 text-[10px] font-semibold text-brand-primary">
                    추천
                  </span>
                </span>
                <span className="mt-1 block text-[13px] leading-5 text-text-tertiary">
                  이미 정리된 {label}는 유지하고 미분류 {ungroupedCount}개만 새로 분석합니다.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => onStart("all")}
              className="group flex w-full items-start gap-4 rounded-xl border border-[#2A2E36] bg-[#101216] p-4 text-left transition hover:border-brand-primary/35 hover:bg-[#14171C]"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#3A3F49] text-text-secondary group-hover:border-brand-primary/50 group-hover:text-brand-primary">
                <Layers3 className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-[15px] font-semibold text-white">기존 그룹 포함</span>
                <span className="mt-1 block text-[13px] leading-5 text-text-tertiary">
                  현재 그룹을 포함한 전체 {totalCount}개를 다시 분석해 새로운 구조를 제안합니다.
                </span>
              </span>
            </button>
          </div>

          <p className="mt-5 text-[12px] leading-5 text-text-tertiary">
            분석 결과는 바로 반영되지 않으며, 다음 화면에서 그룹별로 적용 여부를 선택할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
