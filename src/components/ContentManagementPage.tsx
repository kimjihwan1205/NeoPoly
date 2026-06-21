import React, { useMemo, useState } from 'react';
import { 
  Search, Filter, ChevronDown, LayoutGrid, List, Plus, 
  MoreHorizontal, Eye, Heart, ShoppingCart, Bookmark,
  CreditCard, Settings, HelpCircle, AlertCircle, Clock,
  CheckCircle2, X, Edit, Lock, Trash2, ArrowUpRight, Check, Image as ImageIcon, Box,
  BarChart3, TrendingUp, WalletCards
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  applyPricing,
  calculateRevenueSummary,
  formatCompactWon,
  parseWon,
} from '../contentManagement';

// Types
interface Stats {
  views: string | number;
  likes: string | number;
  saves: string | number;
  sales?: string | number;
  revenue?: string;
}

interface ContentItem {
  id: string;
  type: 'MARKET' | 'ART';
  status: '판매 중' | '공개 중' | '심사 중' | '수정 필요';
  title: string;
  category: string;
  tags: string[];
  price?: number;
  originalPrice?: number;
  saleEnabled?: boolean;
  isFree?: boolean;
  stats: Stats;
  image: string;
  createdAt: string;
  updatedAt: string;
  reviewDate?: string;
  reviewStatus?: string;
}

// Dummy Data matching screenshot
const ITEMS: ContentItem[] = [
  {
    id: '1',
    type: 'MARKET',
    status: '판매 중',
    title: '백색 기사',
    category: '캐릭터 · 판타지',
    tags: ['오크', '전사', '갑옷', '판타지'],
    price: 75000,
    stats: { views: '1,284', likes: 243, saves: 67, sales: 38, revenue: '₩285,000' },
    image: '/images/work_50.png',
    createdAt: '2024.05.20',
    updatedAt: '2024.05.24',
    reviewDate: '2024.05.21',
    reviewStatus: '기준을 충족하여 승인되었습니다.',
  },
  {
    id: '2',
    type: 'ART',
    status: '공개 중',
    title: '판타지 공중 도시',
    category: '환경 · 판타지',
    tags: ['성', '다크판타지', '배경', '밤'],
    isFree: true,
    stats: { views: '2,341', likes: 412, saves: 128 },
    image: '/images/work_51.png',
    createdAt: '2024.05.21',
    updatedAt: '2024.05.21',
  },
  {
    id: '3',
    type: 'MARKET',
    status: '심사 중',
    title: '현대 도시 빌딩',
    category: '캐릭터 · 판타지',
    tags: ['엘프', '궁수', '초안'],
    price: 45000,
    stats: { views: '856', likes: 176, saves: 42, sales: 12, revenue: '₩78,000' },
    image: '/images/work_52.png',
    createdAt: '2024.05.22',
    updatedAt: '2024.05.22',
  },
  {
    id: '4',
    type: 'ART',
    status: '수정 필요',
    title: '드래곤 전투',
    category: '환경 · 역사',
    tags: ['고대', '유적', '스케치'],
    isFree: true,
    stats: { views: '643', likes: 98, saves: 34 },
    image: '/images/work_53.png',
    createdAt: '2024.05.18',
    updatedAt: '2024.05.19',
    reviewStatus: '이미지 해상도가 기준치 미달입니다.',
  },
  {
    id: '5',
    type: 'MARKET',
    status: '판매 중',
    title: '사이버 사무라이',
    category: '기계 · 스팀펑크',
    tags: ['메카닉', '스팀펑크', '로봇'],
    price: 120000,
    stats: { views: '1,102', likes: 231, saves: 54, sales: 26, revenue: '₩312,000' },
    image: '/images/work_54.png',
    createdAt: '2024.05.10',
    updatedAt: '2024.05.20',
  },
  {
    id: '6',
    type: 'ART',
    status: '공개 중',
    title: '엘프궁수',
    category: '일러스트 · 판타지',
    tags: ['마법사', '다크', '캐릭터'],
    isFree: true,
    stats: { views: '1,567', likes: 301, saves: 89 },
    image: '/images/work_%201.png',
    createdAt: '2024.05.12',
    updatedAt: '2024.05.15',
  },
  {
    id: '7',
    type: 'MARKET',
    status: '판매 중',
    title: '오크',
    category: '무기 · 판타지',
    tags: ['드워프', '무기', '해머'],
    price: 35000,
    stats: { views: '789', likes: 142, saves: 31, sales: 15, revenue: '₩52,500' },
    image: '/images/work_%202.png',
    createdAt: '2024.05.08',
    updatedAt: '2024.05.11',
  },
  {
    id: '8',
    type: 'ART',
    status: '공개 중',
    title: '와이번',
    category: '환경 · 판타지',
    tags: ['사막', '마을', '전경'],
    isFree: true,
    stats: { views: '1,036', likes: 210, saves: 64 },
    image: '/images/work_%203.png',
    createdAt: '2024.05.05',
    updatedAt: '2024.05.05',
  }
];

export default function ContentManagementPage() {
  const [items, setItems] = useState<ContentItem[]>(ITEMS);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(ITEMS[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeSection, setActiveSection] = useState<'content' | 'revenue'>('content');
  const [pricingItem, setPricingItem] = useState<ContentItem | null>(null);
  const [originalPriceDraft, setOriginalPriceDraft] = useState(0);
  const [discountPriceDraft, setDiscountPriceDraft] = useState(0);
  const [saleEnabledDraft, setSaleEnabledDraft] = useState(false);

  const revenueRows = useMemo(
    () =>
      items
        .filter((item) => item.type === 'MARKET')
        .map((item) => ({
          item,
          sales: Number(item.stats.sales) || 0,
          revenue: parseWon(item.stats.revenue),
        })),
    [items],
  );
  const revenueSummary = useMemo(
    () => calculateRevenueSummary(revenueRows),
    [revenueRows],
  );

  const openPriceEditor = (item: ContentItem) => {
    const originalPrice = item.originalPrice ?? item.price ?? 0;
    setPricingItem(item);
    setOriginalPriceDraft(originalPrice);
    setDiscountPriceDraft(item.saleEnabled ? item.price ?? 0 : originalPrice);
    setSaleEnabledDraft(Boolean(item.saleEnabled));
  };

  const savePricing = () => {
    if (!pricingItem) return;
    const pricing = applyPricing(
      originalPriceDraft,
      discountPriceDraft,
      saleEnabledDraft,
    );
    const updatedItem = {
      ...pricingItem,
      ...pricing,
      isFree: false,
    };
    setItems((current) =>
      current.map((item) => item.id === updatedItem.id ? updatedItem : item),
    );
    setSelectedItem((current) =>
      current?.id === updatedItem.id ? updatedItem : current,
    );
    setPricingItem(null);
  };

  return (
    <div className="flex h-[calc(100vh-76px)] overflow-hidden bg-[#0A0B0D] font-sans text-text-primary w-full">
      
      {/* Left Sidebar Menu */}
      <aside className="hidden lg:flex w-[300px] shrink-0 border-r border-[#1C1E24] bg-[#050505] flex-col h-full z-10 custom-scrollbar overflow-y-auto">
        <div className="p-6">
          <h2 className="text-[18px] font-semibold text-white tracking-tight">콘텐츠 관리</h2>
          <p className="text-[14px] text-text-secondary mt-2 mb-6">마켓과 아트에 업로드한 작업물을 확인합니다.</p>
          <button className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl border border-[#3A404F]/60 bg-[#15161A] hover:bg-[#22252B] hover:border-[#E0A12E]/50 text-[#E0A12E] shadow-sm transition-all font-medium text-[15px] tracking-wide">
            <Plus className="w-[18px] h-[18px]" />
            <span>새 콘텐츠 업로드</span>
          </button>
        </div>

        <nav className="px-3 space-y-1 mb-6">
          <button
            onClick={() => setActiveSection('content')}
            className={`flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-[15px] transition-colors ${
              activeSection === 'content' ? 'bg-[#15161A] text-white' : 'text-text-secondary hover:text-white hover:bg-[#111215]'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-[18px] h-[18px] text-[#E0A12E]" />
              <span className="tracking-tight">전체 콘텐츠</span>
            </div>
            <span className="text-[14px] font-sans text-text-secondary">42</span>
          </button>
          <button className="flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-lg text-text-secondary hover:text-white hover:bg-[#111215] font-medium text-[15px] transition-colors text-left border border-transparent">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-[18px] h-[18px] text-neutral-400" />
              <span className="tracking-tight">마켓 상품</span>
            </div>
            <span className="text-[14px] font-sans text-text-secondary">18</span>
          </button>
          <button className="flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-lg text-text-secondary hover:text-white hover:bg-[#111215] font-medium text-[15px] transition-colors text-left border border-transparent">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-[18px] h-[18px] text-neutral-400" />
              <span className="tracking-tight">아트 게시물</span>
            </div>
            <span className="text-[14px] font-sans text-text-secondary">16</span>
          </button>
        </nav>

        <div className="px-4 mb-6">
          <div className="h-px bg-[#1C1E24] w-full mb-3"></div>
          <ul className="space-y-1">
            {[
              { label: '판매 중', count: 18, active: false, icon: CheckCircle2 },
              { label: '공개 중', count: 16, active: false, icon: Eye },
              { label: '심사 중', count: 3, active: false, icon: Clock },
              { label: '수정 필요', count: 2, active: false, icon: AlertCircle },
              { label: '임시 저장', count: 1, active: false, icon: Bookmark },
              { label: '비공개', count: 2, active: false, icon: Lock },
              { label: '삭제됨', count: 0, active: false, icon: Trash2 },
            ].map((item, idx) => (
              <li key={idx}>
                <button className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium tracking-tight transition-colors border border-transparent ${item.active ? 'bg-[#15161A] text-white' : 'text-text-secondary hover:text-white hover:bg-[#111215]'}`}>
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-[18px] h-[18px] ${item.active ? 'text-[#E0A12E]' : 'text-neutral-400'}`} />
                    {item.label}
                  </div>
                  <span className="text-[14px] font-sans text-neutral-500">{item.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4 mt-auto mb-6">
          <div className="h-px bg-[#1C1E24] w-full mb-3"></div>
          <nav className="space-y-1 mb-6">
            <button
              onClick={() => {
                setActiveSection('revenue');
                setSelectedItem(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium tracking-tight transition-colors border border-transparent ${
                activeSection === 'revenue' ? 'bg-[#15161A] text-white' : 'text-text-secondary hover:text-white hover:bg-[#111215]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className={`w-[18px] h-[18px] ${activeSection === 'revenue' ? 'text-[#E0A12E]' : 'text-neutral-400'}`} />
                수익 관리
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium tracking-tight text-text-secondary hover:text-white hover:bg-[#111215] transition-colors border border-transparent">
              <div className="flex items-center gap-3">
                <Settings className="w-[18px] h-[18px] text-neutral-400" /> 
                판매자 설정
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium tracking-tight text-text-secondary hover:text-white hover:bg-[#111215] transition-colors border border-transparent">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-[18px] h-[18px] text-neutral-400" /> 
                업로드 가이드
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0A0B0D] relative flex flex-col">
        <div className="px-4 py-6 sm:px-6 2xl:px-8 min-[2200px]:px-10 w-full flex-1">
          {activeSection === 'revenue' ? (
            <div className="mx-auto w-full max-w-[1500px]">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h1 className="text-[28px] font-bold text-white">수익 관리</h1>
                  <p className="mt-2 text-[14px] text-neutral-400">판매 중인 콘텐츠의 매출 흐름을 확인합니다.</p>
                </div>
                <FilterSelect label="2026년 6월" width="w-[150px]" />
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
                <MonthlyRevenueCard
                  value={revenueSummary.totalRevenue}
                  sales={revenueSummary.totalSales}
                />
                <div className="grid grid-cols-2 gap-4">
                  <RevenueMetric
                    icon={<ShoppingCart className="h-5 w-5" />}
                    label="판매 건수"
                    value={`${revenueSummary.totalSales}건`}
                  />
                  <RevenueMetric
                    icon={<WalletCards className="h-5 w-5" />}
                    label="평균 결제액"
                    value={formatCompactWon(revenueSummary.averageOrderValue)}
                  />
                </div>
              </div>

              <section className="mt-6 overflow-hidden rounded-xl border border-[#1C1E24] bg-[#0A0B0D]">
                <div className="flex items-center justify-between border-b border-[#1C1E24] px-5 py-4">
                  <h2 className="text-[18px] font-medium text-white">작품별 수익</h2>
                  <span className="text-[14px] text-neutral-500">최근 30일</span>
                </div>
                <div className="divide-y divide-[#1C1E24]">
                  {revenueRows
                    .slice()
                    .sort((a, b) => b.revenue - a.revenue)
                    .map(({ item, sales, revenue }) => (
                      <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_90px_130px] items-center gap-4 px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <img src={item.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-medium text-white">{item.title}</p>
                            <p className="mt-1 text-[14px] text-neutral-500">
                              {item.saleEnabled && item.originalPrice
                                ? `할인가 ₩${item.price?.toLocaleString()}`
                                : `₩${item.price?.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-right text-[14px] text-neutral-400">{sales}건</span>
                        <span className="text-right text-[16px] font-medium text-[#E0A12E]">{formatCompactWon(revenue)}</span>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          ) : (
          <>
          <MonthlyRevenueCard
            value={revenueSummary.totalRevenue}
            sales={revenueSummary.totalSales}
            compact
          />

          <div className="mb-8 mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <StatCard icon={<Box className="w-5 h-5 text-neutral-400" />} title="전체 업로드" value="42" desc="전체 작품 수" />
            <StatCard icon={<ShoppingCart className="w-5 h-5 text-neutral-400" />} title="판매 중" value="18" desc="마켓 판매 중" />
            <StatCard icon={<ImageIcon className="w-5 h-5 text-neutral-400" />} title="아트 공개" value="16" desc="아트 공개 중" />
            <StatCard icon={<Clock className="w-5 h-5 text-[#E0A12E]" />} title="심사 중" value="3" desc="검토 대기 중" />
            <StatCard icon={<AlertCircle className="w-5 h-5 text-[#E46B6B]" />} title="수정 필요" value="2" desc="수정 요청" />
          </div>

          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="콘텐츠 제목, 태그 검색" 
                  className="bg-[#111215] border border-[#2A2E36] rounded-lg pl-9 pr-4 py-2 text-[14px] text-white focus:outline-none focus:border-brand-primary/50 transition-colors w-full sm:w-[220px]"
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 sm:pb-0">
                <FilterSelect label="유형 전체" />
                <FilterSelect label="상태 전체" />
                <FilterSelect label="카테고리 전체" />
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <FilterSelect label="최근 수정순" />
              <div className="flex items-center bg-[#111215] border border-[#2A2E36] rounded-lg p-1 gap-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#E0A12E]/20 text-[#E0A12E]' : 'text-text-secondary hover:text-white'}`}
                >
                  <LayoutGrid className="w-[18px] h-[18px]" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-[#E0A12E]/20 text-[#E0A12E]' : 'text-text-secondary hover:text-white'}`}
                >
                  <List className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid/List Area */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 pb-12">
              {items.slice(0, 8).map((item) => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  isSelected={selectedItem?.id === item.id} 
                  onClick={() => setSelectedItem(item)} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-12">
              {items.slice(0, 8).map((item) => (
                <ContentListRow
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
          
          {/* Pagination Area */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-20 border-t border-[#1C1E24] pt-6">
            <span className="text-[14px] text-text-secondary font-medium shrink-0">총 42개 항목</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#111215] border border-[#2A2E36] text-text-secondary hover:text-white transition-colors">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#E0A12E] border border-[#E0A12E] text-black font-medium text-[14px]">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#111215] text-text-secondary hover:text-white transition-colors font-medium text-[14px]">2</button>
              <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#111215] text-text-secondary hover:text-white transition-colors font-medium text-[14px]">3</button>
              <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#111215] text-text-secondary hover:text-white transition-colors font-medium text-[14px]">4</button>
              <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#111215] text-text-secondary hover:text-white transition-colors font-medium text-[14px]">5</button>
              <span className="text-text-secondary px-1 sm:px-2">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#111215] text-text-secondary hover:text-white transition-colors font-medium text-[14px]">9</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#111215] border border-[#2A2E36] text-text-secondary hover:text-white transition-colors">&gt;</button>
            </div>
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <FilterSelect label="8개씩 보기" width="w-[120px]" />
            </div>
          </div>
          </>
          )}
        </div>
      </main>

      {/* Detail Sidebar */}
      <AnimatePresence>
        {selectedItem && activeSection === 'content' && (
          <motion.aside
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 md:relative md:inset-auto w-full md:w-[380px] shrink-0 bg-[#0A0B0D] border-l border-[#1C1E24] shadow-[0_0_50px_rgba(0,0,0,0.8)] md:shadow-2xl flex flex-col z-30 md:z-20"
          >
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-transparent rounded-lg text-neutral-400 hover:text-white hover:bg-[#111215] transition-colors z-30"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 pt-4 mt-8">
              {/* Header Box */}
              <div className="relative aspect-auto px-5 pb-0">
                 <div className="relative rounded-lg overflow-hidden border border-[#1C1E24]">
                   {selectedItem.type === 'MARKET' ? (
                     <span className="absolute top-3 right-3 h-7 min-w-7 px-1 flex items-center justify-center bg-[#0A0B0D]/80 backdrop-blur border border-[#E0A12E] text-[#E0A12E] text-[14px] font-medium rounded shadow-sm z-10">M</span>
                   ) : (
                     <span className="absolute top-3 right-3 h-7 min-w-7 px-1 flex items-center justify-center bg-[#0A0B0D]/80 backdrop-blur border border-[#4A90E2] text-[#4A90E2] text-[14px] font-medium rounded shadow-sm z-10">A</span>
                   )}
                   {selectedItem.image ? (
                     <img referrerPolicy="no-referrer" src={selectedItem.image} alt={selectedItem.title} className="w-full aspect-[4/3] object-cover" />
                   ) : (
                     <div className="w-full aspect-[4/3] bg-[#111215] flex flex-col items-center justify-center text-neutral-400">
                       <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                       <span className="text-[14px] font-medium">이미지 없음</span>
                     </div>
                   )}
                 </div>
              </div>

              {/* Title & Status */}
              <div className="px-5 py-5 border-b border-[#1C1E24]">
                <h2 className="text-[20px] font-bold text-white mb-2 tracking-tight">{selectedItem.title}</h2>
                <div className="flex items-center gap-2 text-[14px]">
                  <span className="text-neutral-400">{selectedItem.type === 'MARKET' ? 'Market 상품' : 'Art 게시물'}</span>
                  <span className="text-neutral-400">·</span>
                  <span className={selectedItem.status === '판매 중' || selectedItem.status === '공개 중' ? 'text-[#4ADE80]' : selectedItem.status === '수정 필요' ? 'text-[#E46B6B]' : 'text-[#F97316]'}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              {/* Performance */}
              <div className="p-5 border-b border-[#1C1E24]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-medium text-text-primary tracking-tight">성과 요약</h3>
                  <span className="text-[14px] text-neutral-500">최근 30일 기준</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <StatMini icon={<Eye className="w-4 h-4" />} label="조회수" value={selectedItem.stats.views} />
                  <StatMini icon={<Heart className="w-4 h-4" />} label="좋아요" value={selectedItem.stats.likes} />
                  <StatMini icon={<Bookmark className="w-4 h-4" />} label="저장" value={selectedItem.stats.saves} />
                  <StatMini icon={<ShoppingCart className="w-4 h-4" />} label="판매수" value={selectedItem.stats.sales || '-'} />
                  <StatMini icon={<CreditCard className="w-4 h-4" />} label="수익" value={selectedItem.stats.revenue || '-'} isRevenue />
                </div>
              </div>

              {/* Meta Info */}
              <div className="p-5 border-b border-[#1C1E24]">
                <h3 className="text-[14px] font-medium text-text-primary tracking-tight mb-4">등록 정보</h3>
                <div className="space-y-3">
                  <MetaRow label="카테고리" value={selectedItem.category.replace('·', '>')} />
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[14px] text-neutral-400 font-medium shrink-0 pt-0.5 w-[80px]">태그</span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {selectedItem.tags.map(tag => (
                        <span key={tag} className="text-[14px] bg-[#1A1C20] border border-[#2A2E36] text-neutral-300 px-2 py-0.5 rounded font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[14px] font-medium text-neutral-400">가격</span>
                    <PriceDisplay item={selectedItem} align="right" />
                  </div>
                  <MetaRow label="라이선스" value="Standard License" hasInfo />
                  <MetaRow label="등록일" value={selectedItem.createdAt} />
                  <MetaRow label="수정일" value={selectedItem.updatedAt} />
                </div>
              </div>

              {/* Review Status */}
              {selectedItem.reviewStatus && (
                <div className="p-5">
                  <h3 className="text-[14px] font-medium text-text-primary tracking-tight mb-4">심사 상태</h3>
                  <div className={`p-4 rounded-lg border ${selectedItem.status === '수정 필요' ? 'bg-[#E46B6B]/10 border-[#E46B6B]/20' : 'bg-[#4ADE80]/10 border-[#4ADE80]/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedItem.status === '수정 필요' ? (
                        <AlertCircle className="w-4 h-4 text-[#E46B6B]" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                      )}
                      <span className={`text-[14px] font-medium ${selectedItem.status === '수정 필요' ? 'text-[#E46B6B]' : 'text-[#4ADE80]'}`}>
                        {selectedItem.status === '수정 필요' ? '수정 요청됨' : '승인됨'} {selectedItem.reviewDate && <span className="font-sans font-medium ml-1.5 opacity-80">{selectedItem.reviewDate} {selectedItem.status === '수정 필요' ? '요청' : '승인'}</span>}
                      </span>
                    </div>
                    <p className={`text-[14px] leading-relaxed ${selectedItem.status === '수정 필요' ? 'text-white/80' : 'text-white/70'}`}>
                      {selectedItem.reviewStatus}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0A0B0D]/95 backdrop-blur border-t border-[#1C1E24] flex flex-col gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
               <div className="grid grid-cols-2 gap-2">
                 <button className="py-2.5 flex items-center justify-center gap-2 text-[14px] font-medium text-[#E0A12E] bg-transparent border border-[#E0A12E] hover:bg-[#E0A12E]/10 rounded-lg transition-colors">
                   상세 보기 <ArrowUpRight className="w-3.5 h-3.5" />
                 </button>
                 <button className="py-2.5 flex items-center justify-center gap-2 text-[14px] font-medium text-[#0A0B0D] bg-[#E0A12E] hover:bg-[#F0B43A] rounded-lg transition-colors shadow-md">
                   <Edit className="w-3.5 h-3.5" /> 수정하기
                 </button>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 <button
                   disabled={selectedItem.type !== 'MARKET'}
                   onClick={() => openPriceEditor(selectedItem)}
                   className="py-2.5 flex items-center justify-center gap-2 text-[14px] font-medium text-neutral-300 bg-transparent border border-[#2A2E36] hover:bg-[#15161A] hover:text-white rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                 >
                   가격 수정
                 </button>
                 <button className="py-2.5 flex items-center justify-center gap-2 text-[14px] font-medium text-neutral-300 bg-transparent border border-[#2A2E36] hover:bg-[#15161A] hover:text-white rounded-lg transition-colors">
                   <Lock className="w-3.5 h-3.5" /> 비공개 전환
                 </button>
               </div>
               <button className="w-full mt-1 py-2.5 flex items-center justify-center gap-2 text-[14px] font-medium text-[#E46B6B] bg-transparent border border-[#E46B6B]/30 hover:bg-[#E46B6B]/10 hover:border-[#E46B6B] rounded-lg transition-colors">
                 <Trash2 className="w-3.5 h-3.5" /> 삭제
               </button>
            </div>

          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pricingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setPricingItem(null)}
            className="fixed inset-0 z-[180] flex items-center justify-center bg-black/60 p-5 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onMouseDown={(event) => event.stopPropagation()}
              className="w-full max-w-[520px] overflow-hidden rounded-xl border border-[#2A2E36] bg-[#0A0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.72)]"
            >
              <div className="flex h-16 items-center justify-between border-b border-[#1F2329] px-5">
                <div>
                  <h2 className="text-[18px] font-medium text-white">판매 가격 설정</h2>
                  <p className="mt-0.5 text-[14px] text-neutral-500">{pricingItem.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPricingItem(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="가격 설정 닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <label className="block">
                  <span className="text-[14px] font-medium text-neutral-300">판매 가격</span>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-neutral-500">₩</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={originalPriceDraft}
                      onChange={(event) => setOriginalPriceDraft(Number(event.target.value))}
                      className="h-12 w-full rounded-lg border border-[#2A2E36] bg-[#111317] pl-9 pr-4 text-[15px] text-white outline-none transition focus:border-[#E0A12E]"
                    />
                  </div>
                </label>

                <div className="flex items-center justify-between rounded-lg border border-[#1F2329] bg-[#111317] p-4">
                  <div>
                    <p className="text-[15px] font-medium text-white">할인 가격 사용</p>
                    <p className="mt-1 text-[14px] text-neutral-500">판매 가격보다 낮을 때 적용됩니다.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={saleEnabledDraft}
                    onClick={() => setSaleEnabledDraft((current) => !current)}
                    className={`relative h-6 w-11 rounded-full transition ${saleEnabledDraft ? 'bg-[#E0A12E]' : 'bg-[#2A2E36]'}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${saleEnabledDraft ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {saleEnabledDraft && (
                  <label className="block">
                    <span className="text-[14px] font-medium text-neutral-300">할인 가격</span>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-neutral-500">₩</span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={discountPriceDraft}
                        onChange={(event) => setDiscountPriceDraft(Number(event.target.value))}
                        className="h-12 w-full rounded-lg border border-[#2A2E36] bg-[#111317] pl-9 pr-4 text-[15px] text-white outline-none transition focus:border-[#E0A12E]"
                      />
                    </div>
                  </label>
                )}

                <div className="flex items-center justify-between border-t border-[#1F2329] pt-4">
                  <span className="text-[14px] text-neutral-400">최종 표시 가격</span>
                  <span className="text-[20px] font-medium text-[#E0A12E]">
                    {formatCompactWon(
                      applyPricing(originalPriceDraft, discountPriceDraft, saleEnabledDraft).price,
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#1F2329] p-5">
                <button
                  type="button"
                  onClick={() => setPricingItem(null)}
                  className="h-11 rounded-lg border border-[#2A2E36] px-4 text-[14px] font-medium text-neutral-300 transition hover:bg-white/5"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={savePricing}
                  className="h-11 rounded-lg bg-[#E0A12E] px-5 text-[14px] font-medium text-black transition hover:bg-[#F0B43A]"
                >
                  가격 저장
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MonthlyRevenueCard({ value, sales, compact = false }: { value: number, sales: number, compact?: boolean }) {
  return (
    <section className={`min-w-0 overflow-hidden rounded-xl border border-[#E0A12E]/25 bg-[#E0A12E]/[0.06] ${compact ? 'px-5 py-4' : 'p-6'}`}>
      <div className={`flex ${compact ? 'items-center justify-between gap-5' : 'h-full flex-col justify-between'}`}>
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-5 w-5 shrink-0 text-[#E0A12E]" />
          <span className="text-[14px] font-medium text-neutral-300">이번 달 수익</span>
        </div>
        <div className={compact ? 'min-w-0 text-right' : 'mt-8'}>
          <p className={`max-w-full truncate font-medium tracking-tight text-[#E0A12E] ${compact ? 'text-[clamp(22px,2vw,30px)]' : 'text-[clamp(30px,4vw,48px)]'}`}>
            {formatCompactWon(value)}
          </p>
          <p className="mt-1 text-[14px] text-neutral-400">{sales}건 판매 · 전월 대비 +24%</p>
        </div>
      </div>
    </section>
  );
}

function RevenueMetric({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#1C1E24] bg-[#111215] p-5">
      <div className="flex items-center gap-2 text-neutral-400">
        {icon}
        <span className="text-[14px] font-medium">{label}</span>
      </div>
      <p className="mt-5 truncate text-[clamp(20px,2vw,28px)] font-medium text-white">{value}</p>
    </div>
  );
}

function StatCard({ icon, title, value, desc, highlight = false }: { icon: React.ReactNode, title: string, value: string, desc: string, highlight?: boolean }) {
  return (
    <div className={`p-5 rounded-xl border ${highlight ? 'bg-[#E0A12E]/5 border-[#E0A12E]/20' : 'bg-[#111215] border-[#1C1E24]'} flex flex-col justify-between min-h-[120px]`}>
      <div className="flex items-center gap-2.5 mb-3">
        {icon}
        <span className="text-[14px] font-medium text-text-secondary tracking-tight">{title}</span>
      </div>
      <div>
        <div className={`text-[24px] font-bold font-sans tracking-tight leading-none mb-1.5 ${highlight ? 'text-[#E0A12E]' : 'text-white'}`}>{value}</div>
        <div className={`text-[14px] ${highlight ? 'text-[#E0A12E]/80' : 'text-neutral-400'}`}>{desc}</div>
      </div>
    </div>
  )
}

function FilterSelect({ label, width = 'w-[140px]' }: { label: string, width?: string }) {
  return (
    <button className={`flex items-center justify-between px-3 py-2 bg-[#111215] border border-[#2A2E36] hover:bg-[#15161A] rounded-lg text-[14px] text-neutral-300 transition-colors ${width}`}>
      <span>{label}</span>
      <ChevronDown className="w-4 h-4 text-neutral-400" />
    </button>
  )
}

const ContentCard: React.FC<{ item: ContentItem, isSelected: boolean, onClick: () => void }> = ({ item, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#0A0B0D] border rounded-xl overflow-hidden flex flex-col group cursor-pointer transition-all duration-200 ${isSelected ? 'border-[#E0A12E] shadow-[0_0_15px_rgba(224,161,46,0.15)] ring-1 ring-[#E0A12E]' : 'border-[#1C1E24] hover:border-[#3A404F]'}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#111215] overflow-hidden">
        {item.type === 'MARKET' ? (
          <span className="absolute top-3 right-3 h-7 min-w-7 px-1 flex items-center justify-center bg-[#0A0B0D]/80 backdrop-blur border border-[#E0A12E] text-[#E0A12E] text-[14px] font-medium rounded shadow-sm z-10">M</span>
        ) : (
          <span className="absolute top-3 right-3 h-7 min-w-7 px-1 flex items-center justify-center bg-[#0A0B0D]/80 backdrop-blur border border-[#4A90E2] text-[#4A90E2] text-[14px] font-medium rounded shadow-sm z-10">A</span>
        )}
        
        <span className={`absolute top-3 left-3 px-2 py-1 text-[14px] font-medium rounded shadow-sm backdrop-blur z-10 ${item.status === '판매 중' || item.status === '공개 중' ? 'bg-[#0A0B0D]/80 text-[#4ADE80] border border-[#14532D]' : item.status === '수정 필요' ? 'bg-[#0A0B0D]/80 text-[#E46B6B] border border-[#7F1D1D]' : 'bg-[#0A0B0D]/80 text-[#F97316] border border-[#C2410C]'}`}>
          {item.status}
        </span>

        {item.image ? (
          <img referrerPolicy="no-referrer" 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 group-hover:text-neutral-500 transition-colors">
            <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-[14px] font-medium">이미지 없음</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1.5 gap-2">
          <h3 className="text-[15px] font-medium text-white tracking-tight line-clamp-1 group-hover:text-[#E0A12E] transition-colors">{item.title}</h3>
          <button className="text-neutral-500 hover:text-white transition-colors shrink-0 pt-0.5">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[14px] text-neutral-400 font-medium tracking-tight mb-2.5">{item.category}</p>
        
        <div className="mt-auto">
          <div className="mb-4">
            <PriceDisplay item={item} />
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3.5 text-[14px] font-sans text-neutral-500">
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {item.stats.views}</span>
            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> {item.stats.likes}</span>
            <span className="flex items-center gap-1.5">
              {item.type === 'MARKET' ? <ShoppingCart className="w-[14px] h-[14px]" /> : <Bookmark className="w-[14px] h-[14px]" />} 
              {item.type === 'MARKET' ? item.stats.sales : item.stats.saves}
            </span>
            <span className="flex items-center gap-1.5 ml-auto text-neutral-400">
              {item.stats.revenue ? <span className="font-medium font-sans flex items-center gap-1"><span className="text-[#E0A12E] text-[14px]">₩</span> {item.stats.revenue.replace('₩', '')}</span> : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const ContentListRow: React.FC<{ item: ContentItem, isSelected: boolean, onClick: () => void }> = ({ item, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#0A0B0D] border rounded-xl overflow-hidden flex items-center p-3 gap-4 group cursor-pointer transition-all duration-200 ${isSelected ? 'border-[#E0A12E] bg-[#E0A12E]/5 shadow-[0_0_15px_rgba(224,161,46,0.15)] ring-1 ring-[#E0A12E]' : 'border-[#1C1E24] hover:border-[#3A404F]'}`}
    >
      {/* Image Container */}
      <div className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-[#111215]">
        {item.type === 'MARKET' ? (
          <span className="absolute top-1.5 right-1.5 h-7 min-w-7 px-2 flex items-center justify-center bg-[#0A0B0D]/80 backdrop-blur border border-[#E0A12E] text-[#E0A12E] text-[14px] font-medium rounded shadow-sm z-10">M</span>
        ) : (
          <span className="absolute top-1.5 right-1.5 h-7 min-w-7 px-2 flex items-center justify-center bg-[#0A0B0D]/80 backdrop-blur border border-[#4A90E2] text-[#4A90E2] text-[14px] font-medium rounded shadow-sm z-10">A</span>
        )}
        
        {item.image ? (
          <img referrerPolicy="no-referrer" 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <ImageIcon className="w-6 h-6 opacity-50" />
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-[14px] font-medium rounded flex-shrink-0 ${item.status === '판매 중' || item.status === '공개 중' ? 'bg-[#0A0B0D] text-[#4ADE80] border border-[#14532D]' : item.status === '수정 필요' ? 'bg-[#0A0B0D] text-[#E46B6B] border border-[#7F1D1D]' : 'bg-[#0A0B0D] text-[#F97316] border border-[#C2410C]'}`}>
              {item.status}
            </span>
            <h3 className="text-[15px] font-medium text-white tracking-tight truncate group-hover:text-[#E0A12E] transition-colors">{item.title}</h3>
          </div>
          <p className="text-[14px] text-neutral-400 font-medium tracking-tight truncate">{item.category}</p>
        </div>

        <div className="hidden lg:flex w-32 shrink-0">
          <PriceDisplay item={item} />
        </div>

        <div className="flex lg:w-48 xl:w-64 items-center gap-4 text-[14px] font-sans text-neutral-500 shrink-0">
          <span className="flex items-center gap-1.5 whitespace-nowrap"><Eye className="w-[14px] h-[14px]" /> <span className="w-6">{item.stats.views}</span></span>
          <span className="flex items-center gap-1.5 whitespace-nowrap"><Heart className="w-[14px] h-[14px]" /> <span className="w-6">{item.stats.likes}</span></span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            {item.type === 'MARKET' ? <ShoppingCart className="w-[14px] h-[14px]" /> : <Bookmark className="w-[14px] h-[14px]" />} 
            <span className="w-6">{item.type === 'MARKET' ? item.stats.sales : item.stats.saves}</span>
          </span>
        </div>
      </div>
      
      <button className="text-neutral-500 hover:text-white transition-colors p-2 shrink-0 self-center">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  )
}

function StatMini({ icon, label, value, isRevenue = false }: { icon: React.ReactNode, label: string, value: string | number, isRevenue?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-4 bg-[#111215] border border-[#1C1E24] rounded-lg">
      <div className="text-neutral-400 flex flex-col items-center gap-1">
        {icon}
        <span className="text-[14px] font-medium tracking-tight">{label}</span>
      </div>
      <div className={`text-[14px] font-medium font-sans tracking-tight mt-0.5 ${isRevenue ? 'text-[#E0A12E]' : 'text-neutral-300'}`}>
        {value}
      </div>
    </div>
  )
}

function PriceDisplay({ item, align = 'left' }: { item: ContentItem, align?: 'left' | 'right' }) {
  if (item.isFree) {
    return <span className="text-[14px] font-medium text-neutral-400">무료 공개</span>;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
      {item.saleEnabled && item.originalPrice && (
        <span className="text-[14px] text-neutral-500 line-through">
          ₩{item.originalPrice.toLocaleString()}
        </span>
      )}
      <span className="text-[15px] font-medium text-[#E0A12E]">
        ₩{item.price?.toLocaleString()}
      </span>
    </div>
  );
}

function MetaRow({ label, value, hasInfo = false }: { label: string, value: string, hasInfo?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[14px] text-neutral-400 font-medium shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 text-right w-full justify-end">
        <span className="text-[14px] font-sans font-medium text-neutral-300 truncate tracking-tight">{value}</span>
        {hasInfo && <HelpCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0" />}
      </div>
    </div>
  )
}
