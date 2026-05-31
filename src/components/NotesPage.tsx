import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, SlidersHorizontal, LayoutGrid, List, Plus, Star, MoreHorizontal,
  Clock, Trash2, Folder, Tag as TagIcon, ChevronRight, PenLine, PlusSquare, Heart, X, Check, CheckSquare, Square, Link as LinkIcon, Wand2
} from 'lucide-react';
import { ASSETS } from '../App';
import NoteSidebar from './NoteSidebar';

interface NotesPageProps {
  onNavigate: (page: string) => void;
  isPopup?: boolean;
  onSelectNote?: (noteId: number) => void;
  onAcceptSelection?: (noteIds: number[]) => void;
}

const FOLDERS = [
  { id: '1', name: '영감 / 아이디어', count: 24, active: true },
  { id: '2', name: '캐릭터 컨셉', count: 38 },
  { id: '3', name: '환경 / 배경', count: 16 },
  { id: '4', name: '무기 / 소품', count: 12 },
  { id: '5', name: '세계관 / 스토리', count: 8 },
  { id: '6', name: '기타', count: 6 },
];

const TAGS = [
  { text: '# 캐릭터', count: 38 },
  { text: '# 엘프', count: 21 },
  { text: '# 판타지', count: 36 },
  { text: '# 갑옷', count: 18 },
  { text: '# 무기', count: 14 },
  { text: '# 동양풍', count: 9 },
  { text: '# 여성', count: 13 },
  { text: '# 다크', count: 12 },
];

export const NOTES = [
  {
    id: 1,
    title: '엘프궁수',
    desc: '하얀 숲을 배경으로 한 엘프궁수 컨셉 아이디어.',
    tags: ['#엘프', '#궁수', '#컨셉'],
    images: ["https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%202.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%203.png"],
    date: '2024.05.20',
    starred: true,
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
  },
  {
    id: 2,
    title: '공룡',
    desc: '다크 판타지 스타일의 갑옷 디자인 아이디어 스케치 및 레퍼런스.',
    tags: ['#갑옷', '#다크판타지', '#디자인'],
    images: ["https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%204.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%205.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%206.png"],
    date: '2024.05.19',
    starred: false,
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
  },
  {
    id: 3,
    title: '컬러 추상 배경',
    desc: '중세 판타지 마을 컨셉 구상 및 레이아웃 아이디어.',
    tags: ['#배경', '#마을', '#컨셉아트'],
    images: ["https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%207.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%208.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%209.png"],
    date: '2024.05.18',
    starred: false,
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
  },
  {
    id: 4,
    title: '모던 주방 인테리어',
    desc: '강인한 여성 전사 컨셉과 스토리 배경.',
    tags: ['#여성', '#전사', '#캐릭터'],
    images: ["https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2010.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2011.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2012.png"],
    date: '2024.05.17',
    starred: false,
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
  },
  {
    id: 5,
    title: '산업 시설 단지',
    desc: '고대 신전 내부 분위기와 구조 레퍼런스 수집.',
    tags: ['#배경', '#신전', '#레퍼런스'],
    images: ["https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2013.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2014.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2015.png"],
    date: '2024.05.17',
    starred: false,
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
  },
  {
    id: 6,
    title: '사이버 엘프 전사',
    desc: '긴 창과 다양한 창날 디자인 아이디어 스케치.',
    tags: ['#무기', '#창', '#디자인'],
    images: ["https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2016.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2017.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2018.png"],
    date: '2024.05.16',
    starred: false,
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6'
  },
  {
    id: 7,
    title: '미래형 로봇 빌런',
    desc: '동양 판타지 건축 스타일 레퍼런스 모음.',
    tags: ['#동양풍', '#건축', '#배경'],
    images: ["https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2019.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2020.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2021.png"],
    date: '2024.05.15',
    starred: false,
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7'
  },
  {
    id: 8,
    title: '홈랜더 캐릭터',
    desc: '의상 디테일과 패턴, 재질 레퍼런스 정리.',
    tags: ['#의상', '#디테일', '#레퍼런스'],
    images: ["https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2022.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2023.png", "https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2024.png"],
    date: '2024.05.14',
    starred: false,
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8'
  }
];

export default function NotesPage({ onNavigate, isPopup, onSelectNote, onAcceptSelection }: NotesPageProps) {
  const [activeNote, setActiveNote] = useState<number | null>(1);
  const [selectedNotes, setSelectedNotes] = useState<Set<number>>(new Set());

  const handleNoteClick = (e: React.MouseEvent, id: number) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newSet = new Set(selectedNotes);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setSelectedNotes(newSet);
    } else {
      if (isPopup) {
        setSelectedNotes(new Set([id]));
      } else {
        setSelectedNotes(new Set());
      }
    }
    setActiveNote(id);
  };

  return (
    <div className={`flex bg-bg-dark font-sans text-text-primary ${isPopup ? 'h-full' : 'h-[calc(100vh-76px)]'} overflow-hidden`}>
      {/* Left Sidebar */}
      <NoteSidebar onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-bg-dark px-6 py-6 relative">
        <div className="max-w-[2400px] w-full mx-auto flex flex-col h-full gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-400" />
              <input 
                type="text" 
                placeholder="노트 검색..." 
                className="w-full h-12 bg-[#121417] border border-[#1C1E24] rounded-xl pl-11 pr-4 text-[15px] text-white placeholder-[#6E737B] focus:outline-none focus:border-brand-primary/50 transition-colors shadow-inner"
              />
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-[#121417] border border-[#1C1E24] rounded-xl text-neutral-400 hover:text-white hover:bg-[#1A1C20] transition-colors shrink-0">
              <SlidersHorizontal className="w-[18px] h-[18px]" />
            </button>
            <div className="h-12 flex items-center bg-[#121417] border border-[#1C1E24] rounded-xl px-2">
              <div className="text-[14px] text-text-secondary px-3 border-r border-[#2A2E36] mr-1 flex items-center gap-2 cursor-pointer hover:text-white">
                정렬: 최근 수정 <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <span className="text-[13px] text-text-tertiary px-3 mr-1">보기:</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-md bg-[#252830] text-white"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-md text-neutral-400 hover:text-white"><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="text-[13px] text-neutral-400 flex items-center gap-2 px-1">
            <CheckSquare className="w-4 h-4 text-neutral-400" /> Ctrl(Cmd) 키를 누르고 클릭하면 여러 개를 다중 선택할 수 있습니다.
          </div>

          <div className={`grid gap-5 transition-all duration-300 ${activeNote ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'}`}>
            {NOTES.map((note) => {
              const isSelected = selectedNotes.has(note.id);
              return (
              <div 
                key={note.id} 
                onClick={(e) => handleNoteClick(e, note.id)}
                className={`flex flex-col rounded-[10px] border p-5 cursor-pointer transition-all duration-300 group shadow-[0_4px_12px_rgba(0,0,0,0.15)] relative ${isSelected ? 'bg-surface-primary border-brand-primary shadow-[0_0_20px_rgba(224,161,46,0.15)]' : 'bg-surface-primary/80 border-border-primary/20 hover:bg-surface-primary hover:border-brand-primary/40'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-[20px] font-bold tracking-tight ${isSelected ? 'text-brand-primary' : 'text-[#F5F5F5]'} transition-colors`}>{note.title}</h3>
                    {isSelected && (
                      <div className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-bg-dark shadow-md shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <button className={`${note.starred ? 'text-brand-primary' : 'text-neutral-400 group-hover:text-neutral-400'} transition-colors`}>
                    <Star className={`w-[18px] h-[18px] ${note.starred ? 'fill-brand-primary' : ''}`} />
                  </button>
                </div>
                <p className="text-[14px] text-neutral-400 leading-relaxed mb-4 line-clamp-2 h-10">{note.desc}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-[12px] font-medium bg-[#1A1C20] border border-[#252830] px-2 py-0.5 rounded text-neutral-400">{tag}</span>
                  ))}
                </div>

                <div className="flex gap-1.5 mb-5 h-[90px]">
                  {note.images.map((img, i) => (
                    <div key={i} className="flex-1 rounded-md overflow-hidden bg-[#0A0B0E] border border-[#1A1C20]">
                      <img referrerPolicy="no-referrer" src={img} alt="thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#1C1E24]">
                  <span className="text-[13px] font-sans text-neutral-400">{note.date}</span>
                  <div className="flex items-center gap-3">
                    <button className="text-neutral-400 hover:text-white transition-colors">
                      {activeNote === note.id ? <PenLine className="w-[18px] h-[18px]" /> : <MoreHorizontal className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </main>

      {/* Right Sidebar (Detail panel) */}
      <AnimatePresence>
        {activeNote && NOTES.find(n => n.id === activeNote) && (
          <motion.aside 
            initial={{ width: 0, opacity: 0, x: 20 }}
            animate={{ width: 400, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[420px] shrink-0 border-l border-[#161618] bg-[#0A0B0D] hidden xl:flex flex-col h-full overflow-y-auto custom-scrollbar relative z-10"
          >
            <div className="sticky top-0 bg-[#0A0B0D]/80 backdrop-blur-xl border-b border-[#161618] p-5 flex items-center justify-between z-20">
               <div>
                 <h2 className="text-[28px] font-bold text-white tracking-tight flex items-center gap-3">
                   {NOTES.find(n => n.id === activeNote)?.title}
                 </h2>
                 <div className="flex gap-1.5 mt-3">
                    {NOTES.find(n => n.id === activeNote)?.tags.map(tag => (
                      <span key={tag} className="text-[14px] font-medium bg-[#15161A] border border-[#22252A] px-2.5 py-1 rounded text-neutral-300">{tag}</span>
                    ))}
                    <button className="flex items-center justify-center w-7 h-7 bg-[#15161A] border border-[#22252A] rounded text-neutral-400 hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
                 </div>
               </div>
               <div className="flex items-start gap-4 h-full">
                 <button className="text-brand-primary">
                   <Star className={`w-[22px] h-[22px] ${NOTES.find(n => n.id === activeNote)?.starred ? 'fill-brand-primary' : ''}`} />
                 </button>
                 <button onClick={() => setActiveNote(null)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
               </div>
            </div>

            <div className="p-6 space-y-8 pb-32">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-[18px] font-bold text-white tracking-tight">메모</h3>
                  <PenLine className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <div className="text-[15px] text-neutral-300 leading-relaxed space-y-1">
                  <p>{NOTES.find(n => n.id === activeNote)?.desc}</p>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[18px] font-bold text-white tracking-tight">참고 레퍼런스</h3>
                  <button className="text-[13px] text-neutral-400 font-medium hover:text-white">모두 보기</button>
                </div>
                <div className="flex gap-2 h-[140px]">
                  {NOTES.find(n => n.id === activeNote)?.images.map((img, i) => (
                    <div key={i} className="flex-1 rounded-lg overflow-hidden border border-[#22252A] bg-black group relative cursor-pointer">
                      <img referrerPolicy="no-referrer" src={img} alt="ref" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  ))}
                  <div className="w-[45px] shrink-0 border border-dashed border-[#2A2E36] rounded-lg flex items-center justify-center cursor-pointer hover:border-[#4A4E58] hover:bg-[#15161A] transition-colors">
                    <Plus className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[18px] font-bold text-white tracking-tight">연결 프로젝트</h3>
                  <button className="text-[13px] text-neutral-400 font-medium hover:text-white">모두 보기</button>
                </div>
                <div className="bg-[#111215] border border-[#1C1E24] rounded-xl p-3 flex gap-4 cursor-pointer hover:border-brand-primary/50 transition-colors group">
                  <img referrerPolicy="no-referrer" src={NOTES.find(n => n.id === activeNote)?.images[1] || ''} alt="project" className="w-[60px] h-[60px] rounded-lg object-cover" />
                  <div className="flex-1 flex flex-col justify-center">
                     <h4 className="text-[16px] font-bold text-white mb-1.5 group-hover:text-brand-primary transition-colors">{NOTES.find(n => n.id === activeNote)?.title} 프로젝트</h4>
                     <span className="flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-[#E0A12E]/30 text-[#E0A12E] bg-[#E0A12E]/10 w-fit">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#E0A12E] animate-pulse" /> In Progress
                     </span>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4 border-b border-[#1C1E24] pb-4">
                  <h3 className="text-[18px] font-bold text-white tracking-tight">체크리스트</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1 bg-[#252830] rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary w-[50%]" />
                    </div>
                    <span className="text-[14px] font-sans text-neutral-400">3 / 6</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { text: '레퍼런스 이미지 수집', checked: true },
                    { text: '전체 실루엣 구상', checked: true },
                    { text: '색상 팔레트 결정', checked: true },
                    { text: '3면도 스케치', checked: false },
                    { text: '디테일 디자인', checked: false },
                    { text: '최종 컨셉 확정', checked: false }
                  ].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      {item.checked ? (
                        <CheckSquare className="w-5 h-5 text-brand-primary rounded" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400 group-hover:text-neutral-400 transition-colors rounded" />
                      )}
                      <span className={`text-[15px] ${item.checked ? 'text-neutral-400 line-through' : 'text-neutral-300'}`}>{item.text}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[18px] font-bold text-white tracking-tight mb-4">메모 히스토리</h3>
                <div className="space-y-4">
                  {[
                    { date: '2024.05.20 14:32', action: '내용 수정' },
                    { date: '2024.05.19 10:15', action: '레퍼런스 추가' },
                    { date: '2024.05.18 18:22', action: '노트 생성' }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between text-[14px]">
                      <span className="text-neutral-400 font-sans w-[130px]">{log.date}</span>
                      <span className="text-neutral-400 flex-1">{log.action}</span>
                      
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedNotes.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-[#1A1C20] border border-[#2A2E36] rounded-[12px] p-2 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-50 gap-4"
          >
            <div className="flex items-center gap-2 pr-4 border-r border-[#2A2E36]">
              <div className="w-5 h-5 bg-brand-primary rounded-full flex justify-center items-center text-bg-dark text-[11px] font-bold">
                {selectedNotes.size}
              </div>
              <span className="text-[13px] font-bold text-white">선택됨</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isPopup ? (
                <button 
                  onClick={() => {
                    if (onAcceptSelection) {
                      onAcceptSelection(Array.from<number>(selectedNotes));
                    } else if (onSelectNote) {
                      const firstNote = Array.from<number>(selectedNotes)[0];
                      if (firstNote !== undefined) {
                        onSelectNote(firstNote);
                      }
                    }
                  }}
                  className="px-6 py-1.5 bg-[#E0A12E] hover:bg-[#E0A12E]/90 text-bg-dark rounded-[6px] text-[13px] font-bold transition-colors flex gap-2 items-center shadow-[0_0_12px_rgba(224,161,46,0.15)]"
                >
                   노트 가져오기 <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <>
                  <button className="px-3 py-1.5 hover:bg-surface-primary rounded-[6px] text-[13px] font-medium text-text-secondary hover:text-white transition-colors flex gap-2 items-center">
                    <Folder className="w-4 h-4" /> 보드 이동
                  </button>
                  <button className="px-3 py-1.5 hover:bg-surface-primary rounded-[6px] text-[13px] font-medium text-text-secondary hover:text-white transition-colors flex gap-2 items-center">
                    <LinkIcon className="w-4 h-4" /> 프로젝트 연결
                  </button>
                  <button className="px-4 py-1.5 bg-[#E0A12E]/10 border border-[#E0A12E]/30 text-brand-primary hover:bg-[#E0A12E]/20 rounded-[6px] text-[13px] font-bold transition-colors flex gap-2 items-center shadow-[0_0_12px_rgba(224,161,46,0.15)]">
                    <Wand2 className="w-4 h-4" /> AI Studio 보내기
                  </button>
                </>
              )}
            </div>

            <div className="pl-2 border-l border-[#2A2E36]">
              <button onClick={() => setSelectedNotes(new Set())} className="p-1.5 hover:bg-surface-primary rounded-full text-text-tertiary hover:text-white transition-colors">
                <Trash2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
