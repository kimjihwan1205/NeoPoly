import React, { useState } from 'react';
import { 
  ChevronDown, Plus, Star, Clock, Trash2, Settings, 
  FileText, Image as ImageIcon, CheckSquare, LayoutGrid, X, 
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, 
  Link2, Table, Code, MoreHorizontal, Sparkles, RefreshCw, 
  UploadCloud, Folder, Hash, Type, Minus, AlignLeft, RefreshCcw, File, PanelRightClose
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NoteSidebar from './NoteSidebar';
import type { NoteItem } from './NotesPage';

interface NoteEditorPageProps {
  onNavigate: (page: string) => void;
  initialNote?: NoteItem | null;
}

export default function NoteEditorPage({ onNavigate, initialNote = null }: NoteEditorPageProps) {
  const [activeTab, setActiveTab] = useState('전체 노트');

  const FOLDERS = [
    { id: 1, name: '아이디어', count: 24, active: true },
    { id: 2, name: '컨셉 레퍼런스', count: 38, active: false },
    { id: 3, name: '캐릭터', count: 16, active: false },
    { id: 4, name: '환경 / 배경', count: 12, active: false },
    { id: 5, name: '무기 / 소품', count: 8, active: false },
    { id: 6, name: '기타', count: 6, active: false },
  ];

  const TAGS = [
    { text: '# 캐릭터', count: 38 },
    { text: '# 컨셉', count: 21 },
    { text: '# 판타지', count: 36 },
    { text: '# 갑옷', count: 18 },
    { text: '# 무기', count: 14 },
    { text: '# 스케치', count: 9 },
    { text: '# 레퍼런스', count: 24 },
    { text: '# 디자인', count: 12 },
  ];

  const BLOCK_TYPES = [
    { icon: <AlignLeft className="w-5 h-5 mx-auto mb-2 text-neutral-400" />, name: '텍스트' },
    { icon: <ImageIcon className="w-5 h-5 mx-auto mb-2 text-neutral-400" />, name: '이미지' },
    { icon: <LayoutGrid className="w-5 h-5 mx-auto mb-2 text-neutral-400" />, name: '레퍼런스 보드' },
    { icon: <CheckSquare className="w-5 h-5 mx-auto mb-2 text-neutral-400" />, name: '체크리스트' },
    { icon: <CheckSquare className="w-5 h-5 mx-auto mb-2 text-neutral-400" />, name: '체크리스트' }, // Repeated in UI? No, let's fix below. Wait, image shows: 텍스트, 이미지, 레퍼런스 보드, 체크리스트, 체크리스트(No, AI 프롬프트?), 파일, 링크, 구분선.
    // Ah, referring to image, 4th is check, 5th is target/AI icon, 6th is file, 7th is link, 8th is separator
  ];

  const BLOCKS = [
    { icon: <FileText className="w-5 h-5" />, name: '텍스트' },
    { icon: <ImageIcon className="w-5 h-5" />, name: '이미지' },
    { icon: <LayoutGrid className="w-5 h-5" />, name: '레퍼런스 보드' },
    { icon: <CheckSquare className="w-5 h-5" />, name: '체크리스트' },
    { icon: <Sparkles className="w-5 h-5" />, name: 'AI 프롬프트' },
    { icon: <File className="w-5 h-5" />, name: '파일' },
    { icon: <Link2 className="w-5 h-5" />, name: '링크' },
    { icon: <Minus className="w-5 h-5" />, name: '구분선' },
  ];

  return (
    <div className="flex h-[calc(100dvh-60px)] overflow-hidden bg-bg-dark font-sans text-text-primary lg:h-[calc(100dvh-76px)]">
      {/* Left Sidebar */}
      <NoteSidebar onNavigate={onNavigate} mode="editor" editorTitle={initialNote?.title} isNewNote={!initialNote} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-bg-dark flex flex-col relative w-full">
        {/* Top Formatting Toolbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1C1E24] bg-[#0A0B0D]/90 px-4 py-3 text-neutral-400 backdrop-blur-md sm:px-6 sm:py-4">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-3 shrink-0">
              <button className="text-[15px] font-bold hover:text-white transition-colors">H1</button>
              <button className="text-[15px] font-bold hover:text-white transition-colors">H2</button>
              <button className="text-[15px] font-bold hover:text-white transition-colors">H3</button>
            </div>
            <div className="w-px h-4 bg-[#2A2E36] shrink-0"></div>
            <div className="flex items-center gap-3 shrink-0">
              <button className="hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><Underline className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><Strikethrough className="w-4 h-4" /></button>
            </div>
            <div className="w-px h-4 bg-[#2A2E36] shrink-0"></div>
            <div className="flex items-center gap-3 shrink-0">
              <button className="hover:text-white transition-colors"><List className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><ListOrdered className="w-4 h-4" /></button>
            </div>
            <div className="w-px h-4 bg-[#2A2E36] shrink-0"></div>
            <div className="flex items-center gap-3 shrink-0">
              <button className="hover:text-white transition-colors"><CheckSquare className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><Quote className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><Link2 className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><ImageIcon className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><Table className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors"><Code className="w-4 h-4" /></button>
            </div>
            <div className="w-px h-4 bg-[#2A2E36] shrink-0"></div>
            <button className="hover:text-white transition-colors shrink-0"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Editor Wrapper */}
        <div className="max-w-[2560px] w-full mx-auto px-4 py-6 sm:px-6 2xl:px-8 min-[2200px]:px-10 flex-1 flex flex-col gap-6">
          {/* Title Area */}
          <div className="relative group">
            <div className="flex items-center justify-between absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[13px] text-neutral-400 flex items-center gap-1.5"><RefreshCcw className="w-3.5 h-3.5" /> 자동 저장 중...</span>
            </div>
            <input
              key={`title-${initialNote?.id ?? "new"}`}
              type="text"
              defaultValue={initialNote?.title ?? ""}
              placeholder="제목을 입력하세요"
              className="w-full border-none bg-transparent text-[28px] font-bold tracking-tight text-white outline-none placeholder-[#3A404F] sm:text-[36px]"
            />
            <p className="text-[16px] text-neutral-400 mt-4 font-medium tracking-tight">
              {initialNote
                ? `${initialNote.date} ? 이미지 ${initialNote.images.length}개 ? 태그 ${initialNote.tags.length}개`
                : "아이디어, 메모, 저장할 이미지를 자유롭게 정리하세요."}
            </p>
          </div>

          <div className="h-px w-full border-b border-[#1C1E24] mt-2 mb-4"></div>

          {/* Active Editor Block */}
          <div className="group relative flex min-h-[300px] flex-1 flex-col items-start rounded-xl border border-[#1C1E24] bg-[#111215] p-4 shadow-sm sm:min-h-[340px] sm:p-6">
            <textarea
              key={`memo-${initialNote?.id ?? "new"}`}
              defaultValue={initialNote?.desc ?? ""}
              placeholder="메모를 입력하세요."
              className="min-h-[260px] w-full flex-1 resize-y bg-transparent border-none outline-none text-[16px] leading-[1.75] text-white placeholder:text-neutral-500"
            />
            <button className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-[#2A2E36] bg-[#1A1C20] px-4 py-2 text-[14px] font-semibold text-neutral-300 opacity-100 shadow-md transition-all hover:border-[#3A404F] hover:bg-[#22252A] md:opacity-0 md:group-hover:opacity-100">
              <Plus className="w-4 h-4" /> 블록 추가
            </button>
          </div>

          {initialNote && (
            <div className="flex flex-wrap gap-2">
              {initialNote.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#2A2E36] bg-[#151820] px-3 py-1.5 text-[14px] font-medium text-neutral-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {initialNote && initialNote.images.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {initialNote.images.map((image, index) => (
                <figure key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-[#1C1E24] bg-[#0A0B0D]">
                  <div className="flex aspect-[4/3] items-center justify-center bg-[#0E1014]">
                    <img src={image} alt={`${initialNote.title} 저장 이미지 ${index + 1}`} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <figcaption className="border-t border-[#1C1E24] px-3 py-2 text-[13px] text-neutral-400">
                    저장 이미지 {index + 1}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div className="mt-2 border border-dashed border-[#2A2E36] rounded-xl p-6 flex flex-col items-center justify-center text-center bg-[#0C0C0E] hover:bg-[#111215] cursor-pointer hover:border-[#4A4E58] transition-all min-h-[120px]">
             <div className="w-8 h-8 rounded-lg bg-[#15161A] border border-[#22252B] flex items-center justify-center mb-3 text-neutral-400">
               <UploadCloud className="w-4 h-4" />
             </div>
             <p className="text-[14px] font-bold text-neutral-300 mb-1">드래그 & 드롭으로 레퍼런스 추가</p>
             <p className="text-[13px] text-neutral-400">이미지를 드래그하거나 클릭하여 추가하세요 (PNG, JPG, WEBP 지원)</p>
          </div>

          {/* Block Add Grid */}
          <div className="mt-4">
             <h4 className="text-[15px] font-bold text-neutral-300 mb-4">블록 추가</h4>
             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
               {BLOCKS.map((block, i) => (
                 <button key={i} className="flex flex-col items-center justify-center bg-[#0A0B0D] hover:bg-[#15161A] border border-[#1C1E24] hover:border-[#3A404F] rounded-xl p-4 gap-3 transition-colors text-center aspect-square shadow-sm">
                   <div className="text-neutral-400">{block.icon}</div>
                   <span className="text-[13px] font-medium text-neutral-300 leading-tight">{block.name}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - AI Assist */}
      <aside className="relative z-10 hidden h-full w-[320px] shrink-0 flex-col border-l border-[#161618] bg-[#0A0B0D] xl:flex 2xl:w-[350px]">
        <div className="flex items-center justify-between p-5 border-b border-[#1C1E24]">
          <div className="flex items-center gap-2 text-[16px] font-bold text-white">
            <Sparkles className="w-4 h-4 text-brand-primary" /> AI 어시스트
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-8 pb-24">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <h4 className="text-[15px] font-bold text-white tracking-tight">아이디어 확장</h4>
            <p className="text-[13px] text-neutral-400 leading-relaxed">작성 중인 노트의 내용을 분석하여 아이디어를 확장합니다.</p>
            <div className="bg-[#111215] border border-[#1C1E24] rounded-xl p-3 relative shadow-inner">
              <textarea 
                className="w-full bg-transparent border-none outline-none text-[14px] text-white placeholder-[#4A4E58] resize-none h-[80px]"
                placeholder="예시) 다크 판타지 갑옷 디자인 아이디어 확장해줘"
              ></textarea>
              <div className="absolute bottom-2 right-2 text-neutral-400">
                 <ChevronDown className="w-4 h-4 transform -rotate-45" />
              </div>
            </div>
            <button className="w-full py-2.5 rounded-lg border border-brand-primary/40 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
              아이디어 확장 받기 <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-bold text-white tracking-tight">키워드 제안</h4>
              <button className="text-[12px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3 h-3" /> 새로고침
              </button>
            </div>
            <p className="text-[13px] text-neutral-400">노트 내용을 기반으로 키워드를 추천합니다.</p>
            <div className="flex flex-wrap gap-2">
              {['다크 판타지', '갑옷', '전사', '금속', '문양', '고대', '기사', '신성'].map((kw, i) => (
                <button key={i} className="px-3 py-1.5 bg-[#15161A] border border-[#1C1E24] hover:border-[#3A404F] text-neutral-300 rounded-full text-[13px] font-medium transition-colors">
                  {kw}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px border-b border-[#1C1E24]"></div>

          {/* Section 3 */}
          <div className="space-y-3">
             <h4 className="text-[15px] font-bold text-white tracking-tight">레퍼런스 찾기</h4>
             <p className="text-[13px] text-neutral-400">유사한 레퍼런스를 찾아보세요.</p>
             <button className="w-full py-2.5 rounded-lg border border-[#2A2E36] bg-[#111215] hover:bg-[#15161A] hover:border-[#3A404F] text-neutral-300 text-[14px] font-bold transition-colors flex items-center justify-center gap-2">
              레퍼런스 검색 <span className="ml-1 leading-none text-[16px]">→</span>
            </button>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
             <h4 className="text-[15px] font-bold text-white tracking-tight">연결</h4>
             <p className="text-[13px] text-neutral-400">다른 프로젝트나 에셋과 연결하여 관리하세요.</p>
             <div className="flex gap-2">
               <button className="flex-1 py-2 rounded-lg border border-[#1C1E24] bg-[#0C0C0E] hover:bg-[#111215] text-neutral-400 hover:text-white text-[13px] font-bold transition-colors">
                 프로젝트 연결
               </button>
               <button className="flex-1 py-2 rounded-lg border border-[#1C1E24] bg-[#0C0C0E] hover:bg-[#111215] text-neutral-400 hover:text-white text-[13px] font-bold transition-colors">
                 에셋 연결
               </button>
             </div>
          </div>

          <div className="h-px border-b border-[#1C1E24]"></div>

          {/* Section 5 */}
          <div className="flex items-center justify-between cursor-pointer group">
             <h4 className="text-[15px] font-bold text-white tracking-tight">노트 설정</h4>
             <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </div>

        </div>

        {/* Bottom Save Action */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#0A0B0D]/90 backdrop-blur-md border-t border-[#1C1E24] flex items-center z-20">
          <button className="flex-1 py-3 bg-[#E0A12E] hover:bg-[#F0B43A] text-[#0A0B0D] font-bold text-[15px] rounded-l-lg transition-colors shadow-lg">
            저장
          </button>
          <button className="px-3 py-3 bg-[#E0A12E] hover:bg-[#F0B43A] text-[#0A0B0D] font-bold rounded-r-lg transition-colors border-l border-[#0A0B0D]/20 shadow-lg">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </aside>

    </div>
  );
}
