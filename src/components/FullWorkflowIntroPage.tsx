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
    <div className="np-full-workflow-intro absolute inset-0 z-[100] flex items-start justify-center overflow-x-hidden overflow-y-auto bg-[#050505]/60 font-sans text-white antialiased backdrop-blur-sm md:items-center">
      
      {/* Close Button Top Right */}
      <button 
        onClick={handleClose}
        aria-label="풀 워크플로우 소개 닫기"
        className="absolute right-4 top-4 z-20 cursor-pointer rounded-full border border-[#2A2E36] bg-[#141518] p-2.5 text-neutral-400 transition-all hover:border-brand-primary/50 hover:text-white sm:right-6 sm:top-6 sm:p-3"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(800px,100dvh)] w-[min(800px,100vw)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(224,161,46,0.1),transparent_60%)]" />

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center px-5 pb-8 pt-20 sm:px-8 sm:pb-10 sm:pt-24 md:py-10">
        
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-[14px] font-medium tracking-wide shadow-[0_0_15px_rgba(224,161,46,0.15)]">
          <Sparkles className="w-4 h-4" /> NeoPoly AI Studio
        </div>
        
        <h1 className="np-full-workflow-intro-title mb-4 text-center text-[28px] font-bold leading-[1.3] text-[#F5F5F5] sm:mb-6 sm:text-[32px]">
          가장 완벽한 <span className="text-brand-primary">풀 워크플로우</span> 경험
        </h1>
        
        <p className="np-full-workflow-intro-copy mb-8 max-w-3xl text-center text-[14px] leading-[1.65] text-neutral-400 sm:text-[16px] md:mb-10 xl:mb-14">
          아이디어를 구체화하는 프롬프트 작성부터, 고품질 레퍼런스 이미지 생성, 
          그리고 최종 3D 모델링까지 플랫폼 이동 없이 한 곳에서 매끄럽게 완성하세요.
        </p>

        <div className="mb-8 grid w-full grid-cols-1 gap-3 px-0 sm:gap-5 sm:px-4 md:mb-10 md:grid-cols-3 md:gap-5 xl:mb-14 xl:gap-10">
          {/* Step 1 */}
          <div className="np-full-workflow-step-card relative overflow-hidden rounded-[18px] border border-[#1F2329] bg-[#0A0B0D] p-5 transition-all duration-300 sm:rounded-[24px] sm:p-8 md:p-5 xl:p-9">
            <div className="np-full-workflow-step-number absolute top-0 right-0 p-6 text-[80px] font-bold text-[#141518] leading-none pointer-events-none transition-colors">
              1
            </div>
            <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2A2E36] bg-[#141518] text-brand-primary shadow-sm transition-transform sm:mb-8 sm:h-14 sm:w-14 md:mb-5 xl:mb-8">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="relative z-10 mb-3 text-[18px] font-semibold text-[#F5F5F5] sm:mb-4 sm:text-[20px]">프롬프트 구체화</h3>
            <p className="relative z-10 text-[14px] leading-[1.7] text-neutral-300 sm:text-[16px] md:text-[14px] xl:text-[16px]">
              막연한 아이디어만 있어도 괜찮습니다. 대화형 AI가 원하는 느낌을 파악하여 완벽한 프롬프트로 다듬어 드립니다.
            </p>
          </div>

          {/* Step 2 */}
          <div className="np-full-workflow-step-card relative overflow-hidden rounded-[18px] border border-[#1F2329] bg-[#0A0B0D] p-5 transition-all duration-300 sm:rounded-[24px] sm:p-8 md:p-5 xl:p-9">
            <div className="np-full-workflow-step-number absolute top-0 right-0 p-6 text-[80px] font-bold text-[#141518] leading-none pointer-events-none transition-colors">
              2
            </div>
            <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2A2E36] bg-[#141518] text-[#60A5FA] shadow-sm transition-transform sm:mb-8 sm:h-14 sm:w-14 md:mb-5 xl:mb-8">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="relative z-10 mb-3 text-[18px] font-semibold text-[#F5F5F5] sm:mb-4 sm:text-[20px]">2D 레퍼런스 생성</h3>
            <p className="relative z-10 text-[14px] leading-[1.7] text-neutral-300 sm:text-[16px] md:text-[14px] xl:text-[16px]">
              작성된 프롬프트를 바탕으로 다각도의 컨셉 아트와 텍스쳐 레퍼런스를 실시간으로 시각화합니다.
            </p>
          </div>

          {/* Step 3 */}
          <div className="np-full-workflow-step-card relative overflow-hidden rounded-[18px] border border-[#1F2329] bg-[#0A0B0D] p-5 transition-all duration-300 sm:rounded-[24px] sm:p-8 md:p-5 xl:p-9">
            <div className="np-full-workflow-step-number absolute top-0 right-0 p-6 text-[80px] font-bold text-[#141518] leading-none pointer-events-none transition-colors">
              3
            </div>
            <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2A2E36] bg-[#141518] text-[#4ADE80] shadow-sm transition-transform sm:mb-8 sm:h-14 sm:w-14 md:mb-5 xl:mb-8">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="relative z-10 mb-3 text-[18px] font-semibold text-[#F5F5F5] sm:mb-4 sm:text-[20px]">3D 모델 변환</h3>
            <p className="relative z-10 text-[14px] leading-[1.7] text-neutral-300 sm:text-[16px] md:text-[14px] xl:text-[16px]">
              가장 마음에 드는 이미지를 선택하여 게임 엔진과 호환되는 최적화된 고품질 3D 메쉬로 즉시 변환합니다.
            </p>
          </div>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-4 sm:mt-2 sm:gap-6">
          <label className="flex items-center gap-2.5 text-neutral-400 hover:text-[#F5F5F5] cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-[#2A2E36] bg-[#141518] text-brand-primary focus:ring-brand-primary/50 focus:ring-offset-0 cursor-pointer"
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
