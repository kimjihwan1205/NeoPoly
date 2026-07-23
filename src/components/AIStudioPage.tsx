import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  ChevronRight,
  Clock,
  LayoutGrid,
  Paintbrush,
  Puzzle,
  Rotate3D,
  Star,
  Wand2,
} from "lucide-react";
import { DEFAULT_PROJECTS } from "./ProjectPage";

type StudioProject = {
  id: number;
  title: string;
  status: string;
  timeAgo: string;
  type: string;
  image: string;
  color: string;
};

const PROJECT_TIME_AGOS = [
  "10분 전",
  "1시간 전",
  "3시간 전",
  "5시간 전",
  "6시간 전",
  "1일 전",
  "2일 전",
  "3일 전",
];

const RECENT_PROJECTS: StudioProject[] = DEFAULT_PROJECTS.map((project, index) => ({
  id: project.id,
  title: project.name,
  status: project.status,
  timeAgo: PROJECT_TIME_AGOS[index] ?? "최근 수정",
  type: project.status,
  image: project.listImage || project.image || "",
  color: project.statusColor,
}));

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
  { label: "Board 열기", icon: LayoutGrid, page: "board" },
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
  const [toast, setToast] = useState("");
  const continueScrollRef = useRef<HTMLDivElement | null>(null);
  const continueDragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });
  const suppressProjectClickRef = useRef(false);

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

  const handleContinueDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const scroller = continueScrollRef.current;
    if (!scroller) return;

    continueDragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      moved: false,
    };
    scroller.setPointerCapture?.(event.pointerId);
  };

  const handleContinueDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = continueDragRef.current;
    const scroller = continueScrollRef.current;
    if (!drag.active || !scroller) return;

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) > 4) {
      drag.moved = true;
      event.preventDefault();
    }
    scroller.scrollLeft = drag.scrollLeft - deltaX;
  };

  const finishContinueDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = continueDragRef.current;
    const scroller = continueScrollRef.current;
    if (!drag.active) return;

    if (drag.moved) {
      suppressProjectClickRef.current = true;
      window.setTimeout(() => {
        suppressProjectClickRef.current = false;
      }, 0);
    }

    scroller?.releasePointerCapture?.(event.pointerId);
    continueDragRef.current = { ...drag, active: false };
  };

  const openProjectFromCard = (project: StudioProject) => {
    if (suppressProjectClickRef.current) return;
    onNavigate?.(routeForProject(project));
  };

  return (
    <div className="flex h-[calc(100dvh-60px)] w-full flex-1 flex-col overflow-hidden bg-[#050505] font-sans text-white lg:h-[calc(100dvh-76px)]">
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 2xl:px-8 min-[2200px]:px-10">
        <div className="mx-auto flex w-full max-w-[2560px] flex-col gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
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
                  className="group relative flex min-h-[240px] cursor-pointer flex-col overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D] px-5 py-5 text-left transition hover:border-[#3A404F] sm:aspect-[2/1] sm:min-h-0 sm:px-8"
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
                      <h2 className="mb-3 flex items-center gap-2 text-[20px] font-bold text-white sm:text-[22px]">
                        {card.title}
                        {card.badge && (
                          <span className="relative -top-[1px] rounded border border-[#E0A12E]/30 bg-[#E0A12E]/20 px-2 py-0.5 text-[11px] font-bold text-[#E0A12E]">
                            {card.badge}
                          </span>
                        )}
                      </h2>
                      <p className="max-w-[240px] text-[14px] leading-relaxed text-neutral-300 sm:max-w-[260px] sm:text-[16px]">
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
            <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-[#1F2329] pb-4 sm:flex-row sm:items-end">
              <div className="flex items-baseline gap-4">
                <h2 className="text-[20px] font-bold text-white">
                  Continue Working
                </h2>
                <span className="text-[14px] text-neutral-400">
                  이어서 작업하기
                </span>
              </div>
              <button
                onClick={() => onNavigate?.("projects")}
                className="flex items-center gap-1 text-[14px] text-neutral-400 transition hover:text-white"
              >
                모든 프로젝트
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={continueScrollRef}
              onPointerDown={handleContinueDragStart}
              onPointerMove={handleContinueDragMove}
              onPointerUp={finishContinueDrag}
              onPointerCancel={finishContinueDrag}
              className="custom-scrollbar flex cursor-grab select-none gap-5 overflow-x-auto pb-3 active:cursor-grabbing"
            >
              {RECENT_PROJECTS.map((project) => (
                <button
                  key={project.id}
                  onClick={() => openProjectFromCard(project)}
                  className="group flex min-h-[260px] w-[260px] shrink-0 flex-col overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D] text-left transition hover:border-[#3A404F]"
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
                        if (suppressProjectClickRef.current) return;
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
                    <div className="flex-1">
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
