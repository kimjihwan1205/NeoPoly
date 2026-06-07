import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Image as ImageIcon, Box, ArrowRight, X } from 'lucide-react';

export default function FullWorkflowIntroPage({ onNavigate, onClose }: { onNavigate?: (page: string) => void, onClose?: () => void }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('hideFullWorkflowIntro') === 'true') {
      onClose?.();
    }
  }, [onClose]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideFullWorkflowIntro', 'true');
    }
    onClose?.();
  };

  if (localStorage.getItem('hideFullWorkflowIntro') === 'true') {
    return null;
  }

  return (
    <div className="absolute inset-0 z-[100] flex bg-[#050505]/60 backdrop-blur-sm text-white font-sans antialiased items-center justify-center overflow-hidden">
      
      {/* Close Button Top Right */}
      <button 
        onClick={handleClose}
        className="absolute top-8 right-8 p-3 text-neutral-400 hover:text-white bg-[#141518] border border-[#2A2E36] hover:border-[#E0A12E]/50 rounded-full transition-all z-20 cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(224,161,46,0.1),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl w-full px-5 sm:px-8 flex flex-col items-center relative z-10">
        
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E0A12E]/30 bg-[#E0A12E]/10 text-[#E0A12E] text-[14px] font-medium tracking-wide shadow-[0_0_15px_rgba(224,161,46,0.15)]">
          <Sparkles className="w-4 h-4" /> NeoPoly AI Studio
        </div>
        
        <h1 className="text-[32px] leading-[1.3] font-bold mb-6 text-center text-[#F5F5F5]">
          가장 완벽한 <span className="text-[#E0A12E]">풀 워크플로우</span> 경험
        </h1>
        
        <p className="text-neutral-400 text-[16px] text-center max-w-3xl mb-14 leading-[1.65]">
          아이디어를 구체화하는 프롬프트 작성부터, 고품질 레퍼런스 이미지 생성, 
          그리고 최종 3D 모델링까지 플랫폼 이동 없이 한 곳에서 매끄럽게 완성하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 xl:gap-10 w-full mb-14 px-0 sm:px-4">
          {/* Step 1 */}
          <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-[24px] p-6 sm:p-8 xl:p-9 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 text-[80px] font-bold text-[#141518] leading-none pointer-events-none transition-colors">
              1
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#141518] border border-[#2A2E36] flex items-center justify-center mb-8 text-[#E0A12E] shadow-sm relative z-10 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-semibold mb-4 relative z-10 text-[#F5F5F5]">프롬프트 구체화</h3>
            <p className="text-neutral-300 text-[16px] leading-[1.7] relative z-10">
              막연한 아이디어만 있어도 괜찮습니다. 대화형 AI가 원하는 느낌을 파악하여 완벽한 프롬프트로 다듬어 드립니다.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-[24px] p-6 sm:p-8 xl:p-9 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 text-[80px] font-bold text-[#141518] leading-none pointer-events-none transition-colors">
              2
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#141518] border border-[#2A2E36] flex items-center justify-center mb-8 text-[#60A5FA] shadow-sm relative z-10 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-semibold mb-4 relative z-10 text-[#F5F5F5]">2D 레퍼런스 생성</h3>
            <p className="text-neutral-300 text-[16px] leading-[1.7] relative z-10">
              작성된 프롬프트를 바탕으로 다각도의 컨셉 아트와 텍스쳐 레퍼런스를 실시간으로 시각화합니다.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0A0B0D] border border-[#1F2329] rounded-[24px] p-6 sm:p-8 xl:p-9 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 text-[80px] font-bold text-[#141518] leading-none pointer-events-none transition-colors">
              3
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#141518] border border-[#2A2E36] flex items-center justify-center mb-8 text-[#4ADE80] shadow-sm relative z-10 transition-transform">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-semibold mb-4 relative z-10 text-[#F5F5F5]">3D 모델 변환</h3>
            <p className="text-neutral-300 text-[16px] leading-[1.7] relative z-10">
              가장 마음에 드는 이미지를 선택하여 게임 엔진과 호환되는 최적화된 고품질 3D 메쉬로 즉시 변환합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <label className="flex items-center gap-2.5 text-neutral-400 hover:text-[#F5F5F5] cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-[#2A2E36] bg-[#141518] text-[#E0A12E] focus:ring-[#E0A12E]/50 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-[14px] select-none">다시 보지 않기</span>
          </label>
          <button 
            onClick={handleClose}
            className="text-[14px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
