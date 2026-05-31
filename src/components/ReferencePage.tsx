/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, Link as LinkIcon, Bookmark, Download, MoreHorizontal, 
  LayoutGrid, List, Sparkles, Filter, ChevronDown, ChevronRight, 
  Trash2, Clock, Folder, Wand2, CheckSquare, Check, X
} from 'lucide-react';
import { ASSETS } from '../App';

interface ReferencePageProps {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  onNavigate: (page: string) => void;
  isPopup?: boolean;
  onAcceptSelection?: (selectedIds: number[]) => void;
}

export default function ReferencePage({ favorites = [], toggleFavorite = () => {}, onNavigate = () => {}, isPopup = false, onAcceptSelection }: ReferencePageProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeBadge, setActiveBadge] = useState('전체');
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [refFavorites, setRefFavorites] = useState<number[]>([1, 4, 7]);
  const trashIds = [2, 5];
  const [previewImage, setPreviewImage] = useState<typeof ASSETS[0] | null>(null);

  const [displayLimit, setDisplayLimit] = useState(40);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [externalAssets, setExternalAssets] = useState<typeof ASSETS>([]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // ArtStation API 대신 임의의 데이터를 생성하여 API 호출처럼 시뮬레이션
    setTimeout(() => {
      const newItems = Array.from({ length: 15 }).map((_, i) => {
        const newId = 1000 + externalAssets.length + i;
        const randomTitles = ['사이버펑크 캐릭터', '중세 성', '판타지 크리처', '메카닉 전사', '우주함선', '마법사 지팡이', '황무지 배경', '고대의 유적'];
        return {
          id: newId,
          title: randomTitles[Math.floor(Math.random() * randomTitles.length)] + ' 아트',
          author: 'Artist_' + newId,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`,
          likes: Math.floor(Math.random() * 2000 + 100).toString(),
          views: Math.floor(Math.random() * 5000 + 500).toString(),
          image: `https://picsum.photos/seed/${newId}/600/800`,
          badge: ['M', 'T', 'R'][Math.floor(Math.random() * 3)],
          type: '3D 모델'
        } as any;
      });
      setExternalAssets(prev => [...prev, ...newItems]);
      setDisplayLimit(prev => prev + 15);
      setIsLoadingMore(false);
    }, 1200);
  };

  const toggleRefFavorite = (id: number) => {
    setRefFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleCardClick = (e: React.MouseEvent, id: number) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setSelectedIds(newSet);
    } else {
      const asset = ASSETS.find(a => a.id === id);
      if (asset) {
        setPreviewImage(asset);
      }
    }
  };

  const heights = ['h-[280px]', 'h-[360px]', 'h-[440px]', 'h-[520px]', 'h-[240px]', 'h-[320px]', 'h-[400px]'];

  return (
    <div className={`flex bg-bg-dark ${isPopup ? 'h-full min-h-0' : 'min-h-[calc(100vh-76px)]'} text-text-primary font-sans relative`}>
      <aside className={`w-[300px] shrink-0 border-r border-[#161618] bg-[#08090B] p-5 hidden lg:flex flex-col ${isPopup ? 'h-full overflow-y-auto custom-scrollbar' : 'h-[calc(100vh-76px)] sticky top-[76px]'}`}>
        <div className="mb-8 mt-2">
          {!isPopup && (
            <>
              <h2 className="text-[20px] font-bold text-white mb-2 tracking-tight">레퍼런스</h2>
              <p className="text-[14px] text-text-secondary leading-relaxed mb-6">영감이 되는 이미지를 수집하고<br/>프로젝트에 활용해보세요.</p>
            </>
          )}
          <button className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl border border-[#3A404F]/60 bg-[#15161A] hover:bg-[#22252B] hover:border-[#E0A12E]/50 text-[#E0A12E] shadow-sm transition-all font-bold text-[15px] tracking-wide">
            <Plus className="w-[18px] h-[18px]" />
            <span>새 보드 만들기</span>
          </button>
        </div>

        <div className="flex flex-col gap-1 mb-8">
          <MenuBtn icon={<LayoutGrid className="w-[18px] h-[18px]"/>} label="전체" count="3,842" active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
          <MenuBtn icon={<Bookmark className="w-[18px] h-[18px]"/>} label="즐겨찾기" count={refFavorites.length.toString()} active={activeCategory === 'favorites'} onClick={() => setActiveCategory('favorites')} />
          <MenuBtn icon={<Clock className="w-[18px] h-[18px]"/>} label="최근 추가" count="10" active={activeCategory === 'recent'} onClick={() => setActiveCategory('recent')} />
          <MenuBtn icon={<Trash2 className="w-[18px] h-[18px]"/>} label="휴지통" count={trashIds.length.toString()} active={activeCategory === 'trash'} onClick={() => setActiveCategory('trash')} />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[14px] font-bold text-text-primary tracking-tight">보드</span>
            <button className="text-text-tertiary hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex flex-col gap-0.5">
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png" label="엘프 컨셉" count="246" dot={activeCategory === '엘프 컨셉'} onClick={() => setActiveCategory('엘프 컨셉')} />
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%202.png" label="판타지 환경" count="183" dot={activeCategory === '판타지 환경'} onClick={() => setActiveCategory('판타지 환경')} />
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%203.png" label="갑옷 / 의상" count="198" dot={activeCategory === '갑옷 / 의상'} onClick={() => setActiveCategory('갑옷 / 의상')} />
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%204.png" label="무기 / 소품" count="221" dot={activeCategory === '무기 / 소품'} onClick={() => setActiveCategory('무기 / 소품')} />
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%205.png" label="캐릭터 레퍼런스" count="158" dot={activeCategory === '캐릭터 레퍼런스'} onClick={() => setActiveCategory('캐릭터 레퍼런스')} />
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%206.png" label="다크 판타지 무드" count="176" dot={activeCategory === '다크 판타지 무드'} onClick={() => setActiveCategory('다크 판타지 무드')} />
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%207.png" label="건축 레퍼런스" count="237" dot={activeCategory === '건축 레퍼런스'} onClick={() => setActiveCategory('건축 레퍼런스')} />
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%208.png" label="색감 / 조명" count="124" dot={activeCategory === '색감 / 조명'} onClick={() => setActiveCategory('색감 / 조명')} />
            <BoardBtn img="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%209.png" label="아이디어 스케치" count="93" dot={activeCategory === '아이디어 스케치'} onClick={() => setActiveCategory('아이디어 스케치')} />
          </div>
        </div>
      </aside>

      <main className={`flex-1 min-w-0 px-6 py-6 w-full ${isPopup ? 'h-full overflow-y-auto custom-scrollbar' : 'overscroll-y-auto'}`}>
        {!['favorites', 'recent', 'trash'].includes(activeCategory) && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-[480px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-tertiary" />
                <input 
                  type="text" 
                  placeholder="레퍼런스 검색..." 
                  className="w-full bg-[#111215] border border-[#2A2E36] rounded-[8px] pl-10 pr-10 py-2.5 text-[14px] text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#1A1C20] px-1.5 py-0.5 text-text-tertiary text-[10px] border border-[#2A2E36] font-sans">/</div>
              </div>
              
              <div className="flex-1"></div>
              
              <button className="px-4 py-2 bg-[#111215] border border-[#2A2E36] hover:bg-surface-primary rounded-[8px] text-[13px] font-bold text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" /> 필터
              </button>
              
              <div className="flex items-center bg-[#111215] border border-[#2A2E36] rounded-[8px] px-3 py-2 cursor-pointer hover:bg-surface-primary transition-colors text-[13px] font-bold text-text-secondary">
                최신순 <ChevronDown className="w-4 h-4 ml-6" />
              </div>

              <div className="flex items-center gap-1 bg-[#111215] border border-[#2A2E36] p-1 rounded-[8px]">
                <button className="p-1 rounded bg-[#2A2E36] text-white"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-1 rounded text-text-tertiary hover:text-white"><List className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
              {['전체', '엘프 컨셉', '판타지 환경', '갑옷 / 의상', '무기 / 소품', '다크 판타지', '건축', '색감 / 조명'].map((badge) => (
                <button
                  key={badge}
                  onClick={() => setActiveBadge(badge)}
                  className={`px-4 py-2 rounded-full border text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeBadge === badge
                      ? 'bg-[#E0A12E]/10 border-[#E0A12E]/30 text-brand-primary'
                      : 'bg-transparent border-[#2A2E36] text-text-secondary hover:text-white hover:border-[#4B505A]'
                  }`}
                >
                  {badge}
                </button>
              ))}
              <button className="px-3 py-2 rounded-full border border-[transparent] hover:bg-[#1A1C20] text-text-tertiary hover:text-white transition-all">
                <Plus className="w-[18px] h-[18px]" />
              </button>
            </div>
          </>
        )}

        {activeCategory === 'favorites' && (
          <div className="mb-8 mt-2 pb-6 border-b border-border-soft flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-white flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-[8px] bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <Bookmark className="w-5 h-5 text-red-500 fill-red-500" />
                </span> 즐겨찾기
              </h1>
              <p className="text-text-secondary text-[14px]">내가 북마크한 레퍼런스 이미지들입니다.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input type="text" placeholder="즐겨찾기 내 검색..." className="bg-[#111215] border border-[#2A2E36] rounded-[8px] pl-9 pr-4 py-2 text-[13px] text-white focus:outline-none focus:border-brand-primary/50 transition-colors w-[200px]" />
              </div>
              <button className="px-4 py-2 bg-[#111215] border border-[#2A2E36] hover:bg-surface-primary rounded-[8px] text-[13px] font-bold text-text-secondary hover:text-white transition-colors">최신순</button>
            </div>
          </div>
        )}

        {activeCategory === 'recent' && (
          <div className="mb-8 mt-2 pb-6 border-b border-border-soft flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-white flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-[8px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                  <Clock className="w-5 h-5 text-brand-primary" />
                </span> 최근 추가
              </h1>
              <p className="text-text-secondary text-[14px]">오늘 추가된 이미지 항목입니다.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-[#111215] border border-[#2A2E36] hover:bg-surface-primary rounded-[8px] text-[13px] font-bold text-text-secondary hover:text-white transition-colors flex items-center gap-2"><Filter className="w-4 h-4"/> 필터</button>
            </div>
          </div>
        )}

        {activeCategory === 'trash' && (
          <div className="mb-8 mt-2 pb-6 border-b border-border-soft flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-white flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-[8px] bg-gray-500/10 flex items-center justify-center border border-gray-500/20">
                  <Trash2 className="w-5 h-5 text-text-tertiary" />
                </span> 휴지통
              </h1>
              <p className="text-text-secondary text-[14px]">휴지통의 항목은 30일 후 영구 삭제됩니다.</p>
            </div>
            <button className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-[8px] text-[13px] font-bold transition-colors">
              휴지통 비우기
            </button>
          </div>
        )}

        <div className="text-[13px] text-neutral-400 flex items-center gap-2 mb-4 px-1">
          <CheckSquare className="w-4 h-4 text-neutral-400" /> Ctrl(Cmd) 키를 누르고 클릭하면 여러 개를 다중 선택할 수 있습니다.
        </div>

        <div className="columns-2 md:columns-3 xl:columns-4 2xl:columns-5 gap-[14px]">
          {(() => {
            const allAssets = [...ASSETS, ...externalAssets];
            let displayedAssets = allAssets.slice(0, displayLimit);
            if (activeCategory === 'favorites') {
              displayedAssets = allAssets.filter(a => refFavorites.includes(a.id));
            } else if (activeCategory === 'recent') {
              displayedAssets = allAssets.slice(0, 10);
            } else if (activeCategory === 'trash') {
              displayedAssets = allAssets.filter(a => trashIds.includes(a.id));
            } else {
              displayedAssets = displayedAssets.filter(a => !trashIds.includes(a.id));
            }
            return displayedAssets;
          })().map((asset, i) => {
            const h = heights[(asset.id * 3 + 17) % heights.length];
            const isSelected = selectedIds.has(asset.id);
            const isFav = refFavorites.includes(asset.id);
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                key={asset.id}
                onClick={(e) => handleCardClick(e as any, asset.id)}
                className={`relative group rounded-[10px] overflow-hidden mb-[14px] cursor-pointer break-inside-avoid shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all ${
                  isSelected ? 'border-2 border-brand-primary shadow-[0_0_20px_rgba(224,161,46,0.15)]' : 'border border-[#1F2329] hover:border-brand-primary/40'
                }`}
              >
                <div className={`w-full ${h} overflow-hidden bg-surface-secondary`}>
                  <img src={asset.image} alt={asset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {isSelected && (
                  <div className="absolute top-3 left-3 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-bg-dark shadow-md z-20 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                
                {isFav && !isSelected && (
                  <div className="absolute top-3 right-3 text-red-500 z-20">
                    <Bookmark className="w-[22px] h-[22px] fill-red-500" />
                  </div>
                )}

                <div className="absolute bottom-3 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-10 pointer-events-none">
                  <div className="pointer-events-auto flex items-center gap-1.5 bg-[#1A1C20]/90 backdrop-blur-md border border-[#2A2E36]/80 p-1.5 rounded-[10px] shadow-xl">
                    <ActionButton icon={<Plus className="w-3.5 h-3.5"/>} title="임시 보드 추가" />
                    <ActionButton icon={<LinkIcon className="w-3.5 h-3.5"/>} title="프로젝트 연결" />
                    <ActionButton 
                      icon={<Bookmark className={`w-3.5 h-3.5 ${isFav ? 'text-red-400 fill-red-400' : ''}`}/>} 
                      title="즐겨찾기" 
                      onClick={(e) => { e.stopPropagation(); toggleRefFavorite(asset.id); }}
                    />
                    <ActionButton icon={<Download className="w-3.5 h-3.5"/>} title="다운로드" />
                    <div className="w-[1px] h-4 bg-[#2A2E36] mx-1"></div>
                    <ActionButton icon={<MoreHorizontal className="w-3.5 h-3.5"/>} title="더보기 (분석 메뉴 등)" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {!['favorites', 'recent', 'trash'].includes(activeCategory) && (
          <div className="flex justify-center mt-8 py-6 pb-20">
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-primary border border-[#2A2E36] text-[14px] font-bold text-text-tertiary hover:text-white transition-all hover:bg-[#111215]"
            >
              {isLoadingMore ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  로딩중...
                </div>
              ) : (
                <>더보기 <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-[calc(50%+140px)] -translate-x-1/2 flex items-center bg-[#1A1C20] border border-[#2A2E36] rounded-[12px] p-2 px-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-50 gap-4"
          >
            <div className="flex items-center gap-2 pr-4 border-r border-[#2A2E36]">
              <div className="w-5 h-5 bg-brand-primary rounded-full flex justify-center items-center text-bg-dark text-[11px] font-bold">
                {selectedIds.size}
              </div>
              <span className="text-[13px] font-bold text-white">선택됨</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isPopup ? (
                <button 
                  onClick={() => onAcceptSelection?.(Array.from(selectedIds))}
                  className="px-6 py-1.5 bg-[#E0A12E] hover:bg-[#E0A12E]/90 text-bg-dark rounded-[6px] text-[13px] font-bold transition-colors flex gap-2 items-center shadow-[0_0_12px_rgba(224,161,46,0.15)]"
                >
                  선택 항목 가져오기 <ChevronRight className="w-4 h-4 ml-1" />
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
            
            <div className="pl-2">
              <button onClick={() => setSelectedIds(new Set())} className="p-1.5 hover:bg-surface-primary rounded-full text-text-tertiary hover:text-white transition-colors">
                <Trash2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/95 backdrop-blur-sm p-8"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-full max-h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 p-2 text-neutral-400 hover:text-white transition-colors bg-surface-primary/50 rounded-full hover:bg-surface-primary"
              >
                <X className="w-6 h-6" />
              </button>
              <img 
                src={previewImage.image} 
                alt={previewImage.title} 
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-[8px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#1F2329]" 
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 flex items-center justify-between px-2">
                <div>
                  <h3 className="text-[20px] font-bold text-white tracking-tight">{previewImage.title}</h3>
                  <p className="text-[14px] text-neutral-400 mt-1">{previewImage.badge}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { toggleRefFavorite(previewImage.id); }} className={`p-2.5 rounded-[8px] bg-surface-primary border border-[#1F2329] hover:bg-[#111215] hover:text-white transition-colors ${refFavorites.includes(previewImage.id) ? 'text-red-400' : 'text-neutral-400'}`}>
                    <Bookmark className={`w-5 h-5 ${refFavorites.includes(previewImage.id) ? 'fill-red-400' : ''}`} />
                  </button>
                  <button onClick={() => {
                      const newSet = new Set(selectedIds);
                      if (newSet.has(previewImage.id)) newSet.delete(previewImage.id);
                      else newSet.add(previewImage.id);
                      setSelectedIds(newSet);
                    }} className={`p-2.5 rounded-[8px] border transition-colors flex items-center gap-2 px-4 ${selectedIds.has(previewImage.id) ? 'bg-brand-primary text-bg-dark border-brand-primary font-bold' : 'bg-surface-primary border-[#1F2329] text-white hover:bg-[#111215]'}`}>
                    <CheckSquare className="w-4 h-4" />
                    {selectedIds.has(previewImage.id) ? '선택 취소' : '선택하기'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuBtn({ icon, label, count, active, onClick }: { icon: any, label: string, count: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-semibold tracking-tight transition-colors border border-transparent ${active ? 'bg-[#15161A] text-white' : 'text-text-secondary hover:text-white hover:bg-[#111215]'}`}>
      <div className="flex items-center gap-3">
        <span className={`w-[18px] h-[18px] flex items-center justify-center ${active ? 'text-[#E0A12E]' : 'text-neutral-400'}`}>
          {icon}
        </span>
        <span className="tracking-tight">{label}</span>
      </div>
      <span className={`text-[13px] font-sans ${active ? 'text-text-secondary' : 'text-neutral-500'}`}>{count}</span>
    </button>
  )
}

function BoardBtn({ img, label, count, dot, onClick }: { img: string, label: string, count: string, dot?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-[16px] font-semibold tracking-tight transition-colors border border-transparent ${dot ? 'bg-[#15161A] text-white' : 'text-text-secondary hover:text-white hover:bg-[#111215]'}`}>
      <div className="flex items-center gap-3.5">
        <div className="w-8 h-8 rounded-[6px] overflow-hidden shrink-0 border border-[#2A2E36]">
          <img referrerPolicy="no-referrer" src={img} alt="" className="w-full h-full object-cover" />
        </div>
        <span className={`tracking-tight ${dot ? 'text-[#E0A12E]' : ''}`}>{label}</span>
      </div>
      <span className={`text-[13px] font-sans ${dot ? 'text-text-secondary' : 'text-neutral-500'}`}>{count}</span>
    </button>
  )
}

function ActionButton({ icon, title, onClick }: { icon: any, title: string, onClick?: (e:React.MouseEvent) => void }) {
  return (
    <button 
      onClick={onClick}
      title={title}
      className="p-2 hover:bg-surface-primary rounded-[6px] text-text-secondary hover:text-white transition-colors flex items-center justify-center hover:scale-110 active:scale-95"
    >
      {icon}
    </button>
  )
}
