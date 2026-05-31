import React, { useState } from "react";
import { ChevronLeft, Image as ImageIcon, Check, Loader2, Play, MousePointer2, RotateCcw, Sparkles, Wand2, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TurnaroundPageProps {
  onNavigate?: (page: string) => void;
}

export default function TurnaroundPage({ onNavigate }: TurnaroundPageProps) {
  // Tabs
  const [expertTab, setExpertTab] = useState<"turnaround" | "modular">("turnaround");

  // Turnaround State
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(true); // Default to true as per request
  const [includeTop, setIncludeTop] = useState(false);
  const [includeBottom, setIncludeBottom] = useState(false);
  const [selectedView, setSelectedView] = useState<string>("45deg"); // Start with 45deg after generation

  // Modular State
  const [isGeneratingModular, setIsGeneratingModular] = useState(false);
  const [hasGeneratedModular, setHasGeneratedModular] = useState(false);
  const [autoSegmentation, setAutoSegmentation] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const baseImage = "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png";

  // --- Turnaround Logic ---
  const defaultViews = [
    { id: "front", label: "정면 (Base)", img: baseImage },
    { id: "45deg", label: "45도", img: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png" },
    { id: "side", label: "측면", img: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png" },
    { id: "back", label: "후면", img: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png" },
  ];

  const optionalViews = [];
  if (includeTop) optionalViews.push({ id: "top", label: "탑뷰", img: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png" });
  if (includeBottom) optionalViews.push({ id: "bottom", label: "바텀뷰", img: "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png" });

  const allViews = [...defaultViews, ...optionalViews];
  const activeImage = allViews.find((v) => v.id === selectedView)?.img || baseImage;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      if(selectedView === "front") setSelectedView("45deg");
    }, 2000);
  };

  // --- Modular Logic ---
  const modularParts = [
    { id: "head", label: "헤드파츠", color: "#60A5FA" },
    { id: "body", label: "바디파츠", color: "#4ADE80" },
    { id: "arms", label: "우측 암", color: "#E0A12E" },
    { id: "legs", label: "하단 베이스", color: "#F97316" },
  ];

  const handleGenerateModular = () => {
    setIsGeneratingModular(true);
    setTimeout(() => {
      setIsGeneratingModular(false);
      setHasGeneratedModular(true);
      setSelectedPart("head");
    }, 2000);
  };

  return (
    <div className="flex bg-[#050505] text-[#F5F5F5] font-sans antialiased h-[calc(100vh-76px)]">
      {/* Main Area */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col min-h-0">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-white tracking-tight flex items-center gap-2">
                <span>WORKSPACE</span>
                <span className="text-neutral-500">/</span>
                <span className="text-[#E0A12E]">
                  {expertTab === "turnaround" ? "TURNAROUND" : "MODULAR SETUP"}
                </span>
              </h1>
              <span className="px-2.5 py-1 rounded-md bg-[#E0A12E]/10 border border-[#E0A12E]/30 text-[#E0A12E] text-[12px] font-bold tracking-wider ml-2">
                AI VISION
              </span>
            </div>
            
            {/* Visual Indicator of current mode */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#141518] border border-[#2A2E36]">
              {expertTab === "turnaround" ? (
                <RotateCcw className="w-3.5 h-3.5 text-[#E0A12E]" />
              ) : (
                <Layers className="w-3.5 h-3.5 text-[#E0A12E]" />
              )}
              <span className="text-[12px] font-medium text-neutral-300">
                {expertTab === "turnaround" ? "360° View Generation" : "Part Separation Mode"}
              </span>
            </div>
          </div>

          <div className="flex-1 flex gap-6 min-h-0 relative">
            {expertTab === "turnaround" ? (
              // Turnaround Active Layout
              <>
                {/* Left Column: Base Image */}
                <div className="w-[300px] xl:w-[360px] shrink-0 flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-[14px] font-bold text-white">
                       기준 이미지 (Base)
                     </h3>
                     <span className="text-[11px] font-normal text-[#E0A12E] cursor-pointer hover:underline">이미지 변경</span>
                   </div>
                   <div className="flex-1 max-h-[600px] rounded-2xl border border-[#2A2E36] bg-[#141518] overflow-hidden relative group cursor-pointer hover:border-neutral-400 transition-colors">
                     <img referrerPolicy="no-referrer" src={baseImage} alt="Base" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <MousePointer2 className="w-6 h-6 text-white" />
                     </div>
                   </div>
                </div>

                {/* Right Column: Viewers & Thumbnails */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                  {/* Active Image Viewer */}
                  <div className="flex-1 bg-[#141518] border border-[#1F2329] rounded-2xl flex items-center justify-center p-6 relative overflow-hidden group min-h-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
                    <img
                      referrerPolicy="no-referrer"
                      src={activeImage}
                      alt="Active View"
                      className={`max-w-full max-h-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${isGenerating ? 'opacity-30 blur-sm scale-95' : 'opacity-100 scale-100'} ${hasGenerated && selectedView !== 'front' ? 'grayscale-[30%]' : ''}`}
                    />
                    
                    {isGenerating && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-[#E0A12E] animate-spin mb-4" />
                        <p className="text-[14px] font-semibold text-white animate-pulse">턴어라운드 뷰 재생성중...</p>
                        <p className="text-[12px] text-neutral-400 mt-2">AI가 공간을 계산하고 있습니다</p>
                      </div>
                    )}
                    
                    {/* Only show center button if hasn't generated anything yet, but in turnaround case it's defaulted to true */}
                  </div>

                  {/* Generated Thumbnails Grid */}
                  <div className="h-[200px] shrink-0 bg-[#0A0B0D] border border-[#1F2329] rounded-2xl p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                       <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-neutral-400" /> 생성된 뷰포인트 ({allViews.length})
                       </h3>
                       {hasGenerated && <span className="text-[11px] text-[#4ADE80] border border-[#4ADE80]/30 bg-[#4ADE80]/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5"><Check className="w-3 h-3" /> 생성 완료</span>}
                    </div>
                    
                    <div className="flex-1 flex gap-3 overflow-x-auto custom-scrollbar items-center pb-2">
                      {allViews.map((view, idx) => {
                        const isPlaceholder = !hasGenerated && view.id !== "front";
                        return (
                          <button
                            key={view.id}
                            onClick={() => { if(hasGenerated) setSelectedView(view.id); }}
                            className={`relative h-full aspect-square shrink-0 rounded-xl border-2 overflow-hidden transition-all group ${
                              selectedView === view.id ? 'border-[#E0A12E] scale-[1.02]' : 'border-[#1F2329] hover:border-neutral-400'
                            }`}
                          >
                            {isPlaceholder ? (
                              <div className="w-full h-full bg-[#141518] flex flex-col items-center justify-center gap-2 text-neutral-500">
                                <ImageIcon className="w-6 h-6 opacity-40" />
                                <span className="text-[10px] font-mono opacity-60 uppercase">{view.id}</span>
                              </div>
                            ) : (
                              <>
                                <img referrerPolicy="no-referrer" src={view.img} alt={view.label} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${view.id !== 'front' ? 'grayscale-[30%]' : ''}`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </>
                            )}
                            
                            <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-[2px]">
                              <div className="bg-black/60 backdrop-blur-md rounded border border-white/10 px-2 py-1 text-center">
                                <span className="text-[10.5px] font-bold text-white block truncate">{view.label}</span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Modular Active Layout
              <div className="w-full h-full flex gap-6">
                 {/* Main Base view with segmentation visual overlay */}
                 <div className="flex-[3] flex flex-col gap-4 min-w-0">
                   <div className="flex items-center justify-between">
                     <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                       <Layers className="w-4 h-4 text-neutral-400" /> 원본 구조 분석 (Base)
                     </h3>
                     {hasGeneratedModular && <span className="text-[11px] text-[#4ADE80] border border-[#4ADE80]/30 bg-[#4ADE80]/10 px-2 py-0.5 rounded-full font-medium">분할 분석 완료</span>}
                   </div>
                   
                   <div className="flex-1 bg-[#141518] border border-[#1F2329] rounded-2xl flex items-center justify-center p-6 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
                      
                      <div className="relative">
                        <img
                          referrerPolicy="no-referrer"
                          src={baseImage}
                          alt="Base Modular"
                          className={`max-w-full max-h-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${isGeneratingModular ? 'opacity-30 blur-sm scale-95' : 'opacity-100 scale-100'}`}
                        />
                        
                        {/* Fake segmentation overlays when generated */}
                        {hasGeneratedModular && !isGeneratingModular && (
                          <div className="absolute inset-0 border border-white/20">
                             {/* Top Right Box */}
                             <div className={`absolute top-[10%] right-[20%] w-[35%] h-[25%] border-2 rounded ${selectedPart === 'head' ? 'border-[#60A5FA] bg-[#60A5FA]/10' : 'border-white/30 hover:border-white/60'} transition-colors cursor-pointer`} onClick={() => setSelectedPart('head')} />
                             {/* Center Box */}
                             <div className={`absolute top-[35%] left-[30%] w-[45%] h-[35%] border-2 rounded ${selectedPart === 'body' ? 'border-[#4ADE80] bg-[#4ADE80]/10' : 'border-white/30 hover:border-white/60'} transition-colors cursor-pointer`} onClick={() => setSelectedPart('body')} />
                             {/* Bottom Box */}
                             <div className={`absolute bottom-[10%] left-[20%] w-[60%] h-[20%] border-2 rounded ${selectedPart === 'legs' ? 'border-[#F97316] bg-[#F97316]/10' : 'border-white/30 hover:border-white/60'} transition-colors cursor-pointer`} onClick={() => setSelectedPart('legs')} />
                          </div>
                        )}
                      </div>

                      {isGeneratingModular && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                          <Wand2 className="w-12 h-12 text-[#E0A12E] animate-pulse mb-4" />
                          <p className="text-[14px] font-semibold text-white animate-pulse">이미지 구성요소 분석중...</p>
                          <p className="text-[12px] text-neutral-400 mt-2">형태적 파츠를 자동 연산하고 있습니다</p>
                        </div>
                      )}
                      
                      {!hasGeneratedModular && !isGeneratingModular && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                           <Layers className="w-16 h-16 text-neutral-500 mb-4 opacity-50" />
                           <h4 className="text-[16px] font-bold text-white mb-2">모듈 분할 연산이 필요합니다</h4>
                           <p className="text-[13px] text-neutral-400 mb-6 text-center max-w-sm leading-relaxed">
                             AI가 기준 이미지를 분석하여 각각의 파츠(부품)를 독립적인 3D 요소로 분할 세팅합니다.
                           </p>
                           <button onClick={handleGenerateModular} className="px-6 py-3 bg-[#E0A12E] text-black rounded-xl font-bold text-[14px] hover:bg-[#F0B43A] flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(224,161,46,0.3)] hover:scale-105">
                             <Wand2 className="w-4 h-4 fill-black" />
                             부품 자동 분할 시작 (Auto-Segmentation)
                           </button>
                        </div>
                      )}
                   </div>
                 </div>

                 {/* Segment Views */}
                 <div className="flex-[2] flex flex-col gap-4 min-w-0">
                    <h3 className="text-[14px] font-bold text-white">
                       <span className="text-neutral-400">분류된 파츠목록</span>
                       {hasGeneratedModular && <span className="ml-2 text-[#E0A12E]">({modularParts.length}개 발견)</span>}
                    </h3>
                    
                    <div className="flex-1 bg-[#141518] border border-[#1F2329] rounded-2xl p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                       {!hasGeneratedModular ? (
                         <div className="flex-1 flex items-center justify-center text-center p-6">
                           <p className="text-[12px] text-neutral-500 leading-relaxed font-medium">
                             분할 세팅을 실행해 주세요.<br/>자동으로 부품 영역을 추출하고 리스트업 합니다.
                           </p>
                         </div>
                       ) : (
                         <>
                           {modularParts.map(part => (
                             <div 
                               key={part.id}
                               onClick={() => setSelectedPart(part.id)}
                               className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer ${
                                 selectedPart === part.id 
                                   ? 'border-[#E0A12E] bg-[#E0A12E]/5 shadow-[0_4px_20px_rgba(224,161,46,0.1)]' 
                                   : 'border-[#2A2E36] bg-[#0A0B0D] hover:border-neutral-400'
                               }`}
                             >
                                <div className="w-16 h-16 rounded-lg bg-[#2A2E36] overflow-hidden flex items-center justify-center shrink-0 border border-[#1F2329]">
                                  <img referrerPolicy="no-referrer" src={baseImage} className="w-[150%] max-w-none opacity-80 grayscale-[30%]" alt="Part" style={{ transform: part.id === 'head' ? 'translate(20%, 20%)' : part.id === 'legs' ? 'translate(-20%, -30%)' : 'translate(0, 0)' }} />
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                     <span className="text-[14px] font-bold text-white truncate">{part.label}</span>
                                     <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: part.color }} />
                                  </div>
                                  <span className="text-[12px] text-neutral-400 font-mono">ID_{part.id.toUpperCase()}_01</span>
                                </div>
                             </div>
                           ))}
                         </>
                       )}
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Side Panel */}
      <aside className="w-[360px] shrink-0 border-l border-[#1F2329] bg-[#0A0B0D] flex flex-col h-full">
        {/* Tabs for Right Panel */}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <AnimatePresence mode="wait">
            {expertTab === "turnaround" ? (
              <motion.div 
                key="turnaround"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                {/* Angle Settings */}
                <div className="space-y-4">
                   <label className="text-[13px] font-bold text-white">생성될 앵글 옵션</label>
                   
                   <div className="bg-[#141518] border border-[#2A2E36] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                         <span className="text-[13px] text-neutral-300 font-medium">기본 생성 (45도, 측면, 후면)</span>
                         <Check className="w-4 h-4 text-[#E0A12E]" />
                      </div>
                      
                      <div className="w-full h-px bg-[#2A2E36]" />
                      
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[13px] text-neutral-400 group-hover:text-neutral-200 transition-colors flex flex-col">
                          <span className="font-medium">탑뷰 (Top View) 포함</span>
                          <span className="text-[11px] text-neutral-500">위에서 내려다본 각도 생성</span>
                        </span>
                        <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${includeTop ? 'bg-[#E0A12E]' : 'bg-[#2A2E36]'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${includeTop ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        {/* hidden checkbox */}
                        <input type="checkbox" checked={includeTop} onChange={(e) => setIncludeTop(e.target.checked)} className="hidden" />
                      </label>
                      
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[13px] text-neutral-400 group-hover:text-neutral-200 transition-colors flex flex-col">
                          <span className="font-medium">바텀뷰 (Bottom View) 포함</span>
                          <span className="text-[11px] text-neutral-500">아래에서 올려다본 각도 생성</span>
                        </span>
                        <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${includeBottom ? 'bg-[#E0A12E]' : 'bg-[#2A2E36]'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${includeBottom ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <input type="checkbox" checked={includeBottom} onChange={(e) => setIncludeBottom(e.target.checked)} className="hidden" />
                      </label>
                   </div>
                </div>
                
                {/* Consistency Tuning */}
                <div className="space-y-3">
                   <label className="text-[13px] font-bold text-white flex justify-between">
                     <span>디테일 유지력 (Consistency)</span>
                     <span className="text-[12px] font-mono text-[#E0A12E]">80%</span>
                   </label>
                   <input type="range" min="0" max="100" defaultValue="80" className="w-full h-1 bg-[#2A2E36] rounded-full appearance-none accent-[#E0A12E] outline-none" />
                   <p className="text-[11px] text-neutral-500 leading-relaxed">수치가 높을수록 기준 이미지의 형태를 강하게 유지하지만, 입체감 묘사가 제한될 수 있습니다.</p>
                </div>
                
                <div className="pt-2">
                   <button
                     onClick={handleGenerate}
                     disabled={isGenerating}
                     className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-[13px] transition-all
                       ${isGenerating ? "bg-[#141518] text-neutral-500 border border-[#2A2E36]" : "bg-[#1F2329] hover:bg-[#2A2E36] text-white border border-[#2A2E36] hover:border-neutral-500"}
                     `}
                   >
                     {isGenerating ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" /> 재생성 중...
                       </>
                     ) : (
                       <>
                         <RotateCcw className="w-4 h-4" /> 결과 재생성
                       </>
                     )}
                   </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="modular"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                {/* Modular Settings */}
                <div className="space-y-3">
                   <label className="text-[13px] font-bold text-white flex justify-between items-end">
                     <span>자동 모듈 파싱</span>
                     <span className="text-[11px] font-normal text-[#4ADE80]">추천</span>
                   </label>
                   <p className="text-[12px] text-neutral-400 mb-2">비전 AI가 이미지의 구조를 분석하여 최적의 파츠(부품) 단위로 자동 분할합니다.</p>
                   
                   <label className="flex items-center justify-between cursor-pointer bg-[#141518] p-4 rounded-xl border border-[#2A2E36] group hover:border-neutral-500 transition-colors">
                     <span className="text-[13px] font-medium text-neutral-200">AI 자동 분석 활성화</span>
                     <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${autoSegmentation ? 'bg-[#E0A12E]' : 'bg-[#2A2E36]'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoSegmentation ? 'translate-x-5' : 'translate-x-0'}`} />
                     </div>
                     <input type="checkbox" checked={autoSegmentation} onChange={(e) => setAutoSegmentation(e.target.checked)} className="hidden" />
                   </label>
                </div>
                
                <div className="h-px w-full bg-[#1F2329]" />
                
                <div className="space-y-3">
                   <h3 className="text-[13px] font-bold text-white mb-1">파츠 변환 설정</h3>
                   {selectedPart ? (
                     <div className="bg-[#141518] border border-[#E0A12E]/30 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: modularParts.find(p => p.id === selectedPart)?.color || '#E0A12E' }} />
                       
                       <div className="flex items-center justify-between">
                         <span className="text-[14px] font-bold text-white">
                           {modularParts.find(p => p.id === selectedPart)?.label} 변환
                         </span>
                         <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">선택됨</span>
                       </div>
                       
                       <div className="space-y-2">
                         <label className="text-[11px] text-neutral-400">AI 추천 스타일 키워드</label>
                         <div className="flex flex-wrap gap-1.5">
                           {["#메카닉", "#기사투구", "#사이버펑크"].map(tag => (
                             <button key={tag} className="px-2.5 py-1 rounded-md bg-[#2A2E36] text-[11px] text-neutral-300 hover:bg-[#3A3F4A] hover:text-white transition-colors">
                               {tag}
                             </button>
                           ))}
                         </div>
                       </div>
                       
                       <div className="space-y-2">
                         <label className="text-[11px] text-neutral-400">커스텀 스타일 지시어</label>
                         <input 
                           type="text" 
                           placeholder="단어를 입력하세요..." 
                           className="w-full bg-[#0A0B0D] border border-[#2A2E36] rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-[#E0A12E] transition-colors"
                         />
                       </div>
                       
                       <button className="w-full mt-1 py-3 bg-[#1F2329] hover:bg-[#2A2E36] text-white rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors border border-[#2A2E36] hover:border-neutral-500">
                         <Wand2 className="w-4 h-4" /> 파츠 변환 실행 🪄
                       </button>
                     </div>
                   ) : (
                     <div className="bg-[#141518] border border-[#1F2329] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3">
                       <MousePointer2 className="w-6 h-6 text-neutral-600" />
                       <p className="text-[12px] text-neutral-500">작업 공간에서 변환할 파츠를<br/>선택해주세요.</p>
                     </div>
                   )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bottom */}
        <div className="p-5 border-t border-[#1F2329] bg-[#0A0B0D]">
           <div className="flex gap-2">
             <button
               onClick={() => onNavigate && onNavigate("full_workflow")}
               className="w-[30%] bg-[#0A0B0D] hover:bg-[#141518] border border-[#2A2E36] text-neutral-300 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-[13px] font-medium"
             >
               <ChevronLeft className="w-4 h-4 text-neutral-400" /> 이전
             </button>
             <button
               onClick={() => onNavigate && onNavigate("full_workflow")}
               className="w-[70%] bg-[#E0A12E] hover:bg-[#F0B43A] text-black font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(224,161,46,0.3)] transition-all flex items-center justify-center gap-1.5 text-[14px]"
             >
               이대로 3D 모델링 생성 🚀
             </button>
           </div>
        </div>
      </aside>
    </div>
  );
}

