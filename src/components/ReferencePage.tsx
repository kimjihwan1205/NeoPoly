/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Star,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Folder,
  LayoutGrid,
  Link as LinkIcon,
  List,
  Maximize2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { ASSETS } from "../App";
import LoadingIndicator from "./LoadingIndicator";

interface ReferencePageProps {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  onNavigate: (page: string) => void;
  isPopup?: boolean;
  hideSidebar?: boolean;
  boardCategory?: string;
  onAcceptSelection?: (selectedIds: number[]) => void;
  onSelectionChange?: (selectedIds: number[]) => void;
  hideSelectionActionBar?: boolean;
}

export type ReferenceAsset = (typeof ASSETS)[number] & {
  type?: string;
  category?: string;
};

const LOCAL_LOAD_IMAGES = [
  "/images/work_%2011.png",
  "/images/work_%2012.png",
  "/images/work_%203.png",
  "/images/work_%206.png",
  "/images/work_%2016.png",
  "/images/work_%2017.png",
  "/images/work_%2019.png",
  "/images/work_%2023.png",
  "/images/work_%2025.png",
  "/images/work_%2026.png",
  "/images/work_%2027.png",
  "/images/work_%2031.png",
  "/images/work_%2034.png",
  "/images/work_%2037.png",
  "/images/work_%2038.png",
  "/images/work_%2039.png",
  "/images/work_%2040.png",
  "/images/work_%2041.png",
  "/images/work_%2042.png",
  "/images/work_%2044.png",
  "/images/work_%2045.png",
  "/images/work_46.png",
  "/images/work_47.png",
  "/images/work_48.png",
  "/images/work_49.png",
  "/images/work_50.png",
  "/images/work_51.png",
  "/images/work_53.png",
  "/images/work_54.png",
  "/images/work_55.png",
  "/images/work_56.png",
  "/images/work_57.png",
  "/images/work_59.png",
  "/images/work_60.png",
];

const CURATED_ASSET_IDS = new Set([
  1, 2, 3, 6, 16, 17, 19, 23, 25, 26, 27, 31, 34, 37, 38, 39, 40, 41, 42,
  44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56, 57, 59, 60,
]);

const LOW_PRIORITY_KEYWORDS = [
  "posco",
  "주방",
  "현대",
  "산업",
  "사일로",
  "빌딩",
  "스포츠카",
  "미니언",
  "토피어리",
  "과일",
  "스시",
  "콘솔",
  "주택",
];

const VISUAL_DUPLICATE_PENALTIES = new Map<number, number>([
  [23, 72],
]);

export const REFERENCE_BOARDS = [
  { id: "character", label: "캐릭터 컨셉", image: "/images/work_%2011.png", keyword: "캐릭터" },
  { id: "environment", label: "판타지 배경", image: "/images/work_%2025.png", keyword: "판타지" },
  { id: "armor", label: "갑옷 / 의상", image: "/images/work_47.png", keyword: "갑옷" },
  { id: "weapon", label: "무기 / 장비", image: "/images/work_%2023.png", keyword: "무기" },
  { id: "orc", label: "오크 전사 무드", image: "/images/work_%2042.png", keyword: "오크" },
];

const BADGES = ["전체", "M", "A"];
const BADGE_LABELS: Record<string, string> = { 전체: "전체", M: "Market", A: "Art" };

const MASONRY_PROFILES = [
  { rows: 10, position: "center" },
  { rows: 14, position: "50% 35%" },
  { rows: 18, position: "center top" },
  { rows: 22, position: "center" },
  { rows: 13, position: "50% 62%" },
  { rows: 17, position: "center" },
  { rows: 11, position: "left center" },
  { rows: 20, position: "right center" },
  { rows: 15, position: "center bottom" },
  { rows: 24, position: "50% 42%" },
  { rows: 9, position: "center" },
  { rows: 16, position: "50% 58%" },
  { rows: 23, position: "center top" },
  { rows: 12, position: "center" },
];

function buildGeneratedAsset(index: number, offset: number): ReferenceAsset {
  const id = 1000 + offset + index;
  const image = LOCAL_LOAD_IMAGES[(offset + index) % LOCAL_LOAD_IMAGES.length];
  const themes = [
    ["오크 전사 참고 이미지", "캐릭터"],
    ["판타지 실루엣 무드", "판타지"],
    ["갑옷 디테일 레퍼런스", "갑옷"],
    ["무기 형태 레퍼런스", "무기"],
    ["크리처 조형 참고", "캐릭터"],
  ];
  const [title, category] = themes[(offset + index) % themes.length];

  return {
    id,
    title,
    author: `NeoRef_${id}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    likes: String(120 + index * 17),
    views: String(600 + index * 83),
    image,
    badge: index % 2 === 0 ? "M" : "A",
    type: "Reference",
    category,
  };
}

function referenceScore(asset: ReferenceAsset) {
  let score = 0;
  const text = `${asset.title} ${asset.type ?? ""} ${asset.category ?? ""} ${asset.image}`.toLowerCase();

  if (CURATED_ASSET_IDS.has(asset.id)) score += 80;
  score -= VISUAL_DUPLICATE_PENALTIES.get(asset.id) ?? 0;

  [
    "오크",
    "orc",
    "판타지",
    "fantasy",
    "기사",
    "갑옷",
    "전사",
    "중세",
    "무기",
    "검",
    "단검",
    "괴물",
    "크리처",
    "드래곤",
    "와이번",
    "흑기사",
    "여기사",
    "사제",
    "성직자",
    "사무라이",
    "pbr",
  ].forEach((keyword) => {
    if (text.includes(keyword.toLowerCase())) score += 24;
  });

  LOW_PRIORITY_KEYWORDS.forEach((keyword) => {
    if (text.includes(keyword)) score -= 90;
  });

  return score;
}

type ReferenceBoard = (typeof REFERENCE_BOARDS)[number] & { assetIds?: number[]; memo?: string };

export function boardMatchesAsset(board: ReferenceBoard, asset: ReferenceAsset) {
  if (board.assetIds?.includes(asset.id)) return true;
  const haystack = `${asset.title} ${asset.type ?? ""} ${asset.category ?? ""}`.toLowerCase();

  if (board.id === "character") {
    return (
      haystack.includes("캐릭터") ||
      haystack.includes("전사") ||
      haystack.includes("기사") ||
      haystack.includes("오크") ||
      haystack.includes("크리처") ||
      haystack.includes("괴물")
    );
  }
  if (board.id === "environment") {
    return haystack.includes("판타지") || haystack.includes("숲") || haystack.includes("성채") || haystack.includes("요새");
  }
  if (board.id === "armor") {
    return haystack.includes("갑옷") || haystack.includes("기사") || haystack.includes("망토") || haystack.includes("의상");
  }
  if (board.id === "weapon") {
    return haystack.includes("무기") || haystack.includes("검") || haystack.includes("단검") || haystack.includes("총");
  }
  if (board.id === "orc") {
    return haystack.includes("오크") || haystack.includes("orc");
  }

  return haystack.includes(board.keyword.toLowerCase());
}

export default function ReferencePage({
  favorites = [],
  toggleFavorite = () => {},
  onNavigate = () => {},
  isPopup = false,
  hideSidebar = false,
  boardCategory,
  onAcceptSelection,
  onSelectionChange,
  hideSelectionActionBar = false,
}: ReferencePageProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeBadge, setActiveBadge] = useState("전체");
  const [isBadgeMenuOpen, setIsBadgeMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [refFavorites, setRefFavorites] = useState<number[]>(() =>
    favorites.length ? favorites : [1, 4, 7],
  );
  const [trashIds, setTrashIds] = useState<Set<number>>(new Set([2, 5]));
  const [previewImage, setPreviewImage] = useState<ReferenceAsset | null>(null);
  const [displayLimit, setDisplayLimit] = useState(40);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [extraAssets, setExtraAssets] = useState<ReferenceAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favoritesFirst, setFavoritesFirst] = useState(false);
  const [sortMode, setSortMode] = useState<"recent" | "name">("recent");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [boards, setBoards] = useState<ReferenceBoard[]>(REFERENCE_BOARDS);
  const [toast, setToast] = useState("");
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardMemo, setNewBoardMemo] = useState("");
  const [newBoardImage, setNewBoardImage] = useState("");
  const [newBoardAssetIds, setNewBoardAssetIds] = useState<number[]>([]);

  useEffect(() => {
    if (boardCategory) setActiveCategory(boardCategory);
  }, [boardCategory]);
  useEffect(() => {
    onSelectionChange?.(Array.from(selectedIds));
  }, [onSelectionChange, selectedIds]);



  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const allAssets = useMemo<ReferenceAsset[]>(() => {
    const merged = [...(ASSETS as ReferenceAsset[]), ...extraAssets];
    const uniqueByImage = new Map<string, ReferenceAsset>();

    merged.forEach((asset) => {
      if (!uniqueByImage.has(asset.image)) uniqueByImage.set(asset.image, asset);
    });

    return Array.from(uniqueByImage.values()).sort((a, b) => {
      const scoreDiff = referenceScore(b) - referenceScore(a);
      return scoreDiff || a.id - b.id;
    });
  }, [extraAssets]);

  const displayedAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = allAssets.slice(0, displayLimit);

    if (activeCategory === "favorites") {
      result = allAssets.filter((asset) => refFavorites.includes(asset.id));
    } else if (activeCategory === "recent") {
      result = allAssets.slice(0, 12);
    } else if (activeCategory === "trash") {
      result = allAssets.filter((asset) => trashIds.has(asset.id));
    } else {
      result = result.filter((asset) => !trashIds.has(asset.id));
      const board = boards.find((item) => item.id === activeCategory);
      if (board) {
        result = result.filter((asset) => boardMatchesAsset(board, asset));
      }
    }

    if (activeBadge !== "전체") {
      result = result.filter((asset) => asset.badge === activeBadge);
    }

    if (query) {
      result = result.filter((asset) => {
        const haystack = `${asset.title} ${asset.author} ${asset.type ?? ""} ${asset.category ?? ""}`.toLowerCase();
        return haystack.includes(query);
      });
    }

    result = [...result].sort((a, b) => {
      const aFavorite = refFavorites.includes(a.id);
      const bFavorite = refFavorites.includes(b.id);
      if (favoritesFirst && aFavorite !== bFavorite) {
        return Number(bFavorite) - Number(aFavorite);
      }
      if (sortMode === "name") return a.title.localeCompare(b.title);
      return a.id - b.id;
    });

    return result;
  }, [
    activeBadge,
    activeCategory,
    allAssets,
    boards,
    displayLimit,
    favoritesFirst,
    refFavorites,
    searchQuery,
    sortMode,
    trashIds,
  ]);

  const boardCounts = useMemo(() => {
    const counts = new Map<string, number>();
    boards.forEach((board) => {
      counts.set(
        board.id,
        allAssets.filter((asset) => !trashIds.has(asset.id) && boardMatchesAsset(board, asset)).length,
      );
    });
    return counts;
  }, [allAssets, boards, trashIds]);

  const toggleRefFavorite = (id: number) => {
    setRefFavorites((prev) =>
      prev.includes(id) ? prev.filter((favorite) => favorite !== id) : [...prev, id],
    );
    toggleFavorite(id);
  };

  const toggleAssetSelection = (assetId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  };

  const handleCardClick = (e: React.MouseEvent, asset: ReferenceAsset) => {
    e.preventDefault();
    toggleAssetSelection(asset.id);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    window.setTimeout(() => {
      const offset = extraAssets.length;
      const nextItems = Array.from({ length: 12 }).map((_, index) =>
        buildGeneratedAsset(index, offset),
      );
      setExtraAssets((prev) => [...prev, ...nextItems]);
      setDisplayLimit((prev) => prev + 12);
      setIsLoadingMore(false);
      setToast("기존 레퍼런스 이미지를 더 불러왔습니다.");
    }, 500);
  };

  const openCreateBoard = () => {
    setNewBoardName("");
    setNewBoardMemo("");
    setNewBoardImage("");
    setNewBoardAssetIds([]);
    setIsCreateBoardOpen(true);
  };

  const openCreateBoardFromSelection = () => {
    const selectedAssets = allAssets.filter((asset) => selectedIds.has(asset.id));
    setNewBoardName("");
    setNewBoardMemo(`${selectedIds.size}개의 선택한 레퍼런스를 묶은 보드`);
    setNewBoardImage(selectedAssets[0]?.image ?? "");
    setNewBoardAssetIds(Array.from(selectedIds));
    setIsCreateBoardOpen(true);
  };

  const createBoard = () => {
    const name = newBoardName.trim();
    if (!name) return;
    const next: ReferenceBoard = {
      id: `custom-${Date.now()}`,
      label: name,
      image: newBoardImage.trim() || "/images/work_48.png",
      keyword: newBoardMemo.trim() || name,
      memo: newBoardMemo.trim(),
      assetIds: newBoardAssetIds.length > 0 ? newBoardAssetIds : undefined,
    };
    setBoards((prev) => [next, ...prev]);
    setActiveCategory(next.id);
    setIsCreateBoardOpen(false);
    if (newBoardAssetIds.length > 0) setSelectedIds(new Set());
    setToast(newBoardAssetIds.length > 0 ? "선택 항목을 새 보드로 묶었습니다." : "새 보드를 만들었습니다.");
  };

  const downloadAsset = (asset: ReferenceAsset) => {
    const link = document.createElement("a");
    link.href = asset.image;
    link.download = `${asset.title.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setToast("이미지 다운로드를 시작했습니다.");
  };

  const sendSelectedToTrash = () => {
    if (selectedIds.size === 0) return;
    setTrashIds((prev) => new Set([...prev, ...selectedIds]));
    setSelectedIds(new Set());
    setToast("선택한 항목을 휴지통으로 보냈습니다.");
  };

  const activeBoardLabel = activeCategory === "all"
    ? "전체 보드"
    : boards.find((board) => board.id === activeCategory)?.label ?? "전체 보드";

  return (
    <div
      className={`relative flex bg-bg-dark font-sans text-text-primary ${
        isPopup ? "h-full min-h-0" : "min-h-[calc(100vh-76px)]"
      }`}
    >
      {!hideSidebar && (
        <aside
          className={`hidden w-[300px] shrink-0 flex-col border-r border-[#161618] bg-[#08090B] p-5 lg:flex ${
            isPopup ? "h-full overflow-y-auto" : "sticky top-[76px] h-[calc(100vh-76px)]"
          }`}
        >
        <div className="mb-8 mt-2">
          {!isPopup && (
            <>
              <h2 className="mb-2 text-[20px] font-bold text-white">레퍼런스</h2>
              <p className="mb-6 text-[14px] leading-relaxed text-text-secondary">
                필요한 이미지를 모으고 프로젝트에 연결하세요.
              </p>
            </>
          )}
          <button
            onClick={openCreateBoard}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#3A404F]/60 bg-[#15161A] py-3 text-[15px] font-bold text-[#E0A12E] transition hover:border-[#E0A12E]/50 hover:bg-[#22252B]"
          >
            <Plus className="h-[18px] w-[18px]" />
            새 보드 만들기
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-1">
          <MenuBtn
            icon={<LayoutGrid className="h-[18px] w-[18px]" />}
            label="전체"
            count={allAssets.length - trashIds.size}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          <MenuBtn
            icon={<Star className="h-[18px] w-[18px]" />}
            label="즐겨찾기"
            count={refFavorites.length}
            active={activeCategory === "favorites"}
            onClick={() => setActiveCategory("favorites")}
          />
          <MenuBtn
            icon={<Clock className="h-[18px] w-[18px]" />}
            label="최근 추가"
            count={Math.min(12, allAssets.length)}
            active={activeCategory === "recent"}
            onClick={() => setActiveCategory("recent")}
          />
          <MenuBtn
            icon={<Trash2 className="h-[18px] w-[18px]" />}
            label="휴지통"
            count={trashIds.size}
            active={activeCategory === "trash"}
            onClick={() => setActiveCategory("trash")}
          />
        </div>

        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[14px] font-bold text-text-primary">보드</span>
            <button onClick={openCreateBoard} className="text-text-tertiary transition hover:text-white">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            {boards.map((board) => (
              <BoardBtn
                key={board.id}
                img={board.image}
                label={board.label}
                count={String(boardCounts.get(board.id) ?? 0)}
                active={activeCategory === board.id}
                onClick={() => setActiveCategory(board.id)}
              />
            ))}
          </div>
        </div>
        </aside>
      )}

      <main
        className={`min-w-0 flex-1 ${
          isPopup
            ? "flex h-full min-h-0 flex-col overflow-hidden px-6 pt-4 pb-6"
            : "px-4 py-6 overscroll-y-auto sm:px-6 2xl:px-8 min-[2200px]:px-10"
        }`}
      >
        {!["favorites", "recent", "trash"].includes(activeCategory) && (
          <>
            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsBoardMenuOpen((open) => !open)}
                  className="flex h-12 min-w-[148px] max-w-[190px] items-center justify-between gap-3 rounded-lg border border-[#1C1E24] bg-[#121417] px-3 text-[14px] font-medium text-text-secondary transition hover:bg-surface-primary hover:text-white"
                >
                  <span className="truncate">{activeBoardLabel}</span>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </button>
                {isBoardMenuOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 max-h-[280px] w-[220px] overflow-y-auto rounded-lg border border-[#2A2E36] bg-[#111317] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        setIsBoardMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[14px] font-medium transition ${
                        activeCategory === "all" ? "bg-[#E0A12E]/10 text-brand-primary" : "text-neutral-300 hover:bg-[#1A1C23] hover:text-white"
                      }`}
                    >
                      전체 보드
                    </button>
                    {boards.map((board) => (
                      <button
                        key={board.id}
                        onClick={() => {
                          setActiveCategory(board.id);
                          setIsBoardMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-[14px] font-medium transition ${
                          activeCategory === board.id ? "bg-[#E0A12E]/10 text-brand-primary" : "text-neutral-300 hover:bg-[#1A1C23] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{board.label}</span>
                        <span className="shrink-0 text-[12px] text-neutral-500">{boardCounts.get(board.id) ?? 0}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsBadgeMenuOpen((open) => !open)}
                  className="flex h-12 min-w-[112px] items-center justify-between gap-3 rounded-lg border border-[#1C1E24] bg-[#121417] px-3 text-[14px] font-medium text-text-secondary transition hover:bg-surface-primary hover:text-white"
                >
                  {BADGE_LABELS[activeBadge] ?? activeBadge}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isBadgeMenuOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-[132px] rounded-lg border border-[#2A2E36] bg-[#111317] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                    {BADGES.map((badge) => (
                      <button
                        key={badge}
                        onClick={() => {
                          setActiveBadge(badge);
                          setIsBadgeMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[14px] font-medium transition ${
                          activeBadge === badge ? "bg-[#E0A12E]/10 text-brand-primary" : "text-neutral-300 hover:bg-[#1A1C23] hover:text-white"
                        }`}
                      >
                        {BADGE_LABELS[badge] ?? badge}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={`relative w-full ${isPopup ? "max-w-[400px] flex-[0_1_400px]" : "max-w-[560px] flex-[0_1_560px]"}`}>
                <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="레퍼런스 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-lg border border-[#1C1E24] bg-[#121417] pl-11 pr-4 text-[15px] text-white shadow-inner outline-none transition placeholder:text-[#6E737B] focus:border-brand-primary/50"
                />
              </div>

              <div className="flex-1" />

              <button
                onClick={openCreateBoard}
                className="flex h-12 items-center gap-2 rounded-lg border border-[#E0A12E]/35 bg-[#E0A12E]/10 px-4 text-[14px] font-medium text-brand-primary transition hover:border-brand-primary/60 hover:bg-[#E0A12E]/15"
              >
                <Plus className="h-4 w-4" />
                새 보드 추가
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

          </>
        )}

        <div className={isPopup ? "min-h-0 flex-1 overflow-y-auto pr-1 pb-28" : ""}>
          {activeCategory === "favorites" && (
            <SectionHeader
            icon={<Star className="h-5 w-5 fill-brand-primary text-brand-primary" />}
            title="즐겨찾기"
            desc="북마크한 레퍼런스 이미지입니다."
          />
        )}

          {activeCategory === "recent" && (
            <SectionHeader
            icon={<Clock className="h-5 w-5 text-brand-primary" />}
            title="최근 추가"
            desc="최근 추가된 레퍼런스 항목입니다."
          />
        )}

          {activeCategory === "trash" && (
            <div className="mb-8 mt-2 flex items-center justify-between border-b border-border-soft pb-6">
            <div>
              <h1 className="mb-2 flex items-center gap-3 text-[28px] font-bold text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-500/20 bg-gray-500/10">
                  <Trash2 className="h-5 w-5 text-text-tertiary" />
                </span>
                휴지통
              </h1>
              <p className="text-[14px] text-text-secondary">삭제 대기 중인 항목입니다.</p>
            </div>
            <button
              onClick={() => {
                setTrashIds(new Set());
                setToast("휴지통을 비웠습니다.");
              }}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-[13px] font-bold text-brand-primary transition hover:bg-red-500/10"
            >
              휴지통 비우기
            </button>
          </div>
        )}

          <div className="mb-4 flex items-center gap-2 px-1 text-[13px] text-neutral-400">
            <CheckSquare className="h-4 w-4 text-neutral-400" />
            이미지를 클릭해서 여러 항목을 선택할 수 있습니다. 선택 후 아래 작업바에서 보드로 묶거나 연결하세요.
          </div>

          {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 [grid-auto-flow:dense] [grid-auto-rows:8px] md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {displayedAssets.map((asset, index) => {
              const profile = MASONRY_PROFILES[(asset.id * 3 + index * 7) % MASONRY_PROFILES.length];
              return (
                <ReferenceCard
                  key={asset.id}
                  asset={asset}
                  rowSpan={profile.rows}
                  objectPosition={profile.position}
                  isSelected={selectedIds.has(asset.id)}
                  isFavorite={refFavorites.includes(asset.id)}
                  isPopup={isPopup}
                  isBoardDepth={isPopup && !onAcceptSelection}
                  onClick={(e) => handleCardClick(e, asset)}
                  onPreview={(e) => {
                    e.stopPropagation();
                    setPreviewImage(asset);
                  }}
                  onFavorite={(e) => {
                    e.stopPropagation();
                    toggleRefFavorite(asset.id);
                  }}
                  onDownload={(e) => {
                    e.stopPropagation();
                    downloadAsset(asset);
                  }}
                  onLink={(e) => {
                    e.stopPropagation();
                    setToast("프로젝트 연결 준비가 완료되었습니다.");
                  }}
                  onAdd={(e) => {
                    e.stopPropagation();
                    toggleAssetSelection(asset.id);
                    setToast("보드로 묶을 항목을 선택했습니다.");
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {displayedAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={(e) => handleCardClick(e, asset)}
                className={`grid grid-cols-[120px_1fr_auto] items-center gap-4 rounded-lg border bg-[#0A0B0D] p-3 text-left transition ${
                  selectedIds.has(asset.id)
                    ? "border-brand-primary"
                    : "border-[#1F2329] hover:border-brand-primary/40"
                }`}
              >
                <img
                  referrerPolicy="no-referrer"
                  src={asset.image}
                  alt={asset.title}
                  className="h-[90px] w-[120px] rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-[16px] font-bold text-white">{asset.title}</h3>
                  <p className="mt-1 text-[13px] text-neutral-400">{asset.author}</p>
                  <p className="mt-2 text-[12px] text-neutral-500">{asset.type ?? asset.badge}</p>
                </div>
                <Star
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRefFavorite(asset.id);
                  }}
                  className={`h-5 w-5 ${
                    refFavorites.includes(asset.id) ? "fill-brand-primary text-brand-primary" : "text-neutral-400"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

          {displayedAssets.length === 0 && (
            <div className="flex h-[260px] items-center justify-center rounded-lg border border-[#1F2329] bg-[#0A0B0D] text-[14px] text-neutral-400">
              조건에 맞는 레퍼런스가 없습니다.
            </div>
          )}

          {!["favorites", "recent", "trash"].includes(activeCategory) && (
            <div className="mt-8 flex justify-center py-6 pb-20">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 rounded-full border border-[#2A2E36] bg-surface-primary px-6 py-2.5 text-[14px] font-bold text-text-tertiary transition hover:bg-[#111215] hover:text-white"
            >
              {isLoadingMore ? (
                <>
                  <LoadingIndicator />
                  불러오는 중
                </>
              ) : (
                <>
                  더 보기
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isCreateBoardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
            onClick={() => setIsCreateBoardOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-[520px] rounded-xl border border-[#2A2E36] bg-[#0A0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#1C1E24] px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-brand-primary">Reference Board</p>
                  <h3 className="mt-1 text-[20px] font-medium text-white">{newBoardAssetIds.length > 0 ? "선택 항목 보드로 묶기" : "새 보드 추가"}</h3>
                </div>
                <button
                  onClick={() => setIsCreateBoardOpen(false)}
                  className="rounded-lg p-2 text-neutral-400 transition hover:bg-[#15161A] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <label className="block">
                  <span className="mb-2 block text-[14px] font-medium text-neutral-300">보드명</span>
                  <input
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder={newBoardAssetIds.length > 0 ? "예: 오크 장비 모음" : "예: 오크 장비 레퍼런스"}
                    className="h-12 w-full rounded-lg border border-[#1C1E24] bg-[#111215] px-4 text-[15px] text-white outline-none placeholder:text-neutral-500 focus:border-brand-primary/50"
                    autoFocus
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[14px] font-medium text-neutral-300">보드 설명 / 키워드</span>
                  <textarea
                    value={newBoardMemo}
                    onChange={(e) => setNewBoardMemo(e.target.value)}
                    placeholder="어떤 레퍼런스를 모을 보드인지 적어주세요."
                    className="min-h-[100px] w-full resize-none rounded-lg border border-[#1C1E24] bg-[#111215] px-4 py-3 text-[14px] leading-relaxed text-white outline-none placeholder:text-neutral-500 focus:border-brand-primary/50"
                  />
                </label>
                <label className="block rounded-xl border border-dashed border-[#2A2E36] bg-[#0C0C0E] p-4 transition focus-within:border-brand-primary/50">
                  <span className="mb-2 flex items-center gap-2 text-[14px] font-medium text-neutral-300">
                    <LayoutGrid className="h-4 w-4 text-brand-primary" /> 대표 이미지
                  </span>
                  <input
                    value={newBoardImage}
                    onChange={(e) => setNewBoardImage(e.target.value)}
                    placeholder="이미지 URL 또는 경로, 비워두면 기본 이미지"
                    className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-neutral-500"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#1C1E24] px-5 py-4">
                <button
                  onClick={() => setIsCreateBoardOpen(false)}
                  className="rounded-lg border border-[#2A2E36] px-4 py-2 text-[14px] font-medium text-neutral-300 transition hover:bg-[#15161A] hover:text-white"
                >
                  취소
                </button>
                <button
                  onClick={createBoard}
                  disabled={!newBoardName.trim()}
                  className="rounded-lg bg-brand-primary px-5 py-2 text-[14px] font-medium text-bg-dark transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {newBoardAssetIds.length > 0 ? "보드로 묶기" : "보드 저장"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedIds.size > 0 && !hideSelectionActionBar && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-[#2A2E36] bg-[#1A1C20] p-2 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-2 border-r border-[#2A2E36] pr-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[11px] font-bold text-bg-dark">
                {selectedIds.size}
              </div>
              <span className="text-[13px] font-bold text-white">선택됨</span>
            </div>

            <div className="flex items-center gap-2">
              {isPopup && onAcceptSelection ? (
                <>
                  <button
                    onClick={() => onAcceptSelection?.(Array.from(selectedIds))}
                    className="flex items-center gap-2 rounded-md bg-[#E0A12E] px-6 py-1.5 text-[13px] font-bold text-bg-dark transition hover:bg-[#E0A12E]/90"
                  >
                    선택 항목 가져오기
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={openCreateBoardFromSelection}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium text-text-secondary transition hover:bg-surface-primary hover:text-white"
                  >
                    <Folder className="h-4 w-4" />
                    보드로 묶기
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openCreateBoardFromSelection}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium text-text-secondary transition hover:bg-surface-primary hover:text-white"
                  >
                    <Folder className="h-4 w-4" />
                    보드로 묶기
                  </button>
                  <button
                    onClick={() => {
                      setToast("선택 항목을 프로젝트와 연결했습니다.");
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

            <button
              onClick={sendSelectedToTrash}
              className="rounded-full p-1.5 text-text-tertiary transition hover:bg-surface-primary hover:text-white"
            >
              <Trash2 className="h-[18px] w-[18px]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/95 p-8 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative flex max-h-full max-w-full flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 rounded-full bg-surface-primary/50 p-2 text-neutral-400 transition hover:bg-surface-primary hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                referrerPolicy="no-referrer"
                src={previewImage.image}
                alt={previewImage.title}
                className="max-h-[85vh] max-w-[90vw] rounded-lg border border-[#1F2329] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              />
              <div className="mt-4 flex items-center justify-between px-2">
                <div>
                  <h3 className="text-[20px] font-bold text-white">{previewImage.title}</h3>
                  <p className="mt-1 text-[14px] text-neutral-400">{previewImage.author}</p>
                </div>
                {!isPopup && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRefFavorite(previewImage.id)}
                      className={`rounded-lg border border-[#1F2329] bg-surface-primary p-2.5 transition hover:bg-[#111215] hover:text-white ${
                        refFavorites.includes(previewImage.id) ? "text-brand-primary" : "text-neutral-400"
                      }`}
                    >
                      <Star className={`h-5 w-5 ${refFavorites.includes(previewImage.id) ? "fill-brand-primary" : ""}`} />
                    </button>
                    <button
                      onClick={() => downloadAsset(previewImage)}
                      className="flex items-center gap-2 rounded-lg border border-[#1F2329] bg-surface-primary px-4 py-2.5 text-white transition hover:bg-[#111215]"
                    >
                      <Download className="h-4 w-4" />
                      다운로드
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
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

function SectionHeader({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-8 mt-2 flex items-center justify-between border-b border-border-soft pb-6">
      <div>
        <h1 className="mb-2 flex items-center gap-3 text-[28px] font-bold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#141518]">
            {icon}
          </span>
          {title}
        </h1>
        <p className="text-[14px] text-text-secondary">{desc}</p>
      </div>
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
  onClick?: () => void;
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
        <span className={active ? "text-[#E0A12E]" : "text-neutral-400"}>{icon}</span>
        {label}
      </span>
      <span className={active ? "text-[13px] text-text-secondary" : "text-[13px] text-neutral-500"}>
        {count}
      </span>
    </button>
  );
}

function BoardBtn({
  img,
  label,
  count,
  active,
  onClick,
}: {
  img: string;
  label: string;
  count: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-3 text-[16px] font-semibold transition ${
        active
          ? "bg-[#15161A] text-[#E0A12E]"
          : "text-text-secondary hover:bg-[#111215] hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3.5">
        <span className="h-8 w-8 shrink-0 overflow-hidden rounded-md border border-[#2A2E36]">
          <img referrerPolicy="no-referrer" src={img} alt="" className="h-full w-full object-cover" />
        </span>
        {label}
      </span>
      <span className="font-sans text-[13px] text-neutral-500">{count}</span>
    </button>
  );
}

function ReferenceCard({
  asset,
  rowSpan,
  objectPosition,
  isSelected,
  isFavorite,
  isPopup,
  isBoardDepth,
  onClick,
  onPreview,
  onFavorite,
  onDownload,
  onLink,
  onAdd,
}: {
  asset: ReferenceAsset;
  rowSpan: number;
  objectPosition: string;
  isSelected: boolean;
  isFavorite: boolean;
  isPopup?: boolean;
  isBoardDepth?: boolean;
  onClick: (e: React.MouseEvent) => void;
  onPreview: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
  onLink: (e: React.MouseEvent) => void;
  onAdd: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      style={{ gridRowEnd: `span ${rowSpan}` }}
      className={`group relative h-full min-h-[180px] w-full cursor-pointer overflow-hidden rounded-lg text-left shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition ${
        isSelected
          ? "border-2 border-brand-primary shadow-[0_0_20px_rgba(224,161,46,0.15)]"
          : "border border-[#1F2329] hover:border-brand-primary/40"
      }`}
    >
      <div className="h-full w-full overflow-hidden bg-surface-secondary">
        <img
          referrerPolicy="no-referrer"
          src={asset.image}
          alt={asset.title}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </div>

      {isSelected && (
        <div className="absolute left-3 top-3 z-20 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-bg-dark shadow-md">
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </div>
      )}

      {isBoardDepth ? (
        <>
          <button
            type="button"
            title="크게보기"
            onClick={onPreview}
            className={`absolute top-3 z-20 flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-[#0A0B0D]/75 px-3 text-[14px] font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition hover:bg-[#171A20] group-hover:opacity-100 ${
              isSelected ? "left-10" : "left-3"
            }`}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>크게보기</span>
          </button>
          <button
            type="button"
            title="즐겨찾기"
            onClick={onFavorite}
            className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition hover:bg-[#171A20] ${
              isFavorite
                ? "border-[#E0A12E]/35 bg-[#0A0B0D]/85 text-brand-primary opacity-100"
                : "border-white/10 bg-[#0A0B0D]/70 text-white opacity-0 group-hover:opacity-100"
            }`}
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-brand-primary" : ""}`} />
          </button>
        </>
      ) : isFavorite && !isSelected ? (
        <div className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#E0A12E]/30 bg-[#0A0B0D]/85 text-brand-primary backdrop-blur-sm">
          <Star className="h-4 w-4 fill-brand-primary" />
        </div>
      ) : null}

      {!isBoardDepth && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex translate-y-2 justify-center opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-[#2A2E36]/80 bg-[#1A1C20]/90 p-1.5 shadow-xl backdrop-blur-md">
            {isPopup ? (
              <ActionButton icon={<Maximize2 className="h-3.5 w-3.5" />} title="\uD06C\uAC8C\uBCF4\uAE30" onClick={onPreview} />
            ) : (
              <>
                <ActionButton icon={<LinkIcon className="h-3.5 w-3.5" />} title="\uD504\uB85C\uC81D\uD2B8 \uC5F0\uACB0" onClick={onLink} />
                <ActionButton icon={<Folder className="h-3.5 w-3.5" />} title={isSelected ? "\uBCF4\uB4DC \uC120\uD0DD \uD574\uC81C" : "\uBCF4\uB4DC\uC5D0 \uCD94\uAC00"} onClick={onAdd} />
                <ActionButton
                  icon={<Star className={`h-3.5 w-3.5 ${isFavorite ? "fill-brand-primary text-brand-primary" : ""}`} />}
                  title="\uC990\uACA8\uCC3E\uAE30"
                  onClick={onFavorite}
                />
                <ActionButton icon={<Maximize2 className="h-3.5 w-3.5" />} title="\uD06C\uAC8C\uBCF4\uAE30" onClick={onPreview} />
                <span className="mx-1 h-4 w-px bg-[#2A2E36]" />
                <ActionButton icon={<MoreHorizontal className="h-3.5 w-3.5" />} title="\uB354\uBCF4\uAE30" />
              </>
            )}
          </div>
        </div>
      )}
    </motion.button>
  );
}

function ActionButton({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center rounded-md p-2 text-text-secondary transition hover:scale-105 hover:bg-surface-primary hover:text-white active:scale-95"
    >
      {icon}
    </button>
  );
}
