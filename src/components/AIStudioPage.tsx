import React, { useEffect, useState } from "react";
import {
  Box,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  LayoutGrid,
  List,
  MoreHorizontal,
  Paintbrush,
  Puzzle,
  Rotate3D,
  Star,
  Wand2,
} from "lucide-react";

type StudioProject = {
  id: number;
  title: string;
  status: string;
  timeAgo: string;
  type: string;
  image: string;
  images: number;
  meshes: number;
  notes: number;
  color: string;
};

const RECENT_PROJECTS: StudioProject[] = [
  {
    id: 1,
    title: "하프 궁수",
    status: "In Progress",
    timeAgo: "10분 전 수정",
    type: "Image Generate",
    image: "/images/work_%201.png",
    images: 128,
    meshes: 24,
    notes: 8,
    color: "#facc15",
  },
  {
    id: 2,
    title: "오크 전사",
    status: "Modeling",
    timeAgo: "1시간 전 수정",
    type: "Modeling",
    image: "/images/work_%202.png",
    images: 96,
    meshes: 12,
    notes: 4,
    color: "#4ade80",
  },
  {
    id: 3,
    title: "기사 갑옷",
    status: "Turnaround",
    timeAgo: "3시간 전 수정",
    type: "Turnaround",
    image: "/images/work_%204.png",
    images: 64,
    meshes: 18,
    notes: 7,
    color: "#60a5fa",
  },
  {
    id: 4,
    title: "사이버 무기 세트",
    status: "Modular",
    timeAgo: "5시간 전 수정",
    type: "Modular Extract",
    image: "/images/work_%2016.png",
    images: 48,
    meshes: 32,
    notes: 6,
    color: "#facc15",
  },
  {
    id: 5,
    title: "고대 유적",
    status: "Concept",
    timeAgo: "6시간 전 수정",
    type: "Concept",
    image: "/images/work_%2013.png",
    images: 72,
    meshes: 15,
    notes: 9,
    color: "#60a5fa",
  },
  {
    id: 6,
    title: "로봇 빌런",
    status: "Image Gen",
    timeAgo: "1일 전 수정",
    type: "Image Generate",
    image: "/images/work_%2019.png",
    images: 36,
    meshes: 9,
    notes: 3,
    color: "#60a5fa",
  },
];

const WORKFLOW_CARDS = [
  {
    title: "Full Workflow",
    subtitle: "컨셉부터 3D 모델링까지 한 번에 이어서 작업합니다.",
    image: "/images/AI_studio_Main01.png",
    page: "full_workflow",
    badge: "추천",
  },
  {
    title: "이미지 생성",
    subtitle: "프롬프트와 레퍼런스를 기반으로 컨셉 이미지를 만듭니다.",
    image: "/images/AI_studio_Main02.png",
    page: "full_workflow_chat",
  },
  {
    title: "3D 모델 생성",
    subtitle: "업로드된 모델과 텍스처를 확인하고 3D 제작 단계를 진행합니다.",
    image: "/images/AI_studio_Main03.png",
    page: "modeling_generation",
  },
];

const QUICK_TOOLS = [
  { label: "레퍼런스 보드 열기", icon: LayoutGrid, page: "references" },
  { label: "프롬프트 빌더 열기", icon: Paintbrush, page: "full_workflow_chat" },
  { label: "이미지 생성하기", icon: Wand2, page: "full_workflow" },
  { label: "턴어라운드 생성", icon: Rotate3D, page: "turnaround" },
  { label: "모듈 추출 도구", icon: Puzzle, page: "turnaround" },
  { label: "리메시 도구", icon: Box, page: "modeling_generation" },
];

function routeForProject(project: StudioProject) {
  if (project.type.includes("Modeling")) return "modeling_generation";
  if (project.type.includes("Turnaround") || project.type.includes("Modular")) {
    return "turnaround";
  }
  if (project.type.includes("Image")) return "full_workflow_chat";
  return "full_workflow";
}

export default function AIStudioPage({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [starred, setStarred] = useState<Set<number>>(new Set([2]));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggleStar = (id: number) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-[calc(100vh-76px)] w-full flex-1 flex-col overflow-hidden bg-[#050505] font-sans text-white">
      <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto flex w-full max-w-[2006px] flex-col gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h1 className="text-[20px] font-bold text-white">
                어떤 방식으로 시작할까요?
              </h1>
              <button
                onClick={() => onNavigate?.("projects")}
                className="flex items-center gap-2 rounded-lg border border-[#2A2E36] bg-[#0A0B0D] px-4 py-2.5 text-[14px] text-neutral-300 transition hover:bg-[#141518]"
              >
                <Clock className="h-4 w-4" />
                최근 작업
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {WORKFLOW_CARDS.map((card) => (
                <button
                  key={card.title}
                  onClick={() => onNavigate?.(card.page)}
                  className="group relative flex aspect-[2/1] cursor-pointer flex-col overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D] px-8 py-5 text-left transition hover:border-[#3A404F]"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={card.image}
                    className="absolute right-[-5%] top-1/2 h-[120%] w-[75%] -translate-y-1/2 object-contain object-right transition duration-700 group-hover:scale-[1.01]"
                    alt={card.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <h2 className="mb-3 flex items-center gap-2 text-[22px] font-bold text-white">
                        {card.title}
                        {card.badge && (
                          <span className="relative -top-[1px] rounded border border-[#E0A12E]/30 bg-[#E0A12E]/20 px-2 py-0.5 text-[11px] font-bold text-[#E0A12E]">
                            {card.badge}
                          </span>
                        )}
                      </h2>
                      <p className="max-w-[260px] text-[14px] leading-relaxed text-neutral-400">
                        {card.subtitle}
                      </p>
                    </div>
                    <span className="mt-auto flex w-max items-center gap-2 rounded-lg border border-[#1F2329] bg-[#050505]/80 px-4 py-2 text-[14px] font-bold text-neutral-300 backdrop-blur transition group-hover:text-white">
                      시작하기
                      <ChevronRight className="h-4 w-4 text-[#E0A12E]" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-lg border border-[#1F2329] bg-[#0A0B0D] p-5 md:flex-row md:items-center">
            <div className="shrink-0 pr-4 text-[16px] font-bold text-white md:border-r md:border-[#1F2329] md:pr-8">
              Quick Tools
            </div>
            <div className="custom-scrollbar flex flex-wrap items-center gap-x-8 gap-y-4 overflow-x-auto pb-2 md:pb-0">
              {QUICK_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.label}
                    onClick={() => onNavigate?.(tool.page)}
                    className="group flex items-center gap-2 whitespace-nowrap text-neutral-400 transition hover:text-white"
                  >
                    <Icon className="h-[18px] w-[18px] transition group-hover:text-[#E0A12E]" />
                    <span className="text-[14px]">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-12">
            <div className="mb-6 flex items-end justify-between border-b border-[#1F2329] pb-4">
              <div className="flex items-baseline gap-4">
                <h2 className="text-[20px] font-bold text-white">
                  Continue Working
                </h2>
                <span className="text-[14px] text-neutral-400">
                  이어서 작업하기
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate?.("projects")}
                  className="flex items-center gap-1 text-[14px] text-neutral-400 transition hover:text-white"
                >
                  모든 프로젝트
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1 rounded-lg border border-[#1F2329] bg-[#141518] p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded p-1 ${
                      viewMode === "grid" ? "bg-[#2A2E36] text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded p-1 ${
                      viewMode === "list" ? "bg-[#2A2E36] text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
                  : "grid grid-cols-1 gap-3"
              }
            >
              {RECENT_PROJECTS.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onNavigate?.(routeForProject(project))}
                  className={`group overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D] text-left transition hover:border-[#3A404F] ${
                    viewMode === "list" ? "grid grid-cols-[160px_1fr] items-stretch" : "flex h-full flex-col"
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                    <img
                      referrerPolicy="no-referrer"
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/40 to-transparent" />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(project.id);
                      }}
                      className="absolute right-3 top-3 z-10 p-1 text-neutral-300 transition hover:text-[#E0A12E]"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          starred.has(project.id) ? "fill-[#E0A12E] text-[#E0A12E]" : ""
                        }`}
                      />
                    </span>
                    <div className="absolute inset-x-4 top-4 z-10">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-[12px] font-medium text-white">
                          {project.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-400">
                        {project.timeAgo}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col bg-[#0A0B0D] p-4">
                    <div className="mb-4 flex-1">
                      <h3 className="text-[16px] font-bold text-white">
                        {project.title}
                      </h3>
                      <div className="mt-4 flex items-center justify-between">
                        {[1, 2, 3, 4, 5, 6].map((_, index) => (
                          <div key={index} className="relative flex w-full items-center">
                            <div
                              className={`z-10 h-1.5 w-1.5 rounded-full ${
                                index <= 1 ? "bg-current" : "border border-[#2A2E36]"
                              }`}
                              style={{ color: project.color }}
                            />
                            {index < 5 && (
                              <div
                                className={`absolute left-1 h-px w-full ${
                                  index === 0 ? "bg-current/50" : "bg-[#2A2E36]"
                                }`}
                                style={{ color: project.color }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex shrink-0 items-center justify-between border-t border-[#1F2329] pt-4 text-[12px] text-neutral-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="h-[14px] w-[14px]" />
                          {project.images}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Box className="h-[14px] w-[14px]" />
                          {project.meshes}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <LayoutGrid className="h-[14px] w-[14px]" />
                          {project.notes}
                        </span>
                      </div>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setToast("프로젝트 메뉴를 열 준비가 되었습니다.");
                        }}
                        className="text-neutral-500 transition hover:text-white"
                      >
                        <MoreHorizontal className="h-[16px] w-[16px]" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-[80] rounded-lg border border-[#2A2E36] bg-[#111317] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {toast}
        </div>
      )}
    </div>
  );
}
