import React, { useState } from "react";
import {
  Check,
  ChevronLeft,
  Image as ImageIcon,
  Layers,
  Loader2,
  MousePointer2,
  RotateCcw,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface TurnaroundPageProps {
  onNavigate?: (page: string) => void;
}

const ORC_BASE_IMAGE = "/images/orc/orc_2D_front.png";

const TURNAROUND_VIEWS = [
  { id: "front", label: "정면", angle: "Front", img: "/images/orc/orc_2D_front.png" },
  { id: "45deg", label: "45도", angle: "3/4 View", img: "/images/orc/orc_2D_45.png" },
  { id: "side", label: "측면", angle: "Side", img: "/images/orc/orc_2D_side.png" },
  { id: "back", label: "후면", angle: "Back", img: "/images/orc/orc_2D_back.png" },
];

const MODULAR_PARTS = [
  { id: "left-bracer", label: "스파이크 팔 보호구", image: "/images/orc/orc_default_item01.png", color: "#E0A12E" },
  { id: "right-bracer", label: "가죽 팔 장비", image: "/images/orc/orc_default_item02.png", color: "#60A5FA" },
  { id: "shoulder", label: "어깨 갑옷", image: "/images/orc/orc_default_item03.png", color: "#4ADE80" },
  { id: "belt", label: "해골 벨트 장식", image: "/images/orc/orc_default_item04.png", color: "#F97316" },
  { id: "strap", label: "가죽 스트랩", image: "/images/orc/orc_default_item05.png", color: "#C084FC" },
];

export default function TurnaroundPage({ onNavigate }: TurnaroundPageProps) {
  const [expertTab, setExpertTab] = useState<"turnaround" | "modular">("turnaround");
  const [isGenerating, setIsGenerating] = useState(false);

  const [regeneratingViews, setRegeneratingViews] = useState<Set<string>>(new Set());


  const [isGeneratingModular, setIsGeneratingModular] = useState(false);
  const [hasGeneratedModular, setHasGeneratedModular] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string>("left-bracer");

  const handleGenerate = () => {
    setIsGenerating(true);
    window.setTimeout(() => setIsGenerating(false), 900);
  };

<<<<<<< HEAD
  const handleRegenerateView = (viewId: string) => {
    setRegeneratingViews((current) => new Set(current).add(viewId));
    window.setTimeout(() => {
      setRegeneratingViews((current) => {
        const next = new Set(current);
        next.delete(viewId);
        return next;
      });
    }, 900);
  };

=======
>>>>>>> c80425d0882cb1807b024b299664fd89da59b6a3
  const handleGenerateModular = () => {
    setIsGeneratingModular(true);
    window.setTimeout(() => {
      setIsGeneratingModular(false);
      setHasGeneratedModular(true);
      setSelectedPart("left-bracer");
    }, 900);
  };

  const selectedPartData = MODULAR_PARTS.find((part) => part.id === selectedPart) ?? MODULAR_PARTS[0];

  return (
    <div className="flex h-[calc(100vh-76px)] bg-[#050505] text-[#F5F5F5] font-sans antialiased">
      <main className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto custom-scrollbar p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="flex items-center gap-2 text-[20px] font-bold tracking-tight text-white">
                <span>WORKSPACE</span>
                <span className="text-neutral-500">/</span>
                <span className="text-[#E0A12E]">
                  {expertTab === "turnaround" ? "ORC TURNAROUND" : "ORC MODULES"}
                </span>
              </h1>
              <span className="ml-2 rounded-md border border-[#E0A12E]/30 bg-[#E0A12E]/10 px-2.5 py-1 text-[12px] font-bold tracking-wider text-[#E0A12E]">
                AI VISION
              </span>
            </div>

            <div className="flex items-center gap-2.5 rounded-full border border-[#2A2E36] bg-[#141518] px-3 py-1.5">
              {expertTab === "turnaround" ? (
                <RotateCcw className="h-3.5 w-3.5 text-[#E0A12E]" />
              ) : (
                <Layers className="h-3.5 w-3.5 text-[#E0A12E]" />
              )}
              <span className="text-[12px] font-medium text-neutral-300">
                {expertTab === "turnaround" ? "Front / 45 / Side / Back" : "Equipment Separation"}
              </span>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 gap-6">
            {expertTab === "turnaround" ? (
              <>
                <div className="flex w-[300px] shrink-0 flex-col gap-4 xl:w-[360px]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-white">메인 오크 레퍼런스</h3>
                    <span className="text-[11px] font-normal text-[#E0A12E]">업로드 이미지 적용됨</span>
                  </div>
                  <div className="relative flex-1 max-h-[620px] overflow-hidden rounded-xl border border-[#2A2E36] bg-[#141518]">
                    <img
                      src={ORC_BASE_IMAGE}
                      alt="오크 정면 메인"
                      className="h-full w-full object-contain p-4 drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)]"
                    />
                  </div>
                </div>

                <div className="grid min-w-0 flex-1 grid-cols-2 gap-4">
<<<<<<< HEAD
                  {TURNAROUND_VIEWS.map((view, index) => {
                    const isRegeneratingView = isGenerating || regeneratingViews.has(view.id);
                    return (
                      <motion.div
                        key={view.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="relative min-h-[260px] overflow-hidden rounded-xl border border-[#1F2329] bg-[#101216] p-4"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,161,46,0.09),transparent_58%)]" />
                        <div className="relative z-10 mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[15px] font-bold text-white">{view.label}</p>
                            <p className="mt-0.5 text-[11px] font-mono text-neutral-500">{view.angle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                isRegeneratingView
                                  ? "border-[#E0A12E]/30 bg-[#E0A12E]/10 text-[#E0A12E]"
                                  : "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80]"
                              }`}
                            >
                              {isRegeneratingView ? "Regenerating" : "Ready"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRegenerateView(view.id)}
                              disabled={isRegeneratingView}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#141518] text-neutral-300 transition hover:border-[#E0A12E]/60 hover:text-[#E0A12E] disabled:cursor-not-allowed disabled:opacity-60"
                              title={`${view.label} 개별 재생성`}
                            >
                              {isRegeneratingView ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RotateCcw className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="relative z-10 flex h-[calc(100%-52px)] items-center justify-center">
                          <img
                            src={view.img}
                            alt={`오크 ${view.label}`}
                            className={`max-h-full max-w-full object-contain transition-all duration-300 ${
                              isRegeneratingView ? "scale-95 blur-sm opacity-35" : "opacity-100"
                            }`}
                          />
                          {isRegeneratingView && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="rounded-full border border-[#E0A12E]/30 bg-black/45 px-3 py-1.5 text-[12px] font-bold text-[#E0A12E] backdrop-blur-sm">
                                {view.label} 뷰 재생성 중
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
=======
                  {TURNAROUND_VIEWS.map((view, index) => (
                    <motion.div
                      key={view.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="relative min-h-[260px] overflow-hidden rounded-xl border border-[#1F2329] bg-[#101216] p-4"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,161,46,0.09),transparent_58%)]" />
                      <div className="relative z-10 mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-[15px] font-bold text-white">{view.label}</p>
                          <p className="mt-0.5 text-[11px] font-mono text-neutral-500">{view.angle}</p>
                        </div>
                        <span className="rounded-full border border-[#4ADE80]/30 bg-[#4ADE80]/10 px-2 py-0.5 text-[11px] font-medium text-[#4ADE80]">
                          Ready
                        </span>
                      </div>
                      <div className="relative z-10 flex h-[calc(100%-52px)] items-center justify-center">
                        <img
                          src={view.img}
                          alt={`오크 ${view.label}`}
                          className={`max-h-full max-w-full object-contain transition-all duration-300 ${
                            isGenerating ? "scale-95 blur-sm opacity-35" : "opacity-100"
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
>>>>>>> c80425d0882cb1807b024b299664fd89da59b6a3

                  {isGenerating && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm">
                      <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#E0A12E]" />
                      <p className="text-[14px] font-semibold text-white">오크 턴어라운드 뷰를 동기화하는 중...</p>
                      <p className="mt-2 text-[12px] text-neutral-400">정면 기준으로 각도별 실루엣을 맞추고 있습니다.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex h-full w-full gap-6">
                <div className="flex min-w-0 flex-[3] flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-[14px] font-bold text-white">
                      <Layers className="h-4 w-4 text-neutral-400" />
                      오크 정면 장비 분석
                    </h3>
                    <span className="rounded-full border border-[#4ADE80]/30 bg-[#4ADE80]/10 px-2 py-0.5 text-[11px] font-medium text-[#4ADE80]">
                      장비 파츠 추출 완료
                    </span>
                  </div>

                  <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-[#1F2329] bg-[#141518] p-6">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
                    <div className="relative max-h-full">
                      <img
                        src={ORC_BASE_IMAGE}
                        alt="오크 정면 장비 영역"
                        className={`max-h-[680px] max-w-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                          isGeneratingModular ? "scale-95 blur-sm opacity-30" : "opacity-100"
                        }`}
                      />
                      {hasGeneratedModular && !isGeneratingModular && (
                        <div className="absolute inset-0">
                          <button
                            className={`absolute left-[12%] top-[34%] h-[18%] w-[24%] rounded border-2 transition-colors ${
                              selectedPart === "left-bracer" ? "border-[#E0A12E] bg-[#E0A12E]/12" : "border-white/35 hover:border-white/70"
                            }`}
                            onClick={() => setSelectedPart("left-bracer")}
                            title="스파이크 팔 보호구"
                          />
                          <button
                            className={`absolute right-[11%] top-[37%] h-[18%] w-[24%] rounded border-2 transition-colors ${
                              selectedPart === "right-bracer" ? "border-[#60A5FA] bg-[#60A5FA]/12" : "border-white/35 hover:border-white/70"
                            }`}
                            onClick={() => setSelectedPart("right-bracer")}
                            title="가죽 팔 장비"
                          />
                          <button
                            className={`absolute right-[18%] top-[18%] h-[18%] w-[25%] rounded border-2 transition-colors ${
                              selectedPart === "shoulder" ? "border-[#4ADE80] bg-[#4ADE80]/12" : "border-white/35 hover:border-white/70"
                            }`}
                            onClick={() => setSelectedPart("shoulder")}
                            title="어깨 갑옷"
                          />
                          <button
                            className={`absolute left-[34%] top-[51%] h-[15%] w-[32%] rounded border-2 transition-colors ${
                              selectedPart === "belt" ? "border-[#F97316] bg-[#F97316]/12" : "border-white/35 hover:border-white/70"
                            }`}
                            onClick={() => setSelectedPart("belt")}
                            title="해골 벨트 장식"
                          />
                        </div>
                      )}
                    </div>

                    {isGeneratingModular && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                        <Wand2 className="mb-4 h-12 w-12 animate-pulse text-[#E0A12E]" />
                        <p className="text-[14px] font-semibold text-white">오크 장비 파츠를 다시 분리하는 중...</p>
                        <p className="mt-2 text-[12px] text-neutral-400">정면 이미지에서 장비 영역만 추출합니다.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex min-w-0 flex-[2] flex-col gap-4">
                  <h3 className="text-[14px] font-bold text-white">
                    <span className="text-neutral-400">추출된 장비 파츠</span>
                    <span className="ml-2 text-[#E0A12E]">({MODULAR_PARTS.length}개)</span>
                  </h3>

                  <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-[#1F2329] bg-[#141518] p-4 custom-scrollbar">
                    {MODULAR_PARTS.map((part) => (
                      <button
                        key={part.id}
                        onClick={() => setSelectedPart(part.id)}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                          selectedPart === part.id
                            ? "border-[#E0A12E] bg-[#E0A12E]/5 shadow-[0_4px_20px_rgba(224,161,46,0.1)]"
                            : "border-[#2A2E36] bg-[#0A0B0D] hover:border-neutral-400"
                        }`}
                      >
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#1F2329] bg-[#050505]">
                          <img src={part.image} alt={part.label} className="h-full w-full object-contain p-1" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-[14px] font-bold text-white">{part.label}</span>
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: part.color }} />
                          </div>
                          <span className="mt-1 block text-[12px] font-mono text-neutral-500">ORC_{part.id.toUpperCase()}_01</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <aside className="flex h-full w-[360px] shrink-0 flex-col border-l border-[#1F2329] bg-[#0A0B0D]">
        <div className="flex shrink-0 border-b border-[#1F2329] bg-[#050505] px-6">
          <button
            onClick={() => setExpertTab("turnaround")}
            className={`mr-6 border-b-2 py-4 text-[14px] font-bold transition-colors ${
              expertTab === "turnaround" ? "border-[#E0A12E] text-[#E0A12E]" : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            턴어라운드
          </button>
          <button
            onClick={() => setExpertTab("modular")}
            className={`mr-6 border-b-2 py-4 text-[14px] font-bold transition-colors ${
              expertTab === "modular" ? "border-[#E0A12E] text-[#E0A12E]" : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            모듈화
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {expertTab === "turnaround" ? (
              <motion.div
                key="turnaround"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="space-y-4">
                  <label className="text-[13px] font-bold text-white">생성 뷰 구성</label>
                  <div className="space-y-3 rounded-xl border border-[#2A2E36] bg-[#141518] p-4">
                    {TURNAROUND_VIEWS.map((view) => (
                      <div key={view.id} className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-neutral-300">{view.label} ({view.angle})</span>
                        <Check className="h-4 w-4 text-[#E0A12E]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex justify-between text-[13px] font-bold text-white">
                    <span>캐릭터 일관성</span>
                    <span className="font-mono text-[12px] text-[#E0A12E]">92%</span>
                  </label>
                  <input type="range" min="0" max="100" defaultValue="92" className="h-1 w-full appearance-none rounded-full bg-[#2A2E36] accent-[#E0A12E] outline-none" />
                  <p className="text-[11px] leading-relaxed text-neutral-500">
                    메인 오크 정면 이미지를 기준으로 체형, 장비 위치, 실루엣을 각 뷰에 맞춰 유지합니다.
                  </p>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2A2E36] bg-[#1F2329] py-3.5 text-[13px] font-bold text-white transition-all hover:border-neutral-500 hover:bg-[#2A2E36] disabled:text-neutral-500"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                  {isGenerating ? "재생성 중..." : "턴어라운드 재생성"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="modular"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="space-y-3">
                  <label className="flex items-end justify-between text-[13px] font-bold text-white">
                    <span>장비 모듈 추출</span>
                    <span className="text-[11px] font-normal text-[#4ADE80]">정면 기준</span>
                  </label>
                  <p className="mb-2 text-[12px] text-neutral-400">
                    오크 정면 이미지에서 팔 보호구, 어깨 장비, 벨트처럼 분리 가능한 장비만 골라 3D 작업용 모듈로 정리합니다.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E0A12E]/30 bg-[#141518] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[14px] font-bold text-white">{selectedPartData.label}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-neutral-300">선택됨</span>
                  </div>
                  <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-lg border border-[#1F2329] bg-[#050505]">
                    <img src={selectedPartData.image} alt={selectedPartData.label} className="h-full w-full object-contain p-2" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["#오크", "#장비", "#모듈", "#정면추출"].map((tag) => (
                      <span key={tag} className="rounded-md bg-[#2A2E36] px-2.5 py-1 text-[11px] text-neutral-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateModular}
                  disabled={isGeneratingModular}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E0A12E] py-3.5 text-[13px] font-bold text-black transition-all hover:bg-[#F0B43A] disabled:opacity-70"
                >
                  {isGeneratingModular ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  {isGeneratingModular ? "분리 중..." : "장비 파츠 다시 분리"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-[#1F2329] bg-[#0A0B0D] p-5">
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate?.("full_workflow")}
              className="flex w-[30%] items-center justify-center gap-1.5 rounded-xl border border-[#2A2E36] bg-[#0A0B0D] py-3.5 text-[13px] font-medium text-neutral-300 transition-colors hover:bg-[#141518]"
            >
              <ChevronLeft className="h-4 w-4 text-neutral-400" />
              이전
            </button>
            <button
              onClick={() => onNavigate?.("modeling_generation")}
              className="flex w-[70%] items-center justify-center gap-1.5 rounded-xl bg-[#E0A12E] py-4 text-[14px] font-bold text-black shadow-[0_0_15px_rgba(224,161,46,0.3)] transition-all hover:bg-[#F0B43A]"
            >
              이대로 3D 모델링 생성
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
