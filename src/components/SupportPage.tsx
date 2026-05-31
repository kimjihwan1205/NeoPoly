import React, { useState } from 'react';
import { Search, ChevronDown, MessageCircle, FileText, HelpCircle, BookOpen, ExternalLink } from 'lucide-react';
import ChatbotWidget from './ChatbotWidget';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { question: 'NeoPoly 플랫폼은 무료로 사용할 수 있나요?', answer: '기본 기능인 에셋 브라우징과 무료 에셋 다운로드는 누구나 이용할 수 있습니다. 프리미엄 에셋과 AI Studio의 고급 제너레이션 기능은 크레딧을 소모하거나 구독 플랜이 필요합니다.' },
    { question: '구매한 에셋의 상업적 이용이 가능한가요?', answer: '네, NeoMarket에서 상업용 라이선스로 표기된 에셋은 영리 목적의 프로젝트(게임, 영상 등)에 제한 없이 사용 가능합니다.' },
    { question: 'AI Studio에서 생성된 이미지의 저작권은 누구에게 있나요?', answer: 'AI Studio로 생성한 이미지의 소유권은 생성자(사용자)에게 귀속됩니다. 단, 원본 창작물을 지나치게 모방한 경우 저작권 침해 소지가 있을 수 있으니 주의하시기 바랍니다.' },
    { question: '렌더링을 위해 크레딧은 얼마나 소모되나요?', answer: '기본 2K 렌더링은 1 크레딧이며, 4K 및 턴테이블 영상 추출 시 각각 2 크레딧, 5 크레딧이 추가로 소모됩니다.' },
    { question: '환불 정책이 어떻게 되나요?', answer: '디지털 에셋 특성상 다운로드 후에는 원칙적으로 환불이 불가합니다. 단, 파일이 손상되었거나 설명과 확연히 다를 경우 고객센터를 통해 7일 이내 환불을 요청하실 수 있습니다.' },
  ];

  return (
    <div className="min-h-[calc(100vh-76px)] bg-bg-dark text-text-primary font-sans relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-[#1F2329] bg-[#0A0B0D]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E0A12E]/5 to-transparent"></div>
        <div className="max-w-[1200px] mx-auto px-6 py-12 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141518] border border-[#2A2E36] text-[#E0A12E] text-[12px] font-bold mb-6 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>고객 지원 센터</span>
          </div>
          <h1 className="text-[32px] sm:text-[42px] font-bold tracking-tight text-white mb-4">무엇을 도와드릴까요?</h1>
          <p className="text-[15px] sm:text-[17px] text-neutral-400 max-w-[600px] leading-relaxed mb-10">NeoPoly 이용과 관련된 궁금한 점이나 문제를 해결해보세요.<br/>검색 또는 자주 묻는 질문을 확인하실 수 있습니다.</p>
          
          <div className="w-full max-w-[640px] relative mt-2 group shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <button className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-[#E0A12E] group-focus-within:text-[#E0A12E] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder="궁금한 내용을 검색해보세요 (예: 크레딧, 환불, 저작권)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-[#141518] border border-[#2A2E36] focus:border-[#E0A12E]/60 text-white text-[15px] focus:outline-none transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* FAQ Area */}
          <div className="flex-1">
            <div className="mb-10">
              <h2 className="text-[24px] font-bold text-white mb-2 tracking-tight">자주 묻는 질문 (FAQ)</h2>
              <p className="text-[14px] text-neutral-400">가장 많이 들어오는 질문들을 모아두었어요.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[#0A0B0D] border border-[#1F2329] rounded-xl overflow-hidden hover:border-[#3A404F] transition-colors">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none py-5 px-6">
                      <span className="text-[15px] font-bold text-white group-hover:text-[#E0A12E] transition-colors pr-8 leading-snug">
                        {faq.question}
                      </span>
                      <span className="transition group-open:rotate-180 flex-shrink-0 text-neutral-400">
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </summary>
                    <div className="text-neutral-400 mt-1 group-open:animate-fadeIn pt-1 pb-6 px-6 text-[14px] leading-relaxed border-t border-[#1F2329]/50">
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-[#0A0B0D] border border-[#2A2E36] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#E0A12E]/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
               <div className="relative z-10 flex flex-col gap-2">
                 <h3 className="text-[16px] font-bold text-white">원하는 답변을 찾지 못하셨나요?</h3>
                 <p className="text-[13px] text-neutral-400">우측 하단의 AI 도우미 또는 문의 접수를 이용해주세요.</p>
               </div>
               <button className="whitespace-nowrap px-6 py-2.5 rounded-xl bg-[#141518] border border-[#2A2E36] text-[13px] font-bold text-white hover:bg-[#1C1F26] transition-colors relative z-10">
                 1:1 문의 접수하기
               </button>
            </div>
          </div>

          {/* Docs & Guides */}
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-6">
            <div className="mb-4">
              <h2 className="text-[24px] font-bold text-white mb-2 tracking-tight">가이드 및 리소스</h2>
              <p className="text-[14px] text-neutral-400">서비스 이용에 필요한 유용한 정보와 정책을 확인하세요.</p>
            </div>
            
            <a href="#" className="flex items-start gap-4 p-5 bg-[#0A0B0D] border border-[#1F2329] hover:border-[#E0A12E]/40 rounded-2xl group transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#141518] border border-[#2A2E36] flex items-center justify-center shrink-0 group-hover:bg-[#E0A12E]/10 group-hover:border-[#E0A12E]/30 transition-colors">
                <BookOpen className="w-5 h-5 text-neutral-400 group-hover:text-[#E0A12E] transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-white group-hover:text-[#E0A12E] transition-colors">시작하기 가이드</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <p className="text-[13px] text-neutral-400 leading-relaxed">신규 사용자를 위한 에셋 구매 및 스튜디오 활용법 안내</p>
              </div>
            </a>

            <a href="#" className="flex items-start gap-4 p-5 bg-[#0A0B0D] border border-[#1F2329] hover:border-[#E0A12E]/40 rounded-2xl group transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#141518] border border-[#2A2E36] flex items-center justify-center shrink-0 group-hover:bg-[#E0A12E]/10 group-hover:border-[#E0A12E]/30 transition-colors">
                <FileText className="w-5 h-5 text-neutral-400 group-hover:text-[#E0A12E] transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-white group-hover:text-[#E0A12E] transition-colors">정책 및 이용약관</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <p className="text-[13px] text-neutral-400 leading-relaxed">서비스 이용약관, 개인정보처리방침 및 저작권 규정 안내</p>
              </div>
            </a>

            <a href="#" className="flex items-start gap-4 p-5 bg-[#0A0B0D] border border-[#1F2329] hover:border-[#E0A12E]/40 rounded-2xl group transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#141518] border border-[#2A2E36] flex items-center justify-center shrink-0 group-hover:bg-[#E0A12E]/10 group-hover:border-[#E0A12E]/30 transition-colors">
                <MessageCircle className="w-5 h-5 text-neutral-400 group-hover:text-[#E0A12E] transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-white group-hover:text-[#E0A12E] transition-colors">Discord 커뮤니티</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <p className="text-[13px] text-neutral-400 leading-relaxed">다른 크리에이터들과 소통하고 팁을 공유해보세요.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
      <ChatbotWidget />
    </div>
  );
}
