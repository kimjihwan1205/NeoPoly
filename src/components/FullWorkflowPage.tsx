import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  MoreHorizontal,
  HelpCircle,
  User,
  Sparkles,
  ChevronRight,
  Copy,
  ArrowUp,
  Image as ImageIcon,
  FolderOpen,
  FolderPlus,
  Star,
  Database,
  History,
  Inbox,
  ChevronDown,
  Check,
  Search,
  FileText,
  X,
  Maximize2,
  List,
  Download,
  Bookmark,
  Minus,
  Link2,
  SlidersHorizontal,
  RefreshCw,
  Wand2,
  ChevronLeft,
  Puzzle,
  Box,
  Pencil,
  PenTool,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FullWorkflowIntroPage from "./FullWorkflowIntroPage";
import ReferencePage from "./ReferencePage";
import NotesPage, { NOTES, type NoteItem } from "./NotesPage";
import ProjectPage from "./ProjectPage";
import NewProjectModal from "./NewProjectModal";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowSidebarHeader from "./WorkflowSidebarHeader";
import LoadingIndicator from "./LoadingIndicator";
import {
  requestModelGeneration,
  requestTurnaroundFlow,
  resolveImageWorkflowNextStep,
} from "../workflowState";
import { startImageGenerationLoading } from "../imageGenerationLoading";
import { ASSETS } from "../App";

const COLORS = {
  bg: "#050505",
  panel: "#0A0B0D",
  border: "#1F2329",
  gold: "var(--color-brand-primary)",
  text: "#F5F5F5",
  muted: "#8B909A",
};

const ORC_WORKFLOW_REFERENCES = [
  { id: -401, title: "오크 정면 레퍼런스", image: "/images/orc/orc_2D_front.png" },
  { id: -402, title: "오크 45도 레퍼런스", image: "/images/orc/orc_2D_45.png" },
  { id: -403, title: "오크 측면 레퍼런스", image: "/images/orc/orc_2D_side.png" },
  { id: -404, title: "오크 후면 레퍼런스", image: "/images/orc/orc_2D_back.png" },
  { id: -405, title: "오크 팔 보호대", image: "/images/orc/orc_default_item01.png" },
  { id: -406, title: "오크 허리 장식", image: "/images/orc/orc_default_item04.png" },
];

const ORC_WORKFLOW_REFERENCE_IDS = ORC_WORKFLOW_REFERENCES.map((asset) => asset.id);

const PROJECTS = [
  {
    id: 1,
    name: "오크",
    status: "In Progress",
    statusColor: COLORS.gold,
    date: "2024.05.20",
    image: "/images/work_%202.png",
  },
  {
    id: 2,
    name: "판타지 마을",
    status: "In Progress",
    statusColor: COLORS.gold,
    date: "2024.05.18",
    image: "/images/work_%206.png",
  },
  {
    id: 3,
    name: "바위 절벽 환경",
    status: "Ready",
    statusColor: "#60A5FA",
    date: "2024.05.15",
    image: "/images/work_%207.png",
  },
  {
    id: 4,
    name: "고대 신전",
    status: "Published",
    statusColor: "#4ADE80",
    date: "2024.05.10",
    image: "/images/work_%203.png",
  },
  {
    id: 5,
    name: "기계 전차",
    status: "Draft",
    statusColor: COLORS.muted,
    date: "2024.05.08",
    image: "/images/work_%204.png",
  },
  {
    id: 6,
    name: "숲 늑대",
    status: "In Progress",
    statusColor: COLORS.gold,
    date: "2024.05.05",
    image: "/images/work_%205.png",
  },
  {
    id: 7,
    name: "나무 오두막",
    status: "Concept",
    statusColor: COLORS.muted,
    date: "2024.05.01",
    image: "/images/work_%209.png",
  },
];

type ChipData = {
  label: string;
  image?: string;
  isSelected?: boolean;
  isCustom?: boolean;
};

type MessageInfo = {
  id: string;
  role: "assistant" | "user";
  content: React.ReactNode;
  time: string;
  chips?: ChipData[];
};

type ImageEditPoint = {
  x: number;
  y: number;
};

type GeneratedImageHistoryVersion = {
  id: number;
  label: string;
  prompt: string;
  selection: ImageEditPoint[];
};

const INITIAL_MESSAGES: MessageInfo[] = [
  {
    id: "1",
    role: "assistant",
    content: "안녕하세요! 어떤 이미지를 만들고 싶으신가요?",
    time: "오후 2:30",
  },
  {
    id: "2",
    role: "user",
    content: "숲 속에 있는 오래된 나무 오두막을 만들고 싶어.",
    time: "오후 2:30",
  },
  {
    id: "3",
    role: "assistant",
    content: (
      <>
        좋아요! 더 구체적인 이미지를 만들기 위해 몇 가지를 여쭤볼게요.
        <br />
        원하는 분위기는 어떤 느낌인가요?
      </>
    ),
    time: "오후 2:31",
    chips: [
      {
        label: "따뜻하고 아늑한",
        isSelected: true,
      },
      { label: "신비롭고 몽환적인" },
      { label: "어둡고 으스스한" },
      { label: "자연적이고 평화로운" },
      { label: "기타 직접 입력", isCustom: true },
    ],
  },
  {
    id: "4",
    role: "user",
    content: "따뜻하고 아늑한 느낌이 좋아.",
    time: "오후 2:31",
  },
  {
    id: "5",
    role: "assistant",
    content: "이해했어요! 오두막의 스타일은 어떤 느낌을 원하시나요?",
    time: "오후 2:32",
    chips: [
      {
        label: "통나무 오두막",
        isSelected: true,
      },
      { label: "목조 주택" },
      { label: "조립식 / 판잣집" },
      { label: "판타지 스타일" },
      { label: "기타 직접 입력", isCustom: true },
    ],
  },
  {
    id: "6",
    role: "user",
    content: "통나무 오두막으로 할게.",
    time: "오후 2:32",
  },
  {
    id: "7",
    role: "assistant",
    content: "좋아요! 추가로 포함하고 싶은 요소가 있나요? (선택)",
    time: "오후 2:32",
    chips: [
      { label: "연못 / 개울" },
      { label: "난로 / 연기" },
      { label: "등불 / 조명" },
      { label: "작은 텃밭" },
      { label: "나무 울타리" },
      { label: "돌담" },
      { label: "가구 / 소품" },
      { label: "안개 / 구름" },
      { label: "꽃 / 식물" },
      { label: "없음" },
      { label: "직접 입력", isCustom: true },
    ],
  },
];

const ORC_MESSAGES: MessageInfo[] = [
  {
    id: "orc-1",
    role: "assistant",
    content: "오크 전사 노트를 불러왔어요. 정면 전신, 45도, 측면, 후면 뷰와 장비 파츠를 기준으로 3D 모델링에 바로 이어질 수 있는 제작 시안을 구성할게요.",
    time: "오후 2:30",
  },
  {
    id: "orc-2",
    role: "user",
    content: "녹색 피부의 강인한 오크 전사를 만들고 싶어. 어깨 갑옷, 팔 보호구, 해골 벨트, 큰 목재 무기가 잘 보였으면 좋겠어.",
    time: "오후 2:31",
  },
  {
    id: "orc-3",
    role: "assistant",
    content: "좋아요. 캐릭터 실루엣은 넓은 어깨와 묵직한 체형으로 유지하고, 장비는 어깨 갑옷, 스파이크 팔 보호구, 해골 벨트, 목재 무기가 분리해서 읽히도록 프롬프트를 정리했습니다.",
    time: "오후 2:32",
    chips: [
      { label: "오크 전사", isSelected: true },
      { label: "장비 분리" },
      { label: "정면 전신" },
      { label: "턴어라운드" },
      { label: "게임용 모델링" },
    ],
  },
];

function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export default function FullWorkflowPage({
  onNavigate,
  showIntroOverlay,
}: {
  onNavigate?: (page: string) => void;
  showIntroOverlay?: boolean;
}) {
  const [projects, setProjects] = useState(PROJECTS);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageInfo[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [promptDraft, setPromptDraft] = useState("");
  const [isBoardPopupOpen, setIsBoardPopupOpen] = useState(false);
  const [boardPopupView, setBoardPopupView] = useState<"notes" | "references">("notes");
  const [boardSelectedNotes, setBoardSelectedNotes] = useState<number[]>([]);
  const [boardSelectedReferences, setBoardSelectedReferences] = useState<number[]>([]);
  const [isProjectPopupOpen, setIsProjectPopupOpen] = useState(false);
  const [chatInputImages, setChatInputImages] = useState<number[]>([]);
  const [selectedReferences, setSelectedReferences] = useState<number[]>([]);
  const [refTags, setRefTags] = useState<Record<number, string[]>>({});
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  const handleToggleRefTag = (id: number, tag: string, idx: number) => {
    setRefTags((prev) => {
      let currentTags = prev[id];
      if (!currentTags) {
        currentTags = idx < 3 ? [["그림체", "무기", "얼굴"][idx]] : [];
      }
      if (currentTags.includes(tag)) {
        return { ...prev, [id]: currentTags.filter((t) => t !== tag) };
      } else {
        return { ...prev, [id]: [...currentTags, tag] };
      }
    });
  };

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [stagedNotes, setStagedNotes] = useState<number[]>([]);
  const [stagedReferences, setStagedReferences] = useState<number[]>([]);

  const openBoardImportPopup = () => {
    setBoardPopupView("notes");
    setBoardSelectedNotes([]);
    setBoardSelectedReferences([]);
    setIsBoardPopupOpen(true);
  };

  const handleBoardImportCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    openBoardImportPopup();
  };

  const [workflowStep, setWorkflowStep] = useState<"prompt" | "image-generation">("prompt");
  const [selectedGridImage, setSelectedGridImage] = useState<number | null>(null);
  const [generatedImageCount, setGeneratedImageCount] = useState(4);
  const [isGeneratingInitialImages, setIsGeneratingInitialImages] = useState(false);
  const [isGeneratingMoreImages, setIsGeneratingMoreImages] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<"prompt" | "expert">("prompt");
  const [expertTab, setExpertTab] = useState<"turnaround" | "modular">("turnaround");
  const [isTurnaroundSelected, setIsTurnaroundSelected] = useState<boolean>(false);
  const [isModularSelected, setIsModularSelected] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [hasGeneratedImages, setHasGeneratedImages] = useState<boolean>(false);
  const [hasReturnedFromGeneratedStep, setHasReturnedFromGeneratedStep] = useState<boolean>(false);
  const [isOrcWorkflow, setIsOrcWorkflow] = useState<boolean>(false);
  const [importedNoteReferences, setImportedNoteReferences] = useState<Array<{ id: number; title: string; image: string }>>([]);
  const [editingGeneratedImage, setEditingGeneratedImage] = useState<number | null>(null);
  const [generatedImageEditDraft, setGeneratedImageEditDraft] = useState("");
  const [regeneratingImageIndex, setRegeneratingImageIndex] = useState<number | null>(null);
  const [generatedImageVersions, setGeneratedImageVersions] = useState<Record<number, number>>({});
  const [generatedImageHistories, setGeneratedImageHistories] = useState<Record<number, GeneratedImageHistoryVersion[]>>({});
  const [isImageAreaSelectionEnabled, setIsImageAreaSelectionEnabled] = useState(false);
  const [isDrawingImageArea, setIsDrawingImageArea] = useState(false);
  const [generatedImageSelectionDraft, setGeneratedImageSelectionDraft] = useState<ImageEditPoint[]>([]);
  const generatedImageSelectionRef = useRef<HTMLDivElement>(null);

  const getAvailableNotes = (): NoteItem[] => {
    if (typeof window === "undefined") return NOTES;
    try {
      const saved = window.localStorage.getItem("neopoly_notes_v3");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length ? (parsed as NoteItem[]) : NOTES;
    } catch {
      return NOTES;
    }
  };

  const getSelectedNotes = (noteIds: number[]) => {
    const notes = getAvailableNotes();
    return noteIds
      .map((noteId) => notes.find((note) => note.id === noteId))
      .filter((note): note is NoteItem => Boolean(note));
  };

  const noteIsOrcRelated = (note: NoteItem) => {
    const searchable = [note?.title, note?.desc, ...(note?.tags || [])].filter(Boolean).join(" ").toLowerCase();
    return searchable.includes("오크") || searchable.includes("orc");
  };

  const buildNoteReferenceAssets = (notes: NoteItem[]) => {
    const seenImages = new Set<string>();
    return notes.flatMap((note) =>
      (note.images || []).flatMap((image: string, imageIndex: number) => {
        if (!image || seenImages.has(image)) return [];
        seenImages.add(image);
        return [{
          id: -(10000 + Number(note.id) * 100 + imageIndex),
          title: `${note.title} ${imageIndex + 1}`,
          image,
        }];
      }),
    );
  };

  const getWorkflowReferenceAsset = (id: number) =>
    ASSETS.find((asset) => asset.id === id) ||
    ORC_WORKFLOW_REFERENCES.find((asset) => asset.id === id) ||
    importedNoteReferences.find((asset) => asset.id === id);
  const hasSelectedGeneratedImage = selectedGridImage !== null;
  const hasGeneratedImageSelection = generatedImageSelectionDraft.length >= 3;
  const editingGeneratedImageHistory: GeneratedImageHistoryVersion[] =
    editingGeneratedImage === null
      ? []
      : [
          { id: 0, label: "원본", prompt: "", selection: [] },
          ...(generatedImageHistories[editingGeneratedImage] ?? []),
        ];
  const activeEditingVersion =
    editingGeneratedImage === null ? 0 : (generatedImageVersions[editingGeneratedImage] ?? 0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawReturnState = window.sessionStorage.getItem("neopoly:return-to-generated-images");
    if (!rawReturnState) return;

    window.sessionStorage.removeItem("neopoly:return-to-generated-images");

    let returnState: {
      isOrcWorkflow?: boolean;
      selectedGridImage?: number;
      isTurnaroundSelected?: boolean;
      isModularSelected?: boolean;
    } = {};

    try {
      returnState = JSON.parse(rawReturnState);
    } catch {
      returnState = {};
    }

    const restoredProjectId = Date.now();
    const shouldUseOrcWorkflow = returnState.isOrcWorkflow ?? true;

    setProjects((prev) => [
      {
        id: restoredProjectId,
        name: shouldUseOrcWorkflow ? "오크 전사 모델링" : "이전 작업",
        status: "In Progress",
        statusColor: COLORS.gold,
        date: new Date().toLocaleDateString("ko-KR").replace(/\./g, "."),
        image: shouldUseOrcWorkflow ? "/images/orc/orc_2D_front.png" : "",
      },
      ...prev,
    ]);
    setActiveProject(restoredProjectId);
    setMessages(shouldUseOrcWorkflow ? ORC_MESSAGES : INITIAL_MESSAGES);
    setPromptDraft(
      shouldUseOrcWorkflow
        ? "강인한 오크 전사 캐릭터. 초록 피부, 무거운 가죽과 금속 장비, 나무 몽둥이, 게임용 3D 모델링에 적합한 선명한 실루엣."
        : "",
    );
    setSelectedReferences(shouldUseOrcWorkflow ? ORC_WORKFLOW_REFERENCE_IDS : []);
    setIsOrcWorkflow(shouldUseOrcWorkflow);
    setWorkflowStep("image-generation");
    setRightPanelMode("prompt");
    setHasGeneratedImages(true);
    setHasReturnedFromGeneratedStep(true);
    setHasUnsavedChanges(false);
    setSelectedGridImage(returnState.selectedGridImage ?? 0);
    setIsTurnaroundSelected(returnState.isTurnaroundSelected ?? true);
    setIsModularSelected(returnState.isModularSelected ?? false);
  }, []);

  const handleGeneratedImageSelect = (imageIndex: number) => {
    if (regeneratingImageIndex === imageIndex) return;
    if (selectedGridImage === imageIndex) {
      setSelectedGridImage(null);
      setIsTurnaroundSelected(false);
      setIsModularSelected(false);
      return;
    }
    setSelectedGridImage(imageIndex);
  };

  const handleGenerateMoreImages = () => {
    if (isGeneratingMoreImages) return;
    setIsGeneratingMoreImages(true);
    window.setTimeout(() => {
      setGeneratedImageCount((current) => current + 4);
      setIsGeneratingMoreImages(false);
    }, 1200);
  };

  const openGeneratedImageEditor = (imageIndex: number) => {
    if (regeneratingImageIndex === imageIndex) return;
    const activeVersionId = generatedImageVersions[imageIndex] ?? 0;
    const activeVersion =
      activeVersionId === 0
        ? { id: 0, label: "원본", prompt: "", selection: [] }
        : generatedImageHistories[imageIndex]?.find((version) => version.id === activeVersionId);

    setEditingGeneratedImage(imageIndex);
    setGeneratedImageEditDraft(activeVersion?.prompt ?? "");
    setGeneratedImageSelectionDraft(activeVersion?.selection ?? []);
    setIsImageAreaSelectionEnabled(false);
    setIsDrawingImageArea(false);
  };

  const handleSelectGeneratedImageVersion = (version: GeneratedImageHistoryVersion) => {
    if (editingGeneratedImage === null) return;
    setGeneratedImageVersions((current) => ({ ...current, [editingGeneratedImage]: version.id }));
    setGeneratedImageEditDraft(version.prompt);
    setGeneratedImageSelectionDraft([]);
    setIsImageAreaSelectionEnabled(false);
    setIsDrawingImageArea(false);
  };

  const closeGeneratedImageEditor = () => {
    setEditingGeneratedImage(null);
    setGeneratedImageEditDraft("");
    setGeneratedImageSelectionDraft([]);
    setIsImageAreaSelectionEnabled(false);
    setIsDrawingImageArea(false);
  };

  const getImageEditPoint = (event: React.PointerEvent<HTMLDivElement>): ImageEditPoint | null => {
    const bounds = generatedImageSelectionRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0 || bounds.height === 0) return null;

    return {
      x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)),
    };
  };

  const handleImageAreaPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isImageAreaSelectionEnabled) return;
    const point = getImageEditPoint(event);
    if (!point) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setGeneratedImageSelectionDraft([point]);
    setIsDrawingImageArea(true);
  };

  const handleImageAreaPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isImageAreaSelectionEnabled || !isDrawingImageArea) return;
    const point = getImageEditPoint(event);
    if (!point) return;

    setGeneratedImageSelectionDraft((current) => {
      const previous = current[current.length - 1];
      if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) < 0.7) return current;
      return [...current, point];
    });
  };

  const handleImageAreaPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawingImageArea) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDrawingImageArea(false);
    setIsImageAreaSelectionEnabled(false);
  };

  const handleRegenerateGeneratedImage = () => {
    if (editingGeneratedImage === null || !generatedImageEditDraft.trim()) return;

    const imageIndex = editingGeneratedImage;
    const editPrompt = generatedImageEditDraft.trim();
    const editSelection = generatedImageSelectionDraft.length >= 3 ? [...generatedImageSelectionDraft] : [];
    const nextVersionId = (generatedImageHistories[imageIndex]?.length ?? 0) + 1;
    const nextVersion: GeneratedImageHistoryVersion = {
      id: nextVersionId,
      label: `수정 ${nextVersionId}`,
      prompt: editPrompt,
      selection: editSelection,
    };

    setRegeneratingImageIndex(imageIndex);

    window.setTimeout(() => {
      setGeneratedImageHistories((current) => ({
        ...current,
        [imageIndex]: [...(current[imageIndex] ?? []), nextVersion],
      }));
      setGeneratedImageVersions((current) => ({ ...current, [imageIndex]: nextVersionId }));
      setGeneratedImageEditDraft(editPrompt);
      setGeneratedImageSelectionDraft([]);
      setIsImageAreaSelectionEnabled(false);
      setIsDrawingImageArea(false);
      setRegeneratingImageIndex(null);
    }, 1400);
  };

  const handleToggleTurnaround = () => {
    if (!hasSelectedGeneratedImage) return;
    setIsTurnaroundSelected((current) => !current);
  };

  const handleToggleModular = () => {
    if (!hasSelectedGeneratedImage) return;
    setIsModularSelected((current) => !current);
  };

  const handleDirectModeling = () => {
    if (!hasSelectedGeneratedImage) return;
    if (typeof window !== "undefined") {
      requestModelGeneration(window.sessionStorage, "direct");
    }
    onNavigate?.("modeling_generation");
  };

  const handleRefineSelectedSettings = () => {
    if (!hasSelectedGeneratedImage) return;
    const nextStep = resolveImageWorkflowNextStep(
      isTurnaroundSelected,
      isModularSelected,
    );

    if (nextStep.page === "turnaround" && onNavigate) {
      if (typeof window !== "undefined") {
        requestTurnaroundFlow(window.sessionStorage, {
          startTab: nextStep.startTab,
          isTurnaroundSelected,
          isModularSelected,
          selectedGridImage,
          isOrcWorkflow,
        });
      }
      onNavigate("turnaround");
      return;
    }

    if (typeof window !== "undefined") {
      requestModelGeneration(window.sessionStorage, "image-generation");
    }
    onNavigate?.("modeling_generation");
  };

  const DUMMY_GENERATED_IMAGES = [
    "/images/orc/orc_create01.png",
    "/images/orc/orc_create02.png",
    "/images/orc/orc_create03.png",
    "/images/orc/orc_create04.png",
  ];

  const GENERATED_IMAGE_BACKGROUNDS = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
  const getGeneratedImageSource = (imageIndex: number) =>
    DUMMY_GENERATED_IMAGES[imageIndex % DUMMY_GENERATED_IMAGES.length];
  const getGeneratedImageBackground = (imageIndex: number) =>
    GENERATED_IMAGE_BACKGROUNDS[imageIndex % GENERATED_IMAGE_BACKGROUNDS.length];

  const buildPromptFromNotes = (noteIds: number[]) => {
    const selectedNotes = getSelectedNotes(noteIds);
    if (selectedNotes.length === 0) return "";

    return selectedNotes
      .map((note) => {
        const tags = (note.tags || []).join(" ");
        return [`[${note.title}]`, note.desc, tags].filter(Boolean).join("\n");
      })
      .join("\n\n");
  };

  const appendPromptFromNotes = (noteIds: number[]) => {
    const selectedNotes = getSelectedNotes(noteIds);
    const notePrompt = buildPromptFromNotes(noteIds);
    if (selectedNotes.length === 0 || !notePrompt) return;

    const noteReferences = buildNoteReferenceAssets(selectedNotes);
    const noteReferenceIds = noteReferences.map((asset) => asset.id);
    const hasOrcNote = selectedNotes.some(noteIsOrcRelated);

    setPromptDraft((prev) => [prev.trim(), notePrompt].filter(Boolean).join("\n\n"));
    setImportedNoteReferences((prev) => {
      const nextByImage = new Map([...prev, ...noteReferences].map((asset) => [asset.image, asset]));
      return Array.from(nextByImage.values());
    });
    setSelectedReferences((prev) => Array.from(new Set([...prev, ...noteReferenceIds])));
    if (hasOrcNote) {
      setIsOrcWorkflow(true);
      setMessages(ORC_MESSAGES);
    }
    setHasUnsavedChanges(true);
  };

  const handleStartProjectWithAssets = (
    noteIds = stagedNotes,
    referenceIds = stagedReferences,
  ) => {
    const selectedNotes = getSelectedNotes(noteIds);
    const hasOrcNote = selectedNotes.some(noteIsOrcRelated);
    const notePrompt = buildPromptFromNotes(noteIds);
    const noteReferenceAssets = buildNoteReferenceAssets(selectedNotes);
    const noteReferenceIds = noteReferenceAssets.map((asset) => asset.id);

    setImportedNoteReferences(noteReferenceAssets);
    const mergedRefIds = Array.from(new Set([...referenceIds, ...noteReferenceIds]));
    setSelectedReferences(mergedRefIds);

    // Create a new project instance
    const newProjectId = Date.now();
    const newProject = {
      id: newProjectId,
      name: hasOrcNote ? "오크 전사 모델링" : "새로운 프로젝트",
      status: "Just Started",
      statusColor: COLORS.gold,
      date: new Date().toLocaleDateString("ko-KR").replace(/\./g, "."),
      image:
        hasOrcNote
          ? "/images/orc/orc_2D_front.png"
          : mergedRefIds.length > 0
          ? getWorkflowReferenceAsset(mergedRefIds[0])?.image || ""
          : "",
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProjectId);
    setMessages(hasOrcNote ? ORC_MESSAGES : []);
    setPromptDraft(notePrompt);
    setIsOrcWorkflow(hasOrcNote);
    setWorkflowStep("prompt");
    setRightPanelMode("prompt");
    setHasGeneratedImages(false);
    setHasReturnedFromGeneratedStep(false);
    setHasUnsavedChanges(false);
    setStagedNotes([]);
    setStagedReferences([]);
  };

  const handleStartEmptyProject = () => {
    setSelectedReferences([]);
    setImportedNoteReferences([]);
    setStagedNotes([]);
    setStagedReferences([]);
    setIsOrcWorkflow(false);
    setPromptDraft("");

    const newProjectId = Date.now();
    const newProject = {
      id: newProjectId,
      name: "새 프로젝트",
      status: "Just Started",
      statusColor: COLORS.gold,
      date: new Date().toLocaleDateString("ko-KR").replace(/\./g, "."),
      image: "",
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProjectId);
    setMessages([]);
    setHasGeneratedImages(false);
    setHasReturnedFromGeneratedStep(false);
    setHasUnsavedChanges(false);
  };

  const handleGenerateImage = () => {
    if (isGeneratingInitialImages) return;
    setWorkflowStep("image-generation");
    startImageGenerationLoading({
      setLoading: setIsGeneratingInitialImages,
      onComplete: () => {
        setHasGeneratedImages(true);
        setHasReturnedFromGeneratedStep(false);
        setHasUnsavedChanges(false);
        setSelectedGridImage(null);
        setIsTurnaroundSelected(false);
        setIsModularSelected(false);
      },
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const now = new Date();
    const timeString = now
      .toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" })
      .replace("AM", "오전")
      .replace("PM", "오후");

    const newMessage: MessageInfo = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      time: timeString,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setHasUnsavedChanges(true);
    scrollToBottom();

    // 심플한 자동 응답
    setTimeout(() => {
      const aiResponse: MessageInfo = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "말씀하신 내용을 추가 요소로 반영하겠습니다. 오른쪽 프롬프트를 확인해주세요!",
        time: timeString,
      };
      setMessages((prev) => [...prev, aiResponse]);
      scrollToBottom();
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="np-workspace-shell relative flex h-[calc(100dvh-60px)] w-full overflow-hidden bg-[#050505] font-sans text-white antialiased lg:h-[calc(100dvh-76px)]">
      {showIntroOverlay && (
        <FullWorkflowIntroPage
          onNavigate={onNavigate}
          onClose={() => onNavigate?.("full_workflow_chat")}
        />
      )}

      {/* Main Content Area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto custom-scrollbar lg:flex-row lg:overflow-hidden">
        {activeProject === null ? (
          <div className="relative flex h-full w-full flex-1 flex-col items-center justify-start overflow-y-auto bg-[#050505] p-4 custom-scrollbar sm:p-8 lg:justify-center">
            <div className="flex min-h-full w-full max-w-[1200px] flex-col items-center justify-center py-10 sm:py-12 lg:min-h-[60vh] lg:pb-16 lg:pt-0">
              <div className="w-20 h-20 bg-[#141518] rounded-[24px] flex items-center justify-center border border-[#2A2E36] mb-8 shadow-xl">
                <Sparkles className="w-10 h-10 text-brand-primary" />
              </div>
              <h2 className="mb-4 text-center text-[28px] font-bold tracking-tight text-white sm:text-[32px]">
                새로운 작업 시작하기
              </h2>
              <p className="mb-8 max-w-xl text-center text-[14px] leading-[1.65] text-neutral-300 sm:mb-12 sm:text-[16px]">
                바로 빈 캔버스에서 아이디어를 펼치거나,
                <br />
                미리 정리해둔 보드 자료를 세팅하고 시작할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8 xl:gap-10 w-full">
                {/* 빈 프로젝트로 시작 */}
                <button
                  onClick={handleStartEmptyProject}
                  className="group relative flex h-full flex-col items-center justify-start overflow-hidden rounded-[20px] border border-[#1F2329] bg-[#0A0B0D] px-5 pb-7 pt-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all hover:border-brand-primary/50 hover:bg-[#141518] sm:rounded-[24px] sm:px-7 sm:pb-9 sm:pt-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="h-12 mb-6 flex items-center justify-center shrink-0">
                    <FolderPlus className="w-12 h-12 text-brand-primary group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-3 relative z-10 shrink-0">
                    빈 프로젝트로 시작
                  </h3>
                  <p className="text-[15px] text-neutral-300 relative z-10 leading-[1.65] mb-auto shrink-0 whitespace-pre-line">
                    {"아무 제약 없이 깨끗한 상태에서\n자유롭게 구상을 시작합니다."}
                  </p>
                </button>

                {/* 진행중인 프로젝트로 시작 */}
                <button
                  onClick={() => setIsProjectPopupOpen(true)}
                  className="group relative flex h-full flex-col items-center justify-start overflow-hidden rounded-[20px] border border-[#1F2329] bg-[#0A0B0D] px-5 pb-7 pt-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all hover:border-brand-primary/50 hover:bg-[#141518] sm:rounded-[24px] sm:px-7 sm:pb-9 sm:pt-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="h-12 mb-6 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-12 h-12 text-brand-primary group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-3 relative z-10 shrink-0">
                    프로젝트 이어서 시작
                  </h3>
                  <p className="text-[15px] text-neutral-300 relative z-10 leading-[1.65] mb-auto shrink-0 whitespace-pre-line">
                    {"최근에 진행하던 프로젝트를\n선택하여 작업을 이어갑니다."}
                  </p>
                </button>

                {/* 자료 가져와서 시작 */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openBoardImportPopup}
                  onKeyDown={handleBoardImportCardKeyDown}
                  className="group relative flex h-full cursor-pointer flex-col items-center justify-start overflow-hidden rounded-[20px] border border-[#1F2329] bg-[#0A0B0D] px-5 pb-7 pt-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all hover:border-brand-primary/50 hover:bg-[#141518] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70 sm:rounded-[24px] sm:px-7 sm:pb-9 sm:pt-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center w-full h-full"
                  >
                    <div className="h-12 mb-6 flex items-center justify-center shrink-0">
                      {stagedNotes.length === 0 &&
                      stagedReferences.length === 0 ? (
                        <Inbox className="w-12 h-12 text-brand-primary group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="flex items-center gap-2">
                          {stagedNotes.length > 0 && (
                            <span className="px-3 py-1 bg-[#60A5FA]/10 text-[#60A5FA] rounded-full text-[14px] font-medium border border-[#60A5FA]/20 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" /> 노트{" "}
                              {stagedNotes.length}
                            </span>
                          )}
                          {stagedReferences.length > 0 && (
                            <span className="px-3 py-1 bg-[#4ADE80]/10 text-[#4ADE80] rounded-full text-[14px] font-medium border border-[#4ADE80]/20 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5" /> 레퍼런스{" "}
                              {stagedReferences.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <h3 className="text-[20px] font-bold text-white mb-3 shrink-0">
                      보드에서 가져오기
                    </h3>
                    <p className="text-[15px] text-neutral-300 mb-auto leading-[1.65] shrink-0 whitespace-pre-line">
                      {stagedNotes.length > 0 || stagedReferences.length > 0
                        ? "선택한 자료가 워크스페이스에 자동으로 복사됩니다."
                        : "보드에 정리한 노트와 레퍼런스를\n작업 공간에 한 번에 세팅합니다."}
                    </p>


                    <AnimatePresence>
                      {(stagedNotes.length > 0 ||
                        stagedReferences.length > 0) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            marginTop: 24,
                          }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="w-full flex gap-3 overflow-hidden"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStagedNotes([]);
                              setStagedReferences([]);
                            }}
                            className="flex-1 py-3 bg-[#141518] hover:bg-[#1C1E23] text-neutral-400 rounded-xl text-[14px] font-medium transition-colors border border-[#2A2E36]"
                          >
                            초기화
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartProjectWithAssets();
                            }}
                            className="np-primary-action flex-[2] py-3 bg-brand-primary hover:bg-[#F0B43A] text-[#050505] rounded-xl text-[14px] font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(224,161,46,0.2)]"
                          >
                            작업 시작 <ChevronRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>

              {/* Removed */}
            </div>
          </div>
        ) : (
          <>
            <div className="relative flex min-h-[65dvh] min-w-0 flex-1 flex-col lg:min-h-0">
              {workflowStep === "prompt" ? (
                <>
                  {/* Main Top Header */}
                  <WorkflowHeader
                    title="프롬프트 작성"
                    section="image"
                    currentStep="prompt"
                  />

                  {/* Chat Area */}
                  <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-5 pb-4 custom-scrollbar sm:px-6 lg:gap-8 lg:px-8">
                    {messages.map((msg) => {
                  if (msg.role === "assistant") {
                    return (
                      <div key={msg.id} className="flex gap-4 max-w-[85%]">
                        <div className="w-9 h-9 rounded-full bg-[#141518] border border-[#2A2E36] flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex flex-col gap-1.5 items-start">
                          <div className="bg-[#141518] border border-[#1F2329] rounded-2xl rounded-tl-sm px-5 py-4 text-[15px] text-neutral-100 leading-[1.65] font-medium">
                            {msg.content}
                          </div>

                          {msg.chips && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {msg.chips.map((chip, i) => {
                                if (chip.isCustom) {
                                  return (
                                    <button
                                      key={i}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1F2329] bg-[#0A0B0D] hover:bg-[#141518] text-neutral-300 text-[14px] transition-colors"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      {chip.label}
                                    </button>
                                  );
                                }

                                if (chip.isSelected) {
                                  return (
                                    <button
                                      key={i}
                                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-primary bg-brand-primary/10 text-neutral-100 text-[14px] transition-colors"
                                    >
                                      {chip.label}
                                    </button>
                                  );
                                }

                                return (
                                  <button
                                    key={i}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#1F2329] bg-[#0A0B0D] hover:bg-[#141518] text-neutral-300 text-[14px] transition-colors"
                                  >
                                    {chip.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {!msg.chips && (
                            <span className="text-[14px] text-neutral-400 ml-2">
                              {msg.time}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={msg.id}
                        className="flex gap-4 max-w-[85%] self-end flex-row-reverse mt-2"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#141518] border border-[#2A2E36] flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-neutral-300" />
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <div className="bg-[#1C1E23] border border-[#2A2E36] rounded-2xl rounded-tr-sm px-5 py-4 text-[15px] text-neutral-100 font-medium tracking-tight leading-[1.55]">
                            {msg.content}
                          </div>
                          <span className="text-[14px] text-neutral-400 mr-2">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}

                {/* Removed Image Grid Block from Here */}
                <div ref={chatEndRef} />
              </div>

              {/* Bottom Custom Input */}
              <div className="px-8 pb-8 pt-4 shrink-0">
                <div className="bg-[#0A0B0D] border border-[#2A2E36] rounded-2xl p-3 shadow-lg flex flex-col">
                  {chatInputImages.length > 0 && (
                    <div className="flex items-center gap-3 px-2 pb-3 mb-2 border-b border-[#1F2329] overflow-x-auto custom-scrollbar">
                      {chatInputImages.map((id) => {
                        const asset = ASSETS.find((a: any) => a.id === id);
                        if (!asset) return null;
                        return (
                          <div
                            key={id}
                            className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#2A2E36]"
                          >
                            <img
                              referrerPolicy="no-referrer"
                              src={asset.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() =>
                                setChatInputImages((prev) =>
                                  prev.filter((refId) => refId !== id),
                                )
                              }
                              className="absolute top-1 right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="더 추가하고 싶은 내용이 있다면 자유롭게 입력하세요..."
                    className="w-full bg-transparent border-none text-[15px] text-neutral-100 focus:outline-none px-2 py-1 placeholder:text-neutral-400"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex items-center justify-between mt-3 px-2">
                    <div className="flex items-center gap-3 text-neutral-300">
                      <button className="hover:text-white transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                      <button className="hover:text-white transition-colors">
                        <ImageIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleSend}
                      className="bg-brand-primary hover:bg-[#F0B43A] text-black rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col bg-[#050505]">
                <WorkflowHeader
                  title="이미지 생성"
                  section="image"
                  currentStep="image-generation"
                />
                <div className="relative min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar lg:p-6 2xl:p-8">
                  {isGeneratingInitialImages ? (
                    <div className="flex min-h-full items-center justify-center">
                      <LoadingIndicator size="lg" label="이미지 생성 중" layout="stacked" />
                    </div>
                  ) : (
                  <div className="mx-auto flex min-h-full w-full max-w-[2200px] flex-col">
                  <div
                    className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 2xl:gap-5 ${
                      generatedImageCount <= 4
                        ? "min-h-[calc(100dvh-180px)] flex-1 grid-rows-none sm:grid-rows-2"
                        : "auto-rows-[minmax(260px,42dvh)] sm:auto-rows-[minmax(320px,42dvh)]"
                    }`}
                  >
                    {Array.from({ length: generatedImageCount }, (_, i) => i).map((i) => (
                      <div
                        key={i}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleGeneratedImageSelect(i)}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter" && event.key !== " ") return;
                          event.preventDefault();
                          handleGeneratedImageSelect(i);
                        }}
                        style={{ backgroundColor: getGeneratedImageBackground(i) }}
                        className={`np-dark-media np-generated-image-card group relative block h-full w-full overflow-hidden rounded-xl border-[2px] transition-all duration-300 ${
                          selectedGridImage === i ? "border-brand-primary" : "border-[#1F2329] hover:border-[#555A64]"
                        } ${regeneratingImageIndex === i ? "cursor-wait" : ""}`}
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={`${getGeneratedImageSource(i)}?edit=${generatedImageVersions[i] ?? 0}&slot=${i}`}
                          alt={`생성 이미지 ${i + 1}`}
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                           {selectedGridImage === i && (
                             <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-black shadow-lg">
                               <Check className="w-4 h-4 stroke-[3]" />
                             </div>
                           )}
                        </div>

                        {/* Top Actions Bar (Hover) */}
                        <div className="np-generated-image-actions absolute inset-x-0 top-0 flex items-center justify-end bg-gradient-to-b from-black/60 to-transparent p-2 pb-10 opacity-100 transition-opacity duration-300 md:p-4 md:pb-12 md:opacity-0 md:group-hover:opacity-100">
                          <div className="flex items-center gap-1.5 sm:gap-3">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openGeneratedImageEditor(i);
                              }}
                              className="np-generated-image-action np-generated-image-action-edit flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-md"
                              title={`시안 ${i + 1} 수정`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(event) => event.stopPropagation()}
                              className="np-generated-image-action w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center"
                              title="이미지 다운로드"
                            >
                              <Download className="w-4 h-4 text-white" />
                            </button>
                            <button
                              type="button"
                              onClick={(event) => event.stopPropagation()}
                              className="np-generated-image-action w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center"
                              title="보드에 저장"
                            >
                              <Bookmark className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>

                        {regeneratingImageIndex === i && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white backdrop-blur-sm">
                            <LoadingIndicator size="md" label="수정 시안 생성 중" layout="stacked" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                  )}
              </div>
              </div>
            )}
            </div>

            {/* Right Sidebar - Output & Options */}
            {workflowStep === "prompt" ? (
              ((rightPanelMode === "prompt") || rightPanelMode === "expert") && (
              <div className="flex h-[70dvh] w-full flex-shrink-0 flex-col overflow-hidden border-t border-[#1F2329] bg-[#050505] lg:h-full lg:w-[420px] lg:border-l lg:border-t-0 xl:w-[480px] 2xl:w-[550px]">
                {rightPanelMode === "prompt" ? (
                <>
                  <WorkflowSidebarHeader
                    title="프롬프트 설정"
                    action={
                      <span className="text-[14px] text-neutral-500">
                        레퍼런스 {selectedReferences.length}개
                      </span>
                    }
                  />
                  <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6 pb-0">
                    {/* Selected Refs */}
                    <div className="flex max-h-[45dvh] shrink-0 flex-col rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4">
                      <div className="flex items-center justify-between mb-3 text-[14px] shrink-0">
                        <span className="text-neutral-100 font-bold">레퍼런스</span>
                        <span className="text-neutral-400">
                          {selectedReferences.length} / 20
                        </span>
                      </div>
                      <div className="overflow-y-auto scrollbar-hide flex-1 pb-1 pr-1">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {selectedReferences.map((id, i) => {
                            const asset = getWorkflowReferenceAsset(id);
                            if (!asset) return null;
                            const tags =
                              refTags[id] ||
                              (i < 3 ? [["그림체", "무기", "얼굴"][i]] : []);

                            const isEditing = editingTagId === id;

                            return (
                              <div
                                key={id}
                                className="np-dark-media relative aspect-square flex flex-col justify-end group"
                              >
                                <div className="absolute inset-0 border border-[#1F2329] rounded-lg overflow-hidden">
                                  <img
                                    referrerPolicy="no-referrer"
                                    src={asset.image}
                                    className="w-full h-full object-cover"
                                    alt=""
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedReferences((prev) =>
                                        prev.filter((refId) => refId !== id),
                                      );
                                      setHasUnsavedChanges(true);
                                    }}
                                    aria-label="레퍼런스 제거"
                                    className="absolute right-2 top-2 z-20 rounded-md border border-white/10 bg-black/60 p-1.5 text-white/70 opacity-100 backdrop-blur-sm transition-opacity hover:text-white md:opacity-0 md:group-hover:opacity-100"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Tag indicator / inline input */}
                                <div className="relative z-10 mx-1 mb-2">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      autoFocus
                                      defaultValue={tags.join(" ")}
                                      onBlur={(e) => {
                                        const value = e.target.value.trim();
                                        if (value) {
                                          setRefTags((prev) => ({
                                            ...prev,
                                            [id]: value
                                              .split(" ")
                                              .filter(Boolean),
                                          }));
                                        } else {
                                          setRefTags((prev) => ({
                                            ...prev,
                                            [id]: [],
                                          }));
                                        }
                                        setHasUnsavedChanges(true);
                                        setEditingTagId(null);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          e.currentTarget.blur();
                                        }
                                      }}
                                      className="w-full text-center bg-black/70 border border-white/20 rounded-md backdrop-blur-md text-[14px] text-white px-2 py-1 outline-none focus:border-brand-primary"
                                    />
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTagId(id);
                                      }}
                                      className="mx-auto flex w-full items-center justify-center gap-1.5 px-2.5 py-1 bg-black/70 hover:bg-black/90 border border-white/20 rounded-md backdrop-blur-md transition-all text-white"
                                    >
                                      <span className="text-[14px] font-medium truncate">
                                        {tags.length > 0
                                          ? `#${tags[0]}` +
                                            (tags.length > 1
                                              ? ` +${tags.length - 1}`
                                              : "")
                                          : "+ 태그"}
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <button
                            className="aspect-square rounded-lg border border-dashed border-[#2A2E36] flex flex-col items-center justify-center gap-1 hover:border-[#555A64] hover:bg-[#141518] transition-colors text-neutral-400"
                            onClick={() => { setBoardPopupView("references"); setBoardSelectedNotes([]); setBoardSelectedReferences([]); setIsBoardPopupOpen(true); }}
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[14px]">추가</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Prompt Preview */}
                    <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-5 flex flex-col flex-1 min-h-0 mb-6 shrink">
                      <div className="flex items-center justify-between mb-3 text-[14px] shrink-0">
                        <span className="text-neutral-100 font-bold">프롬프트</span>
                        <button className="flex items-center gap-1.5 text-[14px] text-neutral-400 hover:text-white transition-colors border border-[#1F2329] rounded-md px-2 py-1">
                          <Copy className="w-3 h-3" /> 복사
                        </button>
                      </div>

                      <div
                        className="flex-1 overflow-y-auto custom-scrollbar text-[15px] text-neutral-100 font-medium leading-[1.65] bg-[#141518] p-3 rounded-lg border border-[#1F2329] focus:outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => {
                          setPromptDraft(e.currentTarget.innerText);
                          setHasUnsavedChanges(true);
                        }}
                      >
                        {promptDraft}
                      </div>

                      <div className="mt-2 text-right text-[14px] text-neutral-400 shrink-0">
                        {promptDraft.length} / 1500
                      </div>
                      </div>
                  </div>

                  <div className="shrink-0 p-6 pt-0 bg-[#050505]">
                    <div className="flex flex-col gap-3">
                      {hasGeneratedImages ? (
                        hasUnsavedChanges ? (
                          <button 
                            onClick={handleGenerateImage}
                            className="np-primary-action w-full bg-brand-primary hover:bg-[#F0B43A] text-black font-medium py-4 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.2)] transition-all flex items-center justify-center gap-2 text-[15px]"
                          >
                            변경사항 적용 및 재생성 ✨
                          </button>
                        ) : (
                          <button 
                            onClick={() => setWorkflowStep("image-generation")}
                            className="w-full bg-[#141518] hover:bg-[#1C1E23] border border-[#2A2E36] text-white font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-[15px]"
                          >
                            {hasReturnedFromGeneratedStep ? "이전으로 복귀" : "이미지 시안 확인"} ▶
                          </button>
                        )
                      ) : (
                        <button 
                          onClick={handleGenerateImage}
                          className="np-primary-action w-full bg-brand-primary hover:bg-[#F0B43A] text-black font-medium py-4 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.2)] transition-all flex items-center justify-center gap-2 text-[15px]"
                        >
                          작업 시작 <Sparkles className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full bg-[#050505]">
                  <WorkflowSidebarHeader
                    title="전문가 설정"
                    action={
                      <button
                        onClick={() => setRightPanelMode("prompt")}
                        className="flex items-center gap-1 text-[14px] font-medium text-neutral-400 transition-colors hover:text-white"
                      >
                        <ChevronDown className="h-4 w-4 rotate-90" />
                        돌아가기
                      </button>
                    }
                  />

                  {/* Tabs */}
                  <div className="flex border-b border-[#1F2329] px-6 shrink-0 bg-[#050505]">
                    <button
                      onClick={() => setExpertTab("turnaround")}
                      className={`py-4 text-[14px] font-medium border-b-2 mr-6 transition-colors ${expertTab === "turnaround" ? "border-brand-primary text-brand-primary" : "border-transparent text-neutral-400 hover:text-white"}`}
                    >
                      턴어라운드 설정
                    </button>
                    <button
                      onClick={() => setExpertTab("modular")}
                      className={`py-4 text-[14px] font-medium border-b-2 mr-6 transition-colors ${expertTab === "modular" ? "border-brand-primary text-brand-primary" : "border-transparent text-neutral-400 hover:text-white"}`}
                    >
                      모듈화 설정
                    </button>
                  </div>

                  {/* Content Area - Scrollable */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#050505]">
                    {expertTab === "turnaround" ? (
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-end">
                            <label className="text-[14px] font-medium text-neutral-100">
                              카메라 렌더링 앵글 (Count)
                            </label>
                            <span className="text-[14px] font-medium text-brand-primary">
                              8 views
                            </span>
                          </div>
                          <p className="text-[15px] text-neutral-300 leading-[1.6] mb-1">
                            생성될 3D 모델의 전후좌우 및 대각선 이미지를 추출할
                            앵글 수를 정합니다. 높을 수록 정교하지만 생성 시간이
                            늘어납니다.
                          </p>
                          <input
                            type="range"
                            min="4"
                            max="16"
                            step="2"
                            defaultValue="8"
                            className="w-full accent-brand-primary mt-2 bg-[#1A1C20] h-1.5 rounded-lg appearance-none outline-none"
                          />
                          <div className="flex justify-between text-[14px] text-neutral-400 mt-1 font-mono">
                            <span>4</span>
                            <span>16</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-[14px] font-medium text-neutral-100">
                            토폴로지 최적화 단계 (Topology)
                          </label>
                          <p className="text-[15px] text-neutral-300 leading-[1.6] mb-2">
                            게임 엔진용(Low-Poly)부터 시네마틱용(High-Poly)까지 메쉬의 조밀도를 설정합니다.
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <button className="bg-[#1A1C20] hover:bg-[#1F2329] border border-[#2A2E36] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors">
                              <span className="text-[14px] font-medium text-neutral-200">
                                Low Poly
                              </span>
                              <span className="text-[14px] text-neutral-400">
                                모바일 / VR
                              </span>
                            </button>
                            <button className="bg-brand-primary/10 border border-brand-primary py-3 rounded-xl flex flex-col items-center gap-1 transition-colors">
                              <span className="text-[14px] font-medium text-brand-primary">
                                Mid Poly
                              </span>
                              <span className="text-[14px] text-brand-primary/70">
                                일반 PC / 콘솔
                              </span>
                            </button>
                            <button className="bg-[#1A1C20] hover:bg-[#1F2329] border border-[#2A2E36] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors">
                              <span className="text-[14px] font-medium text-neutral-200">
                                High Poly
                              </span>
                              <span className="text-[14px] text-neutral-400">
                                시네마틱 / 랜더링
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-[14px] font-medium text-neutral-100">
                            텍스처 해상도 (Resolution)
                          </label>
                          <select defaultValue="2048 x 2048 (2K)" className="w-full bg-[#1A1C20] border border-[#2A2E36] rounded-xl px-4 py-3.5 text-[14px] text-neutral-200 font-medium focus:outline-none focus:border-brand-primary">
                            <option>1024 x 1024 (1K)</option>
                            <option>2048 x 2048 (2K)</option>
                            <option>4096 x 4096 (4K)</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <label className="text-[14px] font-medium text-neutral-100">
                              세그먼트 파츠 분할 (Auto-Segment)
                            </label>
                            <div className="w-10 h-6 bg-brand-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(224,161,46,0.3)]">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full transition-all"></div>
                            </div>
                          </div>
                          <p className="text-[15px] text-neutral-300 leading-[1.6]">
                            단일 메쉬가 아닌 부위별(예: 문, 지붕, 창틀)로 독립된
                            폴리곤 파츠로 분할 생성합니다. 인게임 애니메이션 및
                            상호작용 적용 시 유리합니다.
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-[14px] font-medium text-neutral-100">
                            이음매 처리 강도 (Seam Tolerance)
                          </label>
                          <div className="flex items-center gap-4 bg-[#1A1C20] p-4 rounded-xl border border-[#2A2E36]">
                            <Minus className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-white" />
                            <div className="flex-1 bg-black h-1.5 rounded-full overflow-hidden">
                              <div className="bg-brand-primary h-full w-[60%]"></div>
                            </div>
                            <Plus className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-white" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-[14px] font-medium text-neutral-100">
                            바운딩 박스 생성 (Bounding Box)
                          </label>
                          <div className="flex items-center gap-3 mt-1">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 accent-brand-primary bg-transparent border-[#2A2E36]"
                            />
                            <span className="text-[14px] text-neutral-300">
                              각 파츠별 개별 바운딩 박스 자동 계산
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 accent-brand-primary bg-transparent border-[#2A2E36]"
                            />
                            <span className="text-[14px] text-neutral-300">
                              부모-자식(Parent-Child) 계층 구조 자동 생성
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fixed Bottom Button */}
                  <div className="shrink-0 p-6 pt-5 bg-[#0A0B0D] border-t border-[#1F2329] z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
                    <button className="np-primary-action w-full bg-brand-primary hover:bg-[#F0B43A] text-black font-medium py-4 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.3)] transition-all flex items-center justify-center gap-2 text-[15px]">
                      최종 3D 모델링 생성 <span className="text-[20px]">🚀</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            )) : (
              <div className="flex h-[70dvh] w-full flex-shrink-0 flex-col overflow-hidden border-t border-[#1F2329] bg-[#050505] lg:h-full lg:w-[420px] lg:border-l lg:border-t-0 xl:w-[480px] 2xl:w-[550px]">
                <WorkflowSidebarHeader
                  title="이미지 생성 설정"
                  action={
                    selectedGridImage !== null ? (
                      <span className="rounded-md border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-1 text-[14px] text-brand-primary">
                        시안 {selectedGridImage + 1} 선택
                      </span>
                    ) : null
                  }
                />
                <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 custom-scrollbar flex flex-col gap-5">
                  {/* Reference Settings Area */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-medium text-neutral-100">레퍼런스 세부 설정</h3>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2A2E36] text-[14px] text-neutral-400 hover:text-white hover:bg-[#141518] transition-colors">
                        <RefreshCw className="w-3 h-3" /> 초기화
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Ref 1 */}
                      <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-xl p-2.5 flex gap-3 pr-3">
                        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0 border border-[#2A2E36]">
                          <img referrerPolicy="no-referrer" src={isOrcWorkflow ? "/images/orc/orc_2D_front.png" : ASSETS[3]?.image || ''} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-[14px] font-medium text-neutral-300">{isOrcWorkflow ? "오크 정면 메인 시안" : "메인 컨셉"}</span>
                            <X className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] text-neutral-400">영향도</span>
                            <input type="range" min="0" max="100" defaultValue="85" className="flex-1 accent-brand-primary bg-[#1A1C20] h-1 rounded-lg appearance-none outline-none" />
                            <span className="text-[14px] text-neutral-400 font-mono w-9 text-right">0.85</span>
                          </div>
                        </div>
                      </div>

                      {/* Ref 2 */}
                      <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-xl p-2.5 flex gap-3 pr-3">
                        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0 border border-[#2A2E36] bg-white">
                          <img referrerPolicy="no-referrer" src={isOrcWorkflow ? "/images/orc/orc_default_item01.png" : "/images/work_%2014.png"} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-[14px] font-medium text-neutral-300">{isOrcWorkflow ? "스파이크 팔 보호구" : "바지 장신구"}</span>
                            <X className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] text-neutral-400">영향도</span>
                            <input type="range" min="0" max="100" defaultValue="60" className="flex-1 accent-brand-primary bg-[#1A1C20] h-1 rounded-lg appearance-none outline-none" />
                            <span className="text-[14px] text-neutral-400 font-mono w-9 text-right">0.60</span>
                          </div>
                        </div>
                      </div>

                      {/* Ref 3 */}
                      <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-xl p-2.5 flex gap-3 pr-3">
                        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0 border border-[#2A2E36]">
                          <img referrerPolicy="no-referrer" src={isOrcWorkflow ? "/images/orc/orc_default_item04.png" : "/images/work_%2015.png"} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-[14px] font-medium text-neutral-300 line-clamp-1">{isOrcWorkflow ? "해골 벨트와 허리 장식" : "무기 디자인, 무기는 왼손에 들고있음"}</span>
                            <X className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer shrink-0" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] text-neutral-400 shrink-0">영향도</span>
                            <input type="range" min="0" max="100" defaultValue="90" className="flex-1 accent-brand-primary bg-[#1A1C20] h-1 rounded-lg appearance-none outline-none" />
                            <span className="text-[14px] text-neutral-400 font-mono shrink-0 w-9 text-right">0.90</span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full py-3 rounded-xl border border-dashed border-[#2A2E36] hover:border-[#555A64] text-neutral-400 hover:text-white text-[14px] flex items-center justify-center gap-2 transition-colors mt-1">
                        <Plus className="w-4 h-4" /> 레퍼런스 추가
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#1F2329] my-0 shrink-0"></div>

                  {/* Prompt Summary Area */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-medium text-neutral-100">프롬프트</h3>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2A2E36] text-[14px] text-neutral-400 hover:text-white hover:bg-[#141518] transition-colors">
                        편집
                      </button>
                    </div>

                    <div className="bg-[#141518] border border-[#2A2E36] rounded-xl p-4 flex flex-col gap-3 shadow-inner">
                      <p className="text-[15px] text-neutral-100 leading-[1.65] font-medium">
                        {isOrcWorkflow
                          ? "강인한 오크 전사 캐릭터. 정면 전신 기준, 넓은 어깨와 녹색 피부, 금속 어깨 갑옷, 스파이크 팔 보호구, 해골 허리 장식, 가죽 바지와 부츠, 장비 파츠 분리 가능, 게임용 3D 모델링에 적합한 선명한 실루엣."
                          : "강인한 체형의 오크 캐릭터. 스파이크가 달린 가죽과 금속 갑옷, 해골 장식, 큰 철퇴 무기, 전신 샷, 어두운 배경, 시네마틱 조명, 리얼리스틱, 고디테일."}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(isOrcWorkflow ? ["오크", "전사", "정면", "장비", "모듈화", "턴어라운드"] : ["오크", "전사", "판타지", "갑옷", "금속", "무기"]).map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-[#1C1E23] border border-[#2A2E36] rounded-full text-[14px] text-neutral-300">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-end mt-2 pt-3 border-t border-[#1F2329]">
                        <span className="text-[14px] text-neutral-400">124 / 1500</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isGeneratingMoreImages}
                      onClick={handleGenerateMoreImages}
                      className={`flex self-end items-center justify-center gap-2 rounded-lg border px-4 py-2 text-[14px] font-medium transition ${
                        isGeneratingMoreImages
                          ? "cursor-wait border-[#2A2E36] bg-[#111317] text-neutral-500"
                          : "border-brand-primary/45 bg-brand-primary/10 text-brand-primary hover:border-brand-primary hover:bg-brand-primary/15"
                      }`}
                    >
                      {isGeneratingMoreImages ? (
                        <LoadingIndicator tone="current" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {isGeneratingMoreImages ? "생성 중" : "생성"}
                    </button>
                  </div>
                </div>

                {/* Next Step Area */}
                <div className="shrink-0 px-5 pb-5 pt-3 bg-[#050505]">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[15px] font-medium text-neutral-100 mb-1">다음 단계</h3>
                    
                    {/* Preprocessing Options */}
                    <div className="flex gap-2">
                      <button
                        disabled={!hasSelectedGeneratedImage}
                        onClick={handleToggleTurnaround}
                        className={`flex-1 flex items-center justify-start px-4 py-3.5 rounded-xl border text-[14px] font-medium transition-colors ${!hasSelectedGeneratedImage ? "bg-[#08090B] border-[#1F2329] text-neutral-600 cursor-not-allowed" : isTurnaroundSelected ? "bg-[#141518] border-brand-primary text-brand-primary" : "bg-[#0A0B0D] border-[#2A2E36] text-neutral-400 hover:border-[#555A64] hover:text-white"}`}
                      >
                        <div className={`w-4 h-4 rounded-[4px] border shrink-0 mr-3 flex items-center justify-center transition-colors ${isTurnaroundSelected ? 'bg-brand-primary border-brand-primary' : hasSelectedGeneratedImage ? 'border-[#555A64]' : 'border-[#2A2E36]'}`}>
                          {isTurnaroundSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                        </div>
                        <RefreshCw className="w-4 h-4 mr-2 shrink-0" />
                        <span className="flex-1 text-left">턴어라운드 제작</span>
                      </button>
                      <button
                        disabled={!hasSelectedGeneratedImage}
                        onClick={handleToggleModular}
                        className={`flex-1 flex items-center justify-start px-4 py-3.5 rounded-xl border text-[14px] font-medium transition-colors ${!hasSelectedGeneratedImage ? "bg-[#08090B] border-[#1F2329] text-neutral-600 cursor-not-allowed" : isModularSelected ? "bg-[#141518] border-brand-primary text-brand-primary" : "bg-[#0A0B0D] border-[#2A2E36] text-neutral-400 hover:border-[#555A64] hover:text-white"}`}
                      >
                        <div className={`w-4 h-4 rounded-[4px] border shrink-0 mr-3 flex items-center justify-center transition-colors ${isModularSelected ? 'bg-brand-primary border-brand-primary' : hasSelectedGeneratedImage ? 'border-[#555A64]' : 'border-[#2A2E36]'}`}>
                          {isModularSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                        </div>
                        <Puzzle className="w-4 h-4 mr-2 shrink-0" />
                        <span className="flex-1 text-left">이미지 모듈화</span>
                      </button>
                    </div>

                    {/* Final Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { 
                          setWorkflowStep("prompt"); 
                          setRightPanelMode("prompt");
                          setHasReturnedFromGeneratedStep(true);
                          setHasUnsavedChanges(false);
                        }} 
                        className="w-[30%] bg-[#0A0B0D] hover:bg-[#141518] border border-[#2A2E36] text-neutral-300 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-[14px] font-medium"
                      >
                        <ChevronLeft className="w-4 h-4 text-neutral-400" /> 이전 단계
                      </button>
                      {(!isTurnaroundSelected && !isModularSelected) ? (
                        <button
                          disabled={!hasSelectedGeneratedImage}
                          onClick={handleDirectModeling}
                          className={`w-[70%] font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-[14px] ${hasSelectedGeneratedImage ? "bg-brand-primary hover:bg-[#F0B43A] text-black shadow-[0_0_15px_rgba(224,161,46,0.3)]" : "bg-[#202126] text-neutral-500 cursor-not-allowed"}`}
                        >
                          3D 모델링 생성 <Box className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          disabled={!hasSelectedGeneratedImage}
                          onClick={handleRefineSelectedSettings}
                          className={`w-[70%] font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-[14px] ${hasSelectedGeneratedImage ? "bg-brand-primary hover:bg-[#F0B43A] text-black shadow-[0_0_15px_rgba(224,161,46,0.3)]" : "bg-[#202126] text-neutral-500 cursor-not-allowed"}`}
                        >
                          선택한 설정으로 정교화 <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {editingGeneratedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={closeGeneratedImageEditor}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px] sm:p-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onMouseDown={(event) => event.stopPropagation()}
              className="flex max-h-[92dvh] w-full max-w-[1240px] flex-col overflow-hidden rounded-xl border border-[#2A2E36] bg-[#0A0B0D] shadow-[0_28px_80px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center justify-between border-b border-[#1F2329] px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-brand-primary">개별 시안 수정</p>
                  <h3 className="mt-0.5 text-[18px] font-medium text-white">시안 {editingGeneratedImage + 1}</h3>
                </div>
                <button
                  type="button"
                  onClick={closeGeneratedImageEditor}
                  className="rounded-md p-2 text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="시안 수정 닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                className={`grid min-h-0 flex-1 overflow-hidden ${
                  editingGeneratedImageHistory.length > 1
                    ? "grid-cols-[minmax(0,1fr)_220px]"
                    : "grid-cols-1"
                }`}
              >
                <div className="min-h-0 overflow-y-auto p-5 custom-scrollbar">
                <div
                  ref={generatedImageSelectionRef}
                  onPointerDown={handleImageAreaPointerDown}
                  onPointerMove={handleImageAreaPointerMove}
                  onPointerUp={handleImageAreaPointerUp}
                  onPointerCancel={handleImageAreaPointerUp}
                  className={`relative h-[clamp(360px,55vh,620px)] touch-none overflow-hidden rounded-lg border bg-white ${
                    isImageAreaSelectionEnabled
                      ? "cursor-crosshair border-brand-primary"
                      : "border-[#2A2E36]"
                  }`}
                  style={{ backgroundColor: getGeneratedImageBackground(editingGeneratedImage) }}
                >
                  <img
                    src={`${getGeneratedImageSource(editingGeneratedImage)}?edit=${generatedImageVersions[editingGeneratedImage] ?? 0}&slot=${editingGeneratedImage}`}
                    alt={`수정할 시안 ${editingGeneratedImage + 1}`}
                    draggable={false}
                    className="pointer-events-none h-full w-full select-none object-contain"
                  />

                  <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={regeneratingImageIndex === editingGeneratedImage}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => setIsImageAreaSelectionEnabled((current) => !current)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[14px] font-medium shadow-lg backdrop-blur-md transition ${
                        isImageAreaSelectionEnabled
                          ? "border-brand-primary bg-brand-primary text-black"
                          : "border-white/15 bg-black/65 text-white hover:bg-black/80"
                      }`}
                    >
                      <PenTool className="h-4 w-4" />
                      영역 선택
                    </button>
                  </div>

                  {isImageAreaSelectionEnabled && generatedImageSelectionDraft.length === 0 && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center">
                      <span className="rounded-full bg-black/70 px-3 py-1.5 text-[14px] text-white backdrop-blur">
                        수정할 영역의 경계를 따라 자유롭게 그려주세요
                      </span>
                    </div>
                  )}

                  {generatedImageSelectionDraft.length > 0 && (
                    <svg
                      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      {hasGeneratedImageSelection && !isDrawingImageArea ? (
                        <polygon
                          points={generatedImageSelectionDraft.map((point) => `${point.x},${point.y}`).join(" ")}
                          fill="rgba(224, 161, 46, 0.22)"
                          stroke="var(--color-brand-primary)"
                          strokeWidth="0.6"
                          strokeDasharray="1.5 1"
                          vectorEffect="non-scaling-stroke"
                        />
                      ) : (
                        <polyline
                          points={generatedImageSelectionDraft.map((point) => `${point.x},${point.y}`).join(" ")}
                          fill="none"
                          stroke="var(--color-brand-primary)"
                          strokeWidth="0.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      )}
                    </svg>
                  )}

                  {regeneratingImageIndex === editingGeneratedImage && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 text-white backdrop-blur-sm">
                      <LoadingIndicator size="md" label="새 버전 생성 중" layout="stacked" />
                    </div>
                  )}
                </div>

                <div className="mt-5 min-w-0">
                  <label htmlFor="generated-image-edit-prompt" className="text-[15px] font-medium text-white">
                    수정할 내용
                  </label>
                  <textarea
                    id="generated-image-edit-prompt"
                    autoFocus
                    value={generatedImageEditDraft}
                    onChange={(event) => setGeneratedImageEditDraft(event.target.value)}
                    placeholder="예: 어깨 갑옷을 더 크게 하고 금속 스크래치를 강조해줘"
                    className="mt-2 h-24 w-full resize-none rounded-lg border border-[#343842] bg-[#111317] px-3.5 py-3 text-[14px] leading-6 text-white outline-none transition placeholder:text-neutral-500 focus:border-brand-primary"
                  />
                </div>
                </div>

                {editingGeneratedImageHistory.length > 1 && (
                  <aside className="min-h-0 overflow-y-auto border-l border-[#1F2329] bg-[#08090B] p-3 custom-scrollbar">
                    <div className="space-y-3">
                      {editingGeneratedImageHistory.map((version) => {
                        const isActive = activeEditingVersion === version.id;
                        return (
                          <button
                            key={version.id}
                            type="button"
                            onClick={() => handleSelectGeneratedImageVersion(version)}
                            aria-label={`${version.label} 선택`}
                            className={`group w-full overflow-hidden rounded-lg border transition ${
                              isActive
                                ? "border-brand-primary"
                                : "border-[#2A2E36] hover:border-[#555A64]"
                            }`}
                          >
                            <div
                              className="relative aspect-[4/3] overflow-hidden"
                              style={{ backgroundColor: getGeneratedImageBackground(editingGeneratedImage) }}
                            >
                              <img
                                src={`${getGeneratedImageSource(editingGeneratedImage)}?edit=${version.id}&slot=${editingGeneratedImage}`}
                                alt={`${version.label} 이미지`}
                                className="h-full w-full object-contain"
                              />
                              {isActive && (
                                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-black shadow-lg">
                                  <Check className="h-4 w-4 stroke-[3]" />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>
                )}
              </div>

              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#1F2329] px-5 py-4">
                <p className="text-[14px] text-neutral-500">
                  {hasGeneratedImageSelection ? "선택한 영역을 기준으로 수정합니다." : "영역을 선택하지 않으면 이미지 전체를 수정합니다."}
                </p>
                <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeGeneratedImageEditor}
                  className="rounded-lg border border-[#2A2E36] px-4 py-2.5 text-[14px] font-medium text-neutral-300 transition hover:bg-white/5 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={!generatedImageEditDraft.trim() || regeneratingImageIndex === editingGeneratedImage}
                  onClick={handleRegenerateGeneratedImage}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium transition ${
                    generatedImageEditDraft.trim() && regeneratingImageIndex !== editingGeneratedImage
                      ? "bg-brand-primary text-black hover:bg-[#F0B43A]"
                      : "cursor-not-allowed bg-[#202126] text-neutral-500"
                  }`}
                >
                  {regeneratingImageIndex === editingGeneratedImage ? (
                    <LoadingIndicator tone="current" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  재생성
                </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board Selection Modal */}
      {isBoardPopupOpen && (
        <div className="absolute inset-0 z-[100] flex bg-[#050505]/80 backdrop-blur-[2px] text-white font-sans antialiased items-center justify-center p-6">
          <div className="bg-[#050505] border border-[#2A2E36] rounded-xl flex flex-col w-[95vw] h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2329] shrink-0 bg-[#0A0B0D]">
              <div>
                <p className="text-[14px] font-medium text-brand-primary">Board</p>
                <h3 className="text-[18px] font-medium text-white tracking-tight">보드에서 가져오기</h3>
              </div>

              <button
                onClick={() => setIsBoardPopupOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1A1C23] rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative custom-scrollbar bg-bg-dark flex flex-col">
              <div className="shrink-0 bg-bg-dark px-6 pt-6 pb-0">
                <div className="flex w-fit items-center gap-1 rounded-lg border border-[#2A2E36] bg-[#111215] p-1">
                  <button
                    onClick={() => setBoardPopupView("notes")}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-[14px] font-medium transition ${boardPopupView === "notes" ? "bg-brand-primary text-[#050505]" : "text-neutral-400 hover:bg-[#1A1C23] hover:text-white"}`}
                  >
                    <FileText className="w-4 h-4" />
                    노트 {boardSelectedNotes.length > 0 ? boardSelectedNotes.length : ""}
                  </button>
                  <button
                    onClick={() => setBoardPopupView("references")}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-[14px] font-medium transition ${boardPopupView === "references" ? "bg-brand-primary text-[#050505]" : "text-neutral-400 hover:bg-[#1A1C23] hover:text-white"}`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    레퍼런스 {boardSelectedReferences.length > 0 ? boardSelectedReferences.length : ""}
                  </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">
                {boardPopupView === "notes" ? (
                  <NotesPage
                    onNavigate={() => {}}
                    isPopup={true}
                    hideSidebar
                    hideSelectionActionBar
                    onSelectionChange={setBoardSelectedNotes}
                    onAcceptSelection={(noteIds) => {
                      const nextNotes = Array.from(new Set([...stagedNotes, ...noteIds]));
                      if (activeProject === null) {
                        setStagedNotes(nextNotes);
                      } else {
                        appendPromptFromNotes(noteIds);
                      }
                      setIsBoardPopupOpen(false);
                    }}
                  />
                ) : (
                  <ReferencePage
                    favorites={[]}
                    toggleFavorite={() => {}}
                    onNavigate={() => {}}
                    isPopup={true}
                    hideSidebar
                    hideSelectionActionBar
                    onSelectionChange={setBoardSelectedReferences}
                    onAcceptSelection={(selectedIds) => {
                      if (activeProject !== null) {
                        setSelectedReferences(Array.from(new Set([...selectedReferences, ...selectedIds])));
                        setHasUnsavedChanges(true);
                      } else {
                        setStagedReferences(Array.from(new Set([...stagedReferences, ...selectedIds])));
                      }
                      setIsBoardPopupOpen(false);
                    }}
                  />
                )}
              </div>
            </div>
            {boardSelectedNotes.length + boardSelectedReferences.length > 0 && (
              <div className="flex shrink-0 items-center justify-end gap-4 border-t border-[#2A2E36] bg-[#111317] px-4 py-3 sm:px-5">
                  <div className="hidden min-w-0 items-center justify-center gap-3 text-[14px] font-medium text-neutral-300 sm:flex">
                    {boardSelectedNotes.length > 0 && (
                      <span className="rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 px-2.5 py-1 text-[#60A5FA]">
                        노트 {boardSelectedNotes.length}개
                      </span>
                    )}
                    {boardSelectedReferences.length > 0 && (
                      <span className="rounded-full border border-[#4ADE80]/30 bg-[#4ADE80]/10 px-2.5 py-1 text-[#4ADE80]">
                        레퍼런스 {boardSelectedReferences.length}개
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const nextNotes = Array.from(new Set([...stagedNotes, ...boardSelectedNotes]));
                      const nextReferences = Array.from(new Set([...stagedReferences, ...boardSelectedReferences]));

                      if (activeProject === null) {
                        setBoardSelectedNotes([]);
                        setBoardSelectedReferences([]);
                        setIsBoardPopupOpen(false);
                        handleStartProjectWithAssets(nextNotes, nextReferences);
                        return;
                      }

                      if (boardSelectedNotes.length > 0) {
                        appendPromptFromNotes(boardSelectedNotes);
                      }
                      if (boardSelectedReferences.length > 0) {
                        setSelectedReferences(Array.from(new Set([...selectedReferences, ...boardSelectedReferences])));
                        setHasUnsavedChanges(true);
                      }
                      setBoardSelectedNotes([]);
                      setBoardSelectedReferences([]);
                      setIsBoardPopupOpen(false);
                    }}
                    className="np-primary-action flex min-h-11 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-2 text-[14px] font-medium text-[#050505] transition hover:bg-[#F0B43A] sm:w-auto"
                  >
                    <span className="sm:hidden">
                      {boardSelectedNotes.length + boardSelectedReferences.length}개 가져오기
                    </span>
                    <span className="hidden sm:inline">가져오기</span>
                  </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Project Selection Modal */}
      {isProjectPopupOpen && (
        <div className="absolute inset-0 z-[100] flex bg-[#050505]/80 backdrop-blur-[2px] text-white font-sans antialiased items-center justify-center p-6">
          <div className="bg-[#050505] border border-[#2A2E36] rounded-xl flex flex-col w-[95vw] h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2329] shrink-0 bg-[#0A0B0D]">
              <div className="flex items-center gap-4">
                <h3 className="text-[17px] font-semibold text-white tracking-tight">
                  프로젝트 이어서 시작
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsProjectPopupOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1A1C23] rounded transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden relative custom-scrollbar bg-[#050505]">
              <ProjectPage
                isPopup={true}
                onSelectProject={(id) => {
                  setActiveProject(id);
                  setIsProjectPopupOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreate={(projectName, template) => {
          setIsNewProjectModalOpen(false);
          const newProjectId = Date.now();
          const newProject = {
            id: newProjectId,
            name: projectName,
            status: "Just Started",
            statusColor: COLORS.gold,
            date: new Date().toLocaleDateString("ko-KR").replace(/\./g, "."),
            image: "", // blank for now
          };
          setProjects((prev) => [newProject, ...prev]);
          setActiveProject(newProjectId);
          setMessages([]);
        }}
      />
    </div>
  );
}
