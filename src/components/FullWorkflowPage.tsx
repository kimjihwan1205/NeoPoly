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
  LayoutGrid,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FullWorkflowIntroPage from "./FullWorkflowIntroPage";
import ReferencePage from "./ReferencePage";
import NotesPage, { NOTES } from "./NotesPage";
import ProjectPage from "./ProjectPage";
import NewProjectModal from "./NewProjectModal";
import { ASSETS } from "../App";

const COLORS = {
  bg: "#050505",
  panel: "#0A0B0D",
  border: "#1F2329",
  gold: "#E0A12E",
  text: "#F5F5F5",
  muted: "#8B909A",
};

const PROJECTS = [
  {
    id: 1,
    name: "오크",
    status: "In Progress",
    statusColor: COLORS.gold,
    date: "2024.05.20",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%202.png",
  },
  {
    id: 2,
    name: "판타지 마을",
    status: "In Progress",
    statusColor: COLORS.gold,
    date: "2024.05.18",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%206.png",
  },
  {
    id: 3,
    name: "바위 절벽 환경",
    status: "Ready",
    statusColor: "#60A5FA",
    date: "2024.05.15",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%207.png",
  },
  {
    id: 4,
    name: "고대 신전",
    status: "Published",
    statusColor: "#4ADE80",
    date: "2024.05.10",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%203.png",
  },
  {
    id: 5,
    name: "기계 전차",
    status: "Draft",
    statusColor: COLORS.muted,
    date: "2024.05.08",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%204.png",
  },
  {
    id: 6,
    name: "숲 늑대",
    status: "In Progress",
    statusColor: COLORS.gold,
    date: "2024.05.05",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%205.png",
  },
  {
    id: 7,
    name: "나무 오두막",
    status: "Concept",
    statusColor: COLORS.muted,
    date: "2024.05.01",
    image: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%209.png",
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
  const [isNotePopupOpen, setIsNotePopupOpen] = useState(false);
  const [isReferencePopupOpen, setIsReferencePopupOpen] = useState(false);
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

  const [workflowStep, setWorkflowStep] = useState<"prompt" | "image-generation">("prompt");
  const [selectedGridImage, setSelectedGridImage] = useState<number | null>(null);
  const [rightPanelMode, setRightPanelMode] = useState<"prompt" | "expert">("prompt");
  const [expertTab, setExpertTab] = useState<"turnaround" | "modular">("turnaround");
  const [isTurnaroundSelected, setIsTurnaroundSelected] = useState<boolean>(false);
  const [isModularSelected, setIsModularSelected] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [hasGeneratedImages, setHasGeneratedImages] = useState<boolean>(false);

  const DUMMY_GENERATED_IMAGES = [
    "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2010.png",
    "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2011.png",
    "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2012.png",
    "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2013.png",
  ];

  const handleStartProjectWithAssets = () => {
    // Collect all image URLs from staged Notes
    const noteImages = stagedNotes
      .map((noteId) => NOTES.find((n) => n.id === noteId))
      .filter(Boolean)
      .flatMap((n) => n!.images || []);

    // Also include ASSETS that match these URLs
    const noteAssetIds = ASSETS.filter((a) => noteImages.includes(a.image)).map(
      (a) => a.id,
    );

    // Merge staged references and found ASSET ids
    const mergedRefIds = Array.from(
      new Set([...stagedReferences, ...noteAssetIds]),
    );
    setSelectedReferences(mergedRefIds);

    // Create a new project instance
    const newProjectId = Date.now();
    const newProject = {
      id: newProjectId,
      name: "새로운 프로젝트",
      status: "Just Started",
      statusColor: COLORS.gold,
      date: new Date().toLocaleDateString("ko-KR").replace(/\./g, "."),
      image:
        mergedRefIds.length > 0
          ? ASSETS.find((a) => a.id === mergedRefIds[0])?.image || ""
          : "",
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProjectId);
    setMessages([]);
    setHasGeneratedImages(false);
    setHasUnsavedChanges(false);
  };

  const handleStartEmptyProject = () => {
    setSelectedReferences([]);
    setStagedNotes([]);
    setStagedReferences([]);

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
    setHasUnsavedChanges(false);
  };

  const handleGenerateImage = () => {
    setWorkflowStep("image-generation");
    setHasGeneratedImages(true);
    setHasUnsavedChanges(false);
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
    <div className="flex bg-[#050505] h-[calc(100vh-76px)] text-white font-sans antialiased w-full overflow-hidden relative">
      {showIntroOverlay && (
        <FullWorkflowIntroPage
          onNavigate={onNavigate}
          onClose={() => onNavigate?.("full_workflow_chat")}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeProject === null ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative w-full h-full bg-[#050505] overflow-y-auto custom-scrollbar">
            <div className="max-w-[1200px] w-full flex flex-col items-center justify-center min-h-[60vh] pb-16">
              <div className="w-20 h-20 bg-[#141518] rounded-[24px] flex items-center justify-center border border-[#2A2E36] mb-8 shadow-xl">
                <Sparkles className="w-10 h-10 text-[#E0A12E]" />
              </div>
              <h2 className="text-[32px] font-bold text-white mb-4 tracking-tight">
                새로운 작업 시작하기
              </h2>
              <p className="text-[15px] text-neutral-400 leading-relaxed max-w-md text-center mb-12">
                바로 빈 캔버스에서 아이디어를 펼치거나,
                <br />
                미리 정리해둔 노트와 레퍼런스를 세팅하고 시작할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                {/* 빈 프로젝트로 시작 */}
                <button
                  onClick={handleStartEmptyProject}
                  className="flex flex-col items-center justify-start h-full pt-10 pb-8 px-6 bg-[#0A0B0D] hover:bg-[#141518] border border-[#1F2329] hover:border-[#E0A12E]/50 rounded-[24px] transition-all group shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E0A12E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="h-12 mb-6 flex items-center justify-center shrink-0">
                    <FolderPlus className="w-12 h-12 text-[#E0A12E] group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-3 relative z-10 shrink-0">
                    빈 프로젝트로 시작
                  </h3>
                  <p className="text-[14px] text-neutral-400 relative z-10 leading-relaxed mb-auto shrink-0 whitespace-pre-line">
                    {"아무 제약 없이 깨끗한 상태에서\n자유롭게 구상을 시작합니다."}
                  </p>
                </button>

                {/* 진행중인 프로젝트로 시작 */}
                <button
                  onClick={() => setIsProjectPopupOpen(true)}
                  className="flex flex-col items-center justify-start h-full pt-10 pb-8 px-6 bg-[#0A0B0D] hover:bg-[#141518] border border-[#1F2329] hover:border-[#E0A12E]/50 rounded-[24px] transition-all group shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E0A12E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="h-12 mb-6 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-12 h-12 text-[#E0A12E] group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-3 relative z-10 shrink-0">
                    프로젝트 이어서 시작
                  </h3>
                  <p className="text-[14px] text-neutral-400 relative z-10 leading-relaxed mb-auto shrink-0 whitespace-pre-line">
                    {"최근에 진행하던 프로젝트를\n선택하여 작업을 이어갑니다."}
                  </p>
                </button>

                {/* 자료 가져와서 시작 */}
                <div className="flex flex-col items-center justify-start h-full pt-10 pb-8 px-6 bg-[#0A0B0D] border border-[#1F2329] rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-center relative overflow-hidden transition-all">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center w-full h-full"
                  >
                    <div className="h-12 mb-6 flex items-center justify-center shrink-0">
                      {stagedNotes.length === 0 &&
                      stagedReferences.length === 0 ? (
                        <Inbox className="w-12 h-12 text-neutral-400" />
                      ) : (
                        <div className="flex items-center gap-2">
                          {stagedNotes.length > 0 && (
                            <span className="px-3 py-1 bg-[#60A5FA]/10 text-[#60A5FA] rounded-full text-[13px] font-bold border border-[#60A5FA]/20 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" /> 노트{" "}
                              {stagedNotes.length}
                            </span>
                          )}
                          {stagedReferences.length > 0 && (
                            <span className="px-3 py-1 bg-[#4ADE80]/10 text-[#4ADE80] rounded-full text-[13px] font-bold border border-[#4ADE80]/20 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5" /> 레퍼런스{" "}
                              {stagedReferences.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <h3 className="text-[20px] font-bold text-white mb-3 shrink-0">
                      가져온 자료로 시작
                    </h3>
                    <p className="text-[14px] text-neutral-400 mb-auto leading-relaxed shrink-0 whitespace-pre-line">
                      {stagedNotes.length > 0 || stagedReferences.length > 0
                        ? "선택한 자료가 워크스페이스에 자동으로 복사됩니다."
                        : "내 노트나 레퍼런스 이미지를\n작업 공간에 한 번에 세팅합니다."}
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-6 shrink-0 w-full flex-wrap">
                      <button
                        onClick={() => setIsNotePopupOpen(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 bg-[#141518] hover:bg-[#1C1E23] border ${stagedNotes.length > 0 ? "border-[#60A5FA]/50 text-[#60A5FA]" : "border-[#2A2E36] hover:border-[#60A5FA]/50 text-neutral-400 hover:text-[#60A5FA]"} rounded-xl text-[13px] font-medium transition-all`}
                      >
                        <FileText className="w-4 h-4" />{" "}
                        {stagedNotes.length > 0 ? "노트 관리" : "노트 선택"}
                      </button>
                      <button
                        onClick={() => setIsReferencePopupOpen(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 bg-[#141518] hover:bg-[#1C1E23] border ${stagedReferences.length > 0 ? "border-[#4ADE80]/50 text-[#4ADE80]" : "border-[#2A2E36] hover:border-[#4ADE80]/50 text-neutral-400 hover:text-[#4ADE80]"} rounded-xl text-[13px] font-medium transition-all`}
                      >
                        <ImageIcon className="w-4 h-4" />{" "}
                        {stagedReferences.length > 0
                          ? "레퍼런스 관리"
                          : "레퍼런스 선택"}
                      </button>
                    </div>

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
                            onClick={() => {
                              setStagedNotes([]);
                              setStagedReferences([]);
                            }}
                            className="flex-1 py-3 bg-[#141518] hover:bg-[#1C1E23] text-neutral-400 rounded-xl text-[14px] font-medium transition-colors border border-[#2A2E36]"
                          >
                            초기화
                          </button>
                          <button
                            onClick={handleStartProjectWithAssets}
                            className="flex-[2] py-3 bg-[#F5F5F5] hover:bg-white text-[#050505] rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
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
            <div className="flex-1 flex flex-col min-w-0 relative">
              {workflowStep === "prompt" ? (
                <>
                  {/* Main Top Header */}
                  <div className="px-8 pt-5 pb-3 shrink-0 flex items-center justify-between z-10">
                    <div>
                      <h1 className="text-[20px] font-bold text-neutral-100 flex items-center gap-2">
                        AI 프롬프트 도우미
                      </h1>
                      <p className="text-[13px] text-neutral-400 mt-0.5 flex items-center gap-1.5">
                        아이디어를 자유롭게 설명하면, AI가 프롬프트 작성을
                        도와드려요.
                        <HelpCircle className="w-4 h-4" />
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2A2E36] bg-[#0A0B0D] hover:bg-[#141518] transition-colors text-[13px] text-neutral-300">
                      <Sparkles className="w-4 h-4 text-[#E0A12E]" /> 가이드 보기
                    </button>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto px-8 py-5 custom-scrollbar flex flex-col gap-8 pb-4">
                    {messages.map((msg) => {
                  if (msg.role === "assistant") {
                    return (
                      <div key={msg.id} className="flex gap-4 max-w-[85%]">
                        <div className="w-9 h-9 rounded-full bg-[#141518] border border-[#2A2E36] flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#E0A12E]" />
                        </div>
                        <div className="flex flex-col gap-1.5 items-start">
                          <div className="bg-[#141518] border border-[#1F2329] rounded-2xl rounded-tl-sm px-5 py-3.5 text-[14px] text-neutral-200 leading-relaxed font-medium">
                            {msg.content}
                          </div>

                          {msg.chips && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {msg.chips.map((chip, i) => {
                                if (chip.isCustom) {
                                  return (
                                    <button
                                      key={i}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1F2329] bg-[#0A0B0D] hover:bg-[#141518] text-neutral-300 text-[13px] transition-colors"
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
                                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E0A12E] bg-[#E0A12E]/10 text-neutral-100 text-[13px] transition-colors"
                                    >
                                      {chip.label}
                                    </button>
                                  );
                                }

                                return (
                                  <button
                                    key={i}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#1F2329] bg-[#0A0B0D] hover:bg-[#141518] text-neutral-300 text-[13px] transition-colors"
                                  >
                                    {chip.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {!msg.chips && (
                            <span className="text-[11px] text-neutral-400 ml-2">
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
                          <div className="bg-[#1C1E23] border border-[#2A2E36] rounded-2xl rounded-tr-sm px-5 py-3.5 text-[14px] text-neutral-100 font-medium tracking-tight">
                            {msg.content}
                          </div>
                          <span className="text-[11px] text-neutral-400 mr-2">
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
                      className="bg-[#E0A12E] hover:bg-[#F0B43A] text-black rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
            ) : (
              <div className="flex-1 p-5 lg:p-8 custom-scrollbar relative flex flex-col min-h-0 bg-[#050505]">
                <div className="max-w-[1400px] w-full h-full flex flex-col min-h-0 mx-auto">
                  <div className="mb-4 lg:mb-5 shrink-0 flex items-center gap-3">
                    <h2 className="text-[20px] font-bold text-white tracking-tight">생성된 이미지</h2>
                    <span className="bg-[#141518] border border-[#2A2E36] px-2.5 py-0.5 rounded-full text-[13px] text-white font-bold">4</span>
                  </div>
                  
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 lg:gap-5 flex-1 min-h-0">
                    {[0, 1, 2, 3].map((i) => (
                      <button 
                        key={i}
                        onClick={() => setSelectedGridImage(i)}
                        className={`group relative rounded-xl overflow-hidden border-[2px] transition-all duration-300 block w-full h-full ${selectedGridImage === i ? 'border-[#E0A12E]' : 'border-[#1F2329] hover:border-[#555A64]'}`}
                      >
                        <img referrerPolicy="no-referrer" src={DUMMY_GENERATED_IMAGES[i]} alt={`시안 ${i+1}`} className="absolute inset-0 w-full h-full object-cover" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                           {selectedGridImage === i && (
                             <div className="w-6 h-6 rounded-full bg-[#E0A12E] flex items-center justify-center text-black shadow-lg">
                               <Check className="w-4 h-4 stroke-[3]" />
                             </div>
                           )}
                        </div>

                        {/* Top Actions Bar (Hover) */}
                        <div className="absolute top-0 left-0 right-0 p-4 pb-12 flex items-center justify-end bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-colors">
                              <Download className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-colors">
                              <Bookmark className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </div>

            {/* Right Sidebar - Output & Options */}
            {workflowStep === "prompt" ? (
              ((rightPanelMode === "prompt") || rightPanelMode === "expert") && (
              <div className="w-[420px] xl:w-[480px] 2xl:w-[550px] flex-shrink-0 border-l border-[#1F2329] bg-[#050505] flex flex-col h-full overflow-hidden">
                {rightPanelMode === "prompt" ? (
                <>
                  <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6 pb-0">
                    {/* Selected Refs */}
                    <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4 flex flex-col max-h-[45vh] shrink-0">
                      <div className="flex items-center justify-between mb-3 text-[14px] shrink-0">
                        <span className="text-neutral-100 font-bold">레퍼런스</span>
                        <span className="text-neutral-400">
                          {selectedReferences.length} / 20
                        </span>
                      </div>
                      <div className="overflow-y-auto scrollbar-hide flex-1 pb-1 pr-1">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {selectedReferences.map((id, i) => {
                            const asset = ASSETS.find((a) => a.id === id);
                            if (!asset) return null;
                            const tags =
                              refTags[id] ||
                              (i < 3 ? [["그림체", "무기", "얼굴"][i]] : []);

                            const isEditing = editingTagId === id;

                            return (
                              <div
                                key={id}
                                className="relative aspect-square flex flex-col justify-end group"
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
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-md text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/10 z-20"
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
                                      className="w-full text-center bg-black/70 border border-white/20 rounded-md backdrop-blur-md text-[12px] text-white px-2 py-1 outline-none focus:border-[#E0A12E]"
                                    />
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTagId(id);
                                      }}
                                      className="mx-auto flex w-full items-center justify-center gap-1.5 px-2.5 py-1 bg-black/70 hover:bg-black/90 border border-white/20 rounded-md backdrop-blur-md transition-all text-white"
                                    >
                                      <span className="text-[12px] font-bold truncate">
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
                            onClick={() => setIsReferencePopupOpen(true)}
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px]">추가</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Prompt Preview */}
                    <div className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-5 flex flex-col flex-1 min-h-0 mb-6 shrink">
                      <div className="flex items-center justify-between mb-3 text-[14px] shrink-0">
                        <span className="text-neutral-100 font-bold">프롬프트</span>
                        <button className="flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-white transition-colors border border-[#1F2329] rounded-md px-2 py-1">
                          <Copy className="w-3 h-3" /> 복사
                        </button>
                      </div>

                      <div
                        className="flex-1 overflow-y-auto custom-scrollbar text-[14px] text-neutral-200 font-medium leading-relaxed bg-[#141518] p-3 rounded-lg border border-[#1F2329] focus:outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={() => setHasUnsavedChanges(true)}
                      >
                        {messages.length === 0
                          ? ""
                          : "숲 속에 있는 통나무 오두막, 따뜻하고 아늑한 분위기, 난로에서 연기가 피어오름, 등불이 켜져 있음, 작은 텃밭과 나무 울타리가 주변에 있음, 해질녘의 부드러운 자연광, 판타지 스타일, 고품질 3D 렌더링"}
                      </div>

                      <div className="mt-2 text-right text-[11px] text-neutral-400 shrink-0">
                        {messages.length === 0 ? "0" : "152"} / 1500
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 p-6 pt-0 bg-[#050505]">
                    <div className="flex flex-col gap-3">
                      {hasGeneratedImages ? (
                        hasUnsavedChanges ? (
                          <button 
                            onClick={handleGenerateImage}
                            className="w-full bg-[#E0A12E] hover:bg-[#F0B43A] text-black font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.2)] transition-all flex items-center justify-center gap-2 text-[15px]"
                          >
                            변경사항 적용 및 재생성 ✨
                          </button>
                        ) : (
                          <button 
                            onClick={() => setWorkflowStep("image-generation")}
                            className="w-full bg-[#141518] hover:bg-[#1C1E23] border border-[#2A2E36] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-[15px]"
                          >
                            시안 화면으로 복귀 ▶
                          </button>
                        )
                      ) : (
                        <button 
                          onClick={handleGenerateImage}
                          className="w-full bg-[#E0A12E] hover:bg-[#F0B43A] text-black font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.2)] transition-all flex items-center justify-center gap-2 text-[15px]"
                        >
                          이미지 생성하기 <Sparkles className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full bg-[#050505]">
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-[#1F2329] flex items-center justify-between shrink-0 bg-[#0A0B0D]">
                    <h3 className="text-[18px] font-bold text-neutral-100 tracking-tight">
                      전문가용 제어판
                    </h3>
                    <button
                      onClick={() => setRightPanelMode("prompt")}
                      className="text-neutral-400 hover:text-white transition-colors text-[13px] font-medium flex items-center gap-1"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" /> 프롬프트로
                      돌아가기
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[#1F2329] px-6 shrink-0 bg-[#050505]">
                    <button
                      onClick={() => setExpertTab("turnaround")}
                      className={`py-4 text-[14px] font-bold border-b-2 mr-6 transition-colors ${expertTab === "turnaround" ? "border-[#E0A12E] text-[#E0A12E]" : "border-transparent text-neutral-400 hover:text-white"}`}
                    >
                      턴어라운드 설정
                    </button>
                    <button
                      onClick={() => setExpertTab("modular")}
                      className={`py-4 text-[14px] font-bold border-b-2 mr-6 transition-colors ${expertTab === "modular" ? "border-[#E0A12E] text-[#E0A12E]" : "border-transparent text-neutral-400 hover:text-white"}`}
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
                            <label className="text-[14px] font-bold text-neutral-100">
                              카메라 렌더링 앵글 (Count)
                            </label>
                            <span className="text-[13px] font-bold text-[#E0A12E]">
                              8 views
                            </span>
                          </div>
                          <p className="text-[13px] text-neutral-400 leading-relaxed mb-1">
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
                            className="w-full accent-[#E0A12E] mt-2 bg-[#1A1C20] h-1.5 rounded-lg appearance-none outline-none"
                          />
                          <div className="flex justify-between text-[11px] text-neutral-400 mt-1 font-mono">
                            <span>4</span>
                            <span>16</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-[14px] font-bold text-neutral-100">
                            토폴로지 최적화 단계 (Topology)
                          </label>
                          <p className="text-[13px] text-neutral-400 leading-relaxed mb-2">
                            게임 엔진용(Low-Poly)부터 시네마틱용(High-Poly)까지 메쉬의 조밀도를 설정합니다.
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <button className="bg-[#1A1C20] hover:bg-[#1F2329] border border-[#2A2E36] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors">
                              <span className="text-[13px] font-bold text-neutral-200">
                                Low Poly
                              </span>
                              <span className="text-[11px] text-neutral-400">
                                모바일 / VR
                              </span>
                            </button>
                            <button className="bg-[#E0A12E]/10 border border-[#E0A12E] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors">
                              <span className="text-[13px] font-bold text-[#E0A12E]">
                                Mid Poly
                              </span>
                              <span className="text-[11px] text-[#E0A12E]/70">
                                일반 PC / 콘솔
                              </span>
                            </button>
                            <button className="bg-[#1A1C20] hover:bg-[#1F2329] border border-[#2A2E36] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors">
                              <span className="text-[13px] font-bold text-neutral-200">
                                High Poly
                              </span>
                              <span className="text-[11px] text-neutral-400">
                                시네마틱 / 랜더링
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-[14px] font-bold text-neutral-100">
                            텍스처 해상도 (Resolution)
                          </label>
                          <select defaultValue="2048 x 2048 (2K)" className="w-full bg-[#1A1C20] border border-[#2A2E36] rounded-xl px-4 py-3.5 text-[14px] text-neutral-200 font-medium focus:outline-none focus:border-[#E0A12E]">
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
                            <label className="text-[14px] font-bold text-neutral-100">
                              세그먼트 파츠 분할 (Auto-Segment)
                            </label>
                            <div className="w-10 h-6 bg-[#E0A12E] rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(224,161,46,0.3)]">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full transition-all"></div>
                            </div>
                          </div>
                          <p className="text-[13px] text-neutral-400 leading-relaxed">
                            단일 메쉬가 아닌 부위별(예: 문, 지붕, 창틀)로 독립된
                            폴리곤 파츠로 분할 생성합니다. 인게임 애니메이션 및
                            상호작용 적용 시 유리합니다.
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-[14px] font-bold text-neutral-100">
                            이음매 처리 강도 (Seam Tolerance)
                          </label>
                          <div className="flex items-center gap-4 bg-[#1A1C20] p-4 rounded-xl border border-[#2A2E36]">
                            <Minus className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-white" />
                            <div className="flex-1 bg-black h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#E0A12E] h-full w-[60%]"></div>
                            </div>
                            <Plus className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-white" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <label className="text-[14px] font-bold text-neutral-100">
                            바운딩 박스 생성 (Bounding Box)
                          </label>
                          <div className="flex items-center gap-3 mt-1">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 accent-[#E0A12E] bg-transparent border-[#2A2E36]"
                            />
                            <span className="text-[13px] text-neutral-300">
                              각 파츠별 개별 바운딩 박스 자동 계산
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 accent-[#E0A12E] bg-transparent border-[#2A2E36]"
                            />
                            <span className="text-[13px] text-neutral-300">
                              부모-자식(Parent-Child) 계층 구조 자동 생성
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fixed Bottom Button */}
                  <div className="shrink-0 p-6 pt-5 bg-[#0A0B0D] border-t border-[#1F2329] z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
                    <button className="w-full bg-[#E0A12E] hover:bg-[#F0B43A] text-black font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.3)] transition-all flex items-center justify-center gap-2 text-[16px]">
                      최종 3D 모델링 생성 <span className="text-xl">🚀</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            )) : (
              <div className="w-[420px] xl:w-[480px] 2xl:w-[550px] flex-shrink-0 border-l border-[#1F2329] bg-[#050505] flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 custom-scrollbar flex flex-col gap-5">
                  {/* Reference Settings Area */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-neutral-100">레퍼런스 세부 설정</h3>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2A2E36] text-[11px] text-neutral-400 hover:text-white hover:bg-[#141518] transition-colors">
                        <RefreshCw className="w-3 h-3" /> 초기화
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Ref 1 */}
                      <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-xl p-2.5 flex gap-3 pr-3">
                        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0 border border-[#2A2E36]">
                          <img referrerPolicy="no-referrer" src={ASSETS[3]?.image || ''} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-[13px] font-medium text-neutral-300">메인 컨셉</span>
                            <X className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-neutral-400">영향도</span>
                            <input type="range" min="0" max="100" defaultValue="85" className="flex-1 accent-[#E0A12E] bg-[#1A1C20] h-1 rounded-lg appearance-none outline-none" />
                            <span className="text-[11px] text-neutral-400 font-mono w-6">0.85</span>
                          </div>
                        </div>
                      </div>

                      {/* Ref 2 */}
                      <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-xl p-2.5 flex gap-3 pr-3">
                        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0 border border-[#2A2E36] bg-white">
                          <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2014.png" className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-[13px] font-medium text-neutral-300">바지 장신구</span>
                            <X className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-neutral-400">영향도</span>
                            <input type="range" min="0" max="100" defaultValue="60" className="flex-1 accent-[#E0A12E] bg-[#1A1C20] h-1 rounded-lg appearance-none outline-none" />
                            <span className="text-[11px] text-neutral-400 font-mono w-6">0.60</span>
                          </div>
                        </div>
                      </div>

                      {/* Ref 3 */}
                      <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-xl p-2.5 flex gap-3 pr-3">
                        <div className="w-[50px] h-[50px] rounded-lg overflow-hidden shrink-0 border border-[#2A2E36]">
                          <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2015.png" className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-[13px] font-medium text-neutral-300 line-clamp-1">무기 디자인, 무기는 왼손에 들고있음</span>
                            <X className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer shrink-0" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-neutral-400 shrink-0">영향도</span>
                            <input type="range" min="0" max="100" defaultValue="90" className="flex-1 accent-[#E0A12E] bg-[#1A1C20] h-1 rounded-lg appearance-none outline-none" />
                            <span className="text-[11px] text-neutral-400 font-mono shrink-0 w-6">0.90</span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full py-3 rounded-xl border border-dashed border-[#2A2E36] hover:border-[#555A64] text-neutral-400 hover:text-white text-[12px] flex items-center justify-center gap-2 transition-colors mt-1">
                        <Plus className="w-4 h-4" /> 레퍼런스 추가
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#1F2329] my-0 shrink-0"></div>

                  {/* Prompt Summary Area */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-neutral-100">프롬프트 요약</h3>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2A2E36] text-[11px] text-neutral-400 hover:text-white hover:bg-[#141518] transition-colors">
                        편집
                      </button>
                    </div>

                    <div className="bg-[#141518] border border-[#2A2E36] rounded-xl p-4 flex flex-col gap-3 shadow-inner">
                      <p className="text-[14px] text-neutral-200 leading-relaxed font-medium">
                        강인한 체형의 오크 캐릭터.
                        스파이크가 달린 가죽과 금속 갑옷, 해골 장식,
                        큰 철퇴 무기, 전신 샷, 어두운 배경, 시네마틱 조명,
                        리얼리스틱, 고디테일.
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {["오크", "전사", "판타지", "갑옷", "금속", "무기"].map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-[#1C1E23] border border-[#2A2E36] rounded-full text-[11px] text-neutral-300">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#1F2329]">
                        <button className="text-[11.5px] text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors">
                          <Plus className="w-3.5 h-3.5" /> 네거티브 프롬프트 포함
                        </button>
                        <span className="text-[11px] text-neutral-400">124 / 1500</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Step Area */}
                <div className="shrink-0 px-5 pb-5 pt-3 bg-[#050505]">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[15px] font-bold text-neutral-100 mb-1">다음 단계</h3>
                    
                    {/* Preprocessing Options */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsTurnaroundSelected(!isTurnaroundSelected)}
                        className={`flex-1 flex items-center justify-start px-4 py-3.5 rounded-xl border text-[13px] font-semibold transition-colors ${isTurnaroundSelected ? "bg-[#141518] border-[#E0A12E] text-[#E0A12E]" : "bg-[#0A0B0D] border-[#2A2E36] text-neutral-400 hover:border-[#555A64] hover:text-white"}`}
                      >
                        <div className={`w-4 h-4 rounded-[4px] border shrink-0 mr-3 flex items-center justify-center transition-colors ${isTurnaroundSelected ? 'bg-[#E0A12E] border-[#E0A12E]' : 'border-[#555A64]'}`}>
                          {isTurnaroundSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                        </div>
                        <RefreshCw className="w-4 h-4 mr-2 shrink-0" />
                        <span className="flex-1 text-left">턴어라운드 제작</span>
                      </button>
                      <button
                        onClick={() => setIsModularSelected(!isModularSelected)}
                        className={`flex-1 flex items-center justify-start px-4 py-3.5 rounded-xl border text-[13px] font-semibold transition-colors ${isModularSelected ? "bg-[#141518] border-[#E0A12E] text-[#E0A12E]" : "bg-[#0A0B0D] border-[#2A2E36] text-neutral-400 hover:border-[#555A64] hover:text-white"}`}
                      >
                        <div className={`w-4 h-4 rounded-[4px] border shrink-0 mr-3 flex items-center justify-center transition-colors ${isModularSelected ? 'bg-[#E0A12E] border-[#E0A12E]' : 'border-[#555A64]'}`}>
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
                          setHasUnsavedChanges(false);
                        }} 
                        className="w-[30%] bg-[#0A0B0D] hover:bg-[#141518] border border-[#2A2E36] text-neutral-300 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-[13px] font-medium"
                      >
                        <ChevronLeft className="w-4 h-4 text-neutral-400" /> 이전 단계
                      </button>
                      {(!isTurnaroundSelected && !isModularSelected) ? (
                        <button 
                          className="w-[70%] bg-[#E0A12E] hover:bg-[#F0B43A] text-black font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.3)] transition-all flex items-center justify-center gap-1.5 text-[14px]"
                        >
                          이대로 3D 모델링 즉시 생성 🚀
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (isTurnaroundSelected && onNavigate) {
                               onNavigate("turnaround");
                            } else {
                               setWorkflowStep("prompt"); 
                               setRightPanelMode("expert");
                               setExpertTab(isTurnaroundSelected ? "turnaround" : "modular");
                            }
                          }}
                          className="w-[70%] bg-[#E0A12E] hover:bg-[#F0B43A] text-black font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.3)] transition-all flex items-center justify-center gap-1.5 text-[14px]"
                        >
                          선택한 설정으로 정교화 시작 <ChevronRight className="w-4 h-4" />
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

      {/* Note Selection Modal */}
      {isNotePopupOpen && (
        <div className="absolute inset-0 z-[100] flex bg-[#050505]/80 backdrop-blur-[2px] text-white font-sans antialiased items-center justify-center p-6">
          <div className="bg-[#050505] border border-[#2A2E36] rounded-xl flex flex-col w-[95vw] h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2329] shrink-0 bg-[#0A0B0D]">
              <div className="flex items-center gap-4">
                <h3 className="text-[17px] font-bold text-white tracking-tight">
                  노트 가져오기
                </h3>
                <div className="h-4 w-[1px] bg-[#2A2E36]"></div>
              </div>

              <div className="flex items-center gap-3">
                <button className="text-neutral-400 hover:text-white transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-neutral-400 hover:bg-[#1A1C23] hover:text-white rounded transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setIsNotePopupOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1A1C23] rounded transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden relative custom-scrollbar bg-bg-dark">
              <NotesPage
                onNavigate={() => {}}
                isPopup={true}
                onAcceptSelection={(noteIds) => {
                  setStagedNotes(
                    Array.from(new Set([...stagedNotes, ...noteIds])),
                  );
                  setIsNotePopupOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reference Selection Modal */}
      {isReferencePopupOpen && (
        <div className="absolute inset-0 z-[100] flex bg-[#050505]/80 backdrop-blur-[2px] text-white font-sans antialiased items-center justify-center p-6">
          <div className="bg-[#050505] border border-[#2A2E36] rounded-xl flex flex-col w-[95vw] h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2329] shrink-0 bg-[#0A0B0D]">
              <div className="flex items-center gap-4">
                <h3 className="text-[17px] font-bold text-white tracking-tight">
                  레퍼런스
                </h3>
                <button className="text-neutral-400 hover:text-[#E0A12E] transition-colors">
                  <Star className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="text-neutral-400 hover:text-white transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-neutral-400 hover:bg-[#1A1C23] hover:text-white rounded transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setIsReferencePopupOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1A1C23] rounded transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden relative custom-scrollbar bg-bg-dark">
              <ReferencePage
                favorites={[]}
                toggleFavorite={() => {}}
                onNavigate={() => {}}
                isPopup={true}
                onAcceptSelection={(selectedIds) => {
                  if (activeProject !== null) {
                    setSelectedReferences(
                      Array.from(new Set([...selectedReferences, ...selectedIds]))
                    );
                    setHasUnsavedChanges(true);
                  } else {
                    setStagedReferences(
                      Array.from(new Set([...stagedReferences, ...selectedIds])),
                    );
                  }
                  setIsReferencePopupOpen(false);
                }}
              />
            </div>
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
                <h3 className="text-[17px] font-bold text-white tracking-tight">
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
