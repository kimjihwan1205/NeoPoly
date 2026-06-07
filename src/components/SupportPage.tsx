import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileText,
  HelpCircle,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import ChatbotWidget from "./ChatbotWidget";

const FAQS = [
  {
    question: "NeoPoly를 무료로 사용할 수 있나요?",
    answer:
      "기본 레퍼런스 탐색과 일부 작업 도구는 무료로 사용할 수 있습니다. 고급 AI 생성, 대용량 렌더링, 상업용 에셋 다운로드는 플랜에 따라 제한될 수 있습니다.",
  },
  {
    question: "구매한 에셋을 상업 프로젝트에 사용할 수 있나요?",
    answer:
      "상업용 라이선스로 표시된 에셋은 게임, 영상, 프로토타입 등 상업 프로젝트에서 사용할 수 있습니다. 각 에셋 상세 페이지의 라이선스 표기를 확인하세요.",
  },
  {
    question: "AI Studio에서 생성한 이미지는 누구에게 소유권이 있나요?",
    answer:
      "사용자가 입력한 프롬프트와 생성 결과물은 사용자의 작업물로 관리됩니다. 단, 기존 저작물을 과도하게 모방하는 입력은 피하는 것이 안전합니다.",
  },
  {
    question: "렌더링에는 크레딧이 얼마나 필요한가요?",
    answer:
      "기본 2K 렌더링은 1크레딧, 4K 및 영상 추출은 작업량에 따라 더 많은 크레딧을 사용할 수 있습니다.",
  },
  {
    question: "환불 요청은 어떻게 하나요?",
    answer:
      "다운로드 전 에셋은 계정 내 구매 내역에서 환불 요청이 가능합니다. 파일 손상이나 설명과 다른 문제가 있으면 고객센터로 문의해 주세요.",
  },
];

const GUIDES = [
  {
    title: "시작하기 가이드",
    desc: "에셋 탐색, 노트 작성, AI Studio 기본 흐름",
    icon: BookOpen,
  },
  {
    title: "정책 및 이용 약관",
    desc: "서비스 이용, 개인정보, 저작권 관련 안내",
    icon: FileText,
  },
  {
    title: "커뮤니티 연결",
    desc: "다른 크리에이터와 작업 노하우를 공유",
    icon: MessageCircle,
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return FAQS;
    return FAQS.filter((faq) =>
      `${faq.question} ${faq.answer}`.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-76px)] bg-bg-dark font-sans text-text-primary">
      <div className="relative overflow-hidden border-b border-[#1F2329] bg-[#0A0B0D]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E0A12E]/5 to-transparent" />
        <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-4 py-12 text-center sm:px-6 2xl:px-8 min-[2200px]:px-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E0A12E]/30 bg-[#E0A12E]/10 px-3 py-1.5 text-[14px] font-medium text-[#E0A12E]">
            <HelpCircle className="h-3.5 w-3.5" />
            고객 지원 센터
          </div>
          <h1 className="mb-4 text-[32px] font-bold text-white sm:text-[32px]">
            무엇을 도와드릴까요?
          </h1>
          <p className="mb-10 max-w-[600px] text-[15px] leading-relaxed text-neutral-400 sm:text-[17px]">
            NeoPoly 사용 중 궁금한 점을 검색하거나 1:1 문의를 남길 수 있습니다.
          </p>

          <div className="group relative mt-2 w-full max-w-[640px] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 transition group-focus-within:text-[#E0A12E]" />
            <input
              type="text"
              placeholder="예: 크레딧, 환불, 저작권"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 w-full rounded-lg border border-[#2A2E36] bg-[#141518] pl-14 pr-6 text-[15px] text-white outline-none transition placeholder:text-neutral-500 focus:border-[#E0A12E]/60"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 2xl:px-8 min-[2200px]:px-10">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="flex-1">
            <div className="mb-10">
              <h2 className="mb-2 text-[24px] font-bold text-white">
                자주 묻는 질문
              </h2>
              <p className="text-[14px] text-neutral-400">
                검색어에 맞는 답변만 자동으로 정리됩니다.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D] transition hover:border-[#3A404F]"
                >
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-medium">
                      <span className="pr-8 text-[15px] font-medium leading-snug text-white transition group-hover:text-[#E0A12E]">
                        {faq.question}
                      </span>
                      <span className="shrink-0 text-neutral-400 transition group-open:rotate-180">
                        <ChevronDown className="h-5 w-5" />
                      </span>
                    </summary>
                    <div className="border-t border-[#1F2329]/50 px-6 pb-6 pt-4 text-[15px] leading-[1.6] text-neutral-300">
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="rounded-lg border border-[#1F2329] bg-[#0A0B0D] p-8 text-center text-[14px] text-neutral-400">
                  검색 결과가 없습니다. 1:1 문의로 내용을 보내주세요.
                </div>
              )}
            </div>

            <div className="relative mt-10 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-lg border border-[#2A2E36] bg-[#0A0B0D] p-6 sm:flex-row">
              <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-[#E0A12E]/5 blur-[80px]" />
              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="text-[15px] font-medium text-white">
                  원하는 답을 찾지 못했나요?
                </h3>
                <p className="text-[14px] text-neutral-400">
                  문의 내용을 남기면 지원 요청으로 저장됩니다.
                </p>
              </div>
              <button
                onClick={() => setContactOpen(true)}
                className="relative z-10 whitespace-nowrap rounded-lg border border-[#2A2E36] bg-[#141518] px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#1C1F26]"
              >
                1:1 문의 접수하기
              </button>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[360px]">
            <div className="mb-4">
              <h2 className="mb-2 text-[24px] font-bold text-white">
                가이드 및 리소스
              </h2>
              <p className="text-[14px] text-neutral-400">
                필요한 문서를 바로 열어 확인하세요.
              </p>
            </div>

            {GUIDES.map((guide) => {
              const Icon = guide.icon;
              return (
                <button
                  key={guide.title}
                  onClick={() => {
                    setSelectedGuide(guide.title);
                    setToast(`${guide.title}를 열었습니다.`);
                  }}
                  className="group flex items-start gap-4 rounded-lg border border-[#1F2329] bg-[#0A0B0D] p-5 text-left transition hover:border-[#E0A12E]/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#141518] transition group-hover:border-[#E0A12E]/30 group-hover:bg-[#E0A12E]/10">
                    <Icon className="h-5 w-5 text-neutral-400 transition group-hover:text-[#E0A12E]" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 text-[15px] font-medium text-white transition group-hover:text-[#E0A12E]">
                      {guide.title}
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
                    </span>
                    <span className="text-[15px] leading-[1.6] text-neutral-300">
                      {guide.desc}
                    </span>
                  </span>
                </button>
              );
            })}

            {selectedGuide && (
              <div className="rounded-lg border border-[#2A2E36] bg-[#111215] p-5">
                <h3 className="mb-2 text-[15px] font-medium text-white">
                  {selectedGuide}
                </h3>
                <p className="text-[15px] leading-[1.6] text-neutral-300">
                  현재는 앱 내부 도움말로 연결됩니다. 실제 배포 시 문서 URL을 붙이면 같은 버튼에서 바로 열립니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {contactOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#050505]/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[520px] rounded-lg border border-[#2A2E36] bg-[#0A0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-[#1F2329] px-6 py-5">
              <h3 className="text-[18px] font-semibold text-white">1:1 문의 접수</h3>
              <button
                onClick={() => setContactOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <input
                placeholder="제목"
                className="h-11 rounded-lg border border-[#2A2E36] bg-[#141518] px-4 text-white outline-none placeholder:text-neutral-500 focus:border-[#E0A12E]/60"
              />
              <textarea
                placeholder="문의 내용을 적어주세요."
                className="h-36 resize-none rounded-lg border border-[#2A2E36] bg-[#141518] px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-[#E0A12E]/60"
              />
              <button
                onClick={() => {
                  setContactOpen(false);
                  setToast("문의가 접수되었습니다.");
                }}
                className="rounded-lg bg-[#E0A12E] px-5 py-3 text-[14px] font-medium text-[#050505] transition hover:bg-[#F0B43A]"
              >
                문의 보내기
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-[150] rounded-lg border border-[#2A2E36] bg-[#111317] px-4 py-3 text-[14px] font-medium text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {toast}
        </div>
      )}

      <ChatbotWidget />
    </div>
  );
}
