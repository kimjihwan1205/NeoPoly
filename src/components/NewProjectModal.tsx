import React, { useState } from 'react';
import { X, Sparkles, Folder, FileText, MousePointer2 } from 'lucide-react';

export default function NewProjectModal({ isOpen, onClose, onCreate }: { isOpen: boolean; onClose: () => void, onCreate?: (name: string, template?: string | null) => void }) {
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const templates = [
    { id: 'blank', icon: <FileText className="w-5 h-5" />, title: '빈 프로젝트', desc: '처음부터 새롭게 시작하기' },
    { id: 'character', icon: <Sparkles className="w-5 h-5" />, title: '캐릭터 모델링', desc: 'AI를 활용한 빠른 캐릭터 기본 세팅' },
    { id: 'prop', icon: <Folder className="w-5 h-5" />, title: '프랍 모델링', desc: '소품 및 환경 오브젝트 제작 템플릿' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-[640px] bg-[#0A0B0D] border border-[#2A2E36] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E0A12E]/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1F2329] relative z-10">
          <div>
            <h2 className="text-[22px] font-bold text-white mb-2">새 프로젝트 만들기</h2>
            <p className="text-[14px] text-neutral-400">새로운 3D 에셋 작업을 시작하세요.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#141518] border border-[#2A2E36] text-neutral-400 hover:text-white hover:border-[#E0A12E]/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 relative z-10 flex flex-col gap-8">
          
          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-bold text-white ml-1">프로젝트 이름</label>
            <input 
              type="text" 
              placeholder="프로젝트 이름을 입력하세요"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full h-[52px] bg-[#141518] border border-[#2A2E36] focus:border-[#E0A12E]/60 rounded-xl px-5 text-[15px] text-white placeholder:text-neutral-400 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-bold text-white ml-1">설명 <span className="text-neutral-400 font-normal">(선택)</span></label>
            <textarea 
              placeholder="프로젝트에 대한 간단한 설명을 작성해주세요"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full h-24 bg-[#141518] border border-[#2A2E36] focus:border-[#E0A12E]/60 rounded-xl px-5 py-4 text-[15px] text-white placeholder:text-neutral-400 outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[14px] font-bold text-white ml-1">템플릿 선택</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`flex flex-col items-start text-left p-4 rounded-xl border transition-all ${selectedTemplate === t.id ? 'bg-[#E0A12E]/10 border-[#E0A12E] shadow-[0_0_20px_rgba(224,161,46,0.1)]' : 'bg-[#141518] border-[#2A2E36] hover:border-[#3A404F]'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selectedTemplate === t.id ? 'bg-[#E0A12E] text-[#050505]' : 'bg-[#1C1F26] text-neutral-400'}`}>
                    {t.icon}
                  </div>
                  <span className={`text-[14px] font-bold mb-1 ${selectedTemplate === t.id ? 'text-[#E0A12E]' : 'text-white'}`}>{t.title}</span>
                  <span className="text-[12px] text-neutral-400 leading-relaxed line-clamp-2">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1F2329] bg-[#101114] flex justify-end gap-3 relative z-10">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-[14px] font-bold text-neutral-400 hover:text-white transition-colors"
          >
            취소
          </button>
          <button 
            onClick={() => {
              if (projectName.trim()) {
                if (onCreate) onCreate(projectName.trim(), selectedTemplate);
                else onClose();
              }
            }}
            disabled={!projectName.trim()}
            className={`px-8 py-3 rounded-xl text-[14px] font-bold transition-all flex items-center gap-2 ${projectName.trim() ? 'bg-[#E0A12E] text-[#050505] hover:bg-[#F0B43A]' : 'bg-[#1A1C21] text-neutral-400 cursor-not-allowed'}`}
          >
            <MousePointer2 className="w-4 h-4" />
            프로젝트 생성
          </button>
        </div>

      </div>
    </div>
  );
}
