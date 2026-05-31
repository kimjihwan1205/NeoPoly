import React from 'react';
import { Clock, Image as ImageIcon, Box, LayoutGrid, Paintbrush, FileImage, Rotate3D, Puzzle, Wand2, ChevronRight, Star, MoreHorizontal } from 'lucide-react';

const RECENT_PROJECTS = [
  { id: 1, title: '엘프궁수', status: 'In Progress', timeAgo: '수정됨 10분 전', type: 'Image Generate', image: 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png', images: 128, meshes: 24, notes: 8, color: '#facc15' },
  { id: 2, title: '오크', status: 'Image Gen', timeAgo: '수정됨 1시간 전', type: 'Concept', image: 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%202.png', images: 96, meshes: 12, notes: 4, color: '#60a5fa' },
  { id: 3, title: '와이번', status: 'Modeling', timeAgo: '수정됨 3시간 전', type: 'Modeling', image: 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%203.png', images: 64, meshes: 18, notes: 7, color: '#4ade80' },
  { id: 4, title: '공룡', status: 'In Progress', timeAgo: '수정됨 5시간 전', type: 'Modular Extract', image: 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%204.png', images: 48, meshes: 32, notes: 6, color: '#facc15' },
  { id: 5, title: '스트릿 패션', status: 'Concept', timeAgo: '수정됨 6시간 전', type: 'Turnaround', image: 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%205.png', images: 72, meshes: 15, notes: 9, color: '#60a5fa' },
  { id: 6, title: '코뿔소 전사', status: 'Image Gen', timeAgo: '수정됨 1일 전', type: 'Image Generate', image: 'https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%206.png', images: 36, meshes: 9, notes: 3, color: '#60a5fa' },
];

export default function AIStudioPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-76px)] bg-[#050505] font-sans text-white overflow-hidden w-full">
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-6 py-8">
        <div className="max-w-[2006px] mx-auto w-full flex flex-col gap-5">
        
        <div className="flex flex-col gap-5">
          {/* Header Area */}
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-bold text-white tracking-tight">어떤 방식으로 시작할까요?</h1>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2A2E36] bg-[#0A0B0D] hover:bg-[#141518] transition-colors text-[14px] text-neutral-300">
              <Clock className="w-4 h-4" />
              나의 최근 작업
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {/* Start Workflows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Full Workflow Card */}
          <div 
            className="relative rounded-[20px] border border-[#1F2329] bg-[#0A0B0D] px-8 py-5 overflow-hidden group hover:border-[#3A404F] transition-colors cursor-pointer flex flex-col xl:aspect-[2/1] lg:aspect-auto aspect-[2/1]"
            onClick={() => onNavigate?.('full_workflow')}
          >
            <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/AI_studio_Main01.png" className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[75%] h-[120%] object-contain object-right opacity-100 transition-all duration-700 group-hover:scale-[1.01]" alt="Full Workflow" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] xl:via-[#050505]/40 lg:via-[#050505]/70 via-[#050505]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-[24px] font-bold text-white mb-3 tracking-tight flex items-center gap-2">
                  Full Workflow 
                  <span className="inline-flex bg-[#E0A12E]/20 text-[#E0A12E] text-[11px] font-bold px-2 py-0.5 rounded border border-[#E0A12E]/30 relative -top-[1px]">추천</span>
                </h2>
                <p className="text-neutral-400 text-[14px] leading-relaxed max-w-[280px]">
                  컨셉 이미지부터 모델링, 모듈화,<br />리메시까지 전체 제작 흐름을 시작합니다.
                </p>
              </div>
              <button className="flex items-center gap-2 text-neutral-300 group-hover:text-white transition-colors text-[14px] font-bold mt-auto w-max px-4 py-2 rounded-lg border border-[#1F2329] bg-[#050505]/80 backdrop-blur hover:bg-[#141518]">
                시작하기 <ChevronRight className="w-4 h-4 text-[#E0A12E]" />
              </button>
            </div>
          </div>

          {/* Image Gen Card */}
          <div className="relative rounded-[20px] border border-[#1F2329] bg-[#0A0B0D] px-8 py-5 overflow-hidden group hover:border-[#3A404F] transition-colors cursor-pointer flex flex-col xl:aspect-[2/1] lg:aspect-auto aspect-[2/1]">
            <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/AI_studio_Main02.png" className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[75%] h-[120%] object-contain object-right opacity-100 transition-all duration-700 group-hover:scale-[1.01]" alt="bg" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] from-30% xl:via-[#050505]/80 via-[#050505]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-white mb-3 tracking-tight">이미지 생성</h2>
                <p className="text-neutral-400 text-[14px] leading-relaxed max-w-[220px]">
                  프롬프트와 레퍼런스를 기반으로<br />컨셉 이미지를 생성합니다.
                </p>
              </div>
              <button className="flex items-center gap-2 text-neutral-300 group-hover:text-white transition-colors text-[14px] font-bold mt-auto w-max px-4 py-2 rounded-lg border border-[#1F2329] bg-[#050505]/80 backdrop-blur hover:bg-[#141518]">
                시작하기 <ChevronRight className="w-4 h-4 text-[#E0A12E]" />
              </button>
            </div>
          </div>

          {/* 3D Model Gen Card */}
          <div className="relative rounded-[20px] border border-[#1F2329] bg-[#0A0B0D] px-8 py-5 overflow-hidden group hover:border-[#3A404F] transition-colors cursor-pointer flex flex-col xl:aspect-[2/1] lg:aspect-auto aspect-[2/1]">
            <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/AI_studio_Main03.png" className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[75%] h-[120%] object-contain object-right opacity-100 transition-all duration-700 group-hover:scale-[1.01]" alt="bg" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] from-30% xl:via-[#050505]/80 via-[#050505]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-white mb-3 tracking-tight">3D 모델 생성</h2>
                <p className="text-neutral-400 text-[14px] leading-relaxed max-w-[220px]">
                  이미지 또는 프롬프트를 기반으로<br />3D 모델을 생성합니다.
                </p>
              </div>
              <button className="flex items-center gap-2 text-neutral-300 group-hover:text-white transition-colors text-[14px] font-bold mt-auto w-max px-4 py-2 rounded-lg border border-[#1F2329] bg-[#050505]/80 backdrop-blur hover:bg-[#141518]">
                시작하기 <ChevronRight className="w-4 h-4 text-[#E0A12E]" />
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Quick Tools */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-5">
          <div className="text-[16px] font-bold text-white shrink-0 pr-4 md:pr-8 md:border-r border-[#1F2329]">Quick Tools</div>
          <div className="flex items-center gap-x-8 gap-y-4 flex-wrap overflow-x-auto custom-scrollbar pb-2 md:pb-0">
            <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors whitespace-nowrap group">
              <LayoutGrid className="w-[18px] h-[18px] group-hover:text-[#E0A12E] transition-colors" /> <span className="text-[14px]">레퍼런스 보드 열기</span>
            </button>
            <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors whitespace-nowrap group">
              <Paintbrush className="w-[18px] h-[18px] group-hover:text-[#E0A12E] transition-colors" /> <span className="text-[14px]">프롬프트 빌더 열기</span>
            </button>
            <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors whitespace-nowrap group">
              <Wand2 className="w-[18px] h-[18px] group-hover:text-[#E0A12E] transition-colors" /> <span className="text-[14px]">이미지 생성하기</span>
            </button>
            <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors whitespace-nowrap group">
              <Rotate3D className="w-[18px] h-[18px] group-hover:text-[#E0A12E] transition-colors" /> <span className="text-[14px]">턴어라운드 생성</span>
            </button>
            <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors whitespace-nowrap group">
              <Puzzle className="w-[18px] h-[18px] group-hover:text-[#E0A12E] transition-colors" /> <span className="text-[14px]">모듈 추출 도구</span>
            </button>
            <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors whitespace-nowrap group">
              <Box className="w-[18px] h-[18px] group-hover:text-[#E0A12E] transition-colors" /> <span className="text-[14px]">리메시 도구</span>
            </button>
          </div>
        </div>

        {/* Continue Working */}
        <div className="mb-12">
          <div className="flex items-end justify-between border-b border-[#1F2329] pb-4 mb-6">
             <div className="flex items-baseline gap-4">
                <h2 className="text-[20px] font-bold text-white">Continue Working</h2>
                <span className="text-neutral-400 text-[14px]">이어 작업하기</span>
             </div>
             <div className="flex items-center gap-4">
               <button className="text-[14px] text-neutral-400 hover:text-white transition-colors flex items-center gap-1">모든 프로젝트 <ChevronRight className="w-4 h-4" /></button>
               <div className="flex items-center gap-1 bg-[#141518] p-1 rounded-lg border border-[#1F2329]">
                  <button className="p-1 rounded bg-[#2A2E36] text-white"><LayoutGrid className="w-4 h-4" /></button>
                  <button className="p-1 rounded text-neutral-400 hover:text-white transition-colors"><div className="w-4 h-4 flex flex-col gap-[3px]"><span className="w-full h-[3px] bg-current rounded-sm"></span><span className="w-full h-[3px] bg-current rounded-sm"></span><span className="w-full h-[3px] bg-current rounded-sm"></span></div></button>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {RECENT_PROJECTS.map((project) => (
              <div key={project.id} className="rounded-xl border border-[#1F2329] bg-[#0A0B0D] overflow-hidden group hover:border-[#3A404F] transition-all cursor-pointer flex flex-col h-full">
                 <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                    <img referrerPolicy="no-referrer" src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/40 to-transparent" />
                    
                    <button className="absolute top-3 right-3 text-neutral-300 hover:text-[#E0A12E] transition-colors p-1 z-10">
                       <Star className="w-5 h-5" />
                    </button>

                    <div className="absolute inset-x-4 top-4 z-10">
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                         <span className="text-[12px] font-medium text-white drop-shadow-md">{project.status}</span>
                       </div>
                       <p className="text-[11px] text-neutral-400 mt-1 drop-shadow-md">{project.timeAgo}</p>
                    </div>
                 </div>

                 <div className="p-4 flex flex-col flex-1 bg-[#0A0B0D]">
                    <div className="mb-4 flex-1">
                       <h3 className="text-[16px] font-bold text-white">{project.title}</h3>
                       
                       {/* Mini progress bar visualization */}
                       <div className="flex items-center justify-between mt-4">
                           {[1,2,3,4,5,6].map((step, i) => (
                               <div key={i} className="flex items-center relative w-full">
                                   <div className={`w-1.5 h-1.5 rounded-full z-10 ${i === 0 ? 'bg-current ring-2 ring-current/20' : i === 1 ? 'border border-current' : 'border border-[#2A2E36]'}`} style={{ color: project.color }}></div>
                                   {i < 5 && <div className={`h-[1px] w-full absolute left-1 ${i === 0 ? 'bg-current/50' : 'bg-[#2A2E36]'}`} style={{ color: project.color }}></div>}
                               </div>
                           ))}
                       </div>
                    </div>

                    <div className="flex items-center justify-between text-[12px] text-neutral-400 border-t border-[#1F2329] pt-4 mt-auto shrink-0">
                       <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5"><ImageIcon className="w-[14px] h-[14px]" /> {project.images}</span>
                          <span className="flex items-center gap-1.5"><Box className="w-[14px] h-[14px]" /> {project.meshes}</span>
                          <span className="flex items-center gap-1.5"><LayoutGrid className="w-[14px] h-[14px]" /> {project.notes}</span>
                       </div>
                       <button className="text-neutral-500 hover:text-white transition-colors">
                          <MoreHorizontal className="w-[16px] h-[16px]" />
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>



      </div>
     </div>
    </div>
  );
}
