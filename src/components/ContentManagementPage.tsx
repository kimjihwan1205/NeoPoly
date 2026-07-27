import React, { useMemo, useState } from 'react';
import { 
  Search, Filter, ChevronDown, LayoutGrid, List, Plus, 
  MoreHorizontal, Eye, Heart, ShoppingCart, Bookmark,
  CreditCard, Settings, HelpCircle, AlertCircle, Clock,
  CheckCircle2, X, Edit, Lock, Trash2, ArrowUpRight, Check, Image as ImageIcon, Box,
  BarChart3, TrendingUp, WalletCards, MousePointerClick, Repeat2, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  applyPricing,
  calculateRevenueSummary,
  calculateRevenueShares,
  formatCompactWon,
  getRevenueChartPositions,
  normalizeRevenueTrend,
  parseWon,
  scaleRevenueTrend,
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

const MONTHLY_REVENUE_BASE = [
  { month: '1월', revenue: 418000 },
  { month: '2월', revenue: 486000 },
  { month: '3월', revenue: 452000 },
  { month: '4월', revenue: 574000 },
  { month: '5월', revenue: 642000 },
];

type RevenuePeriod = '30d' | '3m' | '6m' | 'year';
type RevenueChannel = 'all' | 'market' | 'license';
type RevenueSort = 'revenue' | 'sales';

export default function ContentManagementPage() {
  const [items, setItems] = useState<ContentItem[]>(ITEMS);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(() =>
    window.matchMedia('(min-width: 1440px)').matches ? ITEMS[0] : null,
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeSection, setActiveSection] = useState<'content' | 'revenue'>('content');
  const [pricingItem, setPricingItem] = useState<ContentItem | null>(null);
  const [originalPriceDraft, setOriginalPriceDraft] = useState(0);
  const [discountPriceDraft, setDiscountPriceDraft] = useState(0);
  const [saleEnabledDraft, setSaleEnabledDraft] = useState(false);
  const [isRevenueSummaryOpen, setIsRevenueSummaryOpen] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('6m');
  const [revenueChannel, setRevenueChannel] = useState<RevenueChannel>('all');
  const [revenueSort, setRevenueSort] = useState<RevenueSort>('revenue');

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
  const monthlyRevenueTrend = useMemo(
    () =>
      normalizeRevenueTrend([
        ...MONTHLY_REVENUE_BASE,
        { month: '6월', revenue: revenueSummary.totalRevenue },
      ]),
    [revenueSummary.totalRevenue],
  );
  const revenueAnalyticsTrend = useMemo(() => {
    const periodSeries: Record<RevenuePeriod, Array<{ month: string; revenue: number }>> = {
      '30d': [
        { month: '1주', revenue: 142000 },
        { month: '2주', revenue: 178000 },
        { month: '3주', revenue: 165000 },
        { month: '4주', revenue: 242500 },
      ],
      '3m': [
        { month: '4월', revenue: 574000 },
        { month: '5월', revenue: 642000 },
        { month: '6월', revenue: revenueSummary.totalRevenue },
      ],
      '6m': [
        ...MONTHLY_REVENUE_BASE,
        { month: '6월', revenue: revenueSummary.totalRevenue },
      ],
      year: [
        { month: '7월', revenue: 362000 },
        { month: '8월', revenue: 394000 },
        { month: '9월', revenue: 421000 },
        { month: '10월', revenue: 388000 },
        { month: '11월', revenue: 456000 },
        { month: '12월', revenue: 502000 },
        ...MONTHLY_REVENUE_BASE,
        { month: '6월', revenue: revenueSummary.totalRevenue },
      ],
    };
    const channelRatio: Record<RevenueChannel, number> = {
      all: 1,
      market: 0.78,
      license: 0.22,
    };
    return normalizeRevenueTrend(
      scaleRevenueTrend(periodSeries[revenuePeriod], channelRatio[revenueChannel]),
    );
  }, [revenueChannel, revenuePeriod, revenueSummary.totalRevenue]);
  const selectedPeriodRevenue = revenueAnalyticsTrend.reduce(
    (sum, point) => sum + point.revenue,
    0,
  );
  const selectedPeriodSales = Math.max(
    1,
    Math.round(selectedPeriodRevenue / Math.max(1, revenueSummary.averageOrderValue)),
  );
  const revenueShares = useMemo(
    () =>
      calculateRevenueShares([
        { label: '캐릭터', revenue: Math.round(selectedPeriodRevenue * 0.58) },
        { label: '환경', revenue: Math.round(selectedPeriodRevenue * 0.23) },
        { label: '소품', revenue: Math.round(selectedPeriodRevenue * 0.19) },
      ]),
    [selectedPeriodRevenue],
  );
  const previousMonthRevenue = MONTHLY_REVENUE_BASE[MONTHLY_REVENUE_BASE.length - 1].revenue;
  const revenueGrowthRate = previousMonthRevenue > 0
    ? Math.round(((revenueSummary.totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 1000) / 10
    : 0;

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
    <div className="np-workspace-shell flex h-[calc(100dvh-60px)] w-full overflow-hidden bg-[#0A0B0D] font-sans text-text-primary lg:h-[calc(100dvh-76px)]">
      
      {/* Left Sidebar Menu */}
      <aside className="z-10 hidden h-full w-[240px] shrink-0 flex-col overflow-y-auto border-r border-[#1C1E24] bg-[#050505] custom-scrollbar lg:flex xl:w-[300px]">
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
      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto bg-[#0A0B0D] custom-scrollbar">
        <nav
          aria-label="콘텐츠 관리 메뉴"
          className="grid shrink-0 grid-cols-3 gap-1.5 border-b border-[#1C1E24] bg-[#08090B] p-2 lg:hidden"
        >
          <button
            type="button"
            onClick={() => {
              setActiveSection('content');
              setSelectedItem(null);
            }}
            className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium transition ${
              activeSection === 'content'
                ? 'bg-[#E0A12E] text-black'
                : 'border border-[#2A2E36] bg-[#111215] text-neutral-300'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            콘텐츠
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSection('revenue');
              setSelectedItem(null);
            }}
            className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium transition ${
              activeSection === 'revenue'
                ? 'bg-[#E0A12E] text-black'
                : 'border border-[#2A2E36] bg-[#111215] text-neutral-300'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            수익
          </button>
          <button
            type="button"
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#2A2E36] bg-[#111215] text-[13px] font-medium text-neutral-300 transition hover:border-[#E0A12E]/50 hover:text-[#E0A12E]"
          >
            <Plus className="h-4 w-4" />
            업로드
          </button>
        </nav>
        <div className="px-4 py-6 sm:px-6 2xl:px-8 min-[2200px]:px-10 w-full flex-1">
          {activeSection === 'revenue' ? (
            <div className="mx-auto w-full max-w-[1500px]">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-[28px] font-bold text-white">수익 분석</h1>
                  <p className="mt-2 text-[14px] text-neutral-400">기간과 상품 유형별 판매 흐름을 비교합니다.</p>
                </div>
                <label className="relative">
                  <span className="sr-only">수익 분석 기간</span>
                  <select
                    value={revenuePeriod}
                    onChange={(event) => setRevenuePeriod(event.target.value as RevenuePeriod)}
                    className="h-10 min-w-[150px] appearance-none rounded-lg border border-[#2A2E36] bg-[#111215] pl-3 pr-9 text-[14px] text-neutral-300 outline-none transition hover:bg-[#15161A] focus:border-[#E0A12E]"
                  >
                    <option value="30d">최근 30일</option>
                    <option value="3m">최근 3개월</option>
                    <option value="6m">최근 6개월</option>
                    <option value="year">최근 1년</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <RevenueMetric
                  icon={<TrendingUp className="h-5 w-5" />}
                  label="선택 기간 수익"
                  value={formatCompactWon(selectedPeriodRevenue)}
                  accent
                />
                <RevenueMetric
                  icon={<ShoppingCart className="h-5 w-5" />}
                  label="판매 건수"
                  value={`${selectedPeriodSales}건`}
                />
                <RevenueMetric
                  icon={<WalletCards className="h-5 w-5" />}
                  label="평균 결제액"
                  value={formatCompactWon(revenueSummary.averageOrderValue)}
                />
                <RevenueMetric
                  icon={<CreditCard className="h-5 w-5" />}
                  label="정산 예정"
                  value={formatCompactWon(Math.round(selectedPeriodRevenue * 0.85))}
                />
              </div>

              <RevenueAnalyticsChart
                points={revenueAnalyticsTrend}
                channel={revenueChannel}
                onChannelChange={setRevenueChannel}
              />

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <RevenueCategoryShare shares={revenueShares} />
                <SalesEfficiencyPanel channel={revenueChannel} />
              </div>

              <section className="mt-6 overflow-hidden rounded-xl border border-[#1C1E24] bg-[#0A0B0D]">
                <div className="flex flex-col gap-3 border-b border-[#1C1E24] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <h2 className="text-[18px] font-medium text-white">작품별 수익</h2>
                    <p className="mt-1 text-[14px] text-neutral-500">판매 성과가 높은 작품을 비교합니다.</p>
                  </div>
                  <div className="flex rounded-lg border border-[#2A2E36] bg-[#111215] p-1">
                    <button
                      type="button"
                      onClick={() => setRevenueSort('revenue')}
                      className={`h-8 rounded-md px-3 text-[14px] font-medium transition ${
                        revenueSort === 'revenue' ? 'bg-[#2A2E36] text-white' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      수익순
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevenueSort('sales')}
                      className={`h-8 rounded-md px-3 text-[14px] font-medium transition ${
                        revenueSort === 'sales' ? 'bg-[#2A2E36] text-white' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      판매순
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-[#1C1E24]">
                  {revenueRows
                    .slice()
                    .sort((a, b) =>
                      revenueSort === 'revenue'
                        ? b.revenue - a.revenue
                        : b.sales - a.sales,
                    )
                    .map(({ item, sales, revenue }) => (
                      <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_80px_minmax(120px,180px)_110px] sm:gap-4 sm:px-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <img src={item.image} alt="" className="h-11 w-14 shrink-0 rounded-lg object-cover sm:h-12 sm:w-16" />
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-medium text-white sm:text-[15px]">{item.title}</p>
                            <p className="mt-1 truncate text-[12px] text-neutral-500 sm:text-[14px]">
                              {item.saleEnabled && item.originalPrice
                                ? `할인가 ₩${item.price?.toLocaleString()}`
                                : `₩${item.price?.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right sm:hidden">
                          <p className="text-[12px] text-neutral-400">{sales}건</p>
                          <p className="mt-1 text-[14px] font-medium text-[#E0A12E]">{formatCompactWon(revenue)}</p>
                        </div>
                        <span className="hidden text-right text-[14px] text-neutral-400 sm:block">{sales}건</span>
                        <div className="hidden min-w-0 sm:block">
                          <div className="mb-1.5 flex justify-between text-[14px] text-neutral-500">
                            <span>수익 비중</span>
                            <span>{Math.round((revenue / Math.max(1, revenueSummary.totalRevenue)) * 100)}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#252830]">
                            <div
                              className="h-full rounded-full bg-[#E0A12E]"
                              style={{ width: `${Math.min(100, (revenue / Math.max(1, revenueSummary.totalRevenue)) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="hidden text-right text-[16px] font-medium text-[#E0A12E] sm:block">{formatCompactWon(revenue)}</span>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          ) : (
          <>
          <div className="mb-6">
            <h1 className="text-[28px] font-bold text-white">전체 콘텐츠</h1>
            <p className="mt-2 text-[14px] text-neutral-400">업로드한 작품의 상태와 판매 정보를 관리합니다.</p>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 min-[1600px]:grid-cols-5">
            <StatCard icon={<Box className="w-5 h-5 text-neutral-400" />} title="전체 업로드" value="42" desc="전체 작품 수" />
            <StatCard icon={<ShoppingCart className="w-5 h-5 text-neutral-400" />} title="판매 중" value="18" desc="마켓 판매 중" />
            <StatCard icon={<ImageIcon className="w-5 h-5 text-neutral-400" />} title="아트 공개" value="16" desc="아트 공개 중" />
            <StatCard icon={<Clock className="w-5 h-5 text-[#E0A12E]" />} title="심사 중" value="3" desc="검토 대기 중" />
            <StatCard icon={<AlertCircle className="w-5 h-5 text-[#E46B6B]" />} title="수정 필요" value="2" desc="수정 요청" />
          </div>

          <RevenueSummaryDisclosure
            isOpen={isRevenueSummaryOpen}
            onToggle={() => setIsRevenueSummaryOpen((current) => !current)}
            onOpenDetails={() => {
              setActiveSection('revenue');
              setSelectedItem(null);
            }}
            value={revenueSummary.totalRevenue}
            sales={revenueSummary.totalSales}
            growthRate={revenueGrowthRate}
            points={monthlyRevenueTrend}
          />

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
                  aria-label="그리드 보기"
                  className={`flex h-11 w-11 items-center justify-center rounded transition-colors sm:h-8 sm:w-8 ${viewMode === 'grid' ? 'bg-[#E0A12E]/20 text-[#E0A12E]' : 'text-text-secondary hover:text-white'}`}
                >
                  <LayoutGrid className="w-[18px] h-[18px]" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  aria-label="목록 보기"
                  className={`flex h-11 w-11 items-center justify-center rounded transition-colors sm:h-8 sm:w-8 ${viewMode === 'list' ? 'bg-[#E0A12E]/20 text-[#E0A12E]' : 'text-text-secondary hover:text-white'}`}
                >
                  <List className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid/List Area */}
          {viewMode === 'grid' ? (
            <div
              className={`grid grid-cols-1 gap-4 pb-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-2 min-[1280px]:grid-cols-3 ${
                selectedItem
                  ? 'min-[1440px]:grid-cols-2 min-[1600px]:grid-cols-3 min-[2000px]:grid-cols-4'
                  : 'min-[1600px]:grid-cols-4'
              }`}
            >
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
              <button aria-label="이전 페이지" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#111215] text-text-secondary transition-colors hover:text-white sm:h-8 sm:w-8">&lt;</button>
              <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E0A12E] bg-[#E0A12E] text-[14px] font-medium text-black sm:h-8 sm:w-8">1</button>
              <button className="flex h-11 w-11 items-center justify-center rounded-lg text-[14px] font-medium text-text-secondary transition-colors hover:bg-[#111215] hover:text-white sm:h-8 sm:w-8">2</button>
              <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#111215] text-text-secondary hover:text-white transition-colors font-medium text-[14px]">3</button>
              <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#111215] text-text-secondary hover:text-white transition-colors font-medium text-[14px]">4</button>
              <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#111215] text-text-secondary hover:text-white transition-colors font-medium text-[14px]">5</button>
              <span className="text-text-secondary px-1 sm:px-2">...</span>
              <button className="flex h-11 w-11 items-center justify-center rounded-lg text-[14px] font-medium text-text-secondary transition-colors hover:bg-[#111215] hover:text-white sm:h-8 sm:w-8">9</button>
              <button aria-label="다음 페이지" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#111215] text-text-secondary transition-colors hover:text-white sm:h-8 sm:w-8">&gt;</button>
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
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 top-[60px] z-30 flex w-full shrink-0 flex-col border-l border-[#1C1E24] bg-[#0A0B0D] shadow-[0_0_50px_rgba(0,0,0,0.8)] lg:top-[76px] min-[1440px]:relative min-[1440px]:inset-auto min-[1440px]:!top-auto min-[1440px]:z-20 min-[1440px]:w-[380px] min-[1440px]:shadow-2xl"
          >
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-lg bg-transparent text-neutral-400 transition-colors hover:bg-[#111215] hover:text-white sm:h-8 sm:w-8"
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

function RevenueSummaryDisclosure({
  isOpen,
  onToggle,
  onOpenDetails,
  value,
  sales,
  growthRate,
  points,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onOpenDetails: () => void;
  value: number;
  sales: number;
  growthRate: number;
  points: Array<{ month: string; revenue: number; height: number }>;
}) {
  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-[#1C1E24] bg-[#0A0B0D]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left transition hover:bg-white/[0.025]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E0A12E]/10 text-[#E0A12E]">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[17px] font-medium text-white">수익 요약</h2>
            <p className="mt-0.5 text-[14px] text-neutral-500">최근 판매 흐름을 간단히 확인합니다.</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <div className="hidden text-right sm:block">
            <p className="text-[14px] text-neutral-500">이번 달</p>
            <p className="mt-0.5 text-[18px] font-medium text-[#E0A12E]">{formatCompactWon(value)}</p>
          </div>
          <span className={`hidden rounded-full px-2.5 py-1 text-[14px] font-medium md:inline-flex ${
            growthRate >= 0 ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-[#E46B6B]/10 text-[#E46B6B]'
          }`}>
            전월 대비 {growthRate >= 0 ? '+' : ''}{growthRate}%
          </span>
          <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-[#1C1E24] p-5">
          <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="flex flex-col justify-between rounded-lg bg-[#111215] p-4">
              <div>
                <p className="text-[14px] text-neutral-400">이번 달 수익</p>
                <p className="mt-2 truncate text-[clamp(26px,3vw,36px)] font-medium text-[#E0A12E]">
                  {formatCompactWon(value)}
                </p>
              </div>
              <p className="mt-5 text-[14px] text-neutral-400">
                {sales}건 판매 · 전월 대비 {growthRate >= 0 ? '+' : ''}{growthRate}%
              </p>
            </div>
            <RevenueTrendChart points={points} compact />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onOpenDetails}
              className="flex h-10 items-center gap-2 rounded-lg px-3 text-[14px] font-medium text-neutral-300 transition hover:bg-white/5 hover:text-white"
            >
              수익 관리에서 자세히 보기
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function MonthlyRevenueCard({
  value,
  sales,
  growthRate,
}: {
  value: number;
  sales: number;
  growthRate: number;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[#E0A12E]/25 bg-[#E0A12E]/[0.06] p-6">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-5 w-5 shrink-0 text-[#E0A12E]" />
          <span className="text-[14px] font-medium text-neutral-300">이번 달 수익</span>
        </div>
        <div className="mt-8">
          <p className="max-w-full truncate text-[clamp(30px,4vw,48px)] font-medium tracking-tight text-[#E0A12E]">
            {formatCompactWon(value)}
          </p>
          <p className="mt-1 text-[14px] text-neutral-400">
            {sales}건 판매 · 전월 대비 {growthRate >= 0 ? '+' : ''}{growthRate}%
          </p>
        </div>
      </div>
    </section>
  );
}

function RevenueTrendChart({
  points,
  compact = false,
  title,
  description,
}: {
  points: Array<{ month: string; revenue: number; height: number }>;
  compact?: boolean;
  title?: string;
  description?: string;
}) {
  return (
    <section className={`${compact ? 'min-h-[190px]' : 'mt-6 min-h-[300px] rounded-xl border border-[#1C1E24] bg-[#0A0B0D] p-5'}`}>
      {!compact && (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-medium text-white">{title}</h2>
            <p className="mt-1 text-[14px] text-neutral-500">{description}</p>
          </div>
          <span className="text-[14px] text-neutral-500">단위: 원</span>
        </div>
      )}
      <div className={`flex items-end gap-3 ${compact ? 'h-[170px]' : 'h-[220px]'}`}>
        {points.map((point, index) => {
          const isCurrentMonth = index === points.length - 1;
          return (
            <div key={point.month} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="group relative flex min-h-0 flex-1 items-end justify-center">
                <div
                  className={`relative w-full max-w-[54px] rounded-t-md transition ${
                    isCurrentMonth
                      ? 'bg-[#E0A12E]'
                      : 'bg-[#343842] group-hover:bg-[#555A64]'
                  }`}
                  style={{ height: `${Math.max(point.height, point.revenue > 0 ? 8 : 2)}%` }}
                >
                  <span className="absolute bottom-[calc(100%+8px)] left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-[#2A2E36] bg-[#111317] px-2 py-1 text-[14px] text-white shadow-xl group-hover:block">
                    {formatCompactWon(point.revenue)}
                  </span>
                </div>
              </div>
              <span className={`mt-2 text-center text-[14px] ${isCurrentMonth ? 'font-medium text-[#E0A12E]' : 'text-neutral-500'}`}>
                {point.month}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RevenueAnalyticsChart({
  points,
  channel,
  onChannelChange,
}: {
  points: Array<{ month: string; revenue: number; height: number }>;
  channel: RevenueChannel;
  onChannelChange: (channel: RevenueChannel) => void;
}) {
  const chartWidth = 800;
  const chartHeight = 220;
  const chartPositions = getRevenueChartPositions(points);
  const coordinates = points.map((point, index) => ({
    ...point,
    ...chartPositions[index],
    x: (chartPositions[index].xPercent / 100) * chartWidth,
    y: (chartPositions[index].yPercent / 100) * chartHeight,
  }));
  const linePoints = coordinates.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPoints = coordinates.length
    ? `${coordinates[0].x},${chartHeight * 0.9} ${linePoints} ${coordinates[coordinates.length - 1].x},${chartHeight * 0.9}`
    : '';

  return (
    <section className="mt-4 overflow-hidden rounded-lg border border-[#1C1E24] bg-[#0A0B0D] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[18px] font-medium text-white">수익 변화</h2>
          <p className="mt-1 text-[14px] text-neutral-500">선택한 기간의 판매 수익 추이</p>
        </div>
        <div className="flex rounded-lg border border-[#2A2E36] bg-[#111215] p-1">
          {([
            ['all', '전체'],
            ['market', '마켓'],
            ['license', '라이선스'],
          ] as Array<[RevenueChannel, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onChannelChange(value)}
              className={`h-8 rounded-md px-3 text-[14px] font-medium transition ${
                channel === value
                  ? 'bg-[#2A2E36] text-white'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-5 h-[260px] w-full">
        <div className="pointer-events-none absolute inset-x-0 top-[22px] flex h-[176px] flex-col justify-between">
          {[0, 1, 2, 3].map((line) => (
            <span key={line} className="block border-t border-dashed border-[#20232A]" />
          ))}
        </div>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-[220px] w-full overflow-visible"
          aria-label="기간별 수익 변화 그래프"
        >
          <defs>
            <linearGradient id="revenue-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0A12E" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#E0A12E" stopOpacity="0" />
            </linearGradient>
          </defs>
          {areaPoints && (
            <polygon points={areaPoints} fill="url(#revenue-area-gradient)" />
          )}
          {linePoints && (
            <polyline
              points={linePoints}
              fill="none"
              stroke="#E0A12E"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        {coordinates.map((point) => (
          <div
            key={`${point.month}-point`}
            className="group absolute top-0 h-[220px] w-0"
            style={{ left: `${point.xPercent}%` }}
          >
            <span
              data-revenue-point={point.month}
              className="absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#E0A12E] bg-[#0A0B0D]"
              style={{ top: `${point.yPercent}%` }}
            />
            <span
              className="pointer-events-none absolute z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-[#2A2E36] bg-[#111317] px-2 py-1 text-[14px] text-white shadow-xl group-hover:block"
              style={{ top: `calc(${point.yPercent}% - 38px)` }}
            >
              {formatCompactWon(point.revenue)}
            </span>
            <span
              data-revenue-label={point.month}
              className="absolute top-[225px] -translate-x-1/2 whitespace-nowrap text-[14px] text-neutral-500"
            >
              {point.month}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RevenueCategoryShare({
  shares,
}: {
  shares: Array<{ label: string; revenue: number; share: number }>;
}) {
  const colors = ['#E0A12E', '#4F7CFF', '#4ADE80'];
  const firstEnd = shares[0]?.share ?? 0;
  const secondEnd = firstEnd + (shares[1]?.share ?? 0);

  return (
    <section className="rounded-lg border border-[#1C1E24] bg-[#0A0B0D] p-5">
      <h2 className="text-[18px] font-medium text-white">상품 유형별 수익</h2>
      <p className="mt-1 text-[14px] text-neutral-500">전체 수익에서 차지하는 비중</p>
      <div className="mt-5 grid items-center gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div
          className="relative mx-auto aspect-square w-[160px] rounded-full"
          style={{
            background: `conic-gradient(${colors[0]} 0 ${firstEnd}%, ${colors[1]} ${firstEnd}% ${secondEnd}%, ${colors[2]} ${secondEnd}% 100%)`,
          }}
        >
          <div className="absolute inset-[28px] flex flex-col items-center justify-center rounded-full bg-[#0A0B0D]">
            <span className="text-[14px] text-neutral-500">총수익</span>
            <strong className="mt-1 text-[18px] font-medium text-white">
              {formatCompactWon(shares.reduce((sum, item) => sum + item.revenue, 0))}
            </strong>
          </div>
        </div>
        <div className="space-y-3">
          {shares.map((item, index) => (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-4 text-[14px]">
                <span className="flex items-center gap-2 text-neutral-300">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors[index] }} />
                  {item.label}
                </span>
                <span className="font-medium text-white">{item.share}%</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[14px] text-neutral-500">
                <span>{formatCompactWon(item.revenue)}</span>
                <span>수익 비중</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SalesEfficiencyPanel({ channel }: { channel: RevenueChannel }) {
  const channelAdjustment = channel === 'market' ? 0.4 : channel === 'license' ? -0.6 : 0;
  const metrics = [
    {
      icon: <MousePointerClick className="h-5 w-5" />,
      label: '구매 전환율',
      value: `${(3.8 + channelAdjustment).toFixed(1)}%`,
      detail: '조회 후 구매',
      change: '+0.6%',
    },
    {
      icon: <Repeat2 className="h-5 w-5" />,
      label: '재구매율',
      value: `${(18.2 + channelAdjustment * 2).toFixed(1)}%`,
      detail: '구매자 재방문',
      change: '+2.1%',
    },
    {
      icon: <RotateCcw className="h-5 w-5" />,
      label: '환불률',
      value: `${Math.max(0.4, 1.2 - channelAdjustment / 2).toFixed(1)}%`,
      detail: '전체 판매 기준',
      change: '-0.3%',
    },
  ];

  return (
    <section className="rounded-lg border border-[#1C1E24] bg-[#0A0B0D] p-5">
      <h2 className="text-[18px] font-medium text-white">판매 효율</h2>
      <p className="mt-1 text-[14px] text-neutral-500">방문부터 구매 이후까지의 핵심 지표</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex min-w-0 items-center gap-4 rounded-lg border border-[#20232A] bg-[#111215] p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-neutral-400">
              {metric.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-neutral-300">{metric.label}</p>
              <p className="mt-1 text-[14px] text-neutral-500">{metric.detail}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[20px] font-medium text-white">{metric.value}</p>
              <p className={`mt-1 text-[14px] ${metric.change.startsWith('-') ? 'text-[#4ADE80]' : 'text-[#4ADE80]'}`}>
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RevenueMetric({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`min-w-0 rounded-lg border p-5 ${
      accent
        ? 'border-[#E0A12E]/35 bg-[#E0A12E]/[0.06]'
        : 'border-[#1C1E24] bg-[#111215]'
    }`}>
      <div className={`flex items-center gap-2 ${accent ? 'text-[#E0A12E]' : 'text-neutral-400'}`}>
        {icon}
        <span className="text-[14px] font-medium">{label}</span>
      </div>
      <p className={`mt-5 truncate text-[clamp(20px,2vw,28px)] font-medium ${accent ? 'text-[#E0A12E]' : 'text-white'}`}>
        {value}
      </p>
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
    <button className={`np-control-label flex items-center justify-between border border-[#2A2E36] bg-[#111215] px-3 py-2 text-[14px] text-neutral-300 transition-colors hover:bg-[#15161A] ${width} rounded-lg`}>
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
          <button aria-label={`${item.title} 작업 더 보기`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-white/5 hover:text-white sm:h-8 sm:w-8">
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
      
      <button aria-label={`${item.title} 작업 더 보기`} className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-lg text-neutral-500 transition-colors hover:bg-white/5 hover:text-white sm:h-9 sm:w-9">
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
