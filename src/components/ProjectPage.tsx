import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Grid3X3,
  Hand,
  Image as ImageIcon,
  Info,
  Layers,
  Link2,
  Maximize2,
  MoreHorizontal,
  Paintbrush,
  Palette,
  PenLine,
  Plus,
  Rotate3D,
  RotateCcw,
  Share2,
  Sparkles,
  ZoomIn,
} from "lucide-react";
import { motion } from "motion/react";
import NewProjectModal from "./NewProjectModal";

interface ProjectPageProps {
  onNavigate?: (page: string) => void;
  isPopup?: boolean;
  onSelectProject?: (projectId: number) => void;
}

type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
  statusColor: string;
  date: string;
  image?: string;
  tags: string[];
  linkedNoteIds?: number[];
  linkedReferenceIds?: number[];
};

const COLORS = {
  gold: "#E0A12E",
  blue: "#4C88D9",
  green: "#6FAF52",
  purple: "#A36BFF",
  teal: "#2DD4BF",
  dim: "#8A8F98",
};

const STORAGE_KEY = "neopoly_projects_v2";

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    name: "하프 궁수",
    description: "숲과 금속 장비를 기반으로 한 캐릭터 제작 프로젝트",
    status: "Image Gen",
    statusColor: COLORS.blue,
    date: "2024.05.20",
    image: "/images/work_%201.png",
    tags: ["#캐릭터", "#궁수", "#컨셉"],
  },
  {
    id: 2,
    name: "오크 전사",
    description: "턴어라운드, 장비 모듈화, 3D 모델 확인까지 진행 중",
    status: "Modeling",
    statusColor: COLORS.green,
    date: "2024.05.19",
    image: "/images/orc/orc_render_reference.png",
    tags: ["#오크", "#전사", "#모델링"],
  },
  {
    id: 3,
    name: "기사 갑옷",
    description: "금속 재질과 장식 구조를 정리하는 프롭 프로젝트",
    status: "Turnaround",
    statusColor: COLORS.purple,
    date: "2024.05.18",
    image: "/images/work_%204.png",
    tags: ["#갑옷", "#프롭", "#레퍼런스"],
  },
  {
    id: 4,
    name: "고대 유적",
    description: "배경 구조와 조명 무드를 정리하는 환경 프로젝트",
    status: "Concept",
    statusColor: COLORS.teal,
    date: "2024.05.15",
    image: "/images/work_%2013.png",
    tags: ["#배경", "#유적", "#환경"],
  },
  {
    id: 5,
    name: "사이버 무기 세트",
    description: "모듈형 장비와 무기 파츠를 정리하는 제작 보드",
    status: "Modular",
    statusColor: COLORS.gold,
    date: "2024.05.11",
    image: "/images/work_%2016.png",
    tags: ["#무기", "#모듈", "#프롭"],
  },
];

const WORKFLOW_STEPS = [
  { title: "Concept", label: "컨셉", icon: ImageIcon, page: "full_workflow" },
  { title: "Image Gen", label: "이미지 생성", icon: Sparkles, page: "full_workflow" },
  { title: "Turnaround", label: "턴어라운드", icon: RotateCcw, page: "turnaround" },
  { title: "Modular", label: "모듈화", icon: Grid3X3, page: "turnaround" },
  { title: "Modeling", label: "모델링", icon: Box, page: "modeling_generation" },
  { title: "Polish", label: "폴리시", icon: Sparkles, page: "modeling_generation" },
  { title: "Remesh", label: "리메시", icon: Layers, page: "modeling_generation" },
  { title: "Texture", label: "텍스처", icon: Paintbrush, page: "modeling_generation" },
  { title: "Material", label: "재질", icon: Palette, page: "modeling_generation" },
  { title: "Finish", label: "완료", icon: CheckCircle2, page: "modeling_generation" },
];

const DEFAULT_THUMBS = [
  "/images/work_%201.png",
  "/images/work_%204.png",
  "/images/work_%2013.png",
  "/images/work_%2016.png",
  "/images/work_%2022.png",
  "/images/work_48.png",
];

const ORC_THUMBS = [
  "/images/orc/orc_render_reference.png",
  "/images/orc/orc_2D_front.png",
  "/images/orc/orc_2D_45.png",
  "/images/orc/orc_2D_side.png",
  "/images/orc/orc_2D_back.png",
  "/images/orc/orc_default_item01.png",
  "/images/orc/orc_default_item02.png",
];

const NOTE_PREVIEWS: Record<number, string> = {
  1: "/images/work_%201.png",
  4: "/images/orc/orc_2D_front.png",
  5: "/images/work_%2013.png",
};

const REFERENCE_PREVIEWS: Record<number, string> = {
  1: "/images/orc/orc_render_reference.png",
  2: "/images/orc/orc_2D_front.png",
  3: "/images/orc/orc_default_item01.png",
  4: "/images/work_%2016.png",
};

function today() {
  return new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PROJECTS;
    const parsed = JSON.parse(saved) as Project[];
    if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_PROJECTS;
    return parsed.map((project) =>
      project.id === 2
        ? { ...project, image: "/images/orc/orc_render_reference.png" }
        : project,
    );
  } catch {
    return DEFAULT_PROJECTS;
  }
}

function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function EmptyProjectImage({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center border border-dashed border-[#2A2E36] bg-[#08090B] ${
        compact ? "text-[11px]" : "text-[13px]"
      } text-neutral-500`}
    >
      <div className="flex flex-col items-center gap-2">
        <ImageIcon className={compact ? "h-4 w-4" : "h-6 w-6"} />
        <span>이미지 없음</span>
      </div>
    </div>
  );
}

export default function ProjectPage({
  onNavigate,
  isPopup,
  onSelectProject,
}: ProjectPageProps) {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [activeProject, setActiveProject] = useState(() => loadProjects()[0].id);
  const [activeStep, setActiveStep] = useState("Modeling");
  const [infoTab, setInfoTab] = useState<"modeling" | "texture" | "rigging">(
    "modeling",
  );
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [toast, setToast] = useState("");
  const boardScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    setSelectedThumb(0);
  }, [activeProject]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeProjData =
    projects.find((project) => project.id === activeProject) || projects[0];

  const linkedImages = useMemo(() => {
    const noteImages =
      activeProjData?.linkedNoteIds?.map((id) => NOTE_PREVIEWS[id]).filter(Boolean) || [];
    const referenceImages =
      activeProjData?.linkedReferenceIds
        ?.map((id) => REFERENCE_PREVIEWS[id])
        .filter(Boolean) || [];
    return Array.from(new Set([...noteImages, ...referenceImages]));
  }, [activeProjData]);

  const hasProjectImage = Boolean(activeProjData?.image);
  const thumbs = useMemo(() => {
    if (!activeProjData?.image) return [];
    const base = activeProjData.name.includes("오크") ? ORC_THUMBS : DEFAULT_THUMBS;
    return Array.from(new Set([activeProjData.image, ...base].filter(Boolean)));
  }, [activeProjData]);

  const boardImages = linkedImages.length > 0 ? linkedImages : thumbs;
  const viewerImage = hasProjectImage ? thumbs[selectedThumb] || activeProjData.image : "";

  const scrollBoard = (direction: "left" | "right") => {
    boardScrollRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  const handleCreateProject = (
    name: string,
    template?: string | null,
    description?: string,
    links?: { noteIds: number[]; referenceIds: number[] },
  ) => {
    const next: Project = {
      id: Date.now(),
      name,
      description: description || "새 제작 워크플로우를 시작했습니다.",
      status: template === "blank" ? "Concept" : "Image Gen",
      statusColor: template === "prop" ? COLORS.purple : COLORS.gold,
      date: today(),
      image: "",
      linkedNoteIds: links?.noteIds || [],
      linkedReferenceIds: links?.referenceIds || [],
      tags:
        template === "prop"
          ? ["#프롭", "#모듈", "#레퍼런스"]
          : template === "blank"
            ? ["#컨셉", "#아이디어"]
            : ["#캐릭터", "#워크플로우", "#모델링"],
    };
    setProjects((prev) => [next, ...prev]);
    setActiveProject(next.id);
    setActiveStep("Concept");
    setToast("새 프로젝트가 추가되었습니다.");
  };

  const commitRename = () => {
    const nextName = draftName.trim();
    if (!nextName) {
      setRenaming(false);
      return;
    }
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProject ? { ...project, name: nextName } : project,
      ),
    );
    setRenaming(false);
    setToast("프로젝트 이름을 저장했습니다.");
  };

  const addTag = () => {
    const value = window.prompt("추가할 태그를 입력하세요.");
    if (!value?.trim()) return;
    const tag = value.trim().startsWith("#") ? value.trim() : `#${value.trim()}`;
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProject && !project.tags.includes(tag)
          ? { ...project, tags: [...project.tags, tag] }
          : project,
      ),
    );
    setToast("태그를 추가했습니다.");
  };

  return (
    <div
      className={`flex bg-bg-dark text-[#F5F5F5] font-sans antialiased ${
        isPopup ? "h-full" : "min-h-[calc(100vh-76px)]"
      }`}
    >
      <aside
        className={`hidden w-[350px] shrink-0 overflow-y-auto border-r border-[#181A1F] bg-bg-dark px-5 py-6 lg:block ${
          isPopup ? "h-full" : "sticky top-[76px] h-[calc(100vh-76px)]"
        }`}
      >
        <div className="mb-6">
          <h2 className="mb-5 text-[22px] font-bold text-[#F5F5F5]">
            내 프로젝트
          </h2>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#3A404F]/60 bg-[#15161A] py-3 text-[15px] font-bold text-[#E0A12E] transition hover:border-[#E0A12E]/50 hover:bg-[#22252B]"
          >
            <Plus className="h-[18px] w-[18px]" />
            새 프로젝트
          </button>
        </div>

        <div className="flex flex-col gap-3 pb-2">
          {projects.map((project) => {
            const active = project.id === activeProject;
            return (
              <button
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`group relative flex h-[118px] w-full items-center overflow-hidden rounded-lg border text-left transition ${
                  active
                    ? "border-[#E0A12E] bg-[#E0A12E]/10"
                    : "border-transparent bg-white/[0.035] hover:border-[#2A2E36] hover:bg-white/[0.06]"
                }`}
              >
                <span
                  className="absolute bottom-0 left-0 top-0 z-20 w-[6px]"
                  style={{
                    backgroundColor: active ? COLORS.gold : project.statusColor,
                  }}
                />
                <div className="relative z-10 min-w-0 flex-1 pl-6 pr-[100px]">
                  <div className="truncate text-[18px] font-bold text-[#F5F5F5]">
                    {project.name}
                  </div>
                  <div
                    className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold"
                    style={{ color: project.statusColor }}
                  >
                    <StatusDot color={project.statusColor} />
                    {project.status}
                  </div>
                  <div className="mt-2 text-[13px] text-neutral-400">
                    {project.date}
                  </div>
                </div>
                <div
                  className="absolute bottom-0 right-0 top-0 z-0 w-[140px]"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 45%)",
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 45%)",
                  }}
                >
                  {project.image ? (
                    <img
                      referrerPolicy="no-referrer"
                      src={project.image}
                      alt={project.name}
                      className={`h-full w-full object-cover transition ${
                        active
                          ? ""
                          : "brightness-[0.45] grayscale-[45%] group-hover:brightness-[0.75]"
                      }`}
                    />
                  ) : (
                    <EmptyProjectImage compact />
                  )}
                </div>
                <MoreHorizontal className="absolute right-2.5 top-2.5 z-20 h-6 w-6 rounded-md bg-black/40 p-1 text-neutral-300 opacity-0 transition group-hover:opacity-100" />
              </button>
            );
          })}
        </div>
      </aside>

      <main
        className={`min-w-0 flex-1 overflow-y-auto px-6 py-6 ${
          isPopup ? "h-full pb-24" : "h-[calc(100vh-76px)]"
        }`}
      >
        <div className="w-full space-y-2">
          <section className="overflow-hidden rounded-lg border border-[#181A1F]/80 bg-[#111317]">
            <div className="grid min-h-[140px] grid-cols-1 xl:grid-cols-[220px_1fr_320px]">
              <div className="h-[150px] w-full overflow-hidden xl:h-full">
                {activeProjData.image ? (
                  <img
                    referrerPolicy="no-referrer"
                    src={activeProjData.image}
                    alt={activeProjData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <EmptyProjectImage />
                )}
              </div>

              <div className="flex flex-col justify-center p-5 xl:px-6">
                <div className="flex flex-wrap items-center gap-3">
                  {renaming ? (
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setRenaming(false);
                      }}
                      className="h-11 min-w-[260px] rounded-lg border border-[#E0A12E]/50 bg-[#08090B] px-3 text-[26px] font-bold text-white outline-none"
                      autoFocus
                    />
                  ) : (
                    <h1 className="text-[32px] font-bold leading-[38px] text-[#F5F5F5]">
                      {activeProjData.name}
                    </h1>
                  )}
                  <button
                    onClick={() => {
                      setDraftName(activeProjData.name);
                      setRenaming(true);
                    }}
                    className="text-neutral-400 transition hover:text-[#E0A12E]"
                    title="프로젝트 이름 수정"
                  >
                    <PenLine className="h-5 w-5" />
                  </button>
                  <span
                    className="flex h-7 items-center rounded-md px-3 text-[13px] font-semibold"
                    style={{
                      color: activeProjData.statusColor,
                      backgroundColor: `${activeProjData.statusColor}24`,
                    }}
                  >
                    {activeProjData.status}
                  </span>
                </div>
                <p className="mt-2.5 max-w-[640px] text-[14px] leading-6 text-neutral-300">
                  {activeProjData.description}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {activeProjData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex h-[26px] items-center rounded-md border border-[#22252B] bg-[#181A1F] px-2 text-[12px] text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <button
                    onClick={addTag}
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#22252B] bg-[#181A1F] text-neutral-300 transition hover:text-white"
                    title="태그 추가"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 border-t border-[#181A1F] p-5 text-[14px] xl:border-none">
                <div className="flex justify-between">
                  <span className="text-neutral-400">생성일</span>
                  <span className="font-medium text-[#F5F5F5]">
                    {activeProjData.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">마지막 수정</span>
                  <span className="font-medium text-[#F5F5F5]">{today()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">공유</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setToast("공유 링크를 준비했습니다.")}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-[#2A2E36] bg-[#15181D] text-neutral-400 hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setToast("프로젝트 정보를 복사했습니다.")}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-[#2A2E36] bg-[#15181D] text-neutral-400 hover:text-white"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-x-auto rounded-lg border border-[#181A1F] bg-[#151618] px-8 py-3">
            <div className="flex min-w-[900px] items-center justify-between">
              {WORKFLOW_STEPS.map((step, index) => {
                const Icon = step.icon;
                const active = step.title === activeStep;
                return (
                  <React.Fragment key={step.title}>
                    <button
                      onClick={() => {
                        setActiveStep(step.title);
                        onNavigate?.(step.page);
                      }}
                      className="group flex min-w-[76px] flex-col items-center text-center"
                    >
                      <Icon
                        className={`h-5 w-5 transition ${
                          active
                            ? "text-[#E0A12E]"
                            : "text-neutral-300 group-hover:text-[#E0A12E]"
                        }`}
                      />
                      <span
                        className={`mt-2 text-[13px] font-semibold ${
                          active ? "text-[#E0A12E]" : "text-neutral-300"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="mt-0.5 text-[11px] text-neutral-500">
                        {step.label}
                      </span>
                    </button>
                    {index < WORKFLOW_STEPS.length - 1 && (
                      <div className="mx-2 h-px flex-1 bg-[#2A2E36]" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-2 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="flex flex-col gap-2">
              <section className="flex flex-col rounded-lg border border-[#181A1F] bg-[#151618] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[16px] font-semibold text-[#F5F5F5]">
                    모델링 뷰어
                    <Info className="h-4 w-4 text-neutral-400" />
                  </div>
                  <button
                    onClick={() => setToast("셰이딩 모드를 전환했습니다.")}
                    className="rounded-md border border-[#22252B] bg-[#15181D] px-3 py-1.5 text-[12px] text-neutral-300 transition hover:bg-[#1A1D23]"
                  >
                    Shaded
                  </button>
                </div>

                <div className="relative flex h-[500px] items-center justify-center overflow-hidden rounded-lg border border-[#181A1F] bg-[#050505]">
                  <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
                    {[
                      { icon: RotateCcw, label: "초기화" },
                      { icon: Hand, label: "이동" },
                      { icon: ZoomIn, label: "확대" },
                      { icon: Grid3X3, label: "그리드" },
                      { icon: Maximize2, label: "크게 보기" },
                    ].map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.label}
                          onClick={() => setToast(`${tool.label} 도구를 선택했습니다.`)}
                          title={tool.label}
                          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/5 bg-white/[0.04] text-neutral-300 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>

                  {viewerImage ? (
                    <img
                      referrerPolicy="no-referrer"
                      src={viewerImage}
                      alt="project viewport"
                      className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-neutral-500">
                      <ImageIcon className="h-10 w-10" />
                      <span className="text-[14px]">아직 대표 이미지가 없습니다.</span>
                      <span className="text-[12px] text-neutral-600">
                        노트나 레퍼런스를 연결한 뒤 작업 단계에서 이미지를 확정하세요.
                      </span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035),rgba(0,0,0,0.25))]" />
                </div>

                {thumbs.length > 0 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                    {thumbs.map((thumb, index) => (
                    <button
                      key={thumb}
                      onClick={() => setSelectedThumb(index)}
                      className={`h-[68px] w-[88px] shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        selectedThumb === index
                          ? "border-[#E0A12E]"
                          : "border-[#22252B] opacity-65 hover:border-[#6E737B] hover:opacity-100"
                      }`}
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src={thumb}
                        alt="thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="relative flex h-[260px] flex-col rounded-lg border border-[#181A1F] bg-[#151618] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#F5F5F5]">
                    레퍼런스 보드
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollBoard("left")}
                      className="rounded-md border border-transparent p-1 text-neutral-400 transition hover:border-[#22252B] hover:bg-[#1A1D23] hover:text-neutral-300"
                    >
                      <ChevronLeft className="h-[14px] w-[14px]" />
                    </button>
                    <button
                      onClick={() => scrollBoard("right")}
                      className="rounded-md border border-transparent p-1 text-neutral-400 transition hover:border-[#22252B] hover:bg-[#1A1D23] hover:text-neutral-300"
                    >
                      <ChevronRight className="h-[14px] w-[14px]" />
                    </button>
                    <button
                      onClick={() => onNavigate?.("references")}
                      className="text-[13px] font-medium text-[#4C88D9] transition hover:text-[#5B9FE6]"
                    >
                      모두 보기
                    </button>
                  </div>
                </div>
                <div
                  ref={boardScrollRef}
                  className="flex min-h-0 flex-1 gap-2 overflow-x-auto scroll-smooth"
                >
                  {boardImages.length > 0 ? (
                    boardImages.map((thumb) => (
                      <button
                        key={thumb}
                        onClick={() => onNavigate?.("references")}
                        className="h-full min-w-[150px] shrink-0 overflow-hidden rounded-lg border border-[#181A1F] bg-[#050505]"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={thumb}
                          alt="reference"
                          className="h-full w-full object-cover transition hover:scale-[1.015]"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="flex h-full min-w-full items-center justify-center rounded-lg border border-dashed border-[#2A2E36] bg-[#0A0B0D] text-[13px] text-neutral-500">
                      연결된 노트나 레퍼런스가 없습니다.
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="flex flex-col gap-2">
              <section className="rounded-lg border border-[#181A1F] bg-[#151618] p-6">
                <div className="mb-5 flex rounded-lg border border-[#181A1F] bg-[#050505] p-1">
                  {(["modeling", "texture", "rigging"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setInfoTab(tab)}
                      className={`flex-1 rounded-md border py-1.5 text-[13px] font-bold transition ${
                        infoTab === tab
                          ? "border-[#22252B] bg-[#181A1F] text-white"
                          : "border-transparent text-neutral-400 hover:text-white"
                      }`}
                    >
                      {tab === "modeling"
                        ? "모델링"
                        : tab === "texture"
                          ? "텍스처"
                          : "리깅"}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 text-[14px]">
                  {(infoTab === "modeling"
                    ? [
                        ["폴리곤 수", "128,540"],
                        ["버텍스 수", "96,312"],
                        ["파츠 분리", "8 Parts"],
                        ["UV 매핑", "Unwrapped"],
                        ["파일 형식", ".fbx, .obj, .blend"],
                        ["파일 크기", "78.6 MB"],
                      ]
                    : infoTab === "texture"
                      ? [
                          ["해상도", "4K"],
                          ["PBR 모델", "Metallic / Roughness"],
                          ["Base Color", "연결됨"],
                          ["Normal Map", "검토 필요"],
                          ["Roughness", "연결됨"],
                          ["Texture Set", "Body / Equipment"],
                        ]
                      : [
                          ["포즈", "A-Pose"],
                          ["본 수", "102 Bones"],
                          ["IK/FK", "준비 중"],
                          ["BlendShape", "52 Base Shapes"],
                          ["클립", "Idle / Walk / Run"],
                          ["엔진", "Unreal Engine 5.x"],
                        ]).map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="font-medium text-neutral-400">
                        {label}
                      </span>
                      <span className="font-semibold text-[#F5F5F5]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-1 flex-col rounded-lg border border-[#181A1F] bg-[#151618] p-6">
                <div className="mb-5 flex items-center gap-2">
                  <h3 className="text-[16px] font-semibold text-[#F5F5F5]">
                    작업 노트
                  </h3>
                  <PenLine className="h-[14px] w-[14px] text-neutral-400" />
                </div>

                <div className="space-y-5 text-[14px] leading-6 text-neutral-300">
                  <div>
                    <div className="mb-2 text-[13px] font-semibold text-white">
                      현재 체크 포인트
                    </div>
                    <ul className="space-y-1.5 text-[13px] text-neutral-300">
                      <li>컨셉 이미지와 정면 기준이 연결됨</li>
                      <li>장비 파츠는 모듈화 페이지에서 재사용 가능</li>
                      <li>3D 모델은 모델링 생성 페이지에서 확인 가능</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-[#22252B] bg-[#050505] p-4 text-[13px] text-neutral-300">
                    <div className="mb-1 font-sans text-neutral-500">메모</div>
                    {activeProjData.description}
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <button
                    onClick={() => onNavigate?.("notes")}
                    className="group flex h-10 w-full items-center justify-between rounded-lg border border-[#22252B] bg-[#15181D] px-4 text-[13px] font-medium text-neutral-400 transition hover:bg-[#1A1D23] hover:text-white"
                  >
                    노트 전체 보기
                    <ChevronRight className="h-[14px] w-[14px] transition group-hover:translate-x-1" />
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {toast && (
        <div className="fixed bottom-8 right-8 z-[80] rounded-lg border border-[#2A2E36] bg-[#111317] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {toast}
        </div>
      )}

      {isPopup && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-[#2A2E36] bg-[#1A1C20] p-2 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        >
          <span className="text-[14px] font-semibold text-white">
            {activeProjData.name} 프로젝트를 이어서 진행합니다.
          </span>
          <div className="h-5 w-px bg-[#2A2E36]" />
          <button
            onClick={() => onSelectProject?.(activeProject)}
            className="flex items-center gap-2 rounded-lg bg-[#E0A12E] px-5 py-2.5 text-[14px] font-bold text-black transition hover:bg-[#F0B43A]"
          >
            시작하기
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
