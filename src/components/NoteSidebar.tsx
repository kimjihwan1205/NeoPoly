import React from 'react';
import { 
  ChevronDown, Plus, Star, Clock, Trash2, Settings, 
  FileText, Folder, MoreHorizontal, Sparkles
} from 'lucide-react';

interface NoteSidebarProps {
  onNavigate: (page: string) => void;
}

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

export default function NoteSidebar({ onNavigate }: NoteSidebarProps) {
  return (
    <aside className="w-[300px] shrink-0 border-r border-[#161618] bg-[#08090B] p-5 hidden lg:flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h2 className="text-[26px] font-bold tracking-tight text-white mb-2 cursor-pointer hover:text-brand-primary transition-colors" onClick={() => onNavigate('notes')}>Notes</h2>
        <p className="text-[14px] text-text-secondary w-[90%] leading-relaxed">아이디어와 작업 메모를 정리하세요.</p>
      </div>

      <button onClick={() => onNavigate('note-editor')} className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl border border-[#3A404F]/60 bg-[#15161A] hover:bg-[#22252B] hover:border-[#E0A12E]/50 text-[#E0A12E] shadow-sm transition-all font-bold text-[15px] mb-6 tracking-wide">
        <Plus className="w-[18px] h-[18px]" />
        <span>새 노트</span>
      </button>

      <nav className="space-y-1 mb-8 px-1">
        <div onClick={() => onNavigate('notes')} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-semibold tracking-tight transition-colors border border-transparent bg-[#15161A] text-white cursor-pointer">
          <div className="flex items-center gap-3">
            <Folder className="w-[18px] h-[18px] text-[#E0A12E]" />
            <span className="tracking-tight">전체 노트</span>
          </div>
          <span className="text-[13px] font-sans text-text-secondary">128</span>
        </div>
        <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-semibold tracking-tight transition-colors border border-transparent text-text-secondary hover:text-white hover:bg-[#111215] cursor-pointer">
          <div className="flex items-center gap-3">
            <Star className="w-[18px] h-[18px] text-neutral-400" />
            <span className="tracking-tight">즐겨찾기</span>
          </div>
          <span className="text-[13px] font-sans text-neutral-500">12</span>
        </div>
        <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-semibold tracking-tight transition-colors border border-transparent text-text-secondary hover:text-white hover:bg-[#111215] cursor-pointer">
          <div className="flex items-center gap-3">
            <Clock className="w-[18px] h-[18px] text-neutral-400" />
            <span className="tracking-tight">최근 수정</span>
          </div>
          <span className="text-[13px] font-sans text-neutral-500">20</span>
        </div>
        <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-semibold tracking-tight transition-colors border border-transparent text-text-secondary hover:text-white hover:bg-[#111215] cursor-pointer">
          <div className="flex items-center gap-3">
            <Trash2 className="w-[18px] h-[18px] text-neutral-400" />
            <span className="tracking-tight">휴지통</span>
          </div>
          <span className="text-[13px] font-sans text-neutral-500">4</span>
        </div>
      </nav>

      <div className="mb-8 px-1">
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-[14px] font-bold text-neutral-400 tracking-wider">노트 폴더</span>
          <button className="text-neutral-400 hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
        </div>
        <nav className="space-y-1">
          {FOLDERS.map((folder) => (
            <div key={folder.id} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-semibold tracking-tight transition-colors border border-transparent cursor-pointer ${folder.active ? 'bg-[#15161A] text-white' : 'text-text-secondary hover:text-white hover:bg-[#111215]'}`}>
              <div className="flex items-center gap-3">
                <Folder className={`w-[18px] h-[18px] ${folder.active ? 'text-[#E0A12E]' : 'text-neutral-400'}`} />
                <span className="tracking-tight">{folder.name}</span>
              </div>
              <span className={`text-[13px] font-sans ${folder.active ? 'text-text-secondary' : 'text-neutral-500'}`}>{folder.count}</span>
            </div>
          ))}
        </nav>
      </div>

      <div>
         <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-[14px] font-bold text-neutral-400 tracking-wider">태그</span>
          <button className="text-neutral-400 hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
        </div>
        <div className="flex flex-wrap gap-2 px-1">
          {TAGS.map((tag, i) => (
            <span key={i} className="flex items-center bg-[#15161A] border border-[#22252A] rounded-full px-2.5 py-1 text-[13px] font-semibold text-text-secondary hover:text-white hover:border-[#3A404F] transition-colors cursor-pointer tracking-tight group">
              {tag.text} <span className="ml-1.5 text-[12px] text-neutral-400 font-sans font-medium group-hover:text-text-secondary transition-colors">{tag.count}</span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
