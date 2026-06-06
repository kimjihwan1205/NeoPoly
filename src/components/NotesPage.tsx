import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  CheckSquare,
  ChevronRight,
  Folder,
  LayoutGrid,
  Link as LinkIcon,
  List,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  SlidersHorizontal,
  Square,
  Star,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import NoteSidebar from "./NoteSidebar";

interface NotesPageProps {
  onNavigate: (page: string) => void;
  isPopup?: boolean;
  hideSidebar?: boolean;
  hideDetailPanel?: boolean;
  boardFilter?: string;
  onSelectNote?: (noteId: number) => void;
  onAcceptSelection?: (noteIds: number[]) => void;
}

export type NoteItem = {
  id: number;
  title: string;
  desc: string;
  tags: string[];
  images: string[];
  date: string;
  starred: boolean;
  authorImage: string;
};

const STORAGE_KEY = "neopoly_notes_v2";
const CHECKLIST_KEY = "neopoly_note_checklist_v2";

export const NOTES: NoteItem[] = [
  {
    id: 1,
    title: "하프 궁수",
    desc: "숲 배경의 하프 궁수 캐릭터. 얇은 금속 장식과 가죽 장비를 중심으로 정리.",
    tags: ["#하프", "#궁수", "#캐릭터"],
    images: ["/images/work_%201.png", "/images/work_%202.png", "/images/work_%203.png"],
    date: "2024.05.20",
    starred: true,
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    id: 2,
    title: "기사 갑옷",
    desc: "중세 판타지 갑옷의 실루엣과 금속 재질 참고 이미지 모음.",
    tags: ["#갑옷", "#프롭", "#금속"],
    images: ["/images/work_%204.png", "/images/work_%205.png", "/images/work_%206.png"],
    date: "2024.05.19",
    starred: false,
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
  {
    id: 3,
    title: "마을 배경",
    desc: "판타지 마을의 레이아웃, 조명, 건물 구조를 정리한 배경 노트.",
    tags: ["#배경", "#마을", "#컨셉"],
    images: ["/images/work_%207.png", "/images/work_%208.png", "/images/work_%209.png"],
    date: "2024.05.18",
    starred: false,
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
  {
    id: 4,
    title: "오크 전사 장비 컨셉",
    desc: "오크 캐릭터의 정면, 45도, 측면, 후면 턴어라운드와 장비 모듈 레퍼런스.",
    tags: ["#오크", "#전사", "#장비", "#턴어라운드"],
    images: [
      "/images/orc/orc_2D_front.png",
      "/images/orc/orc_2D_45.png",
      "/images/orc/orc_default_item01.png",
    ],
    date: "2024.05.17",
    starred: true,
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
  },
  {
    id: 5,
    title: "유적 배경 구조",
    desc: "고대 유적의 기둥, 계단, 내부 공간을 제작하기 위한 레퍼런스.",
    tags: ["#배경", "#유적", "#구조"],
    images: ["/images/work_%2013.png", "/images/work_%2014.png", "/images/work_%2015.png"],
    date: "2024.05.17",
    starred: false,
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  },
  {
    id: 6,
    title: "사이버 무기",
    desc: "날카로운 실루엣과 금속, 발광 파츠를 가진 무기 디자인 정리.",
    tags: ["#무기", "#사이버", "#프롭"],
    images: ["/images/work_%2016.png", "/images/work_%2017.png", "/images/work_%2018.png"],
    date: "2024.05.16",
    starred: false,
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
  },
  {
    id: 7,
    title: "미래형 로봇 빌런",
    desc: "기계 관절, 큰 실루엣, 차가운 색감의 적 캐릭터 레퍼런스.",
    tags: ["#로봇", "#빌런", "#캐릭터"],
    images: ["/images/work_%2019.png", "/images/work_%2020.png", "/images/work_%2021.png"],
    date: "2024.05.15",
    starred: false,
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
  },
  {
    id: 8,
    title: "드래곤 캐릭터",
    desc: "비늘, 날개, 뿔 구조와 재질 표현을 위한 이미지 묶음.",
    tags: ["#드래곤", "#생물", "#레퍼런스"],
    images: ["/images/work_%2022.png", "/images/work_%2023.png", "/images/work_%2024.png"],
    date: "2024.05.14",
    starred: false,
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
  },
];

const DEFAULT_CHECKLIST = [
  "레퍼런스 이미지 수집",
  "전체 실루엣 정리",
  "색상 팔레트 결정",
  "3면도 스케치",
  "장비 파츠 분리",
  "최종 컨셉 확정",
];

const EXTRA_REFERENCES = [
  "/images/work_48.png",
  "/images/work_49.png",
  "/images/work_50.png",
  "/images/orc/orc_default_item02.png",
  "/images/orc/orc_default_item03.png",
];

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return NOTES;
    const parsed = JSON.parse(saved) as NoteItem[];
    return Array.isArray(parsed) && parsed.length ? parsed : NOTES;
  } catch {
    return NOTES;
  }
}

function loadChecklist() {
  try {
    const saved = localStorage.getItem(CHECKLIST_KEY);
    return saved ? (JSON.parse(saved) as Record<string, boolean[]>) : {};
  } catch {
    return {};
  }
}

export default function NotesPage({
  onNavigate,
  isPopup,
  hideSidebar = false,
  hideDetailPanel = false,
  boardFilter,
  onSelectNote,
  onAcceptSelection,
}: NotesPageProps) {
  const [notes, setNotes] = useState<NoteItem[]>(loadNotes);
  const [activeNote, setActiveNote] = useState<number | null>(() => hideDetailPanel ? null : notes[0]?.id ?? null);
  const [selectedNotes, setSelectedNotes] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [sortMode, setSortMode] = useState<"recent" | "starred">("recent");
  const [trashIds, setTrashIds] = useState<Set<number>>(new Set());
  const [checklists, setChecklists] = useState<Record<string, boolean[]>>(
    loadChecklist,
  );
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (boardFilter) setFilter(boardFilter);
  }, [boardFilter]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeNoteData = notes.find((note) => note.id === activeNote) || null;

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = notes.filter((note) => {
      const inTrash = trashIds.has(note.id);
      if (filter === "trash") return inTrash;
      if (inTrash) return false;
      if (filter === "starred" && !note.starred) return false;
      if (filter.startsWith("#") && !note.tags.includes(filter)) return false;
      if (query) {
        const haystack = `${note.title} ${note.desc} ${note.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (sortMode === "starred") {
      result = [...result].sort((a, b) => Number(b.starred) - Number(a.starred));
    } else {
      result = [...result].sort((a, b) => b.date.localeCompare(a.date));
    }
    return result;
  }, [filter, notes, searchQuery, sortMode, trashIds]);

  const handleNoteClick = (e: React.MouseEvent, id: number) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setSelectedNotes((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else if (isPopup) {
      setSelectedNotes(new Set([id]));
    } else {
      setSelectedNotes(new Set());
    }
    setActiveNote(id);
  };

  const toggleStar = (id: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, starred: !note.starred } : note,
      ),
    );
  };

  const toggleChecklistItem = (index: number) => {
    if (!activeNoteData) return;
    const key = String(activeNoteData.id);
    const current = checklists[key] || [true, true, true, false, false, false];
    const next = [...current];
    next[index] = !next[index];
    setChecklists((prev) => ({ ...prev, [key]: next }));
  };

  const addTag = () => {
    if (!activeNoteData) return;
    const value = window.prompt("추가할 태그를 입력하세요.");
    if (!value?.trim()) return;
    const tag = value.trim().startsWith("#") ? value.trim() : `#${value.trim()}`;
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNoteData.id && !note.tags.includes(tag)
          ? { ...note, tags: [...note.tags, tag] }
          : note,
      ),
    );
    setToast("태그를 추가했습니다.");
  };

  const addReference = () => {
    if (!activeNoteData) return;
    const candidate =
      EXTRA_REFERENCES.find((image) => !activeNoteData.images.includes(image)) ||
      EXTRA_REFERENCES[0];
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNoteData.id
          ? { ...note, images: [...note.images, candidate].slice(-4) }
          : note,
      ),
    );
    setToast("레퍼런스를 추가했습니다.");
  };

  const moveSelectedToTrash = () => {
    if (selectedNotes.size === 0) return;
    setTrashIds((prev) => new Set([...prev, ...selectedNotes]));
    if (activeNote && selectedNotes.has(activeNote)) {
      setActiveNote(filteredNotes.find((note) => !selectedNotes.has(note.id))?.id ?? null);
    }
    setSelectedNotes(new Set());
    setToast("선택한 노트를 휴지통으로 보냈습니다.");
  };

  const selectedCount = selectedNotes.size;

  return (
    <div
      className={`flex overflow-hidden bg-bg-dark font-sans text-text-primary ${
        isPopup ? "h-full" : "h-[calc(100vh-76px)]"
      }`}
    >
      {!hideSidebar && (
        <NoteSidebar
          onNavigate={onNavigate}
          activeFilter={filter}
          onFilterChange={setFilter}
          totalCount={notes.filter((note) => !trashIds.has(note.id)).length}
          starredCount={notes.filter((note) => note.starred && !trashIds.has(note.id)).length}
          trashCount={trashIds.size}
        />
      )}

      <main className="relative flex-1 overflow-y-auto bg-bg-dark px-6 py-6">
        <div className="mx-auto flex h-full w-full max-w-[2400px] flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="노트 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-lg border border-[#1C1E24] bg-[#121417] pl-11 pr-4 text-[15px] text-white shadow-inner outline-none transition placeholder:text-[#6E737B] focus:border-brand-primary/50"
              />
            </div>
            <button
              onClick={() => setSortMode((mode) => (mode === "recent" ? "starred" : "recent"))}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#1C1E24] bg-[#121417] text-neutral-400 transition hover:bg-[#1A1C20] hover:text-white"
              title="정렬 전환"
            >
              <SlidersHorizontal className="h-[18px] w-[18px]" />
            </button>
            <div className="flex h-12 items-center rounded-lg border border-[#1C1E24] bg-[#121417] px-2">
              <div className="mr-1 flex items-center gap-2 border-r border-[#2A2E36] px-3 text-[14px] text-text-secondary">
                정렬: {sortMode === "recent" ? "최근 수정" : "즐겨찾기"}
                <ChevronRight className="h-3.5 w-3.5 rotate-90" />
              </div>
              <span className="mr-1 px-3 text-[13px] text-text-tertiary">
                보기
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-1.5 ${
                    viewMode === "grid" ? "bg-[#252830] text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-1.5 ${
                    viewMode === "list" ? "bg-[#252830] text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1 text-[13px] text-neutral-400">
            <CheckSquare className="h-4 w-4 text-neutral-400" />
            Ctrl 또는 Cmd를 누른 채 클릭하면 여러 노트를 선택할 수 있습니다.
          </div>

          <div
            className={
              viewMode === "grid"
                ? `grid gap-5 transition ${
                    activeNote
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  }`
                : "flex flex-col gap-3"
            }
          >
            {filteredNotes.map((note) => {
              const isSelected = selectedNotes.has(note.id);
              return (
                <button
                  key={note.id}
                  onClick={(e) => handleNoteClick(e, note.id)}
                  className={`group relative flex cursor-pointer flex-col rounded-lg border p-5 text-left shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition ${
                    viewMode === "list" ? "min-h-[150px]" : ""
                  } ${
                    isSelected
                      ? "border-brand-primary bg-surface-primary shadow-[0_0_20px_rgba(224,161,46,0.15)]"
                      : "border-border-primary/20 bg-surface-primary/80 hover:border-brand-primary/40 hover:bg-surface-primary"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3
                        className={`truncate text-[20px] font-bold ${
                          isSelected ? "text-brand-primary" : "text-white"
                        }`}
                      >
                        {note.title}
                      </h3>
                      {isSelected && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-bg-dark">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(note.id);
                      }}
                      className={`transition ${
                        note.starred ? "text-brand-primary" : "text-neutral-400 group-hover:text-white"
                      }`}
                    >
                      <Star className={`h-[18px] w-[18px] ${note.starred ? "fill-brand-primary" : ""}`} />
                    </span>
                  </div>

                  <p className="mb-4 h-10 text-[14px] leading-relaxed text-neutral-400 line-clamp-2">
                    {note.desc}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-[#252830] bg-[#1A1C20] px-2 py-0.5 text-[12px] font-medium text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`mb-5 flex gap-1.5 ${
                      viewMode === "list" ? "h-[78px] max-w-[360px]" : "h-[90px]"
                    }`}
                  >
                    {note.images.slice(0, 3).map((img) => (
                      <div
                        key={img}
                        className="flex-1 overflow-hidden rounded-md border border-[#1A1C20] bg-[#0A0B0E]"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={img}
                          alt={note.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-[#1C1E24] pt-4">
                    <span className="font-sans text-[13px] text-neutral-400">
                      {note.date}
                    </span>
                    <span className="text-neutral-400 transition hover:text-white">
                      {activeNote === note.id ? (
                        <PenLine className="h-[18px] w-[18px]" />
                      ) : (
                        <MoreHorizontal className="h-[18px] w-[18px]" />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredNotes.length === 0 && (
            <div className="flex h-[280px] items-center justify-center rounded-lg border border-[#1F2329] bg-[#0A0B0D] text-[14px] text-neutral-400">
              조건에 맞는 노트가 없습니다.
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {!hideDetailPanel && activeNoteData && (
          <motion.aside
            initial={{ width: 0, opacity: 0, x: 20 }}
            animate={{ width: 400, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 hidden h-full shrink-0 flex-col overflow-y-auto border-l border-[#161618] bg-[#0A0B0D] xl:flex"
          >
            <div className="sticky top-0 z-20 flex items-start justify-between border-b border-[#161618] bg-[#0A0B0D]/85 p-5 backdrop-blur-xl">
              <div>
                <h2 className="flex items-center gap-3 text-[26px] font-bold text-white">
                  {activeNoteData.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeNoteData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-[#22252A] bg-[#15161A] px-2.5 py-1 text-[13px] font-medium text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <button
                    onClick={addTag}
                    className="flex h-7 w-7 items-center justify-center rounded border border-[#22252A] bg-[#15161A] text-neutral-400 hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStar(activeNoteData.id)}
                  className={activeNoteData.starred ? "text-brand-primary" : "text-neutral-400"}
                >
                  <Star className={`h-[22px] w-[22px] ${activeNoteData.starred ? "fill-brand-primary" : ""}`} />
                </button>
                <button
                  onClick={() => setActiveNote(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-8 p-6 pb-32">
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="text-[18px] font-bold text-white">메모</h3>
                  <PenLine className="h-3.5 w-3.5 text-neutral-400" />
                </div>
                <p className="text-[15px] leading-relaxed text-neutral-300">
                  {activeNoteData.desc}
                </p>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[18px] font-bold text-white">
                    참고 레퍼런스
                  </h3>
                  <button
                    onClick={() => onNavigate("references")}
                    className="text-[13px] font-medium text-neutral-400 hover:text-white"
                  >
                    모두 보기
                  </button>
                </div>
                <div className="flex h-[140px] gap-2">
                  {activeNoteData.images.slice(0, 4).map((img) => (
                    <button
                      key={img}
                      onClick={() => onNavigate("references")}
                      className="group relative flex-1 overflow-hidden rounded-lg border border-[#22252A] bg-black"
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src={img}
                        alt="reference"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                  <button
                    onClick={addReference}
                    className="flex w-[45px] shrink-0 items-center justify-center rounded-lg border border-dashed border-[#2A2E36] transition hover:border-[#4A4E58] hover:bg-[#15161A]"
                  >
                    <Plus className="h-4 w-4 text-neutral-400" />
                  </button>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[18px] font-bold text-white">
                    연결 프로젝트
                  </h3>
                  <button
                    onClick={() => onNavigate("projects")}
                    className="text-[13px] font-medium text-neutral-400 hover:text-white"
                  >
                    모두 보기
                  </button>
                </div>
                <button
                  onClick={() => onNavigate("projects")}
                  className="flex w-full gap-4 rounded-lg border border-[#1C1E24] bg-[#111215] p-3 text-left transition hover:border-brand-primary/50"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={activeNoteData.images[1] || activeNoteData.images[0]}
                    alt="project"
                    className="h-[60px] w-[60px] rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="mb-1.5 text-[16px] font-bold text-white">
                      {activeNoteData.title} 프로젝트
                    </h4>
                    <span className="flex w-fit items-center gap-1.5 rounded border border-[#E0A12E]/30 bg-[#E0A12E]/10 px-2 py-0.5 text-[11px] font-bold uppercase text-[#E0A12E]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E0A12E]" />
                      In Progress
                    </span>
                  </div>
                </button>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between border-b border-[#1C1E24] pb-4">
                  <h3 className="text-[18px] font-bold text-white">
                    체크리스트
                  </h3>
                  <span className="text-[14px] text-neutral-400">
                    {(checklists[String(activeNoteData.id)] || [true, true, true, false, false, false]).filter(Boolean).length} / 6
                  </span>
                </div>
                <div className="space-y-3">
                  {DEFAULT_CHECKLIST.map((text, index) => {
                    const checked =
                      (checklists[String(activeNoteData.id)] || [true, true, true, false, false, false])[index] ?? false;
                    return (
                      <button
                        key={text}
                        onClick={() => toggleChecklistItem(index)}
                        className="group flex w-full items-center gap-3 text-left"
                      >
                        {checked ? (
                          <CheckSquare className="h-5 w-5 rounded text-brand-primary" />
                        ) : (
                          <Square className="h-5 w-5 rounded text-neutral-400 transition group-hover:text-white" />
                        )}
                        <span
                          className={`text-[15px] ${
                            checked ? "text-neutral-500 line-through" : "text-neutral-300"
                          }`}
                        >
                          {text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-[#2A2E36] bg-[#1A1C20] p-2 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-2 border-r border-[#2A2E36] pr-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[11px] font-bold text-bg-dark">
                {selectedCount}
              </div>
              <span className="text-[13px] font-bold text-white">선택됨</span>
            </div>

            <div className="flex items-center gap-2">
              {isPopup ? (
                <button
                  onClick={() => {
                    if (onAcceptSelection) onAcceptSelection(Array.from(selectedNotes));
                    else if (onSelectNote) onSelectNote(Array.from(selectedNotes)[0]);
                  }}
                  className="flex items-center gap-2 rounded-md bg-[#E0A12E] px-6 py-1.5 text-[13px] font-bold text-bg-dark transition hover:bg-[#E0A12E]/90"
                >
                  노트 가져오기
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setToast("선택한 노트를 보드로 이동했습니다.")}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium text-text-secondary transition hover:bg-surface-primary hover:text-white"
                  >
                    <Folder className="h-4 w-4" />
                    보드 이동
                  </button>
                  <button
                    onClick={() => {
                      setToast("선택한 노트를 프로젝트와 연결했습니다.");
                      onNavigate("projects");
                    }}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium text-text-secondary transition hover:bg-surface-primary hover:text-white"
                  >
                    <LinkIcon className="h-4 w-4" />
                    프로젝트 연결
                  </button>
                  <button
                    onClick={() => onNavigate("studio")}
                    className="flex items-center gap-2 rounded-md border border-[#E0A12E]/30 bg-[#E0A12E]/10 px-4 py-1.5 text-[13px] font-bold text-brand-primary transition hover:bg-[#E0A12E]/20"
                  >
                    <Wand2 className="h-4 w-4" />
                    AI Studio 보내기
                  </button>
                </>
              )}
            </div>

            <div className="border-l border-[#2A2E36] pl-2">
              <button
                onClick={moveSelectedToTrash}
                className="rounded-full p-1.5 text-text-tertiary transition hover:bg-surface-primary hover:text-white"
                title="휴지통으로 이동"
              >
                <Trash2 className="h-[18px] w-[18px]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && (
        <div className="fixed bottom-8 right-8 z-[80] rounded-lg border border-[#2A2E36] bg-[#111317] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {toast}
        </div>
      )}
    </div>
  );
}
