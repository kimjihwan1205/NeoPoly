import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Folder,
  LayoutGrid,
  Link as LinkIcon,
  List,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
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
  onSelectionChange?: (noteIds: number[]) => void;
  onOpenNote?: (noteId: number) => void;
  hideSelectionActionBar?: boolean;
  onCreateNote?: () => void;
}

export type NoteItem = {
  id: number;
  title: string;
  desc: string;
  tags: string[];
  images: string[];
  date: string;
  status?: string;
  statusColor?: string;
  starred: boolean;
  authorImage: string;
};

const STORAGE_KEY = "neopoly_notes_v3";
const CHECKLIST_KEY = "neopoly_note_checklist_v3";

export const NOTES: NoteItem[] = [
  {
    "id": 1,
    "title": "\uc5d8\ud504 \uad81\uc218 \ucf58\uc149\ud2b8 \uc815\ub9ac",
    "desc": "\uc232 \ubc30\uacbd\uc758 \uc5d8\ud504 \uad81\uc218 \uc2e4\ub8e8\uc5e3, \ud65c \ud3ec\uc988, \uae08\uc18d \uc7a5\uc2dd\uacfc \uc758\uc0c1 \ub808\ud37c\ub7f0\uc2a4\ub97c \uc815\ub9ac\ud55c \ub178\ud2b8\uc785\ub2c8\ub2e4.",
    "tags": [
      "#\uc5d8\ud504",
      "#\uad81\uc218",
      "#\uc232",
      "#\uc758\uc0c1"
    ],
    "images": [
      "/images/elf_re/elf_re01.jpg",
      "/images/elf_re/elf_re02.jpeg",
      "/images/elf_re/elf_re03.jpeg",
      "/images/elf_re/elf_re04.jpg",
      "/images/elf_re/elf_re05.jpg"
    ],
    "date": "2026.06.14",
    "status": "Modeling",
    "statusColor": "#6FAF52",
    "starred": true,
    "authorImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=elf-note"
  },
  {
    "id": 2,
    "title": "\uc624\ud06c \uc804\uc0ac \uc7a5\ube44 \ub178\ud2b8",
    "desc": "\uc624\ud06c \uc804\uc0ac\uc758 \ubab8\ud615, \ubabd\ub465\uc774, \uc5b4\uae68 \uac11\uc637, \ubca8\ud2b8 \uc7a5\uc2dd\uacfc \ubcf4\ud638\ub300 \uad6c\uc870\ub97c \ubb36\uc5b4 \uc815\ub9ac\ud55c \uc791\uc5c5 \ub178\ud2b8\uc785\ub2c8\ub2e4.",
    "tags": [
      "#\uc624\ud06c",
      "#\uc804\uc0ac",
      "#\uc7a5\ube44",
      "#\ubaa8\ub4c8"
    ],
    "images": [
      "/images/orc_re/orc_re01.png",
      "/images/orc_re/orc_re02.jpg",
      "/images/orc_re/orc_re03.jpg",
      "/images/orc_re/orc_re04.jpg"
    ],
    "date": "2026.06.13",
    "status": "Modeling",
    "statusColor": "#6FAF52",
    "starred": true,
    "authorImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=orc-note"
  },
  {
    "id": 3,
    "title": "\uc640\uc774\ubc88 \ud06c\ub9ac\ucc98 \uad6c\uc870",
    "desc": "\uac70\ub300\ud55c \ub0a0\uac1c\uc640 \uae34 \uaf2c\ub9ac, \ube44\ud589 \ud3ec\uc988, \uac11\ud53c \uc7ac\uc9c8\uc744 \ud568\uaed8 \ubcfc \uc218 \uc788\ub294 \uc640\uc774\ubc88 \ucc38\uace0 \ub178\ud2b8\uc785\ub2c8\ub2e4.",
    "tags": [
      "#\uc640\uc774\ubc88",
      "#\ud06c\ub9ac\ucc98",
      "#\ub0a0\uac1c",
      "#PBR"
    ],
    "images": [
      "/images/wyvern_re/wyvern_re01.jpg",
      "/images/wyvern_re/wyvern_re02.jpg",
      "/images/wyvern_re/wyvern_re023.png"
    ],
    "date": "2026.06.12",
    "status": "Turnaround",
    "statusColor": "#A36BFF",
    "starred": false,
    "authorImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=wyvern-note"
  },
  {
    "id": 4,
    "title": "\uacf5\ub8e1 \ud0c8\uac83 \uc7a5\ube44 \uad6c\uc870",
    "desc": "\ud0d1\uc2b9 \uc7a5\ube44\uc640 \uc9d0, \uc548\uc7a5 \uc2e4\ub8e8\uc5e3, \uacf5\ub8e1\uc758 \uce21\uba74 \ube44\ub840\ub97c \ube44\uad50\ud558\uae30 \uc704\ud55c \ub178\ud2b8\uc785\ub2c8\ub2e4.",
    "tags": [
      "#\uacf5\ub8e1",
      "#\ud0c8\uac83",
      "#\uc548\uc7a5",
      "#\ud310\ud0c0\uc9c0"
    ],
    "images": [
      "/images/Dino_re/Dino_re01.jpg",
      "/images/Dino_re/Dino_re02.jpg",
      "/images/Dino_re/Dino_re03.jpg",
      "/images/Dino_re/Dino_re04.jpg"
    ],
    "date": "2026.06.11",
    "status": "Concept",
    "statusColor": "#2DD4BF",
    "starred": false,
    "authorImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=dino-note"
  },
  {
    "id": 5,
    "title": "\uc2a4\ud2b8\ub9bf \ud328\uc158 \uc758\uc0c1 \ub178\ud2b8",
    "desc": "\uc2a4\ud3ec\uce20\uc6e8\uc5b4, \ub18d\uad6c \ud3ec\uc988, \uc131\ub2a5\ud615 \uc758\uc0c1 \ube44\ub840\ub97c \uce90\ub9ad\ud130 \uc791\uc5c5\uc5d0 \uc4f0\uae30 \uc88b\uac8c \uc815\ub9ac\ud588\uc2b5\ub2c8\ub2e4.",
    "tags": [
      "#\uc2a4\ud2b8\ub9bf",
      "#\ud328\uc158",
      "#\uc2a4\ud3ec\uce20",
      "#\uce90\ub9ad\ud130"
    ],
    "images": [
      "/images/street_re/Street_re01.jpg",
      "/images/street_re/Street_re02.jpg",
      "/images/street_re/Street_re03.jpg"
    ],
    "date": "2026.06.10",
    "status": "Modeling",
    "statusColor": "#4C88D9",
    "starred": false,
    "authorImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=street-note"
  },
  {
    "id": 6,
    "title": "\ucf54\ubfd4\uc18c \uc804\uc0ac \uac11\uc637 \ucc38\uace0",
    "desc": "\ubb34\uac70\uc6b4 \uac11\uc637, \ub3c4\ub07c, \ub098\ubb34\uc640 \uae08\uc18d \ud30c\uce20\uac00 \uc5b4\ub5bb\uac8c \ubd99\ub294\uc9c0 \ube44\uad50\ud558\ub294 \ucf54\ubfd4\uc18c \uc804\uc0ac \ub178\ud2b8\uc785\ub2c8\ub2e4.",
    "tags": [
      "#\ucf54\ubfd4\uc18c",
      "#\uc804\uc0ac",
      "#\uac11\uc637",
      "#\ub3c4\ub07c"
    ],
    "images": [
      "/images/Rhino_re/Rhino_re01.jpg",
      "/images/Rhino_re/Rhino_re02.jpg",
      "/images/Rhino_re/Rhino_re03.jpg",
      "/images/Rhino_re/Rhino_re04.jpg"
    ],
    "date": "2026.06.09",
    "status": "Turnaround",
    "statusColor": "#A36BFF",
    "starred": false,
    "authorImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=rhino-note"
  },
  {
    "id": 7,
    "title": "\ud3ec\uc2a4\ucf54 \ud654\uc774\ud2b8 \uc0b0\uc5c5 \uc5d0\uc14b",
    "desc": "\uc120\ubc15, \uc124\ube44, \uac74\ucd95 \ubaa8\ub4c8\uc744 \ud654\uc774\ud2b8 \ud1a4 \uc0b0\uc5c5 \uc5d0\uc14b\uc73c\ub85c \ubb36\uc5b4 \ud45c\ud604\ud558\uae30 \uc704\ud55c \ub808\ud37c\ub7f0\uc2a4 \ub178\ud2b8\uc785\ub2c8\ub2e4.",
    "tags": [
      "#\ud3ec\uc2a4\ucf54",
      "#\ud654\uc774\ud2b8",
      "#\uc0b0\uc5c5",
      "#3D\uc5d0\uc14b"
    ],
    "images": [
      "/images/posco01_re/posco01_re01.png",
      "/images/posco01_re/posco01_re02.png",
      "/images/posco01_re/posco01_re03.png",
      "/images/posco01_re/posco01_re04.png",
      "/images/posco01_re/posco01_re05.png",
      "/images/posco01_re/posco01_re06.png",
      "/images/posco01_re/posco01_re07.png"
    ],
    "date": "2026.06.08",
    "status": "Art",
    "statusColor": "#8A8F98",
    "starred": false,
    "authorImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=posco-white-note"
  },
  {
    "id": 8,
    "title": "\ud3ec\uc2a4\ucf54 \ube14\ub8e8 \uad6c\uc870 \ubaa8\ub4c8",
    "desc": "\ube14\ub8e8 \ud1a4 \ucca0\uace8 \uad6c\uc870, \uc8fc\ud0dd \ud504\ub808\uc784, \uc0b0\uc5c5 \ubd80\ud488\uc744 \ubaa8\ub4c8\ud615 \uc5d0\uc14b\uc73c\ub85c \ud655\uc778\ud558\ub294 \ub178\ud2b8\uc785\ub2c8\ub2e4.",
    "tags": [
      "#\ud3ec\uc2a4\ucf54",
      "#\ube14\ub8e8",
      "#\ucca0\uace8",
      "#\uac74\ucd95\ubaa8\ub4c8"
    ],
    "images": [
      "/images/posco02_re/posco02_re01.png",
      "/images/posco02_re/posco02_re02.png",
      "/images/posco02_re/posco02_re03.png",
      "/images/posco02_re/posco02_re04.png",
      "/images/posco02_re/posco02_re05.png",
      "/images/posco02_re/posco02_re06.png",
      "/images/posco02_re/posco02_re07.png"
    ],
    "date": "2026.06.07",
    "status": "Art",
    "statusColor": "#8A8F98",
    "starred": false,
    "authorImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=posco-blue-note"
  }
];

const DEFAULT_CHECKLIST = [
  "\ub808\ud37c\ub7f0\uc2a4 \uc774\ubbf8\uc9c0 \uc218\uc9d1",
  "\ud575\uc2ec \uc2e4\ub8e8\uc5e3 \uc815\ub9ac",
  "\uc0c9\uc0c1\uacfc \uc7ac\uc9c8 \ud0a4\uc6cc\ub4dc \uc120\ud0dd",
  "\uc791\uc5c5\uc6a9 \uba54\ubaa8 \ubcf4\uc644",
  "\uc5f0\uacb0\ud560 \ud504\ub85c\uc81d\ud2b8 \ud655\uc778",
  "\ucd5c\uc885 \uc791\uc5c5 \ubc29\ud5a5 \uc815\ub9ac"
];

const EXTRA_REFERENCES = [
  "/images/elf_re/elf_re01.jpg",
  "/images/orc_re/orc_re01.png",
  "/images/wyvern_re/wyvern_re01.jpg",
  "/images/Dino_re/Dino_re01.jpg",
  "/images/street_re/Street_re01.jpg",
  "/images/Rhino_re/Rhino_re01.jpg",
  "/images/posco01_re/posco01_re01.png",
  "/images/posco02_re/posco02_re01.png"
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
  onSelectionChange,
  onOpenNote,
  hideSelectionActionBar = false,
  onCreateNote,
}: NotesPageProps) {
  const [notes, setNotes] = useState<NoteItem[]>(loadNotes);
  const [activeNote, setActiveNote] = useState<number | null>(() => hideDetailPanel || isPopup ? null : notes[0]?.id ?? null);
  const [selectedNotes, setSelectedNotes] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [sortMode, setSortMode] = useState<"recent" | "name">("recent");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [favoritesFirst, setFavoritesFirst] = useState(false);
  const [trashIds, setTrashIds] = useState<Set<number>>(new Set());
  const [checklists, setChecklists] = useState<Record<string, boolean[]>>(
    loadChecklist,
  );
  const [toast, setToast] = useState("");
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteMemo, setNewNoteMemo] = useState("");
  const [newNoteReference, setNewNoteReference] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");

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
    onSelectionChange?.(Array.from(selectedNotes));
  }, [onSelectionChange, selectedNotes]);



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

    result = [...result].sort((a, b) => {
      if (favoritesFirst && a.starred !== b.starred) {
        return Number(b.starred) - Number(a.starred);
      }
      if (sortMode === "name") return a.title.localeCompare(b.title);
      return b.date.localeCompare(a.date);
    });
    return result;
  }, [favoritesFirst, filter, notes, searchQuery, sortMode, trashIds]);

  const handleNoteClick = (e: React.MouseEvent, id: number) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setSelectedNotes((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      setActiveNote(id);
      return;
    }

    if (onOpenNote) {
      setSelectedNotes(new Set());
      setActiveNote(id);
      onOpenNote(id);
      return;
    }

    if (isPopup) {
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

  const openCreateNote = () => {
    if (onCreateNote) {
      onCreateNote();
      return;
    }

    setNewNoteTitle("");
    setNewNoteMemo("");
    setNewNoteReference("");
    setNewNoteTags("");
    setIsCreateNoteOpen(true);
  };

  const createNote = () => {
    const title = newNoteTitle.trim();
    if (!title) return;
    const nextId = Math.max(0, ...notes.map((note) => note.id)) + 1;
    const now = new Date();
    const tags = newNoteTags
      .split(/[,#\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
    const reference = newNoteReference.trim();
    const nextNote: NoteItem = {
      id: nextId,
      title,
      desc: newNoteMemo.trim() || "새로운 아이디어와 작업 메모를 정리하세요.",
      tags: tags.length > 0 ? Array.from(new Set(tags)) : ["#새노트"],
      images: reference ? [reference] : [],
      date: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`,
      starred: false,
      authorImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=note-${nextId}`,
    };
    setNotes((prev) => [nextNote, ...prev]);
    setActiveNote(nextId);
    setSelectedNotes(new Set());
    setFilter("all");
    setIsCreateNoteOpen(false);
    setToast("새 노트를 추가했습니다.");
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

      <main
        className={`relative flex-1 bg-bg-dark ${
          isPopup
            ? "flex min-h-0 flex-col overflow-hidden px-6 pt-4 pb-6"
            : "overflow-y-auto px-4 py-6 sm:px-6 2xl:px-8 min-[2200px]:px-10"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[2400px] flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className={`relative w-full ${isPopup ? "max-w-[400px] flex-[0_1_400px]" : "max-w-[560px] flex-[0_1_560px]"}`}>
              <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="노트 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-lg border border-[#1C1E24] bg-[#121417] pl-11 pr-4 text-[15px] text-white shadow-inner outline-none transition placeholder:text-[#6E737B] focus:border-brand-primary/50"
              />
            </div>

            <div className="flex-1" />

            <button
              onClick={openCreateNote}
              className="flex h-12 shrink-0 items-center gap-2 rounded-lg border border-[#E0A12E]/35 bg-[#E0A12E]/10 px-4 text-[14px] font-medium text-brand-primary transition hover:border-brand-primary/60 hover:bg-[#E0A12E]/15"
            >
              <Plus className="h-4 w-4" />
              노트 추가
            </button>
            <button
              onClick={() => setFavoritesFirst((value) => !value)}
              className={`flex h-12 items-center gap-2 rounded-lg border px-4 text-[14px] font-medium transition ${
                favoritesFirst
                  ? "border-[#E0A12E]/45 bg-[#E0A12E]/10 text-brand-primary"
                  : "border-[#1C1E24] bg-[#121417] text-text-secondary hover:bg-surface-primary hover:text-white"
              }`}
            >
              <Star className={`h-4 w-4 ${favoritesFirst ? "fill-brand-primary" : ""}`} />
              즐겨찾기
            </button>

            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen((open) => !open)}
                className="flex h-12 cursor-pointer items-center rounded-lg border border-[#1C1E24] bg-[#121417] px-3 text-[14px] font-medium text-text-secondary transition hover:bg-surface-primary hover:text-white"
              >
                {sortMode === "recent" ? "최신순" : "이름순"}
                <ChevronDown className="ml-6 h-4 w-4" />
              </button>
              {isSortMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[132px] rounded-lg border border-[#2A2E36] bg-[#111317] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                  {[
                    ["recent", "최신순"],
                    ["name", "이름순"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortMode(value as "recent" | "name");
                        setIsSortMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[14px] font-medium transition ${
                        sortMode === value ? "bg-[#E0A12E]/10 text-brand-primary" : "text-neutral-300 hover:bg-[#1A1C23] hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-12 items-center rounded-lg border border-[#1C1E24] bg-[#121417] px-2">
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

          <div className={isPopup ? "min-h-0 flex-1 overflow-y-auto pr-1 pb-28" : ""}>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-5 transition md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
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
                        className="rounded border border-[#252830] bg-[#1A1C20] px-2 py-0.5 text-[14px] font-medium text-neutral-400"
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
                    <span className="font-sans text-[14px] text-neutral-400">
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
                <div className="grid grid-cols-2 gap-2">
                  {activeNoteData.images.slice(0, 4).map((img, index) => (
                    <img
                      key={`${img}-${index}`}
                      referrerPolicy="no-referrer"
                      src={img}
                      alt={`${activeNoteData.title} image ${index + 1}`}
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                    />
                  ))}
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
        {isCreateNoteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
            onClick={() => setIsCreateNoteOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-[620px] rounded-xl border border-[#2A2E36] bg-[#0A0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#1C1E24] px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-brand-primary">Board Note</p>
                  <h3 className="mt-1 text-[20px] font-medium text-white">새 노트 작성</h3>
                </div>
                <button
                  onClick={() => setIsCreateNoteOpen(false)}
                  className="rounded-lg p-2 text-neutral-400 transition hover:bg-[#15161A] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <input
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full border-0 border-b border-[#2A2E36] bg-transparent px-0 pb-3 text-[28px] font-medium tracking-tight text-white outline-none placeholder:text-[#3A404F] focus:border-brand-primary/60"
                  autoFocus
                />
                <textarea
                  value={newNoteMemo}
                  onChange={(e) => setNewNoteMemo(e.target.value)}
                  placeholder="메모를 입력하세요..."
                  className="min-h-[150px] w-full resize-none rounded-xl border border-[#1C1E24] bg-[#111215] p-4 text-[15px] leading-relaxed text-white outline-none placeholder:text-neutral-500 focus:border-brand-primary/50"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block rounded-xl border border-dashed border-[#2A2E36] bg-[#0C0C0E] p-4 transition focus-within:border-brand-primary/50">
                    <span className="mb-2 flex items-center gap-2 text-[14px] font-medium text-neutral-300">
                      <LayoutGrid className="h-4 w-4 text-brand-primary" /> 레퍼런스 추가
                    </span>
                    <input
                      value={newNoteReference}
                      onChange={(e) => setNewNoteReference(e.target.value)}
                      placeholder="이미지 URL 또는 경로"
                      className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-neutral-500"
                    />
                  </label>
                  <label className="block rounded-xl border border-[#1C1E24] bg-[#111215] p-4 transition focus-within:border-brand-primary/50">
                    <span className="mb-2 block text-[14px] font-medium text-neutral-300">태그</span>
                    <input
                      value={newNoteTags}
                      onChange={(e) => setNewNoteTags(e.target.value)}
                      placeholder="예: 오크, 장비, 턴어라운드"
                      className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-neutral-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#1C1E24] px-5 py-4">
                <button
                  onClick={() => setIsCreateNoteOpen(false)}
                  className="rounded-lg border border-[#2A2E36] px-4 py-2 text-[14px] font-medium text-neutral-300 transition hover:bg-[#15161A] hover:text-white"
                >
                  취소
                </button>
                <button
                  onClick={createNote}
                  disabled={!newNoteTitle.trim()}
                  className="rounded-lg bg-brand-primary px-5 py-2 text-[14px] font-medium text-bg-dark transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  노트 저장
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedCount > 0 && !hideSelectionActionBar && (
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
