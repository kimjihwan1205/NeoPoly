import React from "react";
import {
  Clock,
  Folder,
  Image as ImageIcon,
  Plus,
  Star,
  Tag,
  Trash2,
  FileText,
} from "lucide-react";

interface NoteSidebarProps {
  onNavigate: (page: string) => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  totalCount?: number;
  starredCount?: number;
  trashCount?: number;
  mode?: "list" | "editor";
  editorTitle?: string;
  isNewNote?: boolean;
}

const FOLDERS = [
  { id: "#캐릭터", name: "캐릭터 컨셉", count: 38 },
  { id: "#배경", name: "환경 / 배경", count: 16 },
  { id: "#프롭", name: "무기 / 프롭", count: 12 },
  { id: "#오크", name: "오크 제작", count: 4 },
];

const TAGS = [
  "#캐릭터",
  "#컨셉",
  "#프롭",
  "#오크",
  "#장비",
  "#배경",
  "#레퍼런스",
  "#턴어라운드",
];

export default function NoteSidebar({
  onNavigate,
  activeFilter = "all",
  onFilterChange,
  totalCount = 0,
  starredCount = 0,
  trashCount = 0,
  mode = "list",
  editorTitle,
  isNewNote = false,
}: NoteSidebarProps) {
  const applyFilter = (filter: string) => {
    onFilterChange?.(filter);
    onNavigate("notes");
  };

  if (mode === "editor") {
    return (
      <aside className="hidden h-full w-[300px] shrink-0 flex-col overflow-y-auto border-r border-[#1C1E24] bg-[#0B0D10] p-5 lg:flex">
        <div className="mb-6">
          <p className="text-[14px] font-medium uppercase tracking-[0.18em] text-brand-primary">Board</p>
          <h2 className="mt-2 text-[24px] font-medium text-white">노트 편집</h2>
          <p className="mt-2 text-[15px] leading-[1.6] text-text-tertiary">
            아이디어 메모와 저장 이미지를 정리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("board")}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#2A2E36] bg-[#121417] px-4 py-3 text-[15px] font-medium text-text-secondary transition hover:border-brand-primary/45 hover:text-white"
        >
          보드로 돌아가기
        </button>

        <div className="rounded-xl border border-brand-primary/35 bg-brand-primary/10 p-4">
          <p className="text-[14px] font-medium text-brand-primary">현재 노트</p>
          <h3 className="mt-2 line-clamp-3 text-[18px] font-medium leading-snug text-white">
            {editorTitle || "새 노트"}
          </h3>
          <p className="mt-2 text-[14px] leading-[1.5] text-text-tertiary">
            {isNewNote ? "새 아이디어를 작성 중입니다." : "선택한 노트를 편집 중입니다."}
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <EditorHint icon={<FileText className="h-4 w-4" />} label="메모" />
          <EditorHint icon={<Tag className="h-4 w-4" />} label="태그" />
          <EditorHint icon={<ImageIcon className="h-4 w-4" />} label="저장 이미지" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col overflow-y-auto border-r border-[#161618] bg-[#08090B] p-5 lg:flex">
      <div className="mb-8">
        <h2
          className="mb-2 cursor-pointer text-[24px] font-medium text-white transition hover:text-brand-primary"
          onClick={() => applyFilter("all")}
        >
          노트
        </h2>
        <p className="w-[90%] text-[14px] leading-relaxed text-text-secondary">
          아이디어와 메모를 한곳에 정리하세요.
        </p>
      </div>

      <button
        onClick={() => onNavigate("note-editor")}
        className="mb-6 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#3A404F]/60 bg-[#15161A] py-3 text-[15px] font-medium text-brand-primary transition hover:border-brand-primary/50 hover:bg-[#22252B]"
      >
        <Plus className="h-[18px] w-[18px]" />
        새 노트
      </button>

      <nav className="mb-8 space-y-1 px-1">
        <MenuBtn
          icon={<Folder className="h-[18px] w-[18px]" />}
          label="전체 노트"
          count={totalCount}
          active={activeFilter === "all"}
          onClick={() => applyFilter("all")}
        />
        <MenuBtn
          icon={<Star className="h-[18px] w-[18px]" />}
          label="즐겨찾기"
          count={starredCount}
          active={activeFilter === "starred"}
          onClick={() => applyFilter("starred")}
        />
        <MenuBtn
          icon={<Clock className="h-[18px] w-[18px]" />}
          label="최근 수정"
          count={totalCount}
          active={activeFilter === "recent"}
          onClick={() => applyFilter("all")}
        />
        <MenuBtn
          icon={<Trash2 className="h-[18px] w-[18px]" />}
          label="휴지통"
          count={trashCount}
          active={activeFilter === "trash"}
          onClick={() => applyFilter("trash")}
        />
      </nav>

      <div className="mb-8 px-1">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-[14px] font-medium text-neutral-400">
            노트 폴더
          </span>
          <button
            onClick={() => applyFilter("all")}
            className="text-neutral-400 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <nav className="space-y-1">
          {FOLDERS.map((folder) => (
            <MenuBtn
              key={folder.id}
              icon={<Folder className="h-[18px] w-[18px]" />}
              label={folder.name}
              count={folder.count}
              active={activeFilter === folder.id}
              onClick={() => applyFilter(folder.id)}
            />
          ))}
        </nav>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-[14px] font-medium text-neutral-400">태그</span>
          <Tag className="h-3.5 w-3.5 text-neutral-500" />
        </div>
        <div className="flex flex-wrap gap-2 px-1">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => applyFilter(tag)}
              className={`rounded-full border px-2.5 py-1 text-[14px] font-medium transition ${
                activeFilter === tag
                  ? "border-brand-primary/40 bg-brand-primary/10 text-brand-primary"
                  : "border-[#22252A] bg-[#15161A] text-text-secondary hover:border-[#3A404F] hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function EditorHint({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#1C1E24] bg-[#101216] px-3 py-3 text-[14px] font-medium text-text-secondary">
      <span className="text-brand-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function MenuBtn({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-[15px] font-medium transition ${
        active
          ? "bg-[#15161A] text-white"
          : "text-text-secondary hover:bg-[#111215] hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-[18px] w-[18px] items-center justify-center ${
            active ? "text-brand-primary" : "text-neutral-400"
          }`}
        >
          {icon}
        </span>
        {label}
      </span>
      <span className={active ? "text-[14px] text-text-secondary" : "text-[14px] text-neutral-500"}>
        {count}
      </span>
    </button>
  );
}
