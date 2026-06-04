import React, { useState } from "react";
import {
  Check,
  X,
  Sparkles,
  Folder,
  FileText,
  Image as ImageIcon,
  MousePointer2,
} from "lucide-react";

type NewProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (
    name: string,
    template?: string | null,
    description?: string,
    links?: { noteIds: number[]; referenceIds: number[] },
  ) => void;
};

const templates = [
  {
    id: "blank",
    icon: <FileText className="h-5 w-5" />,
    title: "빈 프로젝트",
    desc: "처음부터 자유롭게 구성",
  },
  {
    id: "character",
    icon: <Sparkles className="h-5 w-5" />,
    title: "캐릭터 모델링",
    desc: "컨셉, 턴어라운드, 3D 제작",
  },
  {
    id: "prop",
    icon: <Folder className="h-5 w-5" />,
    title: "프롭 모델링",
    desc: "무기, 장비, 배경 오브젝트",
  },
];

const NOTE_OPTIONS = [
  {
    id: 1,
    title: "하프 궁수",
    image: "/images/work_%201.png",
  },
  {
    id: 4,
    title: "오크 전사 장비 컨셉",
    image: "/images/orc/orc_2D_front.png",
  },
  {
    id: 5,
    title: "유적 배경 구조",
    image: "/images/work_%2013.png",
  },
];

const REFERENCE_OPTIONS = [
  {
    id: 1,
    title: "오크 렌더 참고",
    image: "/images/orc/orc_render_reference.png",
  },
  {
    id: 2,
    title: "오크 정면",
    image: "/images/orc/orc_2D_front.png",
  },
  {
    id: 3,
    title: "장비 모듈",
    image: "/images/orc/orc_default_item01.png",
  },
  {
    id: 4,
    title: "무기 / 프롭",
    image: "/images/work_%2016.png",
  },
];

export default function NewProjectModal({
  isOpen,
  onClose,
  onCreate,
}: NewProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    "character",
  );
  const [selectionMode, setSelectionMode] = useState<"notes" | "references" | null>(
    null,
  );
  const [selectedNoteIds, setSelectedNoteIds] = useState<number[]>([]);
  const [selectedReferenceIds, setSelectedReferenceIds] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleCreate = () => {
    const name = projectName.trim();
    if (!name) return;
    onCreate?.(name, selectedTemplate, projectDesc.trim(), {
      noteIds: selectedNoteIds,
      referenceIds: selectedReferenceIds,
    });
    setProjectName("");
    setProjectDesc("");
    setSelectedTemplate("character");
    setSelectedNoteIds([]);
    setSelectedReferenceIds([]);
    setSelectionMode(null);
    onClose();
  };

  const toggleId = (
    id: number,
    values: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
        onClick={onClose}
        aria-label="닫기"
      />

      <div className="relative flex w-full max-w-[640px] flex-col overflow-hidden rounded-lg border border-[#2A2E36] bg-[#0A0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <div className="absolute right-0 top-0 h-[280px] w-[280px] translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0A12E]/5 blur-[90px]" />

        <div className="relative z-10 flex items-center justify-between border-b border-[#1F2329] px-8 py-6">
          <div>
            <h2 className="mb-2 text-[22px] font-bold text-white">
              새 프로젝트 만들기
            </h2>
            <p className="text-[14px] text-neutral-400">
              작업 목적에 맞는 템플릿으로 바로 시작하세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A2E36] bg-[#141518] text-neutral-400 transition hover:border-[#E0A12E]/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col gap-7 p-8">
          <label className="flex flex-col gap-2.5">
            <span className="ml-1 text-[14px] font-bold text-white">
              프로젝트 이름
            </span>
            <input
              type="text"
              placeholder="예: 오크 전사 리깅 테스트"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
              className="h-[52px] rounded-lg border border-[#2A2E36] bg-[#141518] px-5 text-[15px] text-white outline-none transition placeholder:text-neutral-500 focus:border-[#E0A12E]/60"
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="ml-1 text-[14px] font-bold text-white">
              설명 <span className="font-normal text-neutral-500">선택</span>
            </span>
            <textarea
              placeholder="작업 방향이나 참고할 내용을 적어두세요."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="h-24 resize-none rounded-lg border border-[#2A2E36] bg-[#141518] px-5 py-4 text-[15px] text-white outline-none transition placeholder:text-neutral-500 focus:border-[#E0A12E]/60"
            />
          </label>

          <div className="flex flex-col gap-3">
            <span className="ml-1 text-[14px] font-bold text-white">
              템플릿
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {templates.map((template) => {
                const active = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`flex flex-col items-start rounded-lg border p-4 text-left transition ${
                      active
                        ? "border-[#E0A12E] bg-[#E0A12E]/10"
                        : "border-[#2A2E36] bg-[#141518] hover:border-[#3A404F]"
                    }`}
                  >
                    <span
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                        active
                          ? "bg-[#E0A12E] text-[#050505]"
                          : "bg-[#1C1F26] text-neutral-400"
                      }`}
                    >
                      {template.icon}
                    </span>
                    <span
                      className={`mb-1 text-[14px] font-bold ${
                        active ? "text-[#E0A12E]" : "text-white"
                      }`}
                    >
                      {template.title}
                    </span>
                    <span className="text-[12px] leading-relaxed text-neutral-400">
                      {template.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="ml-1 text-[14px] font-bold text-white">
                연결 자료
              </span>
              <span className="text-[12px] text-neutral-500">
                대표 이미지는 비워두고 자료만 연결됩니다.
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setSelectionMode(selectionMode === "notes" ? null : "notes")
                }
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                  selectionMode === "notes" || selectedNoteIds.length > 0
                    ? "border-[#60A5FA]/60 bg-[#60A5FA]/10 text-[#60A5FA]"
                    : "border-[#2A2E36] bg-[#141518] text-neutral-300 hover:border-[#60A5FA]/50"
                }`}
              >
                <span className="flex items-center gap-2 text-[13px] font-bold">
                  <FileText className="h-4 w-4" />
                  노트 선택
                </span>
                <span className="text-[12px]">{selectedNoteIds.length}</span>
              </button>
              <button
                onClick={() =>
                  setSelectionMode(
                    selectionMode === "references" ? null : "references",
                  )
                }
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                  selectionMode === "references" || selectedReferenceIds.length > 0
                    ? "border-[#4ADE80]/60 bg-[#4ADE80]/10 text-[#4ADE80]"
                    : "border-[#2A2E36] bg-[#141518] text-neutral-300 hover:border-[#4ADE80]/50"
                }`}
              >
                <span className="flex items-center gap-2 text-[13px] font-bold">
                  <ImageIcon className="h-4 w-4" />
                  레퍼런스 선택
                </span>
                <span className="text-[12px]">{selectedReferenceIds.length}</span>
              </button>
            </div>

            {selectionMode && (
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#1F2329] bg-[#050505] p-3 sm:grid-cols-4">
                {(selectionMode === "notes" ? NOTE_OPTIONS : REFERENCE_OPTIONS).map(
                  (item) => {
                    const values =
                      selectionMode === "notes"
                        ? selectedNoteIds
                        : selectedReferenceIds;
                    const active = values.includes(item.id);
                    return (
                      <button
                        key={`${selectionMode}-${item.id}`}
                        onClick={() =>
                          selectionMode === "notes"
                            ? toggleId(item.id, selectedNoteIds, setSelectedNoteIds)
                            : toggleId(
                                item.id,
                                selectedReferenceIds,
                                setSelectedReferenceIds,
                              )
                        }
                        className={`relative overflow-hidden rounded-lg border text-left transition ${
                          active
                            ? "border-[#E0A12E]"
                            : "border-[#2A2E36] hover:border-[#555A64]"
                        }`}
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-full object-cover"
                        />
                        <span className="block truncate bg-[#111317] px-2 py-2 text-[12px] font-semibold text-neutral-200">
                          {item.title}
                        </span>
                        {active && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E0A12E] text-black">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 flex justify-end gap-3 border-t border-[#1F2329] bg-[#101114] p-6">
          <button
            onClick={onClose}
            className="rounded-lg px-6 py-3 text-[14px] font-bold text-neutral-400 transition hover:text-white"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={!projectName.trim()}
            className={`flex items-center gap-2 rounded-lg px-8 py-3 text-[14px] font-bold transition ${
              projectName.trim()
                ? "bg-[#E0A12E] text-[#050505] hover:bg-[#F0B43A]"
                : "cursor-not-allowed bg-[#1A1C21] text-neutral-500"
            }`}
          >
            <MousePointer2 className="h-4 w-4" />
            프로젝트 생성
          </button>
        </div>
      </div>
    </div>
  );
}
