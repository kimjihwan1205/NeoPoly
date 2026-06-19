import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Image as ImageIcon,
  Layers,
  Loader2,
  Lock,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Unlock,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface TurnaroundPageProps {
  onNavigate?: (page: string) => void;
}

type ViewId = "front" | "angle" | "side" | "back";

type TurnaroundView = {
  id: ViewId;
  label: string;
  angle: string;
  img: string;
  focus: string;
  prompt: string;
};

type LassoPoint = { left: number; top: number };

type ModularPart = {
  id: string;
  label: string;
  keyword: string;
  setName: string;
  image: string;
  generatedImage: string;
  cropSource?: string;
  color: string;
  point: { left: string; top: string };
  area: { left: string; top: string; width: string; height: string };
  path?: LassoPoint[];
};

type ModuleSet = {
  id: string;
  title: string;
  tag: string;
  accent: string;
  assetPrefix: string;
};

const ORC_BASE_IMAGE = "/images/orc/orc_2D_front.png";
const ORC_MODULE_SCAN_IMAGE = "/images/orc/orc_create01.png";
const ORC_MODULE_RESULT_IMAGE = "/images/orc/orc_module.png";
const MODULE_SCAN_DURATION_MS = 2800;

const TURNAROUND_VIEWS: TurnaroundView[] = [
  {
    id: "front",
    label: "정면",
    angle: "Front",
    img: "/images/orc/orc_2D_front.png",
    focus: "얼굴 비율, 장비 위치, 전체 실루엣",
    prompt: "정면 기준 오크 전사의 얼굴 비율, 어깨 장비, 흉갑과 허리 장식, 손 형태, 발 비율을 3D 모델링용으로 명확하게 정리",
  },
  {
    id: "angle",
    label: "45도",
    angle: "3/4 View",
    img: "/images/orc/orc_2D_45.png",
    focus: "어깨 장비와 흉갑 깊이감",
    prompt: "오크 전사의 상체 볼륨과 장비의 깊이감이 보이는 45도 시점, 어깨 장식, 팔 보호대, 몸통 두께를 정면과 일관되게 정리",
  },
  {
    id: "side",
    label: "측면",
    angle: "Side",
    img: "/images/orc/orc_2D_side.png",
    focus: "복부, 팔 길이, 무기 두께",
    prompt: "측면에서 본 오크의 복부 돌출감, 팔 길이, 어깨와 등 장비의 두께, 무기와 손의 위치 관계를 모델링 기준으로 정리",
  },
  {
    id: "back",
    label: "후면",
    angle: "Back",
    img: "/images/orc/orc_2D_back.png",
    focus: "등 장비, 허리띠, 후면 실루엣",
    prompt: "후면의 등 근육, 어깨 장비 후면, 허리띠와 하의 주름, 팔과 다리의 후면 실루엣을 정면/측면과 일관되게 정리",
  },
];

const CONSISTENCY_ITEMS = [
  { label: "실루엣", score: 94 },
  { label: "장비 위치", score: 88 },
  { label: "색감", score: 91 },
  { label: "비율 일관성", score: 86 },
];

const DEFAULT_MODULAR_PARTS: ModularPart[] = [
  {
    id: "shoulder",
    label: "\uc5b4\uae68 \uac11\uc637",
    keyword: "\uc2a4\ud30c\uc774\ud06c \uc5b4\uae68 \uc7a5\ube44",
    setName: "orc_default",
    image: "/images/orc/orc_default_item04.png",
    generatedImage: "/images/orc/orc_01_item05.png",
    color: "#E0A12E",
    point: { left: "52%", top: "25%" },
    area: { left: "52%", top: "27%", width: "24%", height: "18%" },
  },
  {
    id: "arm-guard",
    label: "\ud314 \ubcf4\ud638\ub300",
    keyword: "\ud314 \ubcf4\ud638\ub300 \ubc34\ub4dc",
    setName: "orc_default",
    image: "/images/orc/orc_default_item01.png",
    generatedImage: "/images/orc/orc_01_item02.png",
    color: "#E0A12E",
    point: { left: "64%", top: "46%" },
    area: { left: "67%", top: "52%", width: "22%", height: "28%" },
  },
  {
    id: "leg-guard",
    label: "\ub2e4\ub9ac \ubcf4\ud638\ub300",
    keyword: "\ub2e4\ub9ac \uac00\uc8fd \ubcf4\ud638\ub300",
    setName: "orc_default",
    image: "/images/orc/orc_default_item02.png",
    generatedImage: "/images/orc/orc_01_item03.png",
    color: "#E0A12E",
    point: { left: "55%", top: "77%" },
    area: { left: "55%", top: "78%", width: "20%", height: "25%" },
  },
  {
    id: "belt",
    label: "\ubca8\ud2b8 \uc7a5\uc2dd",
    keyword: "\ud5c8\ub9ac \ubca8\ud2b8 \uc7a5\uc2dd",
    setName: "orc_default",
    image: "/images/orc/orc_default_item05.png",
    generatedImage: "/images/orc/orc_01_item04.png",
    color: "#E0A12E",
    point: { left: "50%", top: "57%" },
    area: { left: "50%", top: "58%", width: "24%", height: "18%" },
  },
  {
    id: "weapon",
    label: "\ubb34\uae30",
    keyword: "\ub098\ubb34 \ubabd\ub465\uc774",
    setName: "orc_default",
    image: "/images/orc/orc_default_item03.png",
    generatedImage: "/images/orc/orc_01_item01.png",
    color: "#E0A12E",
    point: { left: "22%", top: "41%" },
    area: { left: "22%", top: "37%", width: "15%", height: "55%" },
  },
];

const MODULE_SET_ACCENTS = ["#A3E635", "#C084FC", "#60A5FA", "#F97316", "#2DD4BF"];
const MODULE_SET_ASSET_PREFIXES = ["orc_01", "orc_02", "orc_03", "orc_04"];
const MODULE_SET_ITEM_BY_PART_ID: Record<string, string> = {
  weapon: "01",
  shoulder: "02",
  "leg-guard": "03",
  belt: "04",
  "arm-guard": "05",
};
const MODULE_SET_TAG_SUGGESTIONS = [
  "\ud574\uace8 \uc804\uc0ac \uc138\ud2b8",
  "\uc911\uac11 \uc804\ud22c \uc138\ud2b8",
  "\uc2b5\uaca9 \uc804\ud22c \uc138\ud2b8",
  "\ubd80\uc871 \uc815\ucc30 \uc138\ud2b8",
  "\uac70\uce5c \uc2a4\ud30c\uc774\ud06c \uc138\ud2b8",
];


const ADDITIONAL_MODULE_SUGGESTIONS: Omit<ModularPart, "id">[] = [
  {
    label: "\uc624\ub978\ud314 \ubcf4\ud638\ub300",
    keyword: "\uc624\ub978\ud314 \uae08\uc18d \ubc34\ub4dc \ubcf4\ud638\ub300",
    setName: "orc_custom",
    image: "/images/orc/orc_default_item01.png",
    generatedImage: "/images/orc/orc_01_item02.png",
    color: "#E0A12E",
    point: { left: "76%", top: "52%" },
    area: { left: "76%", top: "55%", width: "19%", height: "34%" },
  },
  {
    label: "\ud5c8\ub9ac \ud574\uace8 \uc7a5\uc2dd",
    keyword: "\ud5c8\ub9ac\ub760 \uce21\uba74 \ud574\uace8 \uc7a5\uc2dd",
    setName: "orc_custom",
    image: "/images/orc/orc_default_item05.png",
    generatedImage: "/images/orc/orc_01_item04.png",
    color: "#E0A12E",
    point: { left: "45%", top: "60%" },
    area: { left: "44%", top: "61%", width: "12%", height: "16%" },
  },
  {
    label: "\ubaa9\uac78\uc774 \uc7a5\uc2dd",
    keyword: "\uac00\uc2b4 \uc911\uc559 \ubaa9\uac78\uc774 \uae08\uc18d \uc7a5\uc2dd",
    setName: "orc_custom",
    image: "/images/orc/orc_default_item05.png",
    generatedImage: "/images/orc/orc_01_item04.png",
    color: "#E0A12E",
    point: { left: "50%", top: "45%" },
    area: { left: "50%", top: "45%", width: "18%", height: "18%" },
  },
];


const clampPercent = (value: number, min = 2, max = 98) => Math.max(min, Math.min(max, value));

const percentNumber = (value: string, fallback = 0) => {
  const parsed = Number.parseFloat(value.replace("%", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildAreaFromPath = (points: LassoPoint[]): ModularPart["area"] => {
  if (points.length === 0) {
    return { left: "50%", top: "50%", width: "8%", height: "8%" };
  }

  const leftValues = points.map((point) => point.left);
  const topValues = points.map((point) => point.top);
  const minLeft = Math.min(...leftValues);
  const maxLeft = Math.max(...leftValues);
  const minTop = Math.min(...topValues);
  const maxTop = Math.max(...topValues);
  const width = Math.max(6, maxLeft - minLeft);
  const height = Math.max(6, maxTop - minTop);

  return {
    left: `${clampPercent(minLeft + width / 2).toFixed(1)}%`,
    top: `${clampPercent(minTop + height / 2).toFixed(1)}%`,
    width: `${Math.min(90, width).toFixed(1)}%`,
    height: `${Math.min(90, height).toFixed(1)}%`,
  };
};

const cropImageStyle = (area: ModularPart["area"]): React.CSSProperties => {
  const left = percentNumber(area.left, 50);
  const top = percentNumber(area.top, 50);
  const width = Math.max(4, percentNumber(area.width, 20));
  const height = Math.max(4, percentNumber(area.height, 20));
  return {
    position: "absolute",
    width: `${10000 / width}%`,
    height: `${10000 / height}%`,
    left: `${-((left - width / 2) / width) * 100}%`,
    top: `${-((top - height / 2) / height) * 100}%`,
    maxWidth: "none",
    objectFit: "fill",
  };
};

export default function TurnaroundPage({ onNavigate }: TurnaroundPageProps) {
  const [expertTab, setExpertTab] = useState<"turnaround" | "modular">("turnaround");
  const [selectedViewId, setSelectedViewId] = useState<ViewId>("front");
  const [viewPrompts, setViewPrompts] = useState<Record<ViewId, string>>(() =>
    TURNAROUND_VIEWS.reduce(
      (acc, view) => ({ ...acc, [view.id]: view.prompt }),
      {} as Record<ViewId, string>,
    ),
  );
  const [lockedViews, setLockedViews] = useState<Set<ViewId>>(new Set(["front"]));
  const [confirmedViews, setConfirmedViews] = useState<Set<ViewId>>(new Set(["front"]));
  const [regeneratingViews, setRegeneratingViews] = useState<Set<ViewId>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingModular, setIsGeneratingModular] = useState(false);
  const [isScanningModules, setIsScanningModules] = useState(false);
  const [isModuleScanComplete, setIsModuleScanComplete] = useState(false);
  const [isBuildingModuleSet, setIsBuildingModuleSet] = useState(false);
  const [isAddingModuleScan, setIsAddingModuleScan] = useState(false);
  const [areaSelectionMode, setAreaSelectionMode] = useState<"new" | "edit" | null>(null);
  const [areaStart, setAreaStart] = useState<{ left: number; top: number } | null>(null);
  const [draftArea, setDraftArea] = useState<ModularPart["area"] | null>(null);
  const [draftPath, setDraftPath] = useState<LassoPoint[]>([]);
  const [moduleParts, setModuleParts] = useState<ModularPart[]>(() => DEFAULT_MODULAR_PARTS);
  const [selectedPart, setSelectedPart] = useState<string>(DEFAULT_MODULAR_PARTS[0].id);
  const [generatedModules, setGeneratedModules] = useState<string[]>([]);
  const [isModuleListConfirmed, setIsModuleListConfirmed] = useState(false);
  const [isModuleListDrawerOpen, setIsModuleListDrawerOpen] = useState(false);
  const [isAddingModuleSet, setIsAddingModuleSet] = useState(false);
  const [isDraggingModuleSets, setIsDraggingModuleSets] = useState(false);
  const moduleSetScrollerRef = useRef<HTMLDivElement | null>(null);
  const moduleSetDragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const previousModuleSetCountRef = useRef(0);
  const [moduleSets, setModuleSets] = useState<ModuleSet[]>([]);
  const [newSetTag, setNewSetTag] = useState(MODULE_SET_TAG_SUGGESTIONS[1]);
  const [moduleDrafts, setModuleDrafts] = useState<Record<string, { label: string; keyword: string; setName: string }>>(() =>
    DEFAULT_MODULAR_PARTS.reduce(
      (acc, part) => ({ ...acc, [part.id]: { label: part.label, keyword: part.keyword, setName: part.setName } }),
      {} as Record<string, { label: string; keyword: string; setName: string }>,
    ),
  );
  const [moduleNameInputs, setModuleNameInputs] = useState<Record<string, string>>(() =>
    DEFAULT_MODULAR_PARTS.reduce(
      (acc, part) => ({ ...acc, [part.id]: part.label }),
      {} as Record<string, string>,
    ),
  );

  const selectedView = TURNAROUND_VIEWS.find((view) => view.id === selectedViewId) ?? TURNAROUND_VIEWS[0];
  const selectedPartData = moduleParts.find((part) => part.id === selectedPart) ?? moduleParts[0] ?? DEFAULT_MODULAR_PARTS[0];
  const selectedModuleDraft = moduleDrafts[selectedPart] ?? {
    label: selectedPartData.label,
    keyword: selectedPartData.keyword,
    setName: selectedPartData.setName,
  };
  const isAreaSelectMode = areaSelectionMode !== null;
  const isSelectedRegenerating = regeneratingViews.has(selectedViewId) || isGenerating;
  const [shouldProceedToModular] = useState(() => {
    if (typeof window === "undefined") return false;

    const rawFlowState = window.sessionStorage.getItem("neopoly:turnaround-flow");
    if (!rawFlowState) return false;

    try {
      return Boolean((JSON.parse(rawFlowState) as { isModularSelected?: boolean }).isModularSelected);
    } catch {
      return false;
    }
  });

  const confirmedModuleParts = moduleParts.filter((part) => generatedModules.includes(part.id));
  const moduleSetParts = confirmedModuleParts.length > 0 ? confirmedModuleParts : moduleParts;
  const isModularScanActive = isScanningModules || isBuildingModuleSet || isAddingModuleScan;

  useEffect(() => {
    if (expertTab !== "modular" || isModuleScanComplete) return;

    setIsScanningModules(true);
    const scanTimer = window.setTimeout(() => {
      setIsScanningModules(false);
      setIsModuleScanComplete(true);
    }, MODULE_SCAN_DURATION_MS);

    return () => window.clearTimeout(scanTimer);
  }, [expertTab, isModuleScanComplete]);

  useEffect(() => {
    if (!isModuleListConfirmed) {
      previousModuleSetCountRef.current = moduleSets.length;
      return;
    }

    const isNewSetAdded = moduleSets.length > previousModuleSetCountRef.current;
    previousModuleSetCountRef.current = moduleSets.length;

    if (!isNewSetAdded) return;

    window.requestAnimationFrame(() => {
      const scroller = moduleSetScrollerRef.current;
      if (!scroller) return;

      scroller.scrollTo({ left: scroller.scrollWidth, behavior: "smooth" });
    });
  }, [isModuleListConfirmed, moduleSets.length]);

  const handleBackToPreviousStep = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "neopoly:return-to-generated-images",
        JSON.stringify({
          isOrcWorkflow: true,
          selectedGridImage: 0,
          isTurnaroundSelected: true,
          isModularSelected: shouldProceedToModular,
        }),
      );
    }
    onNavigate?.("full_workflow_chat");
  };

  const handleRegenerateView = (viewId: ViewId) => {
    if (lockedViews.has(viewId)) return;
    setRegeneratingViews((current) => new Set(current).add(viewId));
    window.setTimeout(() => {
      setRegeneratingViews((current) => {
        const next = new Set(current);
        next.delete(viewId);
        return next;
      });
      setConfirmedViews((current) => {
        const next = new Set(current);
        next.delete(viewId);
        return next;
      });
    }, 900);
  };

  const handleRegenerateAll = () => {
    setIsGenerating(true);
    const unlocked = TURNAROUND_VIEWS.filter((view) => !lockedViews.has(view.id)).map((view) => view.id);
    setRegeneratingViews(new Set(unlocked));
    window.setTimeout(() => {
      setRegeneratingViews(new Set());
      setConfirmedViews((current) => {
        const next = new Set(current);
        unlocked.forEach((id) => next.delete(id));
        return next;
      });
      setIsGenerating(false);
    }, 1000);
  };

  const toggleLock = (viewId: ViewId) => {
    setLockedViews((current) => {
      const next = new Set(current);
      if (next.has(viewId)) next.delete(viewId);
      else next.add(viewId);
      return next;
    });
  };

  const toggleConfirm = (viewId: ViewId) => {
    setConfirmedViews((current) => {
      const next = new Set(current);
      if (next.has(viewId)) next.delete(viewId);
      else next.add(viewId);
      return next;
    });
  };

  const updateModuleNameInput = (partId: string, value: string) => {
    setModuleNameInputs((current) => ({ ...current, [partId]: value }));
  };

  const applyModuleNameChange = (partId: string) => {
    const currentDraft = moduleDrafts[partId];
    if (!currentDraft) return;

    const nextLabel = (moduleNameInputs[partId] ?? currentDraft.label).trim() || currentDraft.label;
    setModuleDrafts((current) => ({
      ...current,
      [partId]: {
        ...currentDraft,
        label: nextLabel,
      },
    }));
  };

  const getCanvasPoint = (event: React.PointerEvent<HTMLElement>, container: HTMLElement | null) => {
    if (!container) return null;

    const rect = container.getBoundingClientRect();
    return {
      left: clampPercent(((event.clientX - rect.left) / rect.width) * 100),
      top: clampPercent(((event.clientY - rect.top) / rect.height) * 100),
    };
  };

  const appendLassoPoint = (point: LassoPoint) => {
    setDraftPath((current) => {
      const lastPoint = current[current.length - 1];
      if (lastPoint && Math.hypot(point.left - lastPoint.left, point.top - lastPoint.top) < 0.75) {
        return current;
      }

      const nextPath = [...current, point];
      setDraftArea(buildAreaFromPath(nextPath));
      return nextPath;
    });
  };

  const startAreaSelection = (mode: "new" | "edit") => {
    if (isAddingModuleScan || isModuleListConfirmed) return;

    setAreaSelectionMode(mode);
    setAreaStart(null);
    setDraftArea(null);
    setDraftPath([]);
  };

  const resetAreaSelection = () => {
    setAreaSelectionMode(null);
    setAreaStart(null);
    setDraftArea(null);
    setDraftPath([]);
  };

  const handleCanvasAreaStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!areaSelectionMode || isModuleListConfirmed || isAddingModuleScan) return;

    const point = getCanvasPoint(event, event.currentTarget);
    if (!point) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setAreaStart(point);
    setDraftPath([point]);
    setDraftArea(buildAreaFromPath([point]));
  };

  const handleCanvasAreaMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!areaSelectionMode || !areaStart || isAddingModuleScan) return;

    const point = getCanvasPoint(event, event.currentTarget);
    if (!point) return;

    appendLassoPoint(point);
  };

  const handleCanvasAreaEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!areaSelectionMode) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setAreaStart(null);
    setDraftPath((current) => {
      if (current.length > 0) setDraftArea(buildAreaFromPath(current));
      return current;
    });
  };

  const applyAreaToModule = (partId: string, area: ModularPart["area"], path?: LassoPoint[]) => {
    setModuleParts((current) =>
      current.map((part) =>
        part.id === partId
          ? {
              ...part,
              area,
              point: { left: area.left, top: area.top },
              cropSource: ORC_MODULE_RESULT_IMAGE,
              path,
            }
          : part,
      ),
    );
  };

  const handleConfirmDrawnArea = () => {
    if (draftPath.length < 3 || !draftArea || !areaSelectionMode || isAddingModuleScan || isModuleListConfirmed) return;

    const area = draftArea;
    const path = draftPath;
    const mode = areaSelectionMode;
    const targetId = selectedPart;
    const nextIndex = moduleParts.length + 1;
    setIsAddingModuleScan(true);

    window.setTimeout(() => {
      if (mode === "edit") {
        applyAreaToModule(targetId, area, path);
        setModuleDrafts((current) => ({
          ...current,
          [targetId]: {
            ...selectedModuleDraft,
            keyword: "\uc9c1\uc811 \uadf8\ub9b0 \uc601\uc5ed \uae30\uc900 \ubaa8\ub4c8",
          },
        }));
      } else {
        const newId = `manual-${Date.now()}`;
        const label = `\uc9c1\uc811 \uc120\ud0dd \ubaa8\ub4c8 ${nextIndex}`;
        const newPart: ModularPart = {
          id: newId,
          label,
          keyword: "\uc0ac\uc6a9\uc790\uac00 \uadf8\ub9b0 \uc601\uc5ed \uae30\uc900 \ubaa8\ub4c8",
          setName: "orc_manual",
          image: "/images/orc/orc_default_item03.png",
          generatedImage: "/images/orc/orc_01_item01.png",
          cropSource: ORC_MODULE_RESULT_IMAGE,
          color: "#E0A12E",
          point: { left: area.left, top: area.top },
          area,
          path,
        };
        setModuleParts((current) => [...current, newPart]);
        setModuleDrafts((current) => ({ ...current, [newId]: { label: newPart.label, keyword: newPart.keyword, setName: newPart.setName } }));
        setModuleNameInputs((current) => ({ ...current, [newId]: label }));
        setSelectedPart(newId);
      }

      resetAreaSelection();
      setIsAddingModuleScan(false);
    }, 650);
  };

  const handleRecheckModulePart = () => {
    if (draftPath.length >= 3 && draftArea && areaSelectionMode) {
      handleConfirmDrawnArea();
      return;
    }

    if (!isModuleScanComplete || isAddingModuleScan || isModuleListConfirmed) return;

    setIsAddingModuleScan(true);
    window.setTimeout(() => {
      applyAreaToModule(selectedPart, selectedPartData.area, selectedPartData.path);
      setModuleDrafts((current) => ({
        ...current,
        [selectedPart]: {
          ...selectedModuleDraft,
          keyword: "\uc9c1\uc811 \uc120\ud0dd\ud55c \uc601\uc5ed \uae30\uc900 \ubaa8\ub4c8",
        },
      }));
      setIsAddingModuleScan(false);
    }, 900);
  };

  const handleConfirmModulePart = (partId: string) => {
    if (!isModuleScanComplete) return;

    setGeneratedModules((current) => (current.includes(partId) ? current : [...current, partId]));
  };

  const handleAddModulePart = () => {
    if (!isModuleScanComplete || isAddingModuleScan || isModuleListConfirmed) return;

    setIsAddingModuleScan(true);
    const nextIndex = moduleParts.length + 1;
    const suggestion = ADDITIONAL_MODULE_SUGGESTIONS[(nextIndex - DEFAULT_MODULAR_PARTS.length - 1 + ADDITIONAL_MODULE_SUGGESTIONS.length) % ADDITIONAL_MODULE_SUGGESTIONS.length];
    const newId = `custom-${Date.now()}`;
    const newPart: ModularPart = {
      id: newId,
      ...suggestion,
    };

    window.setTimeout(() => {
      setModuleParts((current) => [...current, newPart]);
      setModuleDrafts((current) => ({ ...current, [newId]: { label: newPart.label, keyword: newPart.keyword, setName: newPart.setName } }));
      setModuleNameInputs((current) => ({ ...current, [newId]: newPart.label }));
      setGeneratedModules((current) => current.filter((id) => id !== newId));
      setSelectedPart(newId);
      resetAreaSelection();
      setIsAddingModuleScan(false);
    }, 950);
  };

  const handleRemoveModulePart = (partId: string) => {
    if (moduleParts.length <= 1) return;

    const nextParts = moduleParts.filter((part) => part.id !== partId);
    setModuleParts(nextParts);
    setGeneratedModules((current) => current.filter((id) => id !== partId));
    setModuleDrafts((current) => {
      const next = { ...current };
      delete next[partId];
      return next;
    });
    setModuleNameInputs((current) => {
      const next = { ...current };
      delete next[partId];
      return next;
    });
    if (selectedPart === partId) setSelectedPart(nextParts[0]?.id ?? DEFAULT_MODULAR_PARTS[0].id);
    resetAreaSelection();
  };

  const handleConfirmModuleList = () => {
    if (!isModuleScanComplete || isBuildingModuleSet) return;

    setGeneratedModules(moduleParts.map((part) => part.id));
    setIsBuildingModuleSet(true);
    window.setTimeout(() => {
      setModuleSets((current) =>
        current.length > 0
          ? current
          : [{ id: "set-01", title: "Set 01", tag: MODULE_SET_TAG_SUGGESTIONS[0], accent: MODULE_SET_ACCENTS[0], assetPrefix: MODULE_SET_ASSET_PREFIXES[0] }],
      );
      setIsModuleListConfirmed(true);
      setIsModuleListDrawerOpen(true);
      setIsBuildingModuleSet(false);
      window.setTimeout(() => setIsModuleListDrawerOpen(false), 1000);
    }, 950);
  };

  const handleBackToModuleList = () => {
    setIsBuildingModuleSet(false);
    setIsModuleListConfirmed(false);
    setIsModuleListDrawerOpen(false);
  };

  const handleUpdateModuleSetTag = (setId: string, tag: string) => {
    setModuleSets((current) => current.map((set) => (set.id === setId ? { ...set, tag } : set)));
  };

  const handleAddModuleSet = () => {
    if (isAddingModuleSet) return;

    const nextNumber = moduleSets.length + 1;
    const nextIndex = Math.max(0, nextNumber - 1);
    const nextTag = newSetTag.trim() || MODULE_SET_TAG_SUGGESTIONS[nextIndex % MODULE_SET_TAG_SUGGESTIONS.length];
    const nextSet: ModuleSet = {
      id: `set-${String(nextNumber).padStart(2, "0")}`,
      title: `Set ${String(nextNumber).padStart(2, "0")}`,
      tag: nextTag,
      accent: MODULE_SET_ACCENTS[nextIndex % MODULE_SET_ACCENTS.length],
      assetPrefix: MODULE_SET_ASSET_PREFIXES[nextIndex % MODULE_SET_ASSET_PREFIXES.length],
    };

    setIsAddingModuleSet(true);
    window.setTimeout(() => {
      setModuleSets((current) => [...current, nextSet]);
      setNewSetTag(MODULE_SET_TAG_SUGGESTIONS[(nextIndex + 1) % MODULE_SET_TAG_SUGGESTIONS.length]);
      setIsAddingModuleSet(false);
    }, 720);
  };

  const isModuleSetDragBlocked = (target: EventTarget | null) =>
    target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [data-module-set-drag-lock]"));

  const handleModuleSetPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isModuleSetDragBlocked(event.target)) return;

    const scroller = moduleSetScrollerRef.current;
    if (!scroller) return;

    moduleSetDragRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
    };
    setIsDraggingModuleSets(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleModuleSetPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!moduleSetDragRef.current.isDragging) return;

    const scroller = moduleSetScrollerRef.current;
    if (!scroller) return;

    const distance = event.clientX - moduleSetDragRef.current.startX;
    scroller.scrollLeft = moduleSetDragRef.current.scrollLeft - distance;
    event.preventDefault();
  };

  const handleModuleSetPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!moduleSetDragRef.current.isDragging) return;

    moduleSetDragRef.current.isDragging = false;
    setIsDraggingModuleSets(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const getModuleSetImage = (set: ModuleSet, part: ModularPart, partIndex: number) => {
    const matchedItem = MODULE_SET_ITEM_BY_PART_ID[part.id] ?? part.generatedImage.match(/item(\d{2})\.png$/)?.[1] ?? String((partIndex % 5) + 1).padStart(2, "0");
    return `/images/orc/${set.assetPrefix}_item${matchedItem}.png`;
  };

  const renderModuleThumbnail = (part: ModularPart, className: string, preferGenerated = false) => {
    if (part.cropSource) {
      return (
        <div className="relative h-full w-full overflow-hidden bg-white">
          <img src={part.cropSource} alt="" className="absolute" style={cropImageStyle(part.area)} />
        </div>
      );
    }

    return <img src={preferGenerated ? part.generatedImage : part.image} alt="" className={className} />;
  };

  const handleCompleteModular = () => {
    onNavigate?.("modeling_generation");
  };

  return (
    <div className="flex h-[calc(100vh-76px)] bg-[#050505] font-sans text-[#F5F5F5] antialiased">
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-[64px] shrink-0 items-center justify-between border-b border-[#1F2329] bg-[#050505] px-6">
          <h1 className="text-[22px] font-medium tracking-tight text-white">
            {expertTab === "turnaround" ? "턴어라운드" : "이미지 모듈화"}
          </h1>
          <div className="flex items-center gap-2 rounded-xl border border-[#2A2E36] bg-[#0A0B0D] p-1">
            <button
              onClick={() => setExpertTab("turnaround")}
              className={`flex h-10 items-center gap-2 rounded-lg px-4 text-[14px] font-medium transition ${
                expertTab === "turnaround" ? "bg-[#E0A12E] text-black" : "text-neutral-400 hover:bg-[#141518] hover:text-white"
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              턴어라운드
            </button>
            <button
              onClick={() => setExpertTab("modular")}
              className={`flex h-10 items-center gap-2 rounded-lg px-4 text-[14px] font-medium transition ${
                expertTab === "modular" ? "bg-[#E0A12E] text-black" : "text-neutral-400 hover:bg-[#141518] hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              모듈화
            </button>
          </div>
        </div>

        {expertTab === "turnaround" ? (
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_420px] gap-0 overflow-hidden xl:grid-cols-[minmax(0,1fr)_480px] 2xl:grid-cols-[minmax(0,1fr)_550px]">
            <section className="flex min-w-0 flex-col overflow-hidden p-4">
              <div className="mb-3 grid shrink-0 grid-cols-4 gap-2">
                {CONSISTENCY_ITEMS.map((item) => (
                  <div key={item.label} className="rounded-lg border border-[#1F2329] bg-[#0A0B0D] p-2.5">
                    <div className="mb-2 flex items-center justify-between text-[14px]">
                      <span className="font-medium text-neutral-300">{item.label}</span>
                      <span className="font-mono text-[#E0A12E]">{item.score}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#20232A]">
                      <div className="h-full rounded-full bg-[#E0A12E]" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
                {TURNAROUND_VIEWS.map((view, index) => {
                  const isSelected = selectedViewId === view.id;
                  const isLocked = lockedViews.has(view.id);
                  const isConfirmed = confirmedViews.has(view.id);
                  const isRegeneratingView = regeneratingViews.has(view.id) || isGenerating;

                  return (
                    <motion.button
                      key={view.id}
                      type="button"
                      onClick={() => setSelectedViewId(view.id)}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`group relative flex min-h-0 flex-col overflow-hidden rounded-xl border bg-[#101216] p-3 text-left transition ${
                        isSelected ? "border-[#E0A12E] shadow-[0_0_0_1px_rgba(224,161,46,0.25)]" : "border-[#1F2329] hover:border-[#3A404F]"
                      }`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,161,46,0.08),transparent_60%)]" />
                      <div className="relative z-10 mb-2 flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-[16px] font-medium text-white">{view.label}</h2>
                            {isLocked && <Lock className="h-4 w-4 text-[#E0A12E]" />}
                          </div>
                          <p className="mt-0.5 truncate text-[14px] font-normal text-neutral-400">{view.focus}</p>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[14px] font-medium ${
                            isRegeneratingView
                              ? "border-[#E0A12E]/30 bg-[#E0A12E]/10 text-[#E0A12E]"
                              : isConfirmed
                              ? "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80]"
                              : "border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA]"
                          }`}
                        >
                          {isRegeneratingView ? "생성 중" : isConfirmed ? "확정" : "검수 필요"}
                        </span>
                      </div>

                      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center rounded-lg bg-white">
                        <img
                          src={view.img}
                          alt={`오크 ${view.label}`}
                          className={`max-h-full max-w-full object-contain p-2 transition duration-300 ${
                            isRegeneratingView ? "scale-95 opacity-30 blur-sm" : "opacity-100"
                          }`}
                        />
                        {isRegeneratingView && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded-full border border-[#E0A12E]/30 bg-black/55 px-3 py-1.5 text-[14px] font-medium text-[#E0A12E] backdrop-blur-sm">
                              {view.label} 뷰 재생성 중
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="relative z-10 mt-2 flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegenerateView(view.id);
                          }}
                          disabled={isLocked || isRegeneratingView}
                          className="flex h-8 flex-1 items-center justify-center gap-2 rounded-lg border border-[#2A2E36] bg-[#141518] text-[14px] font-medium text-neutral-300 transition hover:border-[#E0A12E]/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {isRegeneratingView ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                          재생성
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLock(view.id);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#141518] text-neutral-300 transition hover:text-white"
                          title={isLocked ? "잠금 해제" : "뷰 잠금"}
                        >
                          {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleConfirm(view.id);
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                            isConfirmed
                              ? "border-[#4ADE80]/40 bg-[#4ADE80]/10 text-[#4ADE80]"
                              : "border-[#2A2E36] bg-[#141518] text-neutral-300 hover:text-white"
                          }`}
                          title="뷰 확정"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <aside className="flex min-h-0 flex-col border-l border-[#1F2329] bg-[#0A0B0D]">
              <div className="border-b border-[#1F2329] p-4">
                <p className="text-[14px] font-medium text-[#E0A12E]">Selected View</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[20px] font-medium text-white">{selectedView.label}</h2>
                    <p className="mt-1 text-[14px] font-medium text-neutral-400">{selectedView.focus}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-[#2A2E36] bg-white">
                    <img src={selectedView.img} alt="" className="h-full w-full object-contain p-1" />
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-3">
                  <section className="rounded-xl border border-[#1F2329] bg-[#111317] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-[16px] font-medium text-white">
                        <SlidersHorizontal className="h-4 w-4 text-[#E0A12E]" />
                        뷰별 수정 요청
                      </h3>
                      <button className="flex items-center gap-1.5 rounded-lg border border-[#2A2E36] px-2.5 py-1.5 text-[14px] font-medium text-neutral-400 transition hover:text-white">
                        <Copy className="h-3.5 w-3.5" /> 복사
                      </button>
                    </div>
                    <textarea
                      value={viewPrompts[selectedViewId]}
                      onChange={(e) => setViewPrompts((prev) => ({ ...prev, [selectedViewId]: e.target.value }))}
                      className="min-h-[112px] w-full resize-none rounded-lg border border-[#2A2E36] bg-[#050505] p-3 text-[15px] leading-[1.55] text-white outline-none placeholder:text-neutral-500 focus:border-[#E0A12E]/60"
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleRegenerateView(selectedViewId)}
                        disabled={lockedViews.has(selectedViewId) || isSelectedRegenerating}
                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#E0A12E] text-[14px] font-medium text-black transition hover:bg-[#F0B43A] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSelectedRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        선택 뷰 재생성
                      </button>
                      <button
                        onClick={() => toggleLock(selectedViewId)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#141518] text-neutral-300 transition hover:text-white"
                      >
                        {lockedViews.has(selectedViewId) ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                    </div>
                  </section>

                  <section className="rounded-xl border border-[#1F2329] bg-[#111317] p-3">
                    <h3 className="mb-3 flex items-center gap-2 text-[16px] font-medium text-white">
                      <Eye className="h-4 w-4 text-[#E0A12E]" />
                      일관성 점검
                    </h3>
                    <div className="space-y-3">
                      {CONSISTENCY_ITEMS.map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex justify-between text-[14px]">
                            <span className="font-medium text-neutral-300">{item.label}</span>
                            <span className="font-mono text-neutral-400">{item.score}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#20232A]">
                            <div className="h-full rounded-full bg-[#E0A12E]" style={{ width: `${item.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-xl border border-[#1F2329] bg-[#111317] p-3">
                    <h3 className="mb-3 flex items-center gap-2 text-[16px] font-medium text-white">
                      <ImageIcon className="h-4 w-4 text-[#E0A12E]" />
                      확정 상태
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {TURNAROUND_VIEWS.map((view) => {
                        const isConfirmed = confirmedViews.has(view.id);
                        return (
                          <button
                            key={view.id}
                            onClick={() => toggleConfirm(view.id)}
                            className={`rounded-lg border px-2 py-2 text-[14px] font-medium transition ${
                              isConfirmed
                                ? "border-[#4ADE80]/40 bg-[#4ADE80]/10 text-[#4ADE80]"
                                : "border-[#2A2E36] bg-[#0A0B0D] text-neutral-400 hover:text-white"
                            }`}
                          >
                            {view.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>

              <div className="border-t border-[#1F2329] p-4">
                <div className="flex gap-2">
                  <button
                    onClick={handleBackToPreviousStep}
                    className="flex w-[32%] items-center justify-center gap-1.5 rounded-xl border border-[#2A2E36] bg-[#0A0B0D] py-3.5 text-[14px] font-medium text-neutral-300 transition hover:bg-[#141518]"
                  >
                    <ChevronLeft className="h-4 w-4" /> 이전
                  </button>
                  <button
                    onClick={() => {
                      if (shouldProceedToModular) {
                        setExpertTab("modular");
                        return;
                      }
                      onNavigate?.("modeling_generation");
                    }}
                    className="flex w-[68%] items-center justify-center gap-2 rounded-xl bg-[#E0A12E] py-3.5 text-[14px] font-medium text-black transition hover:bg-[#F0B43A]"
                  >
                    {shouldProceedToModular ? "모듈화 진행" : "모델링 진행"}
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#050505]">
            <div
              className={`grid min-h-0 flex-1 gap-0 overflow-hidden ${
                isModuleListConfirmed
                  ? "grid-cols-[minmax(0,1fr)_minmax(620px,780px)] 2xl:grid-cols-[minmax(0,1fr)_900px]"
                  : "grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_480px] 2xl:grid-cols-[minmax(0,1fr)_520px]"
              }`}
            >
              <section className="flex min-w-0 flex-col overflow-hidden p-4">
                <div className="mb-3 flex shrink-0 items-center justify-between">
                  <div>
                    <h3 className="text-[17px] font-medium text-white">{"\ubaa8\ub4c8\ud654 \uce94\ubc84\uc2a4"}</h3>
                    <p className="mt-1 text-[14px] text-neutral-400">
                      {isAddingModuleScan
                        ? "AI\uac00 \uc0c8 \uc7a5\ube44 \ud6c4\ubcf4\uc640 \ud3ec\uc778\ud2b8\ub97c \ubd84\uc11d \uc911\uc785\ub2c8\ub2e4."
                        : isBuildingModuleSet
                          ? "AI\uac00 \uc7a5\ube44 \uc138\ud2b8\ub97c \uad6c\uc131 \uc911\uc785\ub2c8\ub2e4."
                          : isModuleListConfirmed
                            ? "\uc0dd\uc131\ub41c \uc7a5\ube44 \uc138\ud2b8\ub97c \ud655\uc778\ud558\uace0 \ud544\uc694\ud558\uba74 \uc774\uc804\uc73c\ub85c \ub3cc\uc544\uac00 \uc218\uc815\ud569\ub2c8\ub2e4."
                            : isScanningModules
                              ? "\uc774\ubbf8\uc9c0\uc5d0\uc11c \ubd84\ub9ac \uac00\ub2a5\ud55c \uc7a5\ube44 \uc9c0\uc810\uc744 \uc2a4\uce94\ud558\ub294 \uc911"
                              : "AI\uac00 \uc774\ubbf8\uc9c0\uc5d0\uc11c \uc778\uc2dd\ud55c \uc7a5\ube44 \ud6c4\ubcf4\uc785\ub2c8\ub2e4. \ud3ec\uc778\ud2b8\ub97c \uc62e\uae30\uac70\ub098 \uc601\uc5ed\uc744 \uc120\ud0dd\ud574 \ubcf4\uc815\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."}
                    </p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[14px] font-medium ${
                    isModularScanActive
                      ? "border-[#E0A12E]/30 bg-[#E0A12E]/10 text-[#E0A12E]"
                      : "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80]"
                  }`}>
                    {isAddingModuleScan || isScanningModules ? "AI Scan" : isBuildingModuleSet ? "Set Building" : isModuleListConfirmed ? "Set Ready" : "\ucd94\ucc9c \uc9c0\uc810 \ud45c\uc2dc"}
                  </span>
                </div>

                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-[#1F2329] bg-white p-4">
                  <img
                    src={isModuleScanComplete ? ORC_MODULE_RESULT_IMAGE : ORC_MODULE_SCAN_IMAGE}
                    alt="orc modular canvas"
                    className={`max-h-full max-w-full object-contain transition duration-500 ${isModularScanActive ? "opacity-55" : "opacity-100"}`}
                  />

                  {(isScanningModules || isAddingModuleScan) && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black/[0.06]">
                      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(224,161,46,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(224,161,46,0.16)_1px,transparent_1px)] [background-size:42px_42px]" />
                      <motion.div
                        className="absolute left-5 right-5 h-[2px] bg-[#E0A12E] shadow-[0_0_12px_rgba(224,161,46,0.9)]"
                        animate={{ top: ["7%", "93%"] }}
                        transition={{ duration: 1.18, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute -top-[7px] left-0 right-0 h-[16px] bg-gradient-to-b from-transparent via-[#E0A12E]/20 to-transparent" />
                        <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#E0A12E] shadow-[0_0_10px_rgba(224,161,46,0.9)]" />
                        <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#E0A12E] shadow-[0_0_10px_rgba(224,161,46,0.9)]" />
                      </motion.div>

                      {[
                        ["18%", "28%", 0],
                        ["62%", "23%", 0.18],
                        ["48%", "45%", 0.34],
                        ["71%", "58%", 0.52],
                        ["31%", "70%", 0.7],
                      ].map(([left, top, delay]) => (
                        <motion.span
                          key={`${left}-${top}`}
                          className="absolute h-2 w-2 rounded-full border border-[#E0A12E] bg-[#E0A12E]/55 shadow-[0_0_10px_rgba(224,161,46,0.8)]"
                          style={{ left, top }}
                          animate={{ opacity: [0.2, 1, 0.25], scale: [0.75, 1.35, 0.85] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: Number(delay), ease: "easeInOut" }}
                        />
                      ))}

                      <div className="absolute left-5 top-5 h-10 w-10 border-l-2 border-t-2 border-[#E0A12E]/65" />
                      <div className="absolute right-5 top-5 h-10 w-10 border-r-2 border-t-2 border-[#E0A12E]/65" />
                      <div className="absolute bottom-5 left-5 h-10 w-10 border-b-2 border-l-2 border-[#E0A12E]/65" />
                      <div className="absolute bottom-5 right-5 h-10 w-10 border-b-2 border-r-2 border-[#E0A12E]/65" />

                      <div className="absolute inset-x-0 bottom-6 flex justify-center">
                        <div className="rounded-lg border border-[#E0A12E]/35 bg-black/70 px-4 py-2 text-center backdrop-blur-sm">
                          <div className="mb-1 flex items-center justify-center gap-2 text-[#E0A12E]">
                            <Wand2 className="h-4 w-4 animate-pulse" />
                            <span className="text-[14px] font-medium">AI Scan</span>
                          </div>
                          <p className="text-[14px] font-medium text-white">{isAddingModuleScan ? "\uc0c8 \uc7a5\ube44 \ud6c4\ubcf4 \ubd84\uc11d \uc911" : "\ud30c\uce20 \ud6c4\ubcf4 \uc9c0\uc810 \ubd84\uc11d \uc911"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isBuildingModuleSet && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                      <div className="rounded-xl border border-[#E0A12E]/30 bg-black/70 px-5 py-4 text-center shadow-2xl">
                        <Loader2 className="mx-auto mb-2 h-7 w-7 animate-spin text-[#E0A12E]" />
                        <p className="text-[15px] font-medium text-white">{"AI\uac00 \uc7a5\ube44 \uc138\ud2b8\ub97c \uad6c\uc131 \uc911\uc785\ub2c8\ub2e4"}</p>
                      </div>
                    </div>
                  )}

                  {isModuleScanComplete && !isBuildingModuleSet && !isModuleListConfirmed && (
                    <div
                      className={`absolute inset-0 ${isAreaSelectMode ? "cursor-crosshair touch-none" : ""}`}
                      onPointerDown={handleCanvasAreaStart}
                      onPointerMove={handleCanvasAreaMove}
                      onPointerUp={handleCanvasAreaEnd}
                      onPointerLeave={handleCanvasAreaEnd}
                    >
                      {isAreaSelectMode && (
                        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {areaSelectionMode === "edit" && selectedPartData.path && selectedPartData.path.length > 2 && draftPath.length === 0 && (
                            <polygon
                              points={selectedPartData.path.map((point) => `${point.left},${point.top}`).join(" ")}
                              fill="rgba(224,161,46,0.12)"
                              stroke="#E0A12E"
                              strokeWidth="0.35"
                              strokeDasharray="1.3 0.9"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                          {draftPath.length > 1 && (
                            <polyline
                              points={draftPath.map((point) => `${point.left},${point.top}`).join(" ")}
                              fill="none"
                              stroke="#E0A12E"
                              strokeWidth="0.55"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                          {draftPath.length > 2 && (
                            <polygon
                              points={draftPath.map((point) => `${point.left},${point.top}`).join(" ")}
                              fill="rgba(224,161,46,0.14)"
                              stroke="#111111"
                              strokeWidth="0.14"
                              strokeDasharray="1.2 0.7"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                        </svg>
                      )}

                      {moduleParts.map((part) => {
                        const isSelected = selectedPart === part.id;
                        return (
                          <button
                            key={part.id}
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedPart(part.id);
                            }}
                            className={`group absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black/45 bg-[#E0A12E] shadow-[0_0_0_5px_rgba(224,161,46,0.22)] transition hover:scale-125 ${
                              isSelected ? "scale-125 ring-4 ring-[#E0A12E]/35" : ""
                            }`}
                            style={{ left: part.point.left, top: part.point.top }}
                          >
                            <span className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/75 px-2 py-1 text-[14px] font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                              {moduleDrafts[part.id]?.label ?? part.label}
                            </span>
                          </button>
                        );
                      })}

                      {isAreaSelectMode && draftPath.length > 2 && (
                        <span
                          className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-md bg-black/75 px-2 py-1 text-[14px] font-medium text-white"
                          style={{
                            left: `${draftPath[0].left}%`,
                            top: `${Math.max(4, draftPath[0].top - 5)}%`,
                          }}
                        >
                          {areaSelectionMode === "new" ? "\uc0c8 \ubaa8\ub4c8 \uc601\uc5ed" : "\uc601\uc5ed \uc218\uc815"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isModuleScanComplete && !isModuleListConfirmed && (
                  <div className="mt-3 flex shrink-0 items-center justify-between gap-3 rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-3">
                    <p className="min-w-0 truncate text-[14px] font-medium text-neutral-300">
                      {isAreaSelectMode
                        ? "\ub9c8\uc6b0\uc2a4\ub97c \ub204\ub978 \ucc44 \uc7a5\ube44 \ub458\ub808\ub97c \uadf8\ub9b0 \ub4a4 \uc120\ud0dd \uc601\uc5ed \ud655\uc778\uc744 \ub204\ub974\uc138\uc694."
                        : "\ubaa8\ub4c8 \ucd94\uac00\ub294 AI\uac00 \ud6c4\ubcf4\ub97c \ucc3e\uace0, \uc601\uc5ed \uc120\ud0dd\uc740 \uc0ac\uc6a9\uc790\uac00 \uc9c1\uc811 \uadf8\ub824 \ubaa8\ub4c8\uc744 \ucd94\uac00\ud569\ub2c8\ub2e4."}
                    </p>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startAreaSelection("new")}
                        disabled={isAddingModuleScan || isBuildingModuleSet}
                        className={`h-9 rounded-lg border px-3 text-[14px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          areaSelectionMode === "new" ? "border-[#E0A12E] bg-[#E0A12E] text-black" : "border-[#2A2E36] bg-[#111317] text-neutral-300 hover:bg-[#171A20]"
                        }`}
                      >
                        {"\uc601\uc5ed \uc120\ud0dd"}
                      </button>
                      <button
                        type="button"
                        onClick={() => startAreaSelection("edit")}
                        disabled={isAddingModuleScan || isBuildingModuleSet}
                        className={`h-9 rounded-lg border px-3 text-[14px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          areaSelectionMode === "edit" ? "border-[#E0A12E] bg-[#E0A12E] text-black" : "border-[#2A2E36] bg-[#111317] text-neutral-300 hover:bg-[#171A20]"
                        }`}
                      >
                        {"\uc120\ud0dd \uc218\uc815"}
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDrawnArea}
                        disabled={draftPath.length < 3 || isAddingModuleScan || isBuildingModuleSet}
                        className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#E0A12E] px-3 text-[14px] font-medium text-black transition hover:bg-[#F0B43A] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isAddingModuleScan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        {"\uc120\ud0dd \uc601\uc5ed \ud655\uc778"}
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <aside className="flex min-h-0 border-l border-[#1F2329] bg-[#0A0B0D]">
                {isBuildingModuleSet ? (
                  <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
                    <Loader2 className="mb-4 h-9 w-9 animate-spin text-[#E0A12E]" />
                    <h2 className="text-[20px] font-medium text-white">{"\ubaa8\ub4c8\ud654 \uc138\ud2b8 \uc0dd\uc131 \uc911"}</h2>
                    <p className="mt-2 text-[14px] leading-6 text-neutral-400">{"\ud655\uc815\ud55c \ubaa8\ub4c8 \ub9ac\uc2a4\ud2b8\ub97c \uae30\uc900\uc73c\ub85c AI\uac00 \uc7a5\ube44 \uc138\ud2b8 \uad6c\uc131\uc744 \ucd94\ucc9c\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4."}</p>
                  </section>
                ) : (
                  <div className="relative grid min-h-0 flex-1 grid-cols-1">
                    <section className={`${isModuleListConfirmed ? "hidden" : "flex"} min-h-0 flex-col`}>
                      <div className="border-b border-[#1F2329] p-4">
                        <p className="text-[14px] font-medium text-[#E0A12E]">Module List</p>
                        <h2 className="mt-1 text-[20px] font-medium text-white">{"\uc804\uccb4 \ubaa8\ub4c8 \ub9ac\uc2a4\ud2b8"}</h2>
                      </div>

                      <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {!isModuleScanComplete ? (
                          <div className="flex h-full min-h-[260px] items-center justify-center rounded-xl border border-dashed border-[#1F2329] bg-[#050505]">
                            <Loader2 className="h-6 w-6 animate-spin text-[#E0A12E]" />
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {moduleParts.map((part) => {
                              const draft = moduleDrafts[part.id] ?? { label: part.label, keyword: part.keyword, setName: part.setName };
                              const isSelected = selectedPart === part.id;
                              return (
                                <div
                                  key={part.id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => setSelectedPart(part.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") setSelectedPart(part.id);
                                  }}
                                  className={`w-full rounded-xl border p-3 text-left transition ${
                                    isSelected ? "border-[#E0A12E] bg-[#E0A12E]/5" : "border-[#1F2329] bg-[#111317] hover:border-[#3A404F]"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                                      {renderModuleThumbnail(part, "h-full w-full object-contain p-1")}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-[15px] font-medium text-white">{draft.label}</p>
                                        {!isModuleListConfirmed && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveModulePart(part.id);
                                            }}
                                            disabled={moduleParts.length <= 1}
                                            className="shrink-0 rounded-lg border border-[#2A2E36] px-2.5 py-1 text-[14px] font-medium text-neutral-300 transition hover:border-[#E0A12E]/50 hover:bg-[#171A20] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                          >
                                            {"\uc0ad\uc81c"}
                                          </button>
                                        )}
                                      </div>
                                      <p className="mt-1 truncate text-[14px] text-neutral-400">{draft.keyword}</p>
                                    </div>
                                  </div>

                                  {!isModuleListConfirmed && isSelected && (
                                    <div className="mt-3 flex gap-2 border-t border-[#1F2329] pt-3">
                                      <input
                                        value={moduleNameInputs[part.id] ?? draft.label}
                                        onChange={(e) => updateModuleNameInput(part.id, e.target.value)}
                                        className="h-9 min-w-0 flex-1 rounded-lg border border-[#2A2E36] bg-[#050505] px-3 text-[14px] text-white outline-none focus:border-[#E0A12E]/60"
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          applyModuleNameChange(part.id);
                                        }}
                                        className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#E0A12E] px-3 text-[14px] font-medium text-black transition hover:bg-[#F0B43A]"
                                      >
                                        {"\ubcc0\uacbd"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {!isModuleListConfirmed && isModuleScanComplete && (
                        <div className="border-t border-[#1F2329] p-4">
                          <div className="grid grid-cols-[0.38fr_0.62fr] gap-2">
                            <button
                              type="button"
                              onClick={handleAddModulePart}
                              disabled={!isModuleScanComplete || isAddingModuleScan || isModuleListConfirmed}
                              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2A2E36] bg-[#111317] py-3.5 text-[14px] font-medium text-neutral-300 transition hover:bg-[#171A20] disabled:cursor-not-allowed disabled:opacity-55"
                            >
                              {isAddingModuleScan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                              {isAddingModuleScan ? "AI \ud6c4\ubcf4 \ucd94\uac00 \uc911" : "\ubaa8\ub4c8 \ucd94\uac00"}
                            </button>
                            <button
                              type="button"
                              onClick={handleConfirmModuleList}
                              disabled={!isModuleScanComplete || isBuildingModuleSet || moduleParts.length === 0}
                              className="flex items-center justify-center gap-2 rounded-xl bg-[#E0A12E] py-3.5 text-[14px] font-medium text-black transition hover:bg-[#F0B43A] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBuildingModuleSet ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                              {"\ub9ac\uc2a4\ud2b8 \ud655\uc815"}
                            </button>
                          </div>
                        </div>
                      )}
                    </section>

                    {isModuleListConfirmed && (
                      <section className="relative flex min-h-0 flex-col bg-[#050505]">
                        <div className="border-b border-[#1F2329] p-4">
                          <p className="text-[14px] font-medium text-[#E0A12E]">Module Set</p>
                          <h2 className="mt-1 text-[20px] font-medium text-white">{"\ubaa8\ub4c8\ud654 \uc138\ud2b8"}</h2>
                        </div>

                        {!isModuleListDrawerOpen && (
                          <button
                            type="button"
                            onClick={() => setIsModuleListDrawerOpen(true)}
                            className="absolute -left-px top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2 rounded-r-xl border border-l-0 border-[#2A2E36] bg-[#0A0B0D]/95 px-2.5 py-3 text-[14px] font-medium text-neutral-200 shadow-xl backdrop-blur transition hover:border-[#E0A12E]/45 hover:bg-[#111317] hover:text-white"
                          >
                            <ChevronRight className="h-4 w-4 text-[#E0A12E]" />
                            <span className="[writing-mode:vertical-rl]">{"\ubaa8\ub4c8 \ub9ac\uc2a4\ud2b8"}</span>
                          </button>
                        )}

                        <AnimatePresence initial={false}>
                          {isModuleListDrawerOpen && (
                            <motion.div
                              initial={{ x: -28, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: -28, opacity: 0 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="absolute bottom-[84px] left-4 top-[84px] z-30 flex w-[320px] flex-col overflow-hidden rounded-xl border border-[#2A2E36] bg-[#0A0B0D]/95 shadow-2xl backdrop-blur-md"
                            >
                              <div className="flex items-start justify-between gap-3 border-b border-[#1F2329] p-4">
                                <div>
                                  <p className="text-[14px] font-medium text-[#E0A12E]">Module List</p>
                                  <h3 className="mt-1 text-[18px] font-medium text-white">{"\uc804\uccb4 \ubaa8\ub4c8 \ub9ac\uc2a4\ud2b8"}</h3>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsModuleListDrawerOpen(false)}
                                  className="rounded-lg border border-[#2A2E36] px-2.5 py-1.5 text-[14px] font-medium text-neutral-300 transition hover:bg-[#171A20] hover:text-white"
                                >
                                  {"\uc811\uae30"}
                                </button>
                              </div>
                              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 custom-scrollbar">
                                {moduleSetParts.map((part) => {
                                  const draft = moduleDrafts[part.id] ?? { label: part.label, keyword: part.keyword, setName: part.setName };
                                  return (
                                    <div key={`drawer-${part.id}`} className="flex items-center gap-3 rounded-lg border border-[#161A20] bg-[#111317] p-2.5">
                                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                                        {renderModuleThumbnail(part, "h-full w-full object-contain p-1")}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-[14px] font-medium text-white">{draft.label}</p>
                                        <p className="mt-0.5 truncate text-[14px] text-neutral-500">{draft.keyword}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="min-h-0 flex-1 p-4">
                          <div className="flex h-full min-h-0 gap-3">
                            <div
                              ref={moduleSetScrollerRef}
                              onPointerDown={handleModuleSetPointerDown}
                              onPointerMove={handleModuleSetPointerMove}
                              onPointerUp={handleModuleSetPointerEnd}
                              onPointerCancel={handleModuleSetPointerEnd}
                              onPointerLeave={handleModuleSetPointerEnd}
                              className={`min-w-0 flex-1 overflow-x-auto overflow-y-hidden pr-1 custom-scrollbar ${isDraggingModuleSets ? "cursor-grabbing select-none" : "cursor-grab"}`}
                              style={{ touchAction: "pan-y" }}
                            >
                              <div className="flex h-full gap-3">
                                <AnimatePresence initial={false}>
                                  {moduleSets.map((set) => (
                                    <motion.div
                                      layout
                                      key={set.id}
                                      initial={{ opacity: 0, x: 64, scale: 0.96 }}
                                      animate={{ opacity: 1, x: 0, scale: 1 }}
                                      exit={{ opacity: 0, x: -24, scale: 0.96 }}
                                      transition={{ duration: 0.28, ease: "easeOut" }}
                                      className="flex w-[320px] min-w-[320px] flex-col rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-3"
                                    >
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                      <div className="min-w-0 flex-1">
                                        <h4 className="text-[16px] font-medium text-white">{set.title}</h4>
                                        <input
                                          data-module-set-drag-lock
                                          value={set.tag}
                                          onChange={(e) => handleUpdateModuleSetTag(set.id, e.target.value)}
                                          className="mt-2 h-8 w-full rounded-lg border border-[#2A2E36] bg-[#050505] px-2 text-[14px] font-medium outline-none"
                                          style={{ color: set.accent }}
                                        />
                                      </div>
                                      <Lock className="h-4 w-4 text-neutral-500" />
                                    </div>

                                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                                      {moduleSetParts.map((part, partIndex) => {
                                        const draft = moduleDrafts[part.id] ?? { label: part.label, keyword: part.keyword, setName: part.setName };
                                        const setImage = getModuleSetImage(set, part, partIndex);
                                        return (
                                          <button
                                            key={`${set.id}-${part.id}`}
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-lg border border-[#161A20] bg-[#111317] p-2.5 text-left transition hover:border-[#E0A12E]/50"
                                          >
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                                              <img src={setImage} alt="" className="h-full w-full object-contain p-0.5" />
                                            </div>
                                            <span className="truncate text-[14px] font-medium text-neutral-200">{draft.label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </div>
                            </div>

                            <div className={`flex w-[300px] shrink-0 flex-col rounded-xl border bg-[#0A0B0D] p-3 shadow-[-18px_0_28px_rgba(0,0,0,0.2)] transition ${
                              isAddingModuleSet ? "border-[#E0A12E]/55" : "border-[#1F2329]"
                            }`}>
                              <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-[16px] font-medium text-white">{isAddingModuleSet ? "AI Set" : "\uc0c8 \uc138\ud2b8"}</h4>
                                {isAddingModuleSet ? <Loader2 className="h-4 w-4 animate-spin text-[#E0A12E]" /> : <SlidersHorizontal className="h-4 w-4 text-neutral-500" />}
                              </div>
                              <div className="flex flex-1 flex-col justify-center rounded-lg border border-dashed border-[#2A2E36] p-3 text-center">
                                {isAddingModuleSet ? (
                                  <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center"
                                  >
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#E0A12E]/40 bg-[#E0A12E]/10">
                                      <Sparkles className="h-5 w-5 animate-pulse text-[#E0A12E]" />
                                    </div>
                                    <p className="text-[14px] font-medium text-white">{"AI\uac00 \uc0c8 \uc138\ud2b8\ub97c \uad6c\uc131 \uc911\uc785\ub2c8\ub2e4"}</p>
                                    <p className="mt-1 text-[14px] text-neutral-500">{newSetTag}</p>
                                  </motion.div>
                                ) : (
                                  <>
                                    <p className="text-[14px] font-medium text-neutral-300">{"AI \ucd94\ucc9c \ud0dc\uadf8"}</p>
                                    <input
                                      data-module-set-drag-lock
                                      value={newSetTag}
                                      onChange={(e) => setNewSetTag(e.target.value)}
                                      className="mt-3 h-9 rounded-lg border border-[#2A2E36] bg-[#050505] px-3 text-center text-[14px] font-medium text-[#E0A12E] outline-none focus:border-[#E0A12E]/60"
                                    />
                                    <button
                                      type="button"
                                      data-module-set-drag-lock
                                      onClick={handleAddModuleSet}
                                      disabled={isAddingModuleSet}
                                      className="mt-3 flex h-10 items-center justify-center gap-2 rounded-lg bg-[#E0A12E] text-[14px] font-medium text-black transition hover:bg-[#F0B43A] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                      <Sparkles className="h-4 w-4" /> {"\uc138\ud2b8 \ucd94\uac00"}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-[#1F2329] p-4">
                          <div className="grid grid-cols-[0.38fr_0.62fr] gap-2">
                            <button
                              type="button"
                              onClick={handleBackToModuleList}
                              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2A2E36] bg-[#0A0B0D] py-3.5 text-[14px] font-medium text-neutral-300 transition hover:bg-[#141518]"
                            >
                              <ChevronLeft className="h-4 w-4" /> {"\uc774\uc804"}
                            </button>
                            <button
                              type="button"
                              onClick={handleCompleteModular}
                              className="flex items-center justify-center rounded-xl bg-[#E0A12E] py-3.5 text-[14px] font-medium text-black transition hover:bg-[#F0B43A]"
                            >
                              {"\uc644\ub8cc"}
                            </button>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
