import React from "react";
import {
  Clock,
  Folder,
  Plus,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

interface NoteSidebarProps {
  onNavigate: (page: string) => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  totalCount?: number;
  starredCount?: number;
  trashCount?: number;
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
}: NoteSidebarProps) {
  const applyFilter = (filter: string) => {
    onFilterChange?.(filter);
    onNavigate("notes");
  };

  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col overflow-y-auto border-r border-[#161618] bg-[#08090B] p-5 lg:flex">
      <div className="mb-8">
        <h2
          className="mb-2 cursor-pointer text-[26px] font-bold text-white transition hover:text-brand-primary"
          onClick={() => applyFilter("all")}
        >
          Notes
        </h2>
        <p className="w-[90%] text-[14px] leading-relaxed text-text-secondary">
          아이디어와 작업 메모를 한 곳에서 정리하세요.
        </p>
      </div>

      <button
        onClick={() => onNavigate("note-editor")}
        className="mb-6 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#3A404F]/60 bg-[#15161A] py-3 text-[15px] font-bold text-[#E0A12E] transition hover:border-[#E0A12E]/50 hover:bg-[#22252B]"
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
          <span className="text-[14px] font-bold text-neutral-400">
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
          <span className="text-[14px] font-bold text-neutral-400">태그</span>
          <Tag className="h-3.5 w-3.5 text-neutral-500" />
        </div>
        <div className="flex flex-wrap gap-2 px-1">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => applyFilter(tag)}
              className={`rounded-full border px-2.5 py-1 text-[13px] font-semibold transition ${
                activeFilter === tag
                  ? "border-[#E0A12E]/40 bg-[#E0A12E]/10 text-[#E0A12E]"
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
      className={`flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-[16px] font-semibold transition ${
        active
          ? "bg-[#15161A] text-white"
          : "text-text-secondary hover:bg-[#111215] hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-[18px] w-[18px] items-center justify-center ${
            active ? "text-[#E0A12E]" : "text-neutral-400"
          }`}
        >
          {icon}
        </span>
        {label}
      </span>
      <span className={active ? "text-[13px] text-text-secondary" : "text-[13px] text-neutral-500"}>
        {count}
      </span>
    </button>
  );
}
