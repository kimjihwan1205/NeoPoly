/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bookmark,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Folder,
  LayoutGrid,
  Link as LinkIcon,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { ASSETS } from "../App";

interface ReferencePageProps {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  onNavigate: (page: string) => void;
  isPopup?: boolean;
  onAcceptSelection?: (selectedIds: number[]) => void;
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

export function boardMatchesAsset(board: (typeof REFERENCE_BOARDS)[number], asset: ReferenceAsset) {
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
  onAcceptSelection,
}: ReferencePageProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeBadge, setActiveBadge] = useState("전체");
  const [activeCategory, setActiveCategory] = useState("all");
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
  const [boards, setBoards] = useState(REFERENCE_BOARDS);
  const [toast, setToast] = useState("");

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

    return result;
  }, [
    activeBadge,
    activeCategory,
    allAssets,
    boards,
    displayLimit,
    refFavorites,
    searchQuery,
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

  const handleCardClick = (e: React.MouseEvent, asset: ReferenceAsset) => {
    if (e.ctrlKey || e.metaKey || isPopup) {
      e.preventDefault();
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(asset.id)) next.delete(asset.id);
        else next.add(asset.id);
        return next;
      });
      return;
    }
    setPreviewImage(asset);
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

  const createBoard = () => {
    const name = window.prompt("새 보드 이름을 입력하세요.");
    if (!name?.trim()) return;
    const next = {
      id: `custom-${Date.now()}`,
      label: name.trim(),
      image: "/images/work_48.png",
      keyword: name.trim(),
    };
    setBoards((prev) => [next, ...prev]);
    setActiveCategory(next.id);
    setToast("새 보드를 만들었습니다.");
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

  return (
    <div
      className={`relative flex bg-bg-dark font-sans text-text-primary ${
        isPopup ? "h-full min-h-0" : "min-h-[calc(100vh-76px)]"
      }`}
    >
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
            onClick={createBoard}
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
            icon={<Bookmark className="h-[18px] w-[18px]" />}
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
            <button onClick={createBoard} className="text-text-tertiary transition hover:text-white">
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

      <main
        className={`min-w-0 flex-1 px-6 py-6 ${
          isPopup ? "h-full overflow-y-auto" : "overscroll-y-auto"
        }`}
      >
        {!["favorites", "recent", "trash"].includes(activeCategory) && (
          <>
            <div className="mb-6 flex items-center gap-4">
              <div className="relative max-w-[480px] flex-1">
                <Search className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="레퍼런스 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#2A2E36] bg-[#111215] py-2.5 pl-10 pr-10 text-[14px] text-white outline-none transition placeholder:text-neutral-500 focus:border-brand-primary/50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#2A2E36] bg-[#1A1C20] px-1.5 py-0.5 font-sans text-[10px] text-text-tertiary">
                  /
                </div>
              </div>

              <div className="flex-1" />

              <button
                onClick={() => setActiveCategory("favorites")}
                className="flex items-center gap-2 rounded-lg border border-[#2A2E36] bg-[#111215] px-4 py-2 text-[13px] font-bold text-text-secondary transition hover:bg-surface-primary hover:text-white"
              >
                <Filter className="h-4 w-4" />
                즐겨찾기
              </button>

              <div className="flex cursor-pointer items-center rounded-lg border border-[#2A2E36] bg-[#111215] px-3 py-2 text-[13px] font-bold text-text-secondary transition hover:bg-surface-primary">
                최신순
                <ChevronDown className="ml-6 h-4 w-4" />
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-[#2A2E36] bg-[#111215] p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded p-1 ${
                    viewMode === "grid" ? "bg-[#2A2E36] text-white" : "text-text-tertiary hover:text-white"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded p-1 ${
                    viewMode === "list" ? "bg-[#2A2E36] text-white" : "text-text-tertiary hover:text-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="-mx-2 mb-8 flex items-center gap-2 overflow-x-auto px-2 pb-2">
              {BADGES.map((badge) => (
                <button
                  key={badge}
                  onClick={() => setActiveBadge(badge)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-bold transition ${
                    activeBadge === badge
                      ? "border-[#E0A12E]/30 bg-[#E0A12E]/10 text-brand-primary"
                      : "border-[#2A2E36] bg-transparent text-text-secondary hover:border-[#4B505A] hover:text-white"
                  }`}
                >
                  {badge}
                </button>
              ))}
              <button
                onClick={createBoard}
                className="rounded-full border border-transparent px-3 py-2 text-text-tertiary transition hover:bg-[#1A1C20] hover:text-white"
              >
                <Plus className="h-[18px] w-[18px]" />
              </button>
            </div>
          </>
        )}

        {activeCategory === "favorites" && (
          <SectionHeader
            icon={<Bookmark className="h-5 w-5 fill-red-500 text-red-500" />}
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
              className="rounded-lg border border-red-500/30 px-4 py-2 text-[13px] font-bold text-red-400 transition hover:bg-red-500/10"
            >
              휴지통 비우기
            </button>
          </div>
        )}

        <div className="mb-4 flex items-center gap-2 px-1 text-[13px] text-neutral-400">
          <CheckSquare className="h-4 w-4 text-neutral-400" />
          Ctrl 또는 Cmd를 누른 채 클릭하면 여러 항목을 선택할 수 있습니다.
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
                  onClick={(e) => handleCardClick(e, asset)}
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
                    setSelectedIds((prev) => new Set([...prev, asset.id]));
                    setToast("보드 선택 항목에 추가했습니다.");
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
                <Bookmark
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRefFavorite(asset.id);
                  }}
                  className={`h-5 w-5 ${
                    refFavorites.includes(asset.id) ? "fill-red-500 text-red-500" : "text-neutral-400"
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
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
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
      </main>

      <AnimatePresence>
        {selectedIds.size > 0 && (
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
              {isPopup ? (
                <button
                  onClick={() => onAcceptSelection?.(Array.from(selectedIds))}
                  className="flex items-center gap-2 rounded-md bg-[#E0A12E] px-6 py-1.5 text-[13px] font-bold text-bg-dark transition hover:bg-[#E0A12E]/90"
                >
                  선택 항목 가져오기
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setToast("선택 항목을 보드에 추가했습니다.")}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium text-text-secondary transition hover:bg-surface-primary hover:text-white"
                  >
                    <Folder className="h-4 w-4" />
                    보드 추가
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
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRefFavorite(previewImage.id)}
                    className={`rounded-lg border border-[#1F2329] bg-surface-primary p-2.5 transition hover:bg-[#111215] hover:text-white ${
                      refFavorites.includes(previewImage.id) ? "text-red-400" : "text-neutral-400"
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${refFavorites.includes(previewImage.id) ? "fill-red-400" : ""}`} />
                  </button>
                  <button
                    onClick={() => downloadAsset(previewImage)}
                    className="flex items-center gap-2 rounded-lg border border-[#1F2329] bg-surface-primary px-4 py-2.5 text-white transition hover:bg-[#111215]"
                  >
                    <Download className="h-4 w-4" />
                    다운로드
                  </button>
                </div>
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
  onClick,
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
  onClick: (e: React.MouseEvent) => void;
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

      {isFavorite && !isSelected && (
        <div className="absolute right-3 top-3 z-20 text-red-500">
          <Bookmark className="h-[22px] w-[22px] fill-red-500" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex translate-y-2 justify-center opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-[#2A2E36]/80 bg-[#1A1C20]/90 p-1.5 shadow-xl backdrop-blur-md">
          <ActionButton icon={<Plus className="h-3.5 w-3.5" />} title="보드 추가" onClick={onAdd} />
          <ActionButton icon={<LinkIcon className="h-3.5 w-3.5" />} title="프로젝트 연결" onClick={onLink} />
          <ActionButton
            icon={<Bookmark className={`h-3.5 w-3.5 ${isFavorite ? "fill-red-400 text-red-400" : ""}`} />}
            title="즐겨찾기"
            onClick={onFavorite}
          />
          <ActionButton icon={<Download className="h-3.5 w-3.5" />} title="다운로드" onClick={onDownload} />
          <span className="mx-1 h-4 w-px bg-[#2A2E36]" />
          <ActionButton icon={<MoreHorizontal className="h-3.5 w-3.5" />} title="더보기" />
        </div>
      </div>
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
