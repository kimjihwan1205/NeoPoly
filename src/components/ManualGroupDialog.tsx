import { FolderPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ManualGroupDialogProps {
  targetLabel: string;
  selectedCount: number;
  hasGroupedItems: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function ManualGroupDialog({
  targetLabel,
  selectedCount,
  hasGroupedItems,
  onClose,
  onCreate,
}: ManualGroupDialogProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const submit = () => {
    const nextName = name.trim();
    if (!nextName) return;
    onCreate(nextName);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${targetLabel} 수동 그룹 만들기`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-xl border border-[#2A2E36] bg-[#0D0F12] shadow-[0_28px_90px_rgba(0,0,0,0.68)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#242832] px-5 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-[#050505]">
              <FolderPlus className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[20px] font-semibold text-white">새 그룹 만들기</h2>
              <p className="mt-1 text-[13px] text-text-tertiary">
                선택한 {targetLabel} {selectedCount}개를 하나로 묶습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="그룹 만들기 닫기"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-5">
          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-neutral-300">그룹명</span>
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder="예: 프로젝트 A · 캐릭터 디자인"
              className="h-12 w-full rounded-lg border border-[#2A2E36] bg-[#111317] px-4 text-[14px] text-white outline-none transition placeholder:text-[#666B74] focus:border-brand-primary/60"
            />
          </label>
          {hasGroupedItems && (
            <p className="mt-3 rounded-lg border border-brand-primary/20 bg-brand-primary/[0.05] px-3 py-2.5 text-[12px] leading-5 text-text-tertiary">
              기존 그룹에 있던 항목은 해당 그룹에서 빠지고 새 그룹으로 이동합니다.
            </p>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-[#242832] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-[#2A2E36] px-4 text-[13px] font-medium text-text-secondary transition hover:bg-white/5 hover:text-white"
          >
            취소
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!name.trim()}
            className="np-primary-action h-10 rounded-lg bg-brand-primary px-5 text-[13px] font-semibold text-[#050505] transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            그룹 만들기
          </button>
        </footer>
      </div>
    </div>
  );
}
