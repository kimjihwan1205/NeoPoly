import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, BotMessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      content: '안녕하세요! NeoPoly 지원 도우미입니다. 무엇을 도와드릴까요? (지원 페이지 구성, AI 스튜디오 사용법 등 질문해주세요!)'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      let botContent = '현재 해당 기능은 준비 중에 있습니다. 궁금하신 내용을 상세한 문의로 남겨주시면 확인 후 답변드리겠습니다. 😊';
      
      if (inputValue.includes('지원') || inputValue.includes('support') || inputValue.includes('어떤 내용')) {
        botContent = `**[NeoPoly 지원 페이지 구성 제안]**

지원 페이지(Support)에는 다음 내용들이 포함되면 좋습니다:

1. **시작하기 가이드 (Getting Started)**: 새 사용자를 위한 온보딩 및 첫 AI 이미지 생성 튜토리얼
2. **자주 묻는 질문 (FAQ)**: 결제, 저작권, 크레딧, AI 생성 팁 등
3. **학습 및 팁 (커뮤니티/포럼)**: 프롬프트 작성 꿀팁이나 레퍼런스 활용법
4. **1:1 문의 및 버그 제보**: 사용자가 직접 질문할 수 있는 티켓 시스템이나 라이브 챗
5. **공지사항 및 업데이트 내역**: 서비스의 최신 버전(v1.2 등) 변경 사항

이 외에도 **'챗봇 도우미'**를 지원 페이지 우측 하단에 배치하여 실시간 안내를 돕는 것도 좋은 방법이에요! 구성하실 때 참고해보세요.`;
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botContent
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-brand-primary/60 bg-[#141518] text-brand-primary shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all hover:scale-110 hover:border-brand-primary hover:bg-[#1A1C21] sm:bottom-6 sm:right-6 sm:h-[52px] sm:w-[52px] lg:bottom-10 lg:right-10 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="AI 도우미 열기"
      >
        <BotMessageSquare className="w-6 h-6 stroke-[1.5px]" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed inset-x-3 bottom-3 z-[110] flex h-[min(620px,calc(100dvh-84px))] flex-col overflow-hidden rounded-2xl border border-[#2A2E36] bg-[#0A0B0D] shadow-[0_12px_40px_rgba(0,0,0,0.8)] transition-all duration-300 origin-bottom-right sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[520px] sm:w-[360px] lg:bottom-10 lg:right-10 ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-[#141518] border-b border-[#1F2329] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center border border-brand-primary/30 shadow-[0_0_12px_rgba(224,161,46,0.2)]">
              <BotMessageSquare className="w-4 h-4 text-[#050505]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white leading-none mb-1">AI 도우미</h3>
              <p className="text-[11px] font-medium text-brand-primary">온라인</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-[#2A2E36] hover:text-white sm:h-8 sm:w-8"
              aria-label="AI 도우미 닫기"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-bg-dark">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-[#141518] border border-[#2A2E36] shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-brand-primary" />
                </div>
              )}
              <div 
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-brand-primary text-[#050505] rounded-tr-sm font-medium'
                    : 'bg-[#141518] border border-[#2A2E36] text-text-primary rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#141518] border-t border-[#1F2329] shrink-0">
          <div className="flex items-center gap-2 bg-[#0A0B0D] border border-[#2A2E36] rounded-xl p-1.5 focus-within:border-brand-primary/50 transition-colors">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-transparent border-none text-[13px] text-white focus:outline-none px-3 py-2 placeholder:text-neutral-500"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-[#050505] transition-opacity disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-8"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
