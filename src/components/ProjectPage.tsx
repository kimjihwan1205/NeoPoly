import React, { useState, useRef } from "react";
import {
  Plus,
  MoreHorizontal,
  Box,
  RefreshCw,
  ZoomIn,
  Hand,
  Rotate3D,
  Layers,
  MousePointer2,
  Play,
  Search,
  Settings,
  PenLine,
  Image as ImageIcon,
  BoxSelect,
  Maximize2,
  Download,
  Link2,
  LayoutTemplate,
  Share2,
  Info,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  RotateCcw,
  Grid3X3,
  Hammer,
  Upload,
  Sparkles,
  Paintbrush,
  Palette,
} from "lucide-react";
import { motion } from "motion/react";
import NewProjectModal from "./NewProjectModal";

interface ProjectPageProps {
  onNavigate?: (page: string) => void;
  isPopup?: boolean;
  onSelectProject?: (projectId: number) => void;
}

const COLORS = {
  bg: "#0B0D10",
  panel: "#111317",
  panel2: "#15181D",
  border: "#22252B",
  softBorder: "#1A1D23",
  gold: "#E0A12E",
  goldHover: "#F0B43A",
  text: "#F5F5F5",
  muted: "#9A9DA3",
  dim: "#6E737B",
  blue: "#4C88D9",
  green: "#6FAF52",
  purple: "#A36BFF",
  orange: "#E0A12E",
};

const PROJECTS = [
  {
    id: 1,
    name: "오크",
    status: "Modeling Completed",
    statusColor: COLORS.blue,
    date: "2024.05.20",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%202.png",
  },
  {
    id: 2,
    name: "엘프궁수",
    status: "Rigging",
    statusColor: COLORS.purple,
    date: "2024.05.18",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png",
  },
  {
    id: 3,
    name: "와이번",
    status: "Published",
    statusColor: COLORS.green,
    date: "2024.05.10",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%203.png",
  },
  {
    id: 4,
    name: "공룡",
    status: "Draft",
    statusColor: COLORS.dim,
    date: "2024.05.08",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%204.png",
  },
  {
    id: 5,
    name: "스트릿 패션",
    status: "In Progress",
    statusColor: "#2DD4BF",
    date: "2024.05.05",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%205.png",
  },
  {
    id: 6,
    name: "코뿔소 전사",
    status: "Concept",
    statusColor: "#B8BBC2",
    date: "2024.05.01",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%206.png",
  },
  {
    id: 7,
    name: "MY POSCO 01",
    status: "Concept",
    statusColor: "#B8BBC2",
    date: "2024.04.28",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%207.png",
  },
];

const WORKFLOW_STEPS = [
  {
    title: "Concept",
    subtitle: "컨셉",
    icon: ImageIcon,
    active: true,
    main: true,
  },
  { title: "Image Gen", subtitle: "이미지 생성", icon: ImageIcon, main: true },
  {
    title: "Turnaround",
    subtitle: "(턴어라운드)",
    icon: RotateCcw,
    main: false,
  },
  { title: "Modular", subtitle: "(모듈화)", icon: Grid3X3, main: false },
  { title: "Modeling", subtitle: "모델링", icon: Box, main: true },
  { title: "Polish", subtitle: "(폴리시)", icon: Sparkles, main: false },
  { title: "Remesh", subtitle: "(리메시)", icon: Layers, main: false },
  { title: "Texture", subtitle: "(텍스쳐)", icon: Paintbrush, main: false },
  { title: "Material", subtitle: "(재질)", icon: Palette, main: false },
  { title: "Finish", subtitle: "피니쉬", icon: CheckCircle2, main: true },
];

const THUMBNAILS = [
  "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png",
  "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%205.png",
  "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%207.png",
  "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%204.png",
  "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%202.png",
  "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%203.png",
];

function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export default function ProjectPage({
  onNavigate,
  isPopup,
  onSelectProject,
}: ProjectPageProps) {
  const [activeProject, setActiveProject] = useState(PROJECTS[0].id);
  const [infoTab, setInfoTab] = useState<"modeling" | "texture" | "rigging">(
    "modeling",
  );
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const boardScrollRef = useRef<HTMLDivElement>(null);

  const scrollBoard = (direction: 'left' | 'right') => {
    if (boardScrollRef.current) {
      boardScrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const activeProjData =
    PROJECTS.find((p) => p.id === activeProject) || PROJECTS[0];

  return (
    <div
      className={`flex bg-bg-dark text-[#F5F5F5] font-sans antialiased ${isPopup ? "h-full" : "min-h-[calc(100vh-76px)]"}`}
    >
      {/* Sidebar */}
      <aside
        className={`sticky top-0 ${isPopup ? "h-full" : "h-[calc(100vh-76px)] top-[76px]"} w-[350px] shrink-0 overflow-y-auto border-r border-[#181A1F] bg-bg-dark px-5 py-6 scrollbar-thin scrollbar-thumb-white/10 hidden lg:block`}
      >
        <div className="mb-6">
          <h2 className="text-[22px] font-bold leading-[30px] text-[#F5F5F5] mb-5">
            내 프로젝트
          </h2>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl border border-[#3A404F]/60 bg-[#15161A] hover:bg-[#22252B] hover:border-[#E0A12E]/50 text-[#E0A12E] shadow-sm transition-all font-bold text-[15px] tracking-wide"
          >
            <Plus className="w-[18px] h-[18px]" />
            <span>새 프로젝트</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 pb-2">
          {PROJECTS.map((project) => {
            const active = project.id === activeProject;
            return (
              <button
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`group relative flex items-center h-[118px] w-full overflow-hidden rounded-xl border text-left transition duration-200 ${
                  active
                    ? "border-[#E0A12E] bg-[linear-gradient(90deg,rgba(224,161,46,0.14),rgba(224,161,46,0.035))] shadow-[0_0_24px_rgba(224,161,46,0.08)]"
                    : "border-transparent bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] hover:border-[#2A2E36] hover:bg-[linear-gradient(90deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))]"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 bottom-0 w-[6px] z-20 transition-colors duration-300 ${active ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}
                  style={{
                    backgroundColor: active ? "#E0A12E" : project.statusColor,
                  }}
                />

                <div className="relative z-10 flex-1 pl-[24px] min-w-0 pr-[100px]">
                  <div className="truncate text-[18px] font-bold leading-[24px] text-[#F5F5F5]">
                    {project.name}
                  </div>
                  <div
                    className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold leading-[18px]"
                    style={{ color: project.statusColor }}
                  >
                    <StatusDot color={project.statusColor} />
                    {project.status}
                  </div>
                  <div className="mt-2 text-[13px] leading-[18px] text-neutral-400">
                    {project.date}
                  </div>
                </div>

                <div
                  className="absolute right-0 top-0 bottom-0 w-[140px] z-0 pointer-events-none origin-right"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 45%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 45%)",
                  }}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={project.image}
                    alt={project.name}
                    className={`h-full w-full object-cover transition-all duration-300 ${active ? "" : "brightness-[0.4] grayscale-[50%] group-hover:brightness-[0.7] group-hover:grayscale-[20%]"}`}
                  />
                </div>

                <MoreHorizontal className="absolute right-2.5 top-2.5 h-6 w-6 rounded-md bg-black/40 p-1 text-neutral-300 opacity-0 transition hover:bg-black/60 group-hover:opacity-100 z-20" />
              </button>
            );
          })}
        </div>
      </aside>

      <main
        className={`min-w-0 flex-1 px-6 py-6 overflow-y-auto ${isPopup ? "h-full pb-24" : "h-[calc(100vh-76px)]"}`}
      >
        <div className="w-full space-y-2">
          {/* Project Header */}
          <section className="rounded-xl overflow-hidden bg-[linear-gradient(90deg,rgba(224,161,46,0.06),rgba(255,255,255,0.02),rgba(0,0,0,0))] border border-[#181A1F]/40 relative">
            <div className="grid grid-cols-1 md:grid-cols-[1fr] lg:grid-cols-[1fr] xl:grid-cols-[200px_1fr_280px] 2xl:grid-cols-[240px_1fr_320px] items-stretch min-h-[140px]">
              <img
                referrerPolicy="no-referrer"
                src={activeProjData.image}
                alt="project"
                className="h-[140px] xl:h-full w-full object-cover shrink-0"
              />

              <div className="p-5 xl:py-5 xl:px-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-[32px] font-bold leading-[38px] text-[#F5F5F5]">
                    {activeProjData.name}
                  </h1>
                  <button className="text-neutral-400 hover:text-[#E0A12E] transition-colors">
                    <PenLine className="h-5 w-5" />
                  </button>
                  <span
                    className="flex h-7 items-center rounded-md px-3 text-[13px] font-semibold"
                    style={{
                      color: activeProjData.statusColor,
                      backgroundColor: `${activeProjData.statusColor}26`,
                    }}
                  >
                    {activeProjData.status}
                  </span>
                </div>
                <p className="mt-2.5 max-w-[560px] text-[14px] leading-6 text-neutral-300">
                  {activeProjData.name} 캐릭터 제작 프로젝트입니다.
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {["#캐릭터", "#판타지", "#모델링"].map((tag) => (
                    <span
                      key={tag}
                      className="flex h-[26px] items-center rounded-md border border-[#22252B] bg-[#181A1F] px-2 text-[12px] text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <button className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#22252B] bg-[#181A1F] text-neutral-300">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 xl:py-4 xl:pr-6 space-y-4 text-[14px] w-full border-t xl:border-none border-[#181A1F] flex flex-col justify-center">
                <div className="flex justify-between">
                  <span className="text-neutral-400">생성일</span>
                  <span className="font-medium text-[#F5F5F5]">
                    {activeProjData.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">마지막 수정</span>
                  <span className="font-medium text-[#F5F5F5]">2024.05.24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">프로젝트 멤버</span>
                  <div className="flex items-center">
                    {[1, 2, 3].map((n) => (
                      <img
                        key={n}
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n + 10}`}
                        alt="member"
                        referrerPolicy="no-referrer"
                        className="-ml-2 h-7 w-7 rounded-full border-2 border-[#111317] object-cover first:ml-0"
                      />
                    ))}
                    <span className="ml-2 rounded-full bg-[#2A2E36] px-2 py-0.5 text-[11px] font-medium text-neutral-300">
                      +2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Workflow Bar */}
          <section className="rounded-xl bg-[#151618] border border-[#181A1F] px-8 py-3 overflow-x-auto hide-scrollbar">
            <div className="flex items-center justify-between min-w-[860px]">
              {WORKFLOW_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isMain = step.main;
                return (
                  <React.Fragment key={step.title}>
                    <div
                      className={`flex flex-col items-center text-center group cursor-pointer ${isMain ? "min-w-[80px]" : "min-w-[64px]"}`}
                    >
                      <div
                        className={`transition ${step.active ? "text-[#E0A12E]" : "text-neutral-300 group-hover:text-[#E0A12E]"}`}
                      >
                        <Icon className={isMain ? "h-6 w-6" : "h-5 w-5"} />
                      </div>
                      {isMain ? (
                        <>
                          <div
                            className={`mt-2 text-[14px] font-semibold ${step.active ? "text-[#E0A12E]" : "text-neutral-300"}`}
                          >
                            {step.title}
                          </div>
                          <div className="mt-0.5 text-[11px] text-neutral-400">
                            {step.subtitle}
                          </div>
                        </>
                      ) : (
                        <div
                          className={`mt-1.5 text-[11px] font-medium ${step.active ? "text-[#E0A12E]" : "text-neutral-400"}`}
                        >
                          {step.subtitle}
                        </div>
                      )}
                    </div>
                    {index < WORKFLOW_STEPS.length - 1 && (
                      <div className="mx-2 h-px flex-1 bg-[#2A2E36]" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          {/* Grid Layout below */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_400px] gap-2">
            {/* Left large col */}
            <div className="flex flex-col gap-2">
              {/* Viewer Panel */}
              <section className="rounded-xl bg-[#151618] border border-[#181A1F] p-4 flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[16px] font-semibold text-[#F5F5F5]">
                    모델링 뷰어
                    <Info className="h-4 w-4 text-neutral-400 cursor-pointer hover:text-neutral-400" />
                  </div>
                  <button className="rounded-md border border-[#22252B] bg-[#15181D] px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-[#1A1D23] transition-colors">
                    Shaded
                  </button>
                </div>

                <div className="relative h-[500px] overflow-hidden rounded-xl border border-[#181A1F] bg-[#050505] flex items-center justify-center">
                  <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
                    {[RotateCcw, Hand, ZoomIn, Grid3X3, Maximize2].map(
                      (Icon, index) => (
                        <button
                          key={index}
                          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/5 bg-white/[0.04] text-neutral-300 transition hover:bg-white/[0.08] hover:text-[#F5F5F5]"
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      ),
                    )}
                  </div>

                  <img
                    referrerPolicy="no-referrer"
                    src={activeProjData.image}
                    alt="viewport"
                    className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] scale-110"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),rgba(0,0,0,0.22))] pointer-events-none" />
                </div>

                <div className="mt-4 flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
                  {THUMBNAILS.map((thumb, index) => (
                    <button
                      key={index}
                      className={`h-[68px] w-[86px] shrink-0 overflow-hidden rounded-lg border-2 transition ${index === 0 ? "border-[#E0A12E]" : "border-[#22252B] hover:border-[#6E737B] opacity-60 hover:opacity-100"}`}
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src={thumb}
                        alt="thumb"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </section>

              {/* Refs Grid */}
              <div className="grid gap-2">
                {/* Reference Board */}
                <div className="rounded-xl bg-[#151618] border border-[#181A1F] p-5 h-[260px] flex flex-col relative">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-[#F5F5F5]">
                      레퍼런스 보드
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => scrollBoard("left")}
                        className="p-1 rounded-md text-neutral-400 hover:text-neutral-300 hover:bg-[#1A1D23] transition-colors border border-transparent hover:border-[#22252B]"
                      >
                        <ChevronLeft className="w-[14px] h-[14px]" />
                      </button>
                      <button
                        onClick={() => scrollBoard("right")}
                        className="p-1 rounded-md text-neutral-400 hover:text-neutral-300 hover:bg-[#1A1D23] transition-colors border border-transparent hover:border-[#22252B]"
                      >
                        <ChevronRight className="w-[14px] h-[14px]" />
                      </button>
                      <div className="w-px h-3 bg-[#2A2E36] mx-1"></div>
                      <button
                        onClick={() => {
                          if (onNavigate) onNavigate("references");
                        }}
                        className="text-[13px] font-medium text-[#4C88D9] hover:text-[#5B9FE6] transition-colors"
                      >
                        모두 보기
                      </button>
                    </div>
                  </div>
                  <div
                    ref={boardScrollRef}
                    className="flex gap-2 flex-1 min-h-0 mt-auto overflow-x-auto hide-scrollbar scroll-smooth"
                  >
                    {THUMBNAILS.map((thumb, index) => (
                      <div
                        key={index}
                        className="h-full min-w-[140px] shrink-0 min-h-0 overflow-hidden rounded-lg bg-[#050505] border border-[#181A1F]"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={thumb}
                          alt="reference"
                          className="h-full w-full object-cover transition duration-300 hover:scale-[1.007] cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Aside (360px wide on desktop) */}
            <aside className="space-y-2 flex flex-col">
              {/* Model Info */}
              <div className="rounded-xl bg-[#151618] border border-[#181A1F] p-6 flex flex-col">
                <div className="flex bg-[#050505] p-1 rounded-lg border border-[#181A1F] mb-5">
                  <button
                    onClick={() => setInfoTab("modeling")}
                    className={`flex-1 py-1.5 text-[13px] font-bold rounded-md transition-colors ${infoTab === "modeling" ? "bg-[#181A1F] text-[#F5F5F5] border border-[#22252B] shadow-sm" : "text-neutral-400 hover:text-neutral-400 border border-transparent"}`}
                  >
                    모델링
                  </button>
                  <button
                    onClick={() => setInfoTab("texture")}
                    className={`flex-1 py-1.5 text-[13px] font-bold rounded-md transition-colors ${infoTab === "texture" ? "bg-[#181A1F] text-[#F5F5F5] border border-[#22252B] shadow-sm" : "text-neutral-400 hover:text-neutral-400 border border-transparent"}`}
                  >
                    텍스쳐
                  </button>
                  <button
                    onClick={() => setInfoTab("rigging")}
                    className={`flex-1 py-1.5 text-[13px] font-bold rounded-md transition-colors ${infoTab === "rigging" ? "bg-[#181A1F] text-[#F5F5F5] border border-[#22252B] shadow-sm" : "text-neutral-400 hover:text-neutral-400 border border-transparent"}`}
                  >
                    애니/리깅
                  </button>
                </div>

                <div className="space-y-4 text-[14px]">
                  {infoTab === "modeling" &&
                    [
                      ["폴리곤 수", "128,540"],
                      ["버텍스 수", "96,312"],
                      ["파츠 분할", "8 Parts"],
                      ["UV 맵핑", "Unwrapped"],
                      ["파일 포맷", ".fbx, .obj, .blend"],
                      ["파일 크기", "78.6 MB"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-neutral-400 font-medium">
                          {label}
                        </span>
                        <span className="font-semibold text-[#F5F5F5]">
                          {value}
                        </span>
                      </div>
                    ))}

                  {infoTab === "texture" &&
                    [
                      ["텍스쳐 해상도", "4K (4096x4096)"],
                      ["PBR 모델", "Metallic/Roughness"],
                      ["Albedo Map", "포함"],
                      ["Normal Map", "포함 (DirectX)"],
                      ["Ambient Occlusion", "포함"],
                      ["Opacity Map", "미포함"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-neutral-400 font-medium">
                          {label}
                        </span>
                        <span className="font-semibold text-[#F5F5F5]">
                          {value}
                        </span>
                      </div>
                    ))}

                  {infoTab === "rigging" &&
                    [
                      ["리깅 포즈", "A-Pose"],
                      ["Base Bone 수", "102 Bones"],
                      ["IK/FK 컨트롤러", "적용됨 (팔/다리)"],
                      ["페이셜 (BlendShape)", "52 Base Shapes"],
                      ["애니메이션 클립", "Idle, Walk, Run 포함"],
                      ["엔진 호환", "Unreal Engine 5.x"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-neutral-400 font-medium">
                          {label}
                        </span>
                        <span className="font-semibold text-[#F5F5F5]">
                          {value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Note Card */}
              <div className="rounded-xl bg-[#151618] border border-[#181A1F] p-6 flex flex-col flex-1">
                <div className="mb-5 flex items-center gap-2">
                  <h3 className="text-[16px] font-semibold text-[#F5F5F5]">
                    노트
                  </h3>
                  <PenLine className="h-[14px] w-[14px] text-neutral-400" />
                </div>

                <div className="space-y-2 text-[14px] leading-6 text-neutral-300">
                  <div>
                    <div className="mb-2 font-semibold text-[#F5F5F5] text-[13px]">
                      컨셉 키워드
                    </div>
                    <ul className="list-none space-y-1.5 text-neutral-300 text-[13px]">
                      <li className="flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">•</span>거친
                        야성미
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">•</span>무거운
                        갑옷과 가죽
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">•</span>둔기,
                        도끼 사용
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">•</span>부족의
                        전사
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-2 font-semibold text-[#F5F5F5] text-[13px]">
                      참고사항
                    </div>
                    <ul className="list-none space-y-1.5 text-neutral-300 text-[13px]">
                      <li className="flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">•</span>피부는
                        녹색 계열
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">•</span>흉터와
                        문신 디테일 추가
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">•</span>큰
                        체구와 근육 강조
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-2 font-semibold text-[#F5F5F5] text-[13px]">
                      작업 메모
                    </div>
                    <div className="rounded-lg border border-[#22252B] bg-[#050505] p-4 text-neutral-300 text-[13px] relative min-h-[90px]">
                      <div className="text-neutral-400 font-sans mb-1">6/1</div>
                      <div className="text-neutral-300">
                        초기 컨셉 방향 검토 완료.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <button className="flex h-10 w-full items-center justify-between rounded-lg border border-[#22252B] bg-[#15181D] px-4 text-[13px] font-medium text-neutral-400 transition hover:bg-[#1A1D23] hover:text-[#F5F5F5] group">
                    노트 전체 보기
                    <ChevronRight className="h-[14px] w-[14px] transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      {/* Floating Action Bar */}
      {isPopup && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-[#1A1C20] border border-[#2A2E36] rounded-[12px] p-2 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-50 gap-4"
        >
          <span className="text-[#F5F5F5] font-semibold text-[14px]">
            {activeProjData.name} 프로젝트를 이어서 진행합니다.
          </span>
          <div className="h-5 w-[1px] bg-[#2A2E36]" />
          <button
            onClick={() => onSelectProject && onSelectProject(activeProject)}
            className="flex items-center gap-2 bg-[#E0A12E] hover:bg-[#F0B43A] text-black px-5 py-2.5 rounded-lg text-[14px] font-bold transition-all shadow-[0_0_15px_rgba(224,161,46,0.3)]"
          >
            시작하기
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
