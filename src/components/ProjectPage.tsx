import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CheckCircle2,
  ChevronRight,
  Download,
  Grid3X3,
  Image as ImageIcon,
  Info,
  Layers,
  Link2,
  Maximize2,
  MoreHorizontal,
  Paintbrush,
  Palette,
  PenLine,
  Pin,
  Plus,
  Rotate3D,
  RotateCcw,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import NewProjectModal from "./NewProjectModal";
import { PROJECT_STORAGE_KEY } from "../workflowState";

interface ProjectPageProps {
  onNavigate?: (page: string) => void;
  isPopup?: boolean;
  onSelectProject?: (projectId: number) => void;
  selectedProjectId?: number;
}

type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
  statusColor: string;
  date: string;
  image?: string;
  listImage?: string;
  tags: string[];
  linkedNoteIds?: number[];
  linkedReferenceIds?: number[];
  viewerImages?: string[];
  referenceImages?: string[];
  pinned?: boolean;
};

const DELETED_PROJECTS_STORAGE_KEY = "neopoly_deleted_project_ids";

const COLORS = {
  gold: "var(--color-brand-primary)",
  blue: "#4C88D9",
  green: "#6FAF52",
  purple: "#A36BFF",
  teal: "#2DD4BF",
  dim: "#8A8F98",
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    name: "\uc5d8\ud504 \uad81\uc218",
    description: "\uc232 \ubc30\uacbd\uc758 \ud310\ud0c0\uc9c0 \uc5d8\ud504 \uad81\uc218 \uce90\ub9ad\ud130 \uc791\uc5c5\uc785\ub2c8\ub2e4. \ud3ec\uc988 \uc774\ubbf8\uc9c0, \ud134\uc5b4\ub77c\uc6b4\ub4dc, \uc640\uc774\uc5b4 \ucc38\uace0 \uc774\ubbf8\uc9c0\ub97c \uae30\ubc18\uc73c\ub85c \ubaa8\ub378\ub9c1 \ub2e8\uacc4\ub97c \uc815\ub9ac\ud569\ub2c8\ub2e4.",
    status: "Modeling",
    statusColor: COLORS.green,
    date: "2024.05.20",
    image: "/images/Discover_in_elf01.png",
    viewerImages: ["/images/Discover_in_elf01.png", "/images/Discover_in_elf02.png", "/images/Discover_in_elf03.png", "/images/Discover_in_elf04.png"],
    referenceImages: ["/images/elf_re/elf_re01.jpg", "/images/elf_re/elf_re02.jpeg", "/images/elf_re/elf_re03.jpeg", "/images/elf_re/elf_re04.jpg", "/images/elf_re/elf_re05.jpg"],
    tags: ["#\uc5d8\ud504", "#\uad81\uc218", "#\uce90\ub9ad\ud130", "#\ud310\ud0c0\uc9c0"],
  },
  {
    id: 2,
    name: "\uc624\ud06c",
    description: "\uac15\ud55c \uccb4\ud615\uacfc \uc7a5\ube44 \ubaa8\ub4c8\uc744 \uac00\uc9c4 \uc624\ud06c \uc804\uc0ac \ud504\ub85c\uc81d\ud2b8\uc785\ub2c8\ub2e4. \uc774\ubbf8\uc9c0 \uc0dd\uc131, \ud134\uc5b4\ub77c\uc6b4\ub4dc, \ubaa8\ub4c8\ud654, 3D \ubaa8\ub378\ub9c1 \ud6c4\uc791\uc5c5\uae4c\uc9c0 \uc5f0\uacb0\ud569\ub2c8\ub2e4.",
    status: "Modeling",
    statusColor: COLORS.green,
    date: "2024.05.19",
    image: "/images/Discover_in_orc01.png",
    viewerImages: ["/images/Discover_in_orc01.png", "/images/Discover_in_orc02.png", "/images/Discover_in_orc03.png", "/images/Discover_in_orc04.png", "/images/Discover_in_orc05.png"],
    referenceImages: ["/images/orc_re/orc_re01.png", "/images/orc_re/orc_re02.jpg", "/images/orc_re/orc_re03.jpg", "/images/orc_re/orc_re04.jpg"],
    tags: ["#\uc624\ud06c", "#\uc804\uc0ac", "#\ubaa8\ub4c8\ud654", "#3D\ubaa8\ub378\ub9c1"],
  },
  {
    id: 3,
    name: "\uc640\uc774\ubc88",
    description: "\uac70\ub300\ud55c \ub0a0\uac1c\uc640 \uae34 \uaf2c\ub9ac \uc2e4\ub8e8\uc5e3\uc744 \uac00\uc9c4 \uc640\uc774\ubc88 \ud06c\ub9ac\ucc98 \ubaa8\ub378\ub9c1 \ud504\ub85c\uc81d\ud2b8\uc785\ub2c8\ub2e4. \ube44\ud589 \ud3ec\uc988\uc640 \uad6c\uc870 \ucc38\uace0 \uc774\ubbf8\uc9c0\ub97c \ud568\uaed8 \ud655\uc778\ud569\ub2c8\ub2e4.",
    status: "Turnaround",
    statusColor: COLORS.purple,
    date: "2024.05.18",
    image: "/images/Discover_in_Wyvern01.png",
    viewerImages: ["/images/Discover_in_Wyvern01.png", "/images/Discover_in_Wyvern02.png", "/images/Discover_in_Wyvern03.png", "/images/Discover_in_Wyvern04.png"],
    referenceImages: ["/images/wyvern_re/wyvern_re01.jpg", "/images/wyvern_re/wyvern_re02.jpg", "/images/wyvern_re/wyvern_re023.png"],
    tags: ["#\uc640\uc774\ubc88", "#\ud06c\ub9ac\ucc98", "#\ub0a0\uac1c", "#PBR"],
  },
  {
    id: 4,
    name: "\uacf5\ub8e1",
    description: "\ud0d1\uc2b9 \uc7a5\ube44\uc640 \uc9d0\uc744 \uc5b9\uc740 \ud310\ud0c0\uc9c0 \uacf5\ub8e1 \ud504\ub85c\uc81d\ud2b8\uc785\ub2c8\ub2e4. \uc0dd\ubb3c \ud615\ud0dc\uc640 \uc7a5\ube44 \uad6c\uc870\ub97c \ud568\uaed8 \uac80\ud1a0\ud558\ub294 \uc791\uc5c5\uc785\ub2c8\ub2e4.",
    status: "Concept",
    statusColor: COLORS.teal,
    date: "2024.05.17",
    image: "/images/Discover_in_Dinosaur01.png",
    viewerImages: ["/images/Discover_in_Dinosaur01.png", "/images/Discover_in_Dinosaur02.png", "/images/Discover_in_Dinosaur03.png", "/images/Discover_in_Dinosaur04.png"],
    referenceImages: ["/images/Dino_re/Dino_re01.jpg", "/images/Dino_re/Dino_re02.jpg", "/images/Dino_re/Dino_re03.jpg", "/images/Dino_re/Dino_re04.jpg"],
    tags: ["#\uacf5\ub8e1", "#\ud0c8\uac83", "#\uc7a5\ube44", "#\ud310\ud0c0\uc9c0"],
  },
  {
    id: 5,
    name: "\uc2a4\ud2b8\ub9bf \ud328\uc158",
    description: "\uc2a4\ud2b8\ub9bf \uc2a4\ud3ec\uce20\uc6e8\uc5b4\uc640 \ub18d\uad6c \ubb34\ub4dc\ub97c \uae30\ubc18\uc73c\ub85c \ud55c \uce90\ub9ad\ud130 \ud504\ub85c\uc81d\ud2b8\uc785\ub2c8\ub2e4. \uc758\uc0c1 \uc2e4\ub8e8\uc5e3\uacfc \ud3ec\uc988 \ub808\ud37c\ub7f0\uc2a4\ub97c \uc911\uc2ec\uc73c\ub85c \uc815\ub9ac\ud569\ub2c8\ub2e4.",
    status: "Modeling",
    statusColor: COLORS.blue,
    date: "2024.05.16",
    image: "/images/Discover_in_Street01.png",
    viewerImages: ["/images/Discover_in_Street01.png", "/images/Discover_in_Street02.png", "/images/Discover_in_Street03.png", "/images/Discover_in_Street04.png"],
    referenceImages: ["/images/street_re/Street_re01.jpg", "/images/street_re/Street_re02.jpg", "/images/street_re/Street_re03.jpg"],
    tags: ["#\uc2a4\ud2b8\ub9bf", "#\ud328\uc158", "#\uc2a4\ud3ec\uce20", "#\uce90\ub9ad\ud130"],
  },
  {
    id: 6,
    name: "\ucf54\ubfd4\uc18c",
    description: "\ubb34\uac70\uc6b4 \uac11\uc637\uacfc \uc804\ud22c \ub3c4\ub07c\ub97c \ub4e0 \ucf54\ubfd4\uc18c \uc804\uc0ac \ud504\ub85c\uc81d\ud2b8\uc785\ub2c8\ub2e4. \uce90\ub9ad\ud130 \ud615\ud0dc\uc640 \uc7a5\ube44 \ud30c\uce20\ub97c \ub2e8\uacc4\ubcc4\ub85c \ud655\uc778\ud569\ub2c8\ub2e4.",
    status: "Turnaround",
    statusColor: COLORS.purple,
    date: "2024.05.15",
    image: "/images/Discover_in_Rhino01.png",
    viewerImages: ["/images/Discover_in_Rhino01.png", "/images/Discover_in_Rhino02.png", "/images/Discover_in_Rhino03.png", "/images/Discover_in_Rhino04.png", "/images/Discover_in_Rhino05.png"],
    referenceImages: ["/images/Rhino_re/Rhino_re01.jpg", "/images/Rhino_re/Rhino_re02.jpg", "/images/Rhino_re/Rhino_re03.jpg", "/images/Rhino_re/Rhino_re04.jpg"],
    tags: ["#\ucf54\ubfd4\uc18c", "#\uc804\uc0ac", "#\uac11\uc637", "#\ud06c\ub9ac\ucc98"],
  },
  {
    id: 7,
    name: "\ud3ec\uc2a4\ucf54 \ud654\uc774\ud2b8",
    description: "\ud654\uc774\ud2b8 \ud1a4\uc758 \uc0b0\uc5c5 \uc124\ube44\uc640 \uae30\uc5c5\ud615 3D \uc5d0\uc14b\uc744 \uc815\ub9ac\ud55c \ud3ec\uc2a4\ucf54 \ud504\ub85c\uc81d\ud2b8\uc785\ub2c8\ub2e4. \uc870\uc120, \uc124\ube44, \uac74\ucd95 \ubaa8\ub4c8 \uc774\ubbf8\uc9c0\ub97c \ud568\uaed8 \ud655\uc778\ud569\ub2c8\ub2e4.",
    status: "Art",
    statusColor: COLORS.dim,
    date: "2024.05.14",
    image: "/images/work_%207.png",
    listImage: "/images/work_%207.png",
    viewerImages: ["/images/Discover_in_Posco101.png", "/images/Discover_in_Posco102.png", "/images/Discover_in_Posco103.png", "/images/Discover_in_Posco104.png", "/images/Discover_in_Posco105.png", "/images/Discover_in_Posco106.png", "/images/Discover_in_Posco107.png", "/images/Discover_in_Posco108.png", "/images/Discover_in_Posco109.png", "/images/Discover_in_Posco110.png", "/images/Discover_in_Posco111.png"],
    referenceImages: ["/images/posco01_re/posco01_re01.png", "/images/posco01_re/posco01_re02.png", "/images/posco01_re/posco01_re03.png", "/images/posco01_re/posco01_re04.png", "/images/posco01_re/posco01_re05.png", "/images/posco01_re/posco01_re06.png", "/images/posco01_re/posco01_re07.png"],
    tags: ["#\ud3ec\uc2a4\ucf54", "#\ud654\uc774\ud2b8", "#\uc0b0\uc5c5", "#3D\uc5d0\uc14b"],
  },
  {
    id: 8,
    name: "\ud3ec\uc2a4\ucf54 \ube14\ub8e8",
    description: "\ube14\ub8e8 \ud1a4\uc758 \ucca0\uace8 \uad6c\uc870\ubb3c\uacfc \uac74\ucd95 \ubaa8\ub4c8\uc744 \uc911\uc2ec\uc73c\ub85c \uad6c\uc131\ud55c \ud3ec\uc2a4\ucf54 \ud504\ub85c\uc81d\ud2b8\uc785\ub2c8\ub2e4. \uc0b0\uc5c5 \uc2dc\ubbac\ub808\uc774\uc158\uc6a9 \uc5d0\uc14b \uad6c\uc131\uc744 \ud655\uc778\ud569\ub2c8\ub2e4.",
    status: "Art",
    statusColor: COLORS.dim,
    date: "2024.05.13",
    image: "/images/work_%208.png",
    listImage: "/images/work_%208.png",
    viewerImages: ["/images/Discover_in_Posco201.png", "/images/Discover_in_Posco202.png", "/images/Discover_in_Posco203.png", "/images/Discover_in_Posco204.png", "/images/Discover_in_Posco205.png", "/images/Discover_in_Posco206.png", "/images/Discover_in_Posco207.png", "/images/Discover_in_Posco208.png", "/images/Discover_in_Posco209.png", "/images/Discover_in_Posco210.png", "/images/Discover_in_Posco211.png"],
    referenceImages: ["/images/posco02_re/posco02_re01.png", "/images/posco02_re/posco02_re02.png", "/images/posco02_re/posco02_re03.png", "/images/posco02_re/posco02_re04.png", "/images/posco02_re/posco02_re05.png", "/images/posco02_re/posco02_re06.png", "/images/posco02_re/posco02_re07.png"],
    tags: ["#\ud3ec\uc2a4\ucf54", "#\ube14\ub8e8", "#\ucca0\uace8", "#\uac74\ucd95\ubaa8\ub4c8"],
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
    const deletedIds = new Set<number>(
      JSON.parse(localStorage.getItem(DELETED_PROJECTS_STORAGE_KEY) || "[]") as number[],
    );
    const availableDefaults = DEFAULT_PROJECTS.filter(
      (project) => !deletedIds.has(project.id),
    );
    const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!saved) return availableDefaults.length > 0 ? availableDefaults : DEFAULT_PROJECTS;
    const parsed = JSON.parse(saved) as Project[];
    if (!Array.isArray(parsed)) return availableDefaults.length > 0 ? availableDefaults : DEFAULT_PROJECTS;

    const mergedDefaults = availableDefaults.map((defaultProject) => {
      const savedProject = parsed.find((project) => project.id === defaultProject.id);
      return savedProject
        ? {
            ...defaultProject,
            linkedNoteIds: savedProject.linkedNoteIds,
            linkedReferenceIds: savedProject.linkedReferenceIds,
            pinned: savedProject.pinned,
          }
        : defaultProject;
    });
    const defaultIds = new Set(DEFAULT_PROJECTS.map((project) => project.id));
    const generatedProjects = parsed.filter(
      (project) => !defaultIds.has(project.id),
    );

    return [...generatedProjects, ...mergedDefaults];
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
        compact ? "text-[14px]" : "text-[14px]"
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
  selectedProjectId,
}: ProjectPageProps) {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [activeProject, setActiveProject] = useState(() => {
    const loadedProjects = loadProjects();
    const storedId = Number(
      localStorage.getItem("neopoly_selected_project_id"),
    );
    return loadedProjects.some((project) => project.id === storedId)
      ? storedId
      : loadedProjects[0].id;
  });
  const [activeStep, setActiveStep] = useState("Modeling");
  const [infoTab, setInfoTab] = useState<"modeling" | "texture" | "rigging">(
    "modeling",
  );
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [isViewerPreviewOpen, setIsViewerPreviewOpen] = useState(false);
  const [referencePreviewImage, setReferencePreviewImage] = useState<string | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [toast, setToast] = useState("");
  const [openProjectMenuId, setOpenProjectMenuId] = useState<number | null>(null);
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState<number | null>(null);
  const boardScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    setSelectedThumb(0);
    setReferencePreviewImage(null);
  }, [activeProject]);

  useEffect(() => {
    if (!selectedProjectId) return;
    if (projects.some((project) => project.id === selectedProjectId)) {
      setActiveProject(selectedProjectId);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (openProjectMenuId === null) return;

    const closeMenu = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-project-context]")) return;
      setOpenProjectMenuId(null);
    };
    const closeMenuWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenProjectMenuId(null);
    };

    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeMenuWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeMenuWithEscape);
    };
  }, [openProjectMenuId]);

  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
    [projects],
  );

  const activeProjData =
    projects.find((project) => project.id === activeProject) || projects[0];
  const pendingDeleteProject = projects.find(
    (project) => project.id === pendingDeleteProjectId,
  );

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
    return Array.from(new Set([activeProjData.image, ...(activeProjData.viewerImages || [])].filter(Boolean)));
  }, [activeProjData]);

  const projectReferenceImages = activeProjData.referenceImages || [];
  const boardImages = projectReferenceImages.length > 0 ? projectReferenceImages : linkedImages.length > 0 ? linkedImages : thumbs;
  const viewerImage = hasProjectImage ? thumbs[selectedThumb] || activeProjData.image : "";

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

  const toggleProjectPin = (projectId: number) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    setProjects((current) =>
      current.map((item) =>
        item.id === projectId ? { ...item, pinned: !item.pinned } : item,
      ),
    );
    setOpenProjectMenuId(null);
    setToast(project.pinned ? "상단 고정을 해제했습니다." : "프로젝트를 상단에 고정했습니다.");
  };

  const deleteProject = (projectId: number) => {
    if (projects.length <= 1) {
      setPendingDeleteProjectId(null);
      setToast("마지막 프로젝트는 삭제할 수 없습니다.");
      return;
    }

    const remainingProjects = projects.filter((project) => project.id !== projectId);
    setProjects(remainingProjects);
    if (activeProject === projectId) {
      const nextProject = [...remainingProjects].sort(
        (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)),
      )[0];
      setActiveProject(nextProject.id);
    }

    if (DEFAULT_PROJECTS.some((project) => project.id === projectId)) {
      try {
        const deletedIds = new Set<number>(
          JSON.parse(localStorage.getItem(DELETED_PROJECTS_STORAGE_KEY) || "[]") as number[],
        );
        deletedIds.add(projectId);
        localStorage.setItem(DELETED_PROJECTS_STORAGE_KEY, JSON.stringify([...deletedIds]));
      } catch {
        // The current session still reflects the deletion if storage is unavailable.
      }
    }

    setPendingDeleteProjectId(null);
    setOpenProjectMenuId(null);
    setToast("프로젝트를 삭제했습니다.");
  };

  return (
    <div
      className={`flex bg-bg-dark text-[#F5F5F5] font-sans antialiased ${
        isPopup ? "h-full" : "min-h-[calc(100dvh-60px)] lg:min-h-[calc(100dvh-76px)]"
      }`}
    >
      <aside
        className={`np-primary-sidebar-surface hidden w-[350px] shrink-0 overflow-y-auto border-r border-[#181A1F] bg-bg-dark px-5 py-6 lg:block ${
          isPopup ? "h-full" : "sticky top-[76px] h-[calc(100dvh-76px)]"
        }`}
      >
        <div className="mb-6">
          <h2 className="np-primary-sidebar-title mb-5 text-[#F5F5F5]">
            내 프로젝트
          </h2>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#3A404F]/60 bg-[#15161A] py-3 text-[15px] font-medium text-brand-primary transition hover:border-brand-primary/50 hover:bg-[#22252B]"
          >
            <Plus className="h-[18px] w-[18px]" />
            새 프로젝트
          </button>
        </div>

        <div className="flex flex-col gap-3 pb-2">
          {orderedProjects.map((project) => {
            const active = project.id === activeProject;
            const sidebarImage = project.listImage || project.image;
            return (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                onClick={() => setActiveProject(project.id)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveProject(project.id);
                  }
                }}
                className={`np-project-list-card group relative flex h-[118px] w-full items-center rounded-lg border text-left transition ${
                  openProjectMenuId === project.id ? "z-30" : ""
                } ${
                  active
                    ? "np-project-list-card-active border-brand-primary bg-brand-primary/10"
                    : "np-project-list-card-idle border-transparent bg-white/[0.035] hover:border-[#2A2E36] hover:bg-white/[0.06]"
                }`}
              >
                <span
                  className="absolute bottom-0 left-0 top-0 z-20 w-[6px] rounded-l-lg"
                  style={{
                    backgroundColor: active ? COLORS.gold : project.statusColor,
                  }}
                />
                <div className="relative z-10 min-w-0 flex-1 pl-6 pr-[100px]">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <div className="np-project-list-title truncate text-[18px] font-semibold text-[#F5F5F5]">
                      {project.name}
                    </div>
                    {project.pinned && (
                      <Pin className="h-3.5 w-3.5 shrink-0 fill-brand-primary text-brand-primary" />
                    )}
                  </div>
                  <div
                    className="mt-1.5 flex items-center gap-1.5 text-[14px] font-medium"
                    style={{ color: project.statusColor }}
                  >
                    <StatusDot color={project.statusColor} />
                    {project.status}
                  </div>
                  <div className="mt-2 text-[14px] text-neutral-400">
                    {project.date}
                  </div>
                </div>
                <div
                  className="np-project-list-media absolute bottom-0 right-0 top-0 z-0 w-[140px] overflow-hidden rounded-r-lg"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 45%)",
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 45%)",
                  }}
                >
                  {sidebarImage ? (
                    <img
                      referrerPolicy="no-referrer"
                      src={sidebarImage}
                      alt={project.name}
                      className={`np-project-list-image h-full w-full object-cover transition ${
                        active
                          ? "np-project-list-image-active"
                          : "np-project-list-image-idle brightness-[0.45] grayscale-[45%] group-hover:brightness-[0.75]"
                      }`}
                    />
                  ) : (
                    <EmptyProjectImage compact />
                  )}
                  <span
                    aria-hidden="true"
                    className={`np-project-list-light-veil absolute inset-0 transition-colors ${
                      active ? "np-project-list-light-veil-active" : "np-project-list-light-veil-idle"
                    }`}
                  />
                </div>
                <button
                  type="button"
                  data-project-context
                  aria-label={`${project.name} 메뉴`}
                  aria-haspopup="menu"
                  aria-expanded={openProjectMenuId === project.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenProjectMenuId((current) =>
                      current === project.id ? null : project.id,
                    );
                  }}
                  className={`np-project-list-menu absolute right-2.5 top-2.5 z-40 flex h-7 w-7 items-center justify-center rounded-md bg-black/40 text-neutral-300 transition focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 ${
                    openProjectMenuId === project.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {openProjectMenuId === project.id && (
                  <div
                    data-project-context
                    role="menu"
                    className="np-project-context-menu absolute right-2.5 top-10 z-50 w-[172px] rounded-lg border border-[#2A2E36] bg-surface-primary p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.38)]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => toggleProjectPin(project.id)}
                      className="flex h-10 w-full items-center gap-2.5 rounded-md px-3 text-[14px] font-medium text-text-secondary transition hover:bg-white/5 hover:text-text-primary"
                    >
                      <Pin className={`h-4 w-4 ${project.pinned ? "fill-brand-primary text-brand-primary" : ""}`} />
                      {project.pinned ? "고정 해제" : "상단에 고정"}
                    </button>
                    <div className="my-1 border-t border-border-soft" />
                    <button
                      type="button"
                      role="menuitem"
                      disabled={projects.length <= 1}
                      onClick={() => {
                        setOpenProjectMenuId(null);
                        setPendingDeleteProjectId(project.id);
                      }}
                      className="flex h-10 w-full items-center gap-2.5 rounded-md px-3 text-[14px] font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Trash2 className="h-4 w-4" />
                      프로젝트 삭제
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      <main
        className={`min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 2xl:px-8 min-[2200px]:px-10 ${
          isPopup ? "h-full pb-24" : "h-[calc(100dvh-60px)] lg:h-[calc(100dvh-76px)]"
        }`}
      >
        <div className="relative mb-4 lg:hidden">
          <div className="flex snap-x gap-2 overflow-x-auto pb-1 pr-10 scrollbar-hide" aria-label="프로젝트 선택">
            {orderedProjects.map((project) => (
              <button
                key={`mobile-${project.id}`}
                type="button"
                onClick={() => setActiveProject(project.id)}
                className={`h-11 shrink-0 snap-start rounded-lg border px-4 text-[14px] font-medium transition ${
                  project.id === activeProject
                    ? "border-brand-primary/60 bg-brand-primary/10 text-brand-primary"
                    : "border-[#242832] bg-[#111317] text-neutral-300"
                }`}
              >
                {project.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(true)}
              className="flex h-11 shrink-0 snap-start items-center gap-1.5 rounded-lg border border-[#2A2E36] bg-[#111317] px-4 text-[14px] font-medium text-neutral-300"
            >
              <Plus className="h-4 w-4 text-brand-primary" />
              새 프로젝트
            </button>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent pr-1" aria-hidden="true">
            <ChevronRight className="h-4 w-4 text-brand-primary" />
          </div>
        </div>
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
                      className="h-11 min-w-[260px] rounded-lg border border-brand-primary/50 bg-[#08090B] px-3 text-[24px] font-bold text-white outline-none"
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
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#181A1F] hover:text-brand-primary sm:h-8 sm:w-8"
                    title="프로젝트 이름 수정"
                  >
                    <PenLine className="h-5 w-5" />
                  </button>
                  <span
                    className="flex h-7 items-center rounded-md px-3 text-[14px] font-medium"
                    style={{
                      color: activeProjData.statusColor,
                      backgroundColor: `${activeProjData.statusColor}24`,
                    }}
                  >
                    {activeProjData.status}
                  </span>
                </div>
                <p className="mt-2.5 max-w-[680px] text-[15px] leading-[1.65] text-neutral-300">
                  {activeProjData.description}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {activeProjData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex h-[26px] items-center rounded-md border border-[#22252B] bg-[#181A1F] px-2 text-[14px] text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <button
                    onClick={addTag}
                    className="flex h-11 w-11 items-center justify-center rounded-md border border-[#22252B] bg-[#181A1F] text-neutral-300 transition hover:text-white sm:h-[26px] sm:w-[26px]"
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
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-[#2A2E36] bg-[#15181D] text-neutral-400 hover:text-white sm:h-8 sm:w-8"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setToast("프로젝트 정보를 복사했습니다.")}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-[#2A2E36] bg-[#15181D] text-neutral-400 hover:text-white sm:h-8 sm:w-8"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="relative">
            <section className="snap-x overflow-x-auto rounded-lg border border-[#181A1F] bg-[#151618] px-4 py-3 pr-10 scrollbar-hide sm:px-6 sm:pr-12 lg:px-8">
              <div className="flex min-w-[640px] items-center justify-between sm:min-w-[760px] xl:min-w-[900px]">
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
                        className="group flex min-w-[72px] snap-start flex-col items-center rounded-lg py-1 text-center sm:min-w-[76px]"
                      >
                        <Icon
                          className={`h-5 w-5 transition ${
                            active
                              ? "text-brand-primary"
                              : "text-neutral-300 group-hover:text-brand-primary"
                          }`}
                        />
                        <span
                          className={`mt-2 text-[14px] font-medium ${
                            active ? "text-brand-primary" : "text-neutral-300"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="mt-0.5 text-[14px] text-neutral-500">
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
            <div className="pointer-events-none absolute inset-y-px right-px flex w-10 items-center justify-end rounded-r-lg bg-gradient-to-l from-[#151618] via-[#151618]/90 to-transparent pr-1 xl:hidden" aria-hidden="true">
              <ChevronRight className="h-4 w-4 text-brand-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="flex flex-col gap-2">
              <section className="flex flex-col rounded-lg border border-[#181A1F] bg-[#151618] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[15px] font-medium text-[#F5F5F5]">
                    모델링 뷰어
                    <Info className="h-4 w-4 text-neutral-400" />
                  </div>
                </div>

                <div className="np-dark-media np-viewer-media relative flex h-[320px] items-center justify-center overflow-hidden rounded-lg border border-[#181A1F] bg-[#050505] sm:h-[420px] lg:h-[500px]">
                  {viewerImage && (
                    <button
                      type="button"
                      onClick={() => setIsViewerPreviewOpen(true)}
                      title="크게 보기"
                      className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-neutral-200 transition hover:bg-white/[0.12] hover:text-white"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  )}

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
                      <span className="text-[14px] text-neutral-600">
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
                          ? "border-brand-primary"
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
                  <h3 className="text-[15px] font-medium text-[#F5F5F5]">
                    레퍼런스
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate?.("board")}
                      className="text-[14px] font-medium text-neutral-500 transition hover:text-neutral-300"
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
                        type="button"
                        onClick={() => setReferencePreviewImage(thumb)}
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
                    <div className="flex h-full min-w-full items-center justify-center rounded-lg border border-dashed border-[#2A2E36] bg-[#0A0B0D] text-[14px] text-neutral-500">
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
                      className={`flex-1 rounded-md border py-1.5 text-[14px] font-medium transition ${
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
                  <h3 className="text-[15px] font-medium text-[#F5F5F5]">
                    작업 노트
                  </h3>
                  <PenLine className="h-[14px] w-[14px] text-neutral-400" />
                </div>

                <div className="space-y-5 text-[15px] leading-[1.65] text-neutral-300">
                  <div>
                    <div className="mb-2 text-[14px] font-medium text-white">
                      현재 체크 포인트
                    </div>
                    <ul className="space-y-1.5 text-[14px] text-neutral-300">
                      <li>컨셉 이미지와 정면 기준이 연결됨</li>
                      <li>장비 파츠는 모듈화 페이지에서 재사용 가능</li>
                      <li>3D 모델은 모델링 생성 페이지에서 확인 가능</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-[#22252B] bg-[#050505] p-4 text-[14px] text-neutral-300">
                    <div className="mb-1 font-sans text-neutral-500">메모</div>
                    {activeProjData.description}
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <button
                    onClick={() => onNavigate?.("board")}
                    className="group flex h-10 w-full items-center justify-between rounded-lg border border-[#22252B] bg-[#15181D] px-4 text-[14px] font-medium text-neutral-400 transition hover:bg-[#1A1D23] hover:text-white"
                  >
                    보드에서 보기
                    <ChevronRight className="h-[14px] w-[14px] transition group-hover:translate-x-1" />
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {isViewerPreviewOpen && viewerImage && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 py-5 backdrop-blur-sm"
          onClick={() => setIsViewerPreviewOpen(false)}
        >
          <div
            className="relative flex max-h-[92dvh] w-full max-w-[1280px] items-center justify-center overflow-hidden rounded-xl border border-[#252A33] bg-[#08090B] p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsViewerPreviewOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/45 text-neutral-300 transition hover:text-white"
              title="닫기"
            >
              X
            </button>
            <img
              src={viewerImage}
              alt={`${activeProjData.name} 작업 뷰 크게 보기`}
              className="max-h-[86dvh] max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {referencePreviewImage && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 py-5 backdrop-blur-sm"
          onClick={() => setReferencePreviewImage(null)}
        >
          <div
            className="relative flex max-h-[92dvh] w-full max-w-[1280px] items-center justify-center overflow-hidden rounded-xl border border-[#252A33] bg-[#08090B] p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setReferencePreviewImage(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/45 text-neutral-300 transition hover:text-white"
              title="Close"
            >
              X
            </button>
            <img
              src={referencePreviewImage}
              alt={`${activeProjData.name} reference preview`}
              className="max-h-[86dvh] max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {pendingDeleteProject && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setPendingDeleteProjectId(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-delete-title"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="np-project-delete-dialog w-full max-w-[420px] rounded-xl border border-border-primary bg-surface-primary p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <Trash2 className="h-5 w-5" />
            </div>
            <h2 id="project-delete-title" className="mt-4 text-[20px] font-semibold text-text-primary">
              프로젝트를 삭제할까요?
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-text-secondary">
              <span className="font-semibold text-text-primary">{pendingDeleteProject.name}</span> 프로젝트가 목록에서 삭제됩니다.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteProjectId(null)}
                className="h-10 rounded-lg border border-border-primary px-4 text-[14px] font-medium text-text-secondary transition hover:bg-white/5 hover:text-text-primary"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => deleteProject(pendingDeleteProject.id)}
                className="h-10 rounded-lg bg-red-500 px-4 text-[14px] font-semibold text-white transition hover:bg-red-600"
              >
                삭제하기
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {toast && (
        <div className="fixed bottom-8 right-8 z-[80] rounded-lg border border-[#2A2E36] bg-[#111317] px-4 py-3 text-[14px] font-medium text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
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
          <span className="text-[14px] font-medium text-white">
            {activeProjData.name} 프로젝트를 이어서 진행합니다.
          </span>
          <div className="h-5 w-px bg-[#2A2E36]" />
          <button
            onClick={() => onSelectProject?.(activeProject)}
            className="np-primary-action flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-[14px] font-medium text-black transition hover:bg-[#F0B43A]"
          >
            시작하기
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
