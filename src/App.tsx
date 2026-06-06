/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, Bell, LayoutGrid, User, Mountain, Building2, 
  Car, Sword, Box, Leaf, Wand2, Heart, Eye, Sliders, Plus, Folder, ChevronRight,
  Sparkles, Video, BrainCircuit, GripVertical, FileText, Skull,
  PanelRightClose, PanelRightOpen, X, ChevronDown, Check, Instagram, Youtube, ShoppingBag,
  Upload, Trash2, Clock, LogOut, Settings, Star, ImageIcon, ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ContentManagementPage from './components/ContentManagementPage';
import PurchasedAssetsPage from './components/PurchasedAssetsPage';
import FavoritesPage from './components/FavoritesPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import ReferencePage, { REFERENCE_BOARDS, boardMatchesAsset } from './components/ReferencePage';
import ProjectPage from './components/ProjectPage';
import NotesPage, { NOTES } from './components/NotesPage';
import NoteEditorPage from './components/NoteEditorPage';
import UserProfilePage from './components/UserProfilePage';
import AIStudioPage from './components/AIStudioPage';
import FullWorkflowPage from './components/FullWorkflowPage';
import FullWorkflowIntroPage from './components/FullWorkflowIntroPage';
import SupportPage from './components/SupportPage';
import TurnaroundPage from './components/TurnaroundPage';
import ModelingGenerationPage from './components/ModelingGenerationPage';
import { UserProfile } from './types';

// --- Constants & Updated Asset Data ---

const HERO_IMAGE = "/images/hero.png";

const CATEGORIES = [
  { id: 'all', label: '전체', icon: LayoutGrid },
  { id: 'character', label: '캐릭터', icon: User },
  { id: 'environment', label: '환경', icon: Mountain },
  { id: 'architecture', label: '건축', icon: Building2 },
  { id: 'vehicle', label: '차량', icon: Car },
  { id: 'weapon', label: '무기', icon: Sword },
  { id: 'prop', label: '소품', icon: Box },
  { id: 'nature', label: '자연', icon: Leaf },
  { id: 'animation', label: '애니메이션', icon: Video },
  { id: 'ai', label: 'AI 생성', icon: BrainCircuit },
  { id: 'material', label: '재질', icon: Sparkles },
  { id: 'creature', label: '크리처', icon: Skull },
  { id: 'concept', label: '컨셉 아트', icon: FileText },
];

export const ASSETS = [
  {
    id: 1,
    title: '엘프궁수',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_%201.png",
    badge: 'M'
  },
  {
    id: 2,
    title: '오크',
    author: 'Alexey',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v1',
    likes: '754',
    views: '52',
    image: "/images/work_%202.png",
    badge: 'M'
  },
  {
    id: 3,
    title: '와이번',
    author: 'Dofresh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    likes: '1.1K',
    views: '87',
    image: "/images/work_%203.png",
    badge: 'A'
  },
  {
    id: 4,
    title: '공룡',
    author: 'Northro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    likes: '982',
    views: '76',
    image: "/images/work_%204.png",
    badge: 'M'
  },
  {
    id: 5,
    title: '스트릿 패션',
    author: 'Alexey',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v2',
    likes: '1.1K',
    views: '89',
    image: "/images/work_%205.png",
    badge: 'M'
  },
  {
    id: 6,
    title: '코뿔소 전사',
    author: 'Johan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    likes: '2.3K',
    views: '189',
    image: "/images/work_%206.png",
    badge: 'M'
  },
  {
    id: 7,
    title: 'MY POSCO 01',
    author: 'PolygonLab',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    likes: '633',
    views: '33',
    image: "/images/work_%207.png",
    badge: 'A'
  },
  {
    id: 8,
    title: 'MY POSCO 02',
    author: 'Materialist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    likes: '872',
    views: '56',
    image: "/images/work_%208.png",
    badge: 'M'
  },
  {
    id: 9,
    title: '현대식 목조 주택',
    author: 'Archive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    likes: '1.4K',
    views: '120',
    image: "/images/work_%209.png",
    badge: 'M'
  },
  {
    id: 10,
    title: '세련된 현대 주방',
    author: 'Jung-gon',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
    likes: '3.1K',
    views: '245',
    image: "/images/work_%2010.png",
    badge: 'M'
  },
  {
    id: 11,
    title: '땋은 머리 여자 캐릭터',
    author: 'NeoArt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
    likes: '890',
    views: '67',
    image: "/images/work_%2011.png",
    badge: 'A'
  },
  {
    id: 12,
    title: '현대 콘크리트 주택',
    author: 'Creator X',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
    likes: '1.5K',
    views: '112',
    image: "/images/work_%2012.png",
    badge: 'M'
  },
  {
    id: 13,
    title: '산업단지 대형 사일로',
    author: 'Posco Design',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13',
    likes: '2.4K',
    views: '198',
    image: "/images/work_%2013.png",
    badge: 'M'
  },
  {
    id: 14,
    title: '작업실 전동 공구',
    author: 'Posco Design',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=14',
    likes: '1.9K',
    views: '154',
    image: "/images/work_%2014.png",
    badge: 'M'
  },
  {
    id: 15,
    title: '유럽풍 아기자기 골목',
    author: 'GreenSpirit',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=15',
    likes: '720',
    views: '45',
    image: "/images/work_%2015.png",
    badge: 'A'
  },
  {
    id: 16,
    title: '미래형 인어 전투 엘프',
    author: 'ShadowBox',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=16',
    likes: '1.1K',
    views: '88',
    image: "/images/work_%2016.png",
    badge: 'M'
  },
  {
    id: 17,
    title: '중세 백마 탄 여기사',
    author: 'UrbanX',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=17',
    likes: '645',
    views: '34',
    image: "/images/work_%2017.png",
    badge: 'M'
  },
  {
    id: 18,
    title: '오렌지 산업용 공구 컬렉션',
    author: 'Biotech',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=18',
    likes: '2.8K',
    views: '210',
    image: "/images/work_%2018.png",
    badge: 'M'
  },
  {
    id: 19,
    title: '사이버펑크 네온 로봇 암살자',
    author: 'IronWorks',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=19',
    likes: '1.3K',
    views: '92',
    image: "/images/work_%2019.png",
    badge: 'M'
  },
  {
    id: 20,
    title: '낡은 우주복 세트',
    author: 'SandWalker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=20',
    likes: '940',
    views: '71',
    image: "/images/work_%2020.png",
    badge: 'A'
  },
  {
    id: 21,
    title: '강력한 커스텀 스포츠카',
    author: 'Vivid',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=21',
    likes: '1.6K',
    views: '124',
    image: "/images/work_%2021.png",
    badge: 'M'
  },
  {
    id: 22,
    title: '슈퍼빌런 홈랜더 3D 모델',
    author: 'Smithy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=22',
    likes: '2.1K',
    views: '167',
    image: "/images/work_%2022.png",
    badge: 'M'
  },
  {
    id: 23,
    title: '우주 은하 판타지 단검',
    author: 'Naturalist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=23',
    likes: '530',
    views: '28',
    image: "/images/work_%2023.png",
    badge: 'A'
  },
  {
    id: 24,
    title: '레트로 SF 제어 콘솔',
    author: 'Alexey',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v1',
    likes: '1.2K',
    views: '95',
    image: "/images/work_%2024.png",
    badge: 'M'
  },
  {
    id: 25,
    title: '신비로운 마법 숲 마법사',
    author: 'PolygonLab',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    likes: '820',
    views: '49',
    image: "/images/work_%2025.png",
    badge: 'M'
  },
  {
    id: 26,
    title: '북유럽 판타지 여기사',
    author: 'Villager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=26',
    likes: '1.1K',
    views: '82',
    image: "/images/work_%2026.png",
    badge: 'A'
  },
  {
    id: 27,
    title: '동양풍 거대한 근육 전사',
    author: 'Antique',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=27',
    likes: '1.4K',
    views: '108',
    image: "/images/work_%2027.png",
    badge: 'M'
  },
  {
    id: 28,
    title: '로우폴리 항구 도시',
    author: 'TankMaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=28',
    likes: '1.7K',
    views: '134',
    image: "/images/work_%2028.png",
    badge: 'M'
  },
  {
    id: 29,
    title: '현대 도시 고층 빌딩',
    author: 'Swift',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=29',
    likes: '840',
    views: '62',
    image: "/images/work_%2029.png",
    badge: 'A'
  },
  {
    id: 30,
    title: '미니언즈 자유의 여신상',
    author: 'Skyscraper',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=30',
    likes: '2.5K',
    views: '212',
    image: "/images/work_%2030.png",
    badge: 'M'
  },
  {
    id: 31,
    title: '개조 황금 스파이크 돌격소총',
    author: 'BikerX',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=31',
    likes: '1.2K',
    views: '98',
    image: "/images/work_%2031.png",
    badge: 'M'
  },
  {
    id: 32,
    title: '다양한 조경 토피어리 식물',
    author: 'Posco Design',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=32',
    likes: '3.3K',
    views: '287',
    image: "/images/work_%2032.png",
    badge: 'M'
  },
  {
    id: 33,
    title: '웅장한 사자 머리 반지',
    author: 'NatureGraph',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=33',
    likes: '690',
    views: '41',
    image: "/images/work_%2033.png",
    badge: 'A'
  },
  {
    id: 34,
    title: '워해머 스페이스 마린 전사',
    author: 'FireBrand',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=34',
    likes: '1.5K',
    views: '118',
    image: "/images/work_%2034.png",
    badge: 'M'
  },
  {
    id: 35,
    title: '신선한 과일 채소 상자',
    author: 'Creator X',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=35',
    likes: '1.1K',
    views: '85',
    image: "/images/work_%2035.png",
    badge: 'M'
  },
  {
    id: 36,
    title: '귀여운 스타일 스시 세트',
    author: 'SwordSmith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=36',
    likes: '920',
    views: '68',
    image: "/images/work_%2036.png",
    badge: 'A'
  },
  {
    id: 37,
    title: '기괴한 외계 생명체 괴물',
    author: 'Posco Design',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=37',
    likes: '1.8K',
    views: '142',
    image: "/images/work_%2037.png",
    badge: 'M'
  },
  {
    id: 38,
    title: '거대한 판타지 괴수 오우거',
    author: 'Fortress',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=38',
    likes: '1.3K',
    views: '94',
    image: "/images/work_%2038.png",
    badge: 'M'
  },
  {
    id: 39,
    title: '미래형 마스크 사이버펑크 여성',
    author: 'WarMachine',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=39',
    likes: '2.4K',
    views: '196',
    image: "/images/work_%2039.png",
    badge: 'M'
  },
  {
    id: 40,
    title: '어둠의 암살자 닌자 군단',
    author: 'Jung-gon',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=40',
    likes: '4.2K',
    views: '350',
    image: "/images/work_%2040.png",
    badge: 'M'
  },
  {
    id: 41,
    title: '심야의 다크 판타지 성직자',
    author: 'Vivid',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=41',
    likes: '1.1K',
    views: '78',
    image: "/images/work_%2041.png",
    badge: 'M'
  },
  {
    id: 42,
    title: '강력한 판타지 오크',
    author: 'Gadget',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=42',
    likes: '670',
    views: '39',
    image: "/images/work_%2042.png",
    badge: 'A'
  },
  {
    id: 43,
    title: '다양한 로우폴리 동물 컬렉션',
    author: 'ForestGuy',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=43',
    likes: '890',
    views: '64',
    image: "/images/work_%2043.png",
    badge: 'M'
  },
  {
    id: 44,
    title: '조선시대 전통 한국 무관',
    author: 'SteelArt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=44',
    likes: '510',
    views: '24',
    image: "/images/work_%2044.png",
    badge: 'A'
  },
  {
    id: 45,
    title: '은하수 문양 판타지 단검',
    author: 'Horde',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=45',
    likes: '1.4K',
    views: '115',
    image: "/images/work_%2045.png",
    badge: 'M'
  },
  {
    id: 46,
    title: '타락한 흑기사 요새',
    author: 'WhiteWing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=46',
    likes: '1.1K',
    views: '82',
    image: "/images/work_46.png",
    badge: 'A'
  },
  {
    id: 47,
    title: '웅장한 중세 기사 갑옷',
    author: 'Cathedral',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=47',
    likes: '2.3K',
    views: '167',
    image: "/images/work_47.png",
    badge: 'M'
  },
  {
    id: 48,
    title: '신비로운 여전사 황금 검',
    author: 'HyperDrive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=48',
    likes: '3.4K',
    views: '280',
    image: "/images/work_48.png",
    badge: 'M'
  },
  {
    id: 49,
    title: '어둠의 여사제 황금 지팡이',
    author: 'NeonVamp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=49',
    likes: '960',
    views: '74',
    image: "/images/work_49.png",
    badge: 'A'
  },
  {
    id: 50,
    title: '고귀한 왕자 백색 망토',
    author: 'RustyNut',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=50',
    likes: '1.5K',
    views: '124',
    image: "/images/work_50.png",
    badge: 'M'
  },
  {
    id: 51,
    title: '폭포 위 판타지 성채',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_51.png",
    badge: 'M'
  },
  {
    id: 52,
    title: '현대 도시 풍경 빌딩',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_52.png",
    badge: 'M'
  },
  {
    id: 53,
    title: '기사단 거대 용 전투',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_53.png",
    badge: 'M'
  },
  {
    id: 54,
    title: '사이버 사무라이 네온 도시',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_54.png",
    badge: 'M'
  },
  {
    id: 55,
    title: '거대한 괴물 가시 도마뱀',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_55.png",
    badge: 'M'
  },
  {
    id: 56,
    title: '산화 구리 PBR 재질',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_56.png",
    badge: 'M'
  },
  {
    id: 57,
    title: '고대 석벽 PBR 재질',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_57.png",
    badge: 'M'
  },
  {
    id: 58,
    title: '건담 RX782 모델',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_58.png",
    badge: 'M'
  },
  {
    id: 59,
    title: '미래형 로봇 메카닉 전투',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_59.png",
    badge: 'M'
  },
  {
    id: 60,
    title: '밤 도시 소년 검사',
    author: 'Vitality',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_60.png",
    badge: 'M'
  }
];

function Header({ onNavigate, currentPage, activeNav, setActiveNav }: { onNavigate?: (page: any) => void, currentPage?: string, activeNav?: 'market' | 'art' | 'studio' | 'support' | null, setActiveNav?: (nav: 'market' | 'art' | 'studio' | 'support' | null) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [similarityResults, setSimilarityResults] = useState<any[] | null>(null);
  const [isAiSearch, setIsAiSearch] = useState(false);
  
  // Interactive Cart, Notifications, and Profile state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: '엘프궁수 (익스텐션 라이선스)',
      price: '85,000₩',
      rawPrice: 85000,
      image: '/images/work_48.png',
      category: '3D 캐릭터'
    },
    {
      id: 2,
      title: '오크 (상업용 라이선스)',
      price: '120,000₩',
      rawPrice: 120000,
      image: '/images/work_49.png',
      category: '3D 캐릭터'
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 101,
      type: 'like',
      title: 'Vitality님이 내 프로필에 하트를 눌렀습니다.',
      time: '5분 전',
      unread: true,
    },
    {
      id: 102,
      type: 'comment',
      title: '새로운 에셋 "네오 골드 드래곤"에 댓글이 달렸습니다.',
      time: '2시간 전',
      unread: true,
    },
    {
      id: 103,
      type: 'purchase',
      title: '성공적으로 "사이버 네온 드론" 구매가 완료되었습니다.',
      time: '어제',
      unread: false,
    },
    {
      id: 104,
      type: 'system',
      title: '안내: NeoPoly 2.0 엔진 빌드 업데이트가 완료되었습니다.',
      time: '2일 전',
      unread: false,
    }
  ]);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('neopoly_recent_searches');
      return saved ? JSON.parse(saved) : ['검', '사이버펑크 시티', '드래곤', '다크 판타지'];
    } catch {
      return ['검', '사이버펑크 시티', '드래곤', '다크 판타지'];
    }
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('neopoly_recent_searches', JSON.stringify(recentSearches));
    } catch (e) {
      // safe fallback if storage is blocked
    }
  }, [recentSearches]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const query = searchQuery.trim();
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev.slice(0, 6)]);
      }
    }
  };

  const handleRecentClick = (query: string) => {
    setSearchQuery(query);
  };

  const removeRecent = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(item => item !== itemToRemove));
  };

  const handleRemoveCartItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleRemoveNotif = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Filter recommendations matching typed keyword
  const filteredAssets = searchQuery.trim() 
    ? ASSETS.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const suggestedKeywords = ['판타지', '사이버펑크', '메카닉', '3D 캐릭터', '고대 수호룡', 'SF'];

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
    setIsNotifOpen(false);
    setIsFocused(false);
  };

  const toggleNotif = () => {
    setIsNotifOpen(prev => !prev);
    setIsCartOpen(false);
    setIsFocused(false);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prev => !prev);
    setIsNotifOpen(false);
    setIsCartOpen(false);
    setIsFocused(false);
  };

  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.rawPrice, 0);
  const formattedTotalPrice = totalCartPrice.toLocaleString() + '₩';

  return (
    <header className="sticky top-0 z-50 bg-[#08090B]/80 backdrop-blur-xl px-6 h-[76px] flex items-center justify-between border-b border-border-primary/45 w-full gap-4 md:gap-6">
      {/* Left section: Logo + Left-aligned menu with comfortable custom spacing */}
      <div className="flex items-center gap-4 md:gap-8 lg:gap-12 xl:gap-16 shrink-0">
        <div className="flex items-center">
          <img referrerPolicy="no-referrer" 
            src="/images/logo.png?v=2" 
            alt="NeoPoly" 
            onClick={() => { if(onNavigate) onNavigate('home'); if(setActiveNav) setActiveNav(null); }} 
            className="h-[32px] md:h-[35px] w-auto max-h-[37px] object-contain transition-all cursor-pointer" 
          />
        </div>
        
        {/* Navigation Menu (Left-aligned, comfortable spacing) */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-5 lg:gap-7 xl:gap-10 text-[15px] lg:text-[15px] xl:text-[16px] font-semibold text-text-tertiary whitespace-nowrap">
            <li 
              className={`${currentPage === 'home' ? 'text-brand-primary border-b-[2px] border-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
              onClick={() => { if(setActiveNav) setActiveNav(null); if(onNavigate) onNavigate('home'); }}
            >
              Discover
            </li>
            <li 
              className={`${activeNav === 'studio' || currentPage === 'studio' || currentPage === 'full_workflow' || currentPage === 'full_workflow_chat' || currentPage === 'turnaround' || currentPage === 'modeling_generation' ? 'text-brand-primary border-b-[2px] border-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
              onClick={() => { if(setActiveNav) setActiveNav('studio'); if(onNavigate) onNavigate('studio'); }}
            >
              AI Studio
            </li>
            <li 
              className={`${currentPage === 'board' || currentPage === 'notes' || currentPage === 'references' || currentPage === 'note-editor' || currentPage === 'projects' ? 'text-brand-primary border-b-[2px] border-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
              onClick={() => { if(setActiveNav) setActiveNav(null); if(onNavigate) onNavigate('board'); }}
            >
              Board
            </li>

            <li 
              className={`${activeNav === 'support' || currentPage === 'support' ? 'text-brand-primary border-b-[2px] border-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
              onClick={() => { if(setActiveNav) setActiveNav('support'); if(onNavigate) onNavigate('support'); }}
            >
              Support
            </li>
          </ul>
        </nav>
      </div>

      {/* Right Column: Search + Proponent Action widgets (Responsive & beautifully scales with generous, high-readability sizes) */}
      <div className="flex-1 flex items-center gap-3 md:gap-5 min-w-0 justify-end max-w-full">
        {/* Stateful Search Bar Area - Enriched to meet user demands for spacious layout and 14px clear text */}
        <div className="hidden sm:flex relative items-center gap-2 flex-1 max-w-[200px] md:max-w-[320px] lg:max-w-[420px] xl:max-w-[580px]" ref={searchContainerRef}>
          <div className="relative flex-1">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setIsCartOpen(false);
                setIsNotifOpen(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder={isAiSearch ? "예: '마법 효과가 부착된 웅장한 다크 엘프 전사용 대검 찾아줘'" : "에셋, 컬렉션 검색"} 
              className={`w-full bg-surface-primary border rounded-full h-[40px] pl-4 pr-10 text-[12px] md:text-[15px] leading-relaxed font-semibold font-sans focus:outline-none transition-all text-text-primary/95 placeholder:text-text-tertiary/75 ${
                isAiSearch 
                  ? 'border-brand-primary/80 ring-2 ring-brand-primary/10 shadow-[0_0_15px_rgba(224,161,46,0.3)] bg-surface-primary/90' 
                  : 'border-border-primary/80 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/10'
              }`}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-1 rounded-full transition-colors cursor-pointer"
                title="지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Search className={`absolute right-4 w-4 h-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isAiSearch ? 'text-brand-primary' : 'text-text-tertiary'}`} />
          </div>

          {/* AI 자연어 지능형 검색 전환기 (Intelligent Natural Language Toggle with gold status ring) */}
          <button
            type="button"
            onClick={() => setIsAiSearch(!isAiSearch)}
            className={`flex items-center gap-1.5 px-3 h-[40px] rounded-full text-[12px] md:text-[12px] font-bold tracking-tight transition-all shrink-0 select-none border cursor-pointer ${
              isAiSearch
                ? 'bg-brand-primary/15 text-brand-primary border-brand-primary/60 shadow-[0_0_12px_rgba(224,161,46,0.3)]'
                : 'bg-[#15161A] hover:bg-[#1C1F26] text-text-secondary border-border-primary/70 hover:border-brand-primary/30'
            }`}
            title="AI 자연어로 대화식 검색 전환"
          >
            <Sparkles className={`w-[13px] h-[13px] md:w-[14px] md:h-[14px] ${isAiSearch ? 'text-brand-primary scale-110 animate-pulse' : 'text-text-tertiary'}`} />
            <span className="hidden xl:inline text-[12px] font-sans">AI 자연어</span>
            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${isAiSearch ? 'bg-brand-primary shadow-[0_0_8px_#E0A12E]' : 'bg-[#555A64]'}`} />
          </button>

          {/* Floating Search Dropdown Board */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-3.5 w-[310px] sm:w-[500px] md:w-[600px] bg-[#0E1011]/98 border border-border-primary rounded-[12px] p-5.5 shadow-[0_25px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl z-50 flex flex-col gap-5.5 text-left"
              >
                {/* 1. 유사 항목 찾기 Drag & Drop Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-text-primary flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> AI 이미지 유사도 검색
                    </span>
                    {uploadedImage && (
                      <button 
                        type="button"
                        onClick={() => { setUploadedImage(null); setSimilarityResults(null); }}
                        className="text-[12px] text-brand-primary hover:underline font-medium font-sans"
                      >
                        초기화
                      </button>
                    )}
                  </div>

                  {!uploadedImage ? (
                    <label 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const files = e.dataTransfer.files;
                        if (files && files[0]) {
                          const file = files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setUploadedImage(event.target?.result as string);
                            setSimilarityResults([
                              { id: 1, title: '엘프궁수', creator: 'Vitality', img: '/images/work_%2039.png', simLevel: '98.4%' },
                              { id: 2, title: '오크', creator: 'Alexey', img: '/images/work_%2040.png', simLevel: '92.1%' }
                            ]);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className={`border border-dashed rounded-[8px] p-5 flex flex-col items-center justify-center gap-2 transition-all text-center cursor-pointer ${
                        isDragging 
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' 
                          : 'border-border-primary/50 bg-bg-dark/50 hover:bg-bg-dark/80 text-text-tertiary hover:text-text-secondary'
                      }`}
                    >
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files[0]) {
                            const file = files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setUploadedImage(event.target?.result as string);
                              setSimilarityResults([
                                { id: 1, title: '엘프궁수', creator: 'Vitality', img: '/images/work_%2041.png', simLevel: '98.4%' },
                                { id: 2, title: '오크', creator: 'Alexey', img: '/images/work_%2042.png', simLevel: '92.1%' }
                              ]);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Upload className="w-5 h-5 text-brand-primary" />
                      <p className="text-[12px] font-semibold text-text-secondary font-sans">유사 이미지 검색 (드롭 / 클릭)</p>
                      <p className="text-[12px] text-text-tertiary font-sans">여기에 이미지를 놓으시면 유사 3D 모델을 매칭합니다</p>
                    </label>
                  ) : (
                    <div className="bg-bg-dark/40 border border-border-primary/30 rounded-[8px] p-3.5 flex flex-col gap-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded comparison" 
                          className="w-13 h-13 rounded-[4px] object-cover border border-border-primary/30" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold text-text-primary font-sans">업로드된 이미지 기반 매칭 중</p>
                          <p className="text-[12px] text-brand-primary/80 flex items-center gap-1 font-medium font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" /> AI 알고리즘 비전 스캔 완료
                          </p>
                        </div>
                      </div>

                      {/* Display Similarity Results */}
                      <div className="space-y-2 border-t border-border-primary/20 pt-3">
                        <p className="text-[12px] font-sans font-semibold uppercase tracking-wider text-text-secondary">유사 항목 매칭 결과</p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {similarityResults?.map((res, index) => (
                            <div key={index} className="bg-surface-primary/60 hover:bg-surface-primary p-2.5 rounded-[6px] border border-border-primary/20 flex flex-col gap-2 group cursor-pointer">
                              <div className="relative aspect-[16/10] rounded-[4px] overflow-hidden bg-black/40">
                                <img referrerPolicy="no-referrer" src={res.img} alt="" className="w-full h-full object-cover" />
                                <span className="absolute top-1 right-1 bg-brand-primary text-bg-dark px-1 py-0.5 rounded-[3px] text-[9px] font-bold font-sans">{res.simLevel}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-text-primary truncate group-hover:text-brand-primary transition-colors font-sans">{res.title}</p>
                                <p className="text-[10px] text-text-tertiary font-sans truncate font-sans">by {res.creator}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. 최근 검색어 / 추천 키워드 영역 */}
                {!searchQuery ? (
                  <div className="space-y-4 pt-2 border-t border-border-primary/25">
                    {/* Recent Search List */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between px-0.5">
                        <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1 font-sans">
                          <Clock className="w-3 h-3" /> 최근 검색어
                        </span>
                        {recentSearches.length > 0 && (
                          <button 
                            onClick={() => setRecentSearches([])}
                            className="text-[12px] text-brand-primary font-bold hover:underline cursor-pointer border-0 bg-transparent font-sans"
                          >
                            전체 삭제
                          </button>
                        )}
                      </div>
                      
                      {recentSearches.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-1.5 bg-surface-primary/60 hover:bg-surface-primary border border-border-primary/45 rounded-full px-3 py-1 text-[12.5px] font-semibold text-text-secondary hover:text-text-primary transition-all cursor-pointer group"
                              onClick={() => setSearchQuery(item)}
                            >
                              <span className="font-sans">{item}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRecentSearches(prev => prev.filter(v => v !== item));
                                }}
                                className="text-text-tertiary hover:text-red-400 p-0.5 rounded-full transition-colors border-0 bg-transparent"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] text-text-tertiary pl-0.5 font-sans">최근 검색 기록이 없습니다.</p>
                      )}
                    </div>

                    {/* Highly curated Suggested Keywords */}
                    <div className="space-y-2.5 pt-1">
                      <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1 font-sans">
                        <Sparkles className="w-3 h-3 text-brand-primary" /> 추천 태그 키워드
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {suggestedKeywords.map((item, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setSearchQuery(item)}
                            className="bg-brand-primary/5 hover:bg-brand-primary/15 border border-brand-primary/20 hover:border-border-primary/60 rounded-full px-3 py-1 text-[12.5px] font-bold text-brand-primary transition-all cursor-pointer font-sans"
                          >
                            #{item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 3. 검색어 입력 시 - 추천 검색어 및 실시간 에셋 매칭 결과 보드 */
                  <div className="space-y-3.5 pt-2 border-t border-border-primary/25 max-h-[290px] overflow-y-auto custom-scrollbar pr-1">
                    <span className="text-[12px] text-text-tertiary uppercase tracking-wider font-semibold block font-sans">매칭 추천 에셋</span>
                    {filteredAssets.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredAssets.slice(0, 4).map((asset) => (
                          <div 
                            key={asset.id}
                            className="flex items-center gap-3 p-2.5 bg-surface-primary/50 hover:bg-surface-primary border border-border-primary/10 hover:border-brand-primary/30 rounded-[8px] transition-all cursor-pointer group"
                          >
                            <img referrerPolicy="no-referrer" 
                              src={asset.image} 
                              alt="" 
                              className="w-11 h-11 rounded-[4px] object-cover border border-border-primary/20" 
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-[12px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate font-sans">{asset.title}</h5>
                              <p className="text-[12px] text-text-tertiary font-sans truncate">by {asset.author}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary transition-colors hover:scale-105" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-7 font-sans">
                        <p className="text-[12px] text-text-tertiary">"{searchQuery}"에 일치하는 에셋이 캐시에 없습니다.</p>
                        <p className="text-[12px] text-text-tertiary mt-1">자유롭게 다른 키워드 또는 다크 판타지 등으로 검색해보세요.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Cart Icon + Dropdown */}
          <div className="relative" ref={cartRef}>
            <button 
              onClick={toggleCart}
              className={`text-text-tertiary hover:text-text-primary transition-all p-2 hover:scale-110 relative cursor-pointer rounded-full hover:bg-surface-primary/30 ${isCartOpen ? 'text-brand-primary' : ''}`}
              aria-label="장바구니"
            >
              <ShoppingBag className="w-[19px] h-[19px] md:w-[21px] md:h-[21px]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-bg-dark text-[10px] font-extrabold w-[16px] h-[16px] md:w-[18px] md:h-[18px] rounded-full flex items-center justify-center font-sans border border-[#08090B]">
                  {cartItems.length}
                </span>
              )}
            </button>
            <AnimatePresence>
              {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full right-[-50px] sm:right-0 mt-3.5 w-80 md:w-96 bg-[#0E1011]/98 border border-border-primary rounded-[12px] p-4.5 shadow-[0_25px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl z-50 flex flex-col gap-4 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-border-primary pb-3">
                      <span className="text-[16px] font-bold text-text-primary font-sans flex items-center gap-2">
                        <ShoppingBag className="w-[18px] h-[18px] text-brand-primary" /> 장바구니 <span className="text-[12px] text-brand-primary font-sans font-bold bg-brand-primary/15 px-2 py-0.5 rounded-full">{cartItems.length}</span>
                      </span>
                      {cartItems.length > 0 && (
                        <button 
                          onClick={() => setCartItems([])} 
                          className="text-[12px] text-text-tertiary hover:text-red-400 font-semibold transition-colors font-sans border-0 bg-transparent cursor-pointer"
                        >
                          전체 비우기
                        </button>
                      )}
                    </div>

                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar space-y-3 pr-1">
                      {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-surface-primary/40 rounded-[8px] border border-border-primary/10 hover:border-brand-primary/20 transition-all group">
                            <img referrerPolicy="no-referrer" src={item.image} alt="" className="w-12 h-12 rounded-[4px] object-cover border border-border-primary/30 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-[15px] font-semibold text-text-primary truncate font-sans">{item.title}</h5>
                              <span className="text-[12px] text-text-tertiary font-sans">{item.category}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[15px] font-bold text-brand-primary font-sans">{item.price}</p>
                              <button 
                                onClick={(e) => handleRemoveCartItem(item.id, e)}
                                className="text-text-tertiary hover:text-red-400 p-1 rounded-full transition-colors inline-block mt-0.5 border-0 bg-transparent cursor-pointer"
                                title="삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-text-tertiary font-sans space-y-2">
                          <ShoppingBag className="w-8 h-8 mx-auto opacity-30 text-text-tertiary animate-pulse" />
                          <p className="text-[15px]">장바구니가 비어 있습니다.</p>
                          <p className="text-[12px] text-text-tertiary/60">인기 다크 판타지 에셋을 추가해 보세요.</p>
                        </div>
                      )}
                    </div>

                    {cartItems.length > 0 && (
                      <div className="border-t border-border-primary pt-3.5 space-y-3.5">
                        <div className="flex items-center justify-between text-[15px]">
                          <span className="text-text-secondary font-sans font-medium">총 주문 금액:</span>
                          <span className="text-[18px] font-extrabold text-brand-primary font-sans">{formattedTotalPrice}</span>
                        </div>
                        <button className="w-full py-2.5 bg-brand-primary hover:bg-[#F2B038] text-bg-dark text-[15px] font-bold rounded-[6px] tracking-wide transition-colors cursor-pointer text-center font-sans shadow-lg shadow-brand-primary/10 border-0">
                          결제 진행하기
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Icon + Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={toggleNotif}
                className={`text-text-tertiary hover:text-text-primary transition-all relative p-2 hover:scale-110 cursor-pointer rounded-full hover:bg-surface-primary/30 ${isNotifOpen ? 'text-brand-primary' : ''}`}
                aria-label="알림"
              >
                <Bell className="w-[19px] h-[19px] md:w-[21px] md:h-[21px]" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-[#08090B] animate-pulse"></span>
                )}
              </button>
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full right-[-10px] sm:right-0 mt-3.5 w-[340px] md:w-[420px] bg-[#0E1011]/98 border border-border-primary rounded-[12px] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl z-50 flex flex-col gap-4 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-border-primary pb-3.5">
                      <span className="text-[16px] font-bold text-text-primary font-sans flex items-center gap-2 tracking-tight">
                        <Bell className="w-[18px] h-[18px] text-brand-primary" /> 알림 센터 
                        <span className="text-[12px] text-brand-primary font-bold bg-brand-primary/10 px-2 py-0.5 rounded-md">
                          {notifications.filter(n => n.unread).length}개 안읽음
                        </span>
                      </span>
                      <div className="flex gap-4">
                        <button 
                          onClick={handleMarkAllRead} 
                          className="text-[12px] text-brand-primary hover:text-[#f3ba4b] font-semibold font-sans border-0 bg-transparent cursor-pointer transition-colors"
                        >
                          모두 읽음
                        </button>
                        {notifications.length > 0 && (
                          <button 
                            onClick={() => setNotifications([])} 
                            className="text-[12px] text-text-secondary hover:text-red-400 font-semibold font-sans border-0 bg-transparent cursor-pointer transition-colors"
                          >
                            전체 삭제
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-3 pr-1">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                            }}
                            className={`flex items-start gap-4 p-3.5 rounded-[8px] border transition-all cursor-pointer group ${
                              notif.unread 
                                ? 'bg-brand-primary/5 hover:bg-brand-primary/10 border-brand-primary/20 hover:border-brand-primary/30' 
                                : 'bg-surface-primary/30 hover:bg-surface-primary/60 border-border-soft hover:border-border-primary'
                            }`}
                          >
                            <div className="mt-2 flex-shrink-0">
                              {notif.unread ? (
                                <span className="block w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_8px_#E0A12E] animate-pulse" />
                              ) : (
                                <span className="block w-2 h-2 rounded-full bg-text-tertiary/60" />
                              )}
                            </div>
                            
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className={`text-[15px] leading-relaxed transition-colors font-sans ${notif.unread ? 'text-text-primary font-semibold' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[12px] text-text-tertiary block mt-1 font-sans">{notif.time}</span>
                            </div>

                            <button 
                              onClick={(e) => handleRemoveNotif(notif.id, e)}
                              className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-red-400 p-1.5 rounded-full transition-colors self-center duration-150 border-0 bg-transparent cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-text-tertiary font-sans space-y-2">
                          <Bell className="w-9 h-9 mx-auto opacity-30 text-text-tertiary" />
                          <p className="text-[15px] font-medium">새 알림이 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

<div className="relative" ref={profileRef}>
  <div 
    onClick={toggleProfileMenu}
    className="w-8 h-8 rounded-full bg-surface-secondary border border-border-soft cursor-pointer overflow-hidden hover:border-brand-primary transition-colors"
  >
    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mainuser" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
  </div>

  <AnimatePresence>
    {isProfileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute top-full right-[-10px] sm:right-0 mt-3.5 w-[300px] bg-[#0E1011] border border-[#2A2E36]/80 rounded-[12px] pb-1 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl z-50 flex flex-col font-sans"
      >
        {/* Header: User Info */}
        <div className="flex items-center gap-3 p-4 border-b border-[#2A2E36]/50">
          <img referrerPolicy="no-referrer" src="https://api.dicebear.com/7.x/avataaars/svg?seed=mainuser" alt="Profile" className="w-[42px] h-[42px] rounded-full border border-border-soft object-cover" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-text-primary tracking-tight">NeoCreator</span>
              <span className="text-[10px] bg-brand-primary/20 text-brand-primary border border-brand-primary/30 px-1.5 py-[1px] rounded uppercase font-bold tracking-wider">PRO</span>
            </div>
            <span className="text-[12px] text-text-secondary">rlawlghks898@gmail.com</span>
          </div>
        </div>

        {/* AI Studio Credit Box */}
        <div className="mx-4 mt-4 p-3.5 bg-surface-primary/60 border border-border-soft/60 rounded-[8px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-text-secondary flex items-center gap-1.5 font-bold tracking-tight">
              <Sparkles className="w-4 h-4 text-brand-primary" /> AI 스튜디오 크레딧
            </span>
            <span className="text-[12px] text-brand-primary font-sans font-bold tracking-tight">320 / 500 CC</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-full mt-2.5">
            <div className="h-full bg-brand-primary w-[64%] shadow-[0_0_8px_rgba(224,161,46,0.6)]"></div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mx-4 mt-3">
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('uploads'); }} className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A1814] text-brand-primary text-[14px] font-bold rounded-[8px] border border-brand-primary/20 hover:bg-[#1F1A12] hover:border-brand-primary/40 transition-colors cursor-pointer tracking-tight shadow-sm">
            <Upload className="w-[18px] h-[18px]" /> 내가 업로드한 작업물 관리
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col mt-4 px-2">
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('projects'); }} className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-semibold tracking-tight">
            <Folder className="w-[20px] h-[20px]" /> 내 프로젝트 라이브러리
          </button>
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('notes'); }} className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-semibold tracking-tight">
            <FileText className="w-[20px] h-[20px]" /> 아이디어 노트
          </button>
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('references'); }} className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-semibold tracking-tight">
            <LayoutGrid className="w-[20px] h-[20px]" /> 레퍼런스 보드
          </button>
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('favorites'); }} className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-semibold tracking-tight">
            <Heart className="w-[20px] h-[20px]" /> 관심 목록
          </button>
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('purchases'); }} className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-semibold tracking-tight">
            <LayoutGrid className="w-[20px] h-[20px]" /> 구매한 에셋
          </button>
          <button 
            onClick={() => {
              setIsProfileMenuOpen(false);
              if(onNavigate) onNavigate('settings');
            }}
            className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-semibold tracking-tight"
          >
            <Settings className="w-[20px] h-[20px]" /> 계정 및 프로필 설정
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-[#2A2E36]/50 mt-2 p-1.5 px-2">
          <button className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-[#9A9DA3] hover:bg-red-500/10 hover:text-[#E46B6B] transition-colors cursor-pointer rounded-lg text-[14px] font-semibold tracking-tight">
            <LogOut className="w-[20px] h-[20px]" /> 로그아웃
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
        </div>
      </div>
    </header>
  );
}


function Hero({ onNavigate }: { onNavigate?: (page: any) => void }) {
  return (
    <section className="relative w-full h-[420px] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={HERO_IMAGE} 
          alt="Hero" 
          className="w-full h-[calc(100%+20px)] object-cover object-top -translate-y-5" 
          referrerPolicy="no-referrer"
        />
        {/* Adjusted cinematic overlays (reduced opacity) */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/75 via-bg-dark/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/70 via-transparent to-transparent"></div>
      </div>
      
      <div className="max-w-[2006px] mx-auto px-6 h-full flex flex-col justify-center items-center md:items-start relative z-10 pt-4 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full md:pl-[8%] lg:pl-[10%] md:translate-x-[300px]"
        >
          <div className="space-y-3 mb-8">
            <h1 className="text-[36px] md:text-[44px] font-bold leading-[1.2] tracking-tight text-text-primary drop-shadow-2xl font-display">
              아이디어를 현실로<br />
              <span className="text-text-primary/95">3D 제작의 모든 과정</span>
            </h1>
            <p className="text-text-tertiary text-[15px] md:text-[15px] leading-[1.6] font-medium max-w-sm mx-auto md:mx-0 opacity-80">
              레퍼런스 수집부터 AI 생성, 모델링까지<br />
              당신의 3D 워크플로우를 하나로 연결합니다.
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate && onNavigate('studio')}
            className="group relative px-6 py-2 border border-brand-primary/80 text-brand-primary rounded-sm text-[12px] font-bold transition-all hover:bg-brand-primary hover:text-bg-dark bg-transparent">
            AI 스튜디오 시작
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryNav() {
  const [active, setActive] = useState('all');
  
  return (
    <section className="relative">
      <div className="flex items-center gap-0 h-[100px] overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`flex flex-col items-center justify-center min-w-[110px] w-[110px] h-full transition-all group shrink-0 ${
              active === cat.id 
                ? 'text-brand-primary' 
                : 'text-text-tertiary hover:text-brand-primary/60'
            }`}
          >
            <div className={`flex items-center justify-center transition-all mb-1`}>
              <cat.icon className={active === cat.id ? "w-[30px] h-[30px]" : "w-[30px] h-[30px] opacity-60 group-hover:opacity-100 transition-opacity"} />
            </div>
            <span className={`text-[16px] font-semibold tracking-tight`}>{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

type QuickDropTarget = "projects" | "notes" | "references";

type QuickCollectAsset = {
  id: number;
  title: string;
  image: string;
  author?: string;
  badge?: string;
  addedAt: number;
  memo?: string;
  groupName?: string;
};

type QuickCollections = Record<QuickDropTarget, QuickCollectAsset[]>;

type QuickCollectOption = {
  name: string;
  image: string;
  count: string;
  helper?: string;
};

const QUICK_COLLECTIONS_KEY = "neopoly_quick_collections_v1";
const QUICK_ASSET_MIME = "application/x-neopoly-asset";

const emptyQuickCollections = (): QuickCollections => ({
  projects: [],
  notes: [],
  references: [],
});

const toQuickCollectAsset = (asset: any): QuickCollectAsset => ({
  id: Number(asset?.id ?? Date.now()),
  title: String(asset?.title ?? "Untitled Asset"),
  image: String(asset?.image ?? ""),
  author: asset?.author,
  badge: asset?.badge,
  addedAt: Date.now(),
});

const readDraggedAsset = (event: React.DragEvent): QuickCollectAsset | null => {
  const payload =
    event.dataTransfer.getData(QUICK_ASSET_MIME) ||
    event.dataTransfer.getData("application/json");
  if (!payload) return null;
  try {
    return toQuickCollectAsset(JSON.parse(payload));
  } catch {
    return null;
  }
};

function QuickDropCard({
  title,
  description,
  icon: Icon,
  items,
  onNavigate,
  onDropAsset,
}: {
  title: string;
  description: string;
  icon: any;
  items: QuickCollectAsset[];
  onNavigate: () => void;
  onDropAsset: (asset: QuickCollectAsset) => void;
}) {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const asset = readDraggedAsset(event);
        if (asset) onDropAsset(asset);
      }}
      className="min-h-[220px] rounded-xl border border-[#2A2E36] bg-[#0A0B0D]/80 p-4 transition-colors hover:border-brand-primary/45"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#15171C] text-brand-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-white">{title}</h3>
            <p className="text-[11px] text-text-tertiary">{description}</p>
          </div>
        </div>
        <button
          onClick={onNavigate}
          className="text-[11px] font-bold text-text-tertiary transition hover:text-brand-primary"
        >
          열기 <ChevronRight className="inline h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.slice(0, 4).map((item) => (
          <div key={`${item.id}-${item.addedAt}`} className="overflow-hidden rounded-lg border border-[#1F2329] bg-[#141518]">
            <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover" referrerPolicy="no-referrer" />
            <div className="p-2">
              <p className="truncate text-[11px] font-bold text-white">{item.title}</p>
              {item.groupName && <p className="mt-0.5 truncate text-[10px] text-brand-primary">{item.groupName}</p>}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex h-[120px] items-center justify-center rounded-lg border border-dashed border-[#2A2E36] text-[12px] font-bold text-text-tertiary">
          이미지를 여기에 드롭
        </div>
      )}
    </div>
  );
}

function QuickCollectDialog({
  request,
  onClose,
  onSave,
}: {
  request: { target: "notes" | "references"; asset: QuickCollectAsset } | null;
  onClose: () => void;
  onSave: (mode: "existing" | "new", groupName: string, memo?: string) => void;
}) {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [memo, setMemo] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!request) return;
    setMode("existing");
    setMemo("");
    setNewName(request.target === "notes" ? `${request.asset.title} 메모` : `${request.asset.title} 보드`);
  }, [request]);

  if (!request) return null;

  const isNote = request.target === "notes";
  const availableNotes = (() => {
    try {
      const saved = localStorage.getItem("neopoly_notes_v2");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : NOTES;
    } catch {
      return NOTES;
    }
  })();
  const existingOptions: QuickCollectOption[] = isNote
    ? availableNotes.map((note) => ({
        name: note.title,
        image: note.images[0] ?? request.asset.image,
        count: `${note.images.length}장`,
        helper: note.date,
      }))
    : REFERENCE_BOARDS.map((board) => ({
        name: board.label,
        image: board.image,
        count: `${ASSETS.filter((asset) => boardMatchesAsset(board, asset)).length}개`,
        helper: "Reference board",
      }));
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-5 backdrop-blur-[1px]">
      <div className="w-full max-w-[600px] rounded-xl border border-[#2A2E36] bg-[#0E1011] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.65)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold text-brand-primary">{isNote ? "노트에 추가" : "레퍼런스 보드에 추가"}</p>
            <h3 className="mt-1 text-[20px] font-bold text-white">{request.asset.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-text-tertiary transition hover:bg-[#1A1C20] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex gap-2 rounded-lg bg-[#08090B] p-1">
          {[
            ["existing", "기존에 추가"],
            ["new", isNote ? "새 노트" : "새 보드"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMode(id as "existing" | "new")}
              className={`flex-1 rounded-md px-3 py-2 text-[13px] font-bold transition ${
                mode === id ? "bg-brand-primary text-bg-dark" : "text-text-tertiary hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "existing" ? (
          <div className="grid max-h-[360px] gap-2 overflow-y-auto pr-1 custom-scrollbar">
            {existingOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => onSave("existing", option.name, memo)}
                className="flex items-center gap-3 rounded-lg border border-[#1F2329] bg-[#141518] p-2.5 text-left transition hover:border-brand-primary/60 hover:bg-[#191B20]"
              >
                <img
                  src={option.image}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-md border border-white/10 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-bold text-white">{option.name}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-text-tertiary">{option.count}</span>
                </span>
                <Plus className="h-4 w-4 shrink-0 text-brand-primary" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              className="w-full rounded-lg border border-[#2A2E36] bg-[#08090B] px-4 py-3 text-[14px] font-bold text-white outline-none focus:border-brand-primary"
              placeholder={isNote ? "새 노트 이름" : "새 보드 이름"}
            />
            <textarea
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              className="h-28 w-full resize-none rounded-lg border border-[#2A2E36] bg-[#08090B] px-4 py-3 text-[13px] text-white outline-none focus:border-brand-primary"
              placeholder={isNote ? "옆에 남길 메모를 입력하세요." : "보드 설명이나 참고 메모를 입력하세요."}
            />
            <button
              onClick={() => onSave("new", newName.trim() || (isNote ? "새 노트" : "새 레퍼런스 보드"), memo)}
              className="w-full rounded-lg bg-brand-primary py-3 text-[14px] font-black text-bg-dark transition hover:bg-brand-hover"
            >
              저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickCollectPanel({
  isOpen,
  collections,
  onOpen,
  onClose,
  onOpenDrop,
  onDropTarget,
  onNavigate,
}: {
  isOpen: boolean;
  collections: QuickCollections;
  onOpen: () => void;
  onClose: () => void;
  onOpenDrop: (asset: QuickCollectAsset | null) => void;
  onDropTarget: (target: QuickDropTarget, asset: QuickCollectAsset) => void;
  onNavigate: (page: PageType) => void;
}) {
  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 left-1/2 z-40 transform"
          >
            <button
              onClick={onOpen}
              onDragOver={(event) => {
                event.preventDefault();
                onOpen();
              }}
              onDrop={(event) => {
                event.preventDefault();
                onOpenDrop(readDraggedAsset(event));
              }}
              className="flex items-center gap-2 rounded-[8px] border border-border-primary/80 bg-bg-secondary/95 px-8 py-3 text-[15px] font-bold tracking-wide text-text-primary shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all hover:border-brand-primary hover:text-brand-primary"
            >
              <PanelRightOpen className="h-4 w-4" />
              패널 열기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 150, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 150, x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-6 left-1/2 z-50 w-[1536px] max-w-[95%] rounded-[12px] border border-border-primary/50 bg-[#0E1011]/95 p-5 pt-12 shadow-[0_30px_60px_rgba(0,0,0,0.95)] backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-50 rounded-md p-1.5 text-text-tertiary transition hover:bg-[#1c1d22]/80 hover:text-brand-primary"
              title="패널 닫기"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <div className="xl:col-span-5">
                <QuickDropCard
                  title="내 프로젝트"
                  description="드롭하면 프로젝트 보드에 바로 추가"
                  icon={Folder}
                  items={collections.projects}
                  onNavigate={() => onNavigate("projects")}
                  onDropAsset={(asset) => onDropTarget("projects", asset)}
                />
              </div>
              <div className="xl:col-span-3">
                <QuickDropCard
                  title="최근 노트"
                  description="기존 노트 또는 새 노트 선택"
                  icon={FileText}
                  items={collections.notes}
                  onNavigate={() => onNavigate("notes")}
                  onDropAsset={(asset) => onDropTarget("notes", asset)}
                />
              </div>
              <div className="xl:col-span-4">
                <QuickDropCard
                  title="레퍼런스 보드"
                  description="새 보드 저장 또는 기존 보드 추가"
                  icon={LayoutGrid}
                  items={collections.references}
                  onNavigate={() => onNavigate("references")}
                  onDropAsset={(asset) => onDropTarget("references", asset)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AssetCard({
  asset,
  isFavorite,
  onToggleFavorite,
  onOpenProduct,
  onQuickCollect,
  onAssetDragStart,
}: {
  asset: any,
  key?: any,
  isFavorite?: boolean,
  onToggleFavorite?: (e: React.MouseEvent) => void,
  onOpenProduct?: (asset: any) => void,
  onQuickCollect?: (target: QuickDropTarget, asset: any) => void,
  onAssetDragStart?: (asset: any, e: React.DragEvent) => void,
}) {
  const isMarket = asset.badge === 'M';
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => onOpenProduct?.(asset)}
      draggable
      onDragStart={(e) => onAssetDragStart?.(asset, e as unknown as React.DragEvent)}
      className="group relative rounded-[6px] overflow-hidden bg-surface-primary border border-border-soft shadow-xl cursor-pointer flex flex-col aspect-[16/10]"
    >
      <div className="relative flex-1 overflow-hidden">
        {/* Main Image */}
        <img 
          src={asset.image} 
          alt={asset.title} 
          className="w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-[1.007] group-hover:brightness-[0.82]" 
          referrerPolicy="no-referrer"
        />

        {/* Badge - M or A */}
        <div className={`absolute top-2 right-2 w-6 h-6 rounded-[6px] flex items-center justify-center text-[12px] font-extrabold backdrop-blur-[8px] z-20 transition-all duration-200 ${
          isMarket 
            ? 'bg-[#E0A12E]/40 text-[#F0B43A] group-hover:bg-[#E0A12E]/50' 
            : 'bg-[#4C88D9]/40 text-[#A0C5FF] group-hover:bg-[#4C88D9]/50'
        }`}>
          {asset.badge}
        </div>

        {/* Hover Information Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/95 via-black/60 to-transparent hidden md:flex flex-col justify-end p-4 pb-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-[300ms] ease-out z-10">
          <h3 className="text-[17px] font-normal text-text-primary line-clamp-2 leading-[1.3] mb-0.5">
            {asset.title}
          </h3>
          <p className="text-[12px] text-text-secondary font-medium">
            {asset.author}
          </p>
          <div className="flex items-center gap-3 mt-2 text-[12px] text-text-secondary">
            <div className="flex items-center gap-1 opacity-75 cursor-pointer hover:opacity-100 transition-opacity" onClick={onToggleFavorite}>
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} /> {asset.likes}
            </div>
            <div className="flex items-center gap-1 opacity-75">
              <Eye className="w-3.5 h-3.5" /> {asset.views}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickCollect?.("references", asset);
              }}
              className="rounded-md border border-white/15 bg-black/55 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur transition hover:border-brand-primary hover:text-brand-primary"
            >
              레퍼런스
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickCollect?.("notes", asset);
              }}
              className="rounded-md border border-white/15 bg-black/55 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur transition hover:border-brand-primary hover:text-brand-primary"
            >
              메모
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Title View (Always visible on mobile, hidden on desktop hover area) */}
      <div className="md:hidden p-3 bg-surface-secondary border-t border-border-soft">
        <h3 className="text-[15px] font-medium text-text-primary line-clamp-1 leading-tight">{asset.title}</h3>
      </div>
    </motion.div>
  );
}

const PRODUCT_DETAIL_DATA: Record<number, {
  slug: string;
  imagePrefix: string;
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  stats: [string, string, string];
  tags: string[];
  description: string;
  fileInfo: [string, string][];
  galleryCount: number;
}> = {
  1: {
    slug: 'elf',
    imagePrefix: 'Discover_in_elf',
    title: 'Fantasy Elf Archer',
    category: 'Market',
    price: '₩70,000',
    originalPrice: '₩100,000',
    stats: ['1.2K', '156', '4.8'],
    tags: ['캐릭터', '몬스터', 'Rigged', 'PBR', '판타지', '궁수'],
    description: '숲을 배경으로 한 판타지 엘프 궁수 캐릭터입니다. 실루엣이 선명하고 턴어라운드와 와이어 참고가 포함되어 게임, 애니메이션, 컨셉 제작에 바로 활용하기 좋습니다.',
    fileInfo: [['파일 형식', 'FBX, OBJ, Blend'], ['폴리곤 수', '25,000 tris'], ['텍스처 해상도', '4K (4096x4096)'], ['리깅', '미포함 (Humanoid)']],
    galleryCount: 4,
  },
  2: {
    slug: 'orc',
    imagePrefix: 'Discover_in_orc',
    title: 'Fantasy Oak Warrior',
    category: 'Market',
    price: '₩90,000',
    originalPrice: '₩100,000',
    stats: ['1.2K', '156', '4.8'],
    tags: ['캐릭터', '몬스터', 'Rigged', 'PBR', '판타지', '오크'],
    description: '강한 체형과 큰 목재 무기를 중심으로 구성한 오크 전사 캐릭터입니다. 장비 모듈과 턴어라운드 참고가 있어 모델링, 텍스처링, 리깅 단계에 활용할 수 있습니다.',
    fileInfo: [['파일 형식', 'FBX, OBJ, Blend'], ['폴리곤 수', '25,000 tris'], ['텍스처 해상도', '4K (4096x4096)'], ['리깅', '미포함 (Humanoid)']],
    galleryCount: 5,
  },
  3: {
    slug: 'wyvern',
    imagePrefix: 'Discover_in_Wyvern',
    title: 'Wyvern',
    category: 'Market',
    price: '₩89,000',
    originalPrice: '₩120,000',
    stats: ['1.2K', '156', '4.8'],
    tags: ['캐릭터', '몬스터', 'Rigged', 'PBR', '판타지', '크리처'],
    description: '커다란 날개와 긴 꼬리 실루엣이 특징인 와이번 크리처 모델입니다. 비행 포즈, 턴어라운드, 와이어 프레임 참고를 기반으로 고품질 크리처 작업에 적합합니다.',
    fileInfo: [['파일 형식', 'FBX, OBJ, Blend'], ['폴리곤 수', '25,000 tris'], ['텍스처 해상도', '4K (4096x4096)'], ['리깅', '미포함 (Humanoid)']],
    galleryCount: 4,
  },
  4: {
    slug: 'dinosaur',
    imagePrefix: 'Discover_in_Dinosaur',
    title: 'Fantasy Warrior Character',
    category: 'Market',
    price: '₩89,000',
    originalPrice: '₩120,000',
    stats: ['1.2K', '156', '4.8'],
    tags: ['동물', '탈것', 'Rigged', 'PBR', '판타지', '사막'],
    description: '사막과 정글 모두에 어울리는 안장 장착형 판타지 탈것 모델입니다. 측면, 후면, 상단 자료와 와이어 프레임 자료를 포함한 제작 참고형 상세입니다.',
    fileInfo: [['파일 형식', 'FBX, OBJ, Blend'], ['폴리곤 수', '25,000 tris'], ['텍스처 해상도', '4K (4096x4096)'], ['리깅', '미포함']],
    galleryCount: 4,
  },
  5: {
    slug: 'street',
    imagePrefix: 'Discover_in_Street',
    title: 'Street Dunker',
    category: 'Market',
    price: '₩50,000',
    originalPrice: '₩120,000',
    stats: ['0.2K', '20', '3.5'],
    tags: ['캐릭터', '남자', '농구', 'PBR', '스포츠'],
    description: '도심 스트릿 농구 문화를 기반으로 제작된 캐릭터입니다. 스포츠웨어 디테일과 자연스러운 체형 비율을 살려 캐주얼 게임, 영상, 애니메이션에 활용 가능합니다.',
    fileInfo: [['파일 형식', 'FBX, OBJ, Blend'], ['폴리곤 수', '25,000 tris'], ['텍스처 해상도', '4K (4096x4096)'], ['리깅', '미포함 (Humanoid)']],
    galleryCount: 4,
  },
  6: {
    slug: 'rhino',
    imagePrefix: 'Discover_in_Rhino',
    title: 'Rhinoceros Warrior',
    category: 'Market',
    price: '₩75,000',
    originalPrice: '₩120,000',
    stats: ['1.2K', '156', '4.8'],
    tags: ['캐릭터', '몬스터', 'Rigged', 'PBR', '판타지', '크리처'],
    description: '묵직한 체형의 코뿔소 전사 캐릭터입니다. 나무와 금속 장비가 섞인 판타지 방어구 구성으로 액션 게임용 적 캐릭터나 보스 캐릭터에 어울립니다.',
    fileInfo: [['파일 형식', 'FBX, OBJ, Blend'], ['폴리곤 수', '25,000 tris'], ['텍스처 해상도', '4K (4096x4096)'], ['리깅', '미포함 (Humanoid)']],
    galleryCount: 5,
  },
  7: {
    slug: 'posco_a',
    imagePrefix: 'Discover_in_Posco1',
    title: 'My Posco',
    category: 'Art',
    price: '문의',
    originalPrice: '',
    stats: ['1.2K', '156', '4.8'],
    tags: ['산업', '건축', '모듈', 'PBR', '기업', '시뮬레이션'],
    description: '산업 설비와 조선, 건축 모듈을 한 화면에서 확인할 수 있는 포스코 스타일 3D 에셋 구성입니다. 기업 교육, 설명형 콘텐츠, 산업 시뮬레이션에 어울립니다.',
    fileInfo: [['파일 형식', 'FBX, OBJ, Blend'], ['폴리곤 수', '25,000 tris'], ['텍스처 해상도', '4K (4096x4096)'], ['리깅', '미포함']],
    galleryCount: 11,
  },
  8: {
    slug: 'posco_b',
    imagePrefix: 'Discover_in_Posco2',
    title: 'My Posco',
    category: 'Art',
    price: '문의',
    originalPrice: '',
    stats: ['1.2K', '156', '4.8'],
    tags: ['산업', '건축', '철골', 'PBR', '기업', '시뮬레이션'],
    description: '철골 구조물, 와이어, 주택 구조, 건축 모듈 중심의 포스코 스타일 3D 에셋 구성입니다. 단계별 산업 모델 소개와 기술 콘텐츠에 적합합니다.',
    fileInfo: [['파일 형식', 'FBX, OBJ, Blend'], ['폴리곤 수', '25,000 tris'], ['텍스처 해상도', '4K (4096x4096)'], ['리깅', '미포함']],
    galleryCount: 11,
  },
};

const PRODUCT_FALLBACK_IMAGE_IDS: Record<number, number[]> = {
  1: [1, 16, 17, 25],
  2: [2, 42, 6, 41],
  3: [3, 38, 53, 55],
  4: [4, 26, 43, 27],
  5: [5, 20, 21, 39],
  6: [6, 37, 31, 38],
  7: [7, 8, 12, 13, 14, 15, 28, 29, 32, 52],
  8: [8, 7, 13, 14, 15, 28, 29, 32, 52, 57],
};

const PRODUCT_IMAGE_ORDER: Record<number, number[]> = {
  1: [1, 2, 3, 4],
  2: [1, 2, 3, 4, 5],
  3: [4, 1, 2, 3],
  4: [4, 1, 2, 3],
  5: [4, 1, 2, 3],
  6: [5, 1, 2, 3, 4],
  7: [11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  8: [11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

function productFallbackImage(assetId: number, order: number, fallback: string) {
  const ids = PRODUCT_FALLBACK_IMAGE_IDS[assetId] ?? [assetId];
  const fallbackAsset = ASSETS.find((item) => item.id === ids[(order - 1) % ids.length]);
  return fallbackAsset?.image ?? fallback;
}

function detailImageCandidates(product: { slug: string; imagePrefix: string }, assetId: number, index: number) {
  const padded = String(index).padStart(2, '0');
  return [
    `/images/${product.imagePrefix}${padded}.png`,
    `/images/${product.imagePrefix}${index}.png`,
    `/images/Discover_in_${product.slug}_${index}.png`,
    `/images/Discover_in_${product.slug}_${padded}.png`,
    `/images/Discover_in_${assetId}_${index}.png`,
    `/images/Discover_in_${assetId}_${padded}.png`,
    `/images/Discover_in_${product.slug}.png`,
  ];
}

function SmartProductImage({
  candidates,
  fallback,
  alt,
  className,
}: {
  candidates: string[];
  fallback: string;
  alt: string;
  className: string;
}) {
  const sources = [...candidates, fallback];
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sources[Math.min(sourceIndex, sources.length - 1)];

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        setSourceIndex((prev) => Math.min(prev + 1, sources.length - 1));
      }}
    />
  );
}

function ProductDetailPage({
  assetId,
  onNavigateHome,
  onOpenProduct,
  onQuickCollect,
  onAssetDragStart,
}: {
  assetId: number;
  onNavigateHome: () => void;
  onOpenProduct: (assetId: number) => void;
  onQuickCollect?: (target: QuickDropTarget, asset: any) => void;
  onAssetDragStart?: (asset: any, e: React.DragEvent) => void;
}) {
  const asset = ASSETS.find((item) => item.id === assetId) ?? ASSETS[0];
  const product = PRODUCT_DETAIL_DATA[asset.id] ?? PRODUCT_DETAIL_DATA[1];
  const recommended = [5, 2, 1, 6]
    .map((id) => ASSETS.find((item) => item.id === id))
    .filter(Boolean) as typeof ASSETS;

  const gallery = PRODUCT_IMAGE_ORDER[asset.id] ?? Array.from({ length: product.galleryCount }, (_, index) => index + 1);
  const [heroOrder, ...detailOrders] = gallery;

  return (
    <main className="flex-1 bg-[#08090B]">
      <div className="mx-auto w-full max-w-[2560px] px-4 py-8 sm:px-6 2xl:px-8 min-[2200px]:px-10">
        <button
          onClick={onNavigateHome}
          className="mb-5 inline-flex items-center gap-2 text-[13px] font-bold text-text-tertiary transition hover:text-brand-primary"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Discover로 돌아가기
        </button>

        <div
          draggable
          onDragStart={(event) => onAssetDragStart?.(asset, event)}
          className="group relative mb-6 overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D]"
        >
          <SmartProductImage
            candidates={detailImageCandidates(product, asset.id, heroOrder)}
            fallback={productFallbackImage(asset.id, heroOrder, asset.image)}
            alt={product.title}
            className="h-auto w-full object-contain"
          />
          <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onQuickCollect?.("references", asset);
              }}
              className="rounded-md border border-white/15 bg-black/60 px-3 py-2 text-[12px] font-bold text-white backdrop-blur transition hover:border-brand-primary hover:text-brand-primary"
            >
              레퍼런스
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onQuickCollect?.("notes", asset);
              }}
              className="rounded-md border border-white/15 bg-black/60 px-3 py-2 text-[12px] font-bold text-white backdrop-blur transition hover:border-brand-primary hover:text-brand-primary"
            >
              메모
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px] min-[2200px]:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0 space-y-3">
            {detailOrders.map((order) => (
              <div
                key={order}
                draggable
                onDragStart={(event) => onAssetDragStart?.(asset, event)}
                className="group relative overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D]"
              >
                <SmartProductImage
                  candidates={detailImageCandidates(product, asset.id, order)}
                  fallback={productFallbackImage(asset.id, order, asset.image)}
                  alt={`${product.title} detail ${order}`}
                  className="h-auto w-full object-contain"
                />
                <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onQuickCollect?.("references", asset);
                    }}
                    className="rounded-md border border-white/15 bg-black/60 px-3 py-2 text-[12px] font-bold text-white backdrop-blur transition hover:border-brand-primary hover:text-brand-primary"
                  >
                    레퍼런스
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onQuickCollect?.("notes", asset);
                    }}
                    className="rounded-md border border-white/15 bg-black/60 px-3 py-2 text-[12px] font-bold text-white backdrop-blur transition hover:border-brand-primary hover:text-brand-primary"
                  >
                    메모
                  </button>
                </div>
              </div>
            ))}
          </section>

          <aside className="xl:sticky xl:top-[92px] xl:self-start">
            <div className="flex flex-col gap-5">
              <ProductPurchasePanel asset={asset} product={product} />
              <ProductLicensePanel />
              <ProductStatsPanel stats={product.stats} />
              <ProductInfoPanel product={product} />
            </div>
          </aside>
        </div>
      </div>

      <section className="border-t border-[#1F2329] px-6 py-16">
        <div className="mx-auto max-w-[2560px]">
          <h2 className="mb-8 text-[24px] font-bold text-white">추천 모델링</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recommended.map((item) => (
              <button
                key={item.id}
                onClick={() => onOpenProduct(item.id)}
                draggable
                onDragStart={(event) => onAssetDragStart?.(item, event)}
                className="overflow-hidden rounded-lg border border-[#1F2329] bg-[#181A1F] text-left transition hover:border-brand-primary/50"
              >
                <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover" referrerPolicy="no-referrer" />
                <div className="p-3">
                  <span className="mb-2 inline-flex rounded-sm bg-brand-primary px-1.5 py-0.5 text-[10px] font-bold text-bg-dark">
                    Market
                  </span>
                  <h3 className="text-[14px] font-bold text-white line-clamp-1">{item.id === 5 ? 'Street Dunker' : 'Fantasy Character 1'}</h3>
                  <p className="mt-1 text-[12px] text-text-tertiary">고품질 3D 캐릭터 모델</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[14px] font-bold text-brand-primary">{item.id === 5 ? '₩89,000' : '₩62K'}</span>
                    <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
                      <Heart className="h-3 w-3" />
                      485
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function BoardPage({
  onNavigate,
  favorites,
  toggleFavorite,
}: {
  onNavigate: (page: PageType) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}) {
  const [boardView, setBoardView] = useState<"all" | "notes" | "references">("all");
  const [boardNoteFilter, setBoardNoteFilter] = useState("all");
  const [boardReferenceCategory, setBoardReferenceCategory] = useState("all");

  const boardItems = [
    { id: "all" as const, label: "전체", desc: "노트와 레퍼런스 함께 보기", icon: LayoutGrid },
    { id: "notes" as const, label: "노트", desc: "아이디어 / 작업 메모", icon: FileText },
    { id: "references" as const, label: "레퍼런스", desc: "이미지 / 보드 / 자료", icon: ImageIcon },
  ];

  const liveNotes = NOTES;
  const liveReferences = ASSETS.filter((asset) =>
    REFERENCE_BOARDS.some((board) => boardMatchesAsset(board, asset as any)),
  );
  const noteTags = liveNotes.flatMap((note) => note.tags);
  const noteFilterFor = (noteIndex: number, tagIndex: number) => liveNotes[noteIndex]?.tags[tagIndex] ?? "all";
  const noteCountFor = (filter: string) =>
    filter === "all" ? liveNotes.length : liveNotes.filter((note) => note.tags.includes(filter)).length;
  const referenceCountFor = (category: string) => {
    if (category === "all") return liveReferences.length;
    if (category === "favorites") return favorites.length;
    if (category === "recent") return Math.min(12, liveReferences.length);
    const board = REFERENCE_BOARDS.find((item) => item.id === category);
    return board ? ASSETS.filter((asset) => boardMatchesAsset(board, asset as any)).length : 0;
  };

  const noteFolders = [
    { label: "캐릭터 컨셉", filter: noteFilterFor(0, 2) },
    { label: "환경 / 배경", filter: noteFilterFor(2, 0) },
    { label: "무기 / 장비", filter: noteFilterFor(5, 0) },
    { label: "오크 제작", filter: noteFilterFor(3, 0) },
  ];

  const submenuButton = (
    label: string,
    count: number,
    active: boolean,
    onClick: () => void,
    icon?: React.ReactNode,
  ) => (
    <button
      key={label}
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-[15px] font-bold transition ${
        active ? "bg-[#171A20] text-white" : "text-text-tertiary hover:bg-[#121417] hover:text-white"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        {icon && <span className={active ? "text-brand-primary" : "text-text-tertiary"}>{icon}</span>}
        <span className="truncate">{label}</span>
      </span>
      <span className={`ml-3 shrink-0 text-[14px] ${active ? "text-brand-primary" : "text-text-tertiary"}`}>
        {count}
      </span>
    </button>
  );

  const renderNoteSubMenu = () => (
    <div className="ml-4 mt-2 space-y-4 pl-1">
      <div className="space-y-1.5">
        {submenuButton("전체 노트", liveNotes.length, boardNoteFilter === "all", () => setBoardNoteFilter("all"), <LayoutGrid className="h-4 w-4" />)}
        {submenuButton("즐겨찾기", liveNotes.filter((note) => note.starred).length, boardNoteFilter === "starred", () => setBoardNoteFilter("starred"), <Star className="h-4 w-4" />)}
        {submenuButton("최근 수정", liveNotes.length, false, () => setBoardNoteFilter("all"), <Clock className="h-4 w-4" />)}
        {submenuButton("휴지통", 0, boardNoteFilter === "trash", () => setBoardNoteFilter("trash"), <Trash2 className="h-4 w-4" />)}
      </div>
      <div>
        <p className="mb-2 px-4 text-[14px] font-black uppercase tracking-[0.08em] text-text-tertiary">폴더</p>
        <div className="space-y-1.5">
          {noteFolders.map((folder) =>
            submenuButton(
              folder.label,
              noteCountFor(folder.filter),
              boardNoteFilter === folder.filter,
              () => setBoardNoteFilter(folder.filter),
              <Folder className="h-4 w-4" />,
            ),
          )}
        </div>
      </div>
    </div>
  );

  const renderReferenceSubMenu = () => (
    <div className="ml-4 mt-2 space-y-4 pl-1">
      <div className="space-y-1.5">
        {submenuButton("전체", referenceCountFor("all"), boardReferenceCategory === "all", () => setBoardReferenceCategory("all"), <LayoutGrid className="h-4 w-4" />)}
        {submenuButton("즐겨찾기", referenceCountFor("favorites"), boardReferenceCategory === "favorites", () => setBoardReferenceCategory("favorites"), <Star className="h-4 w-4" />)}
        {submenuButton("최근 추가", referenceCountFor("recent"), boardReferenceCategory === "recent", () => setBoardReferenceCategory("recent"), <Clock className="h-4 w-4" />)}
      </div>
      <div>
        <p className="mb-2 px-4 text-[14px] font-black uppercase tracking-[0.08em] text-text-tertiary">보드</p>
        <div className="space-y-2">
          {REFERENCE_BOARDS.map((board) => {
            const active = boardReferenceCategory === board.id;
            return (
              <button
                key={board.id}
                onClick={() => setBoardReferenceCategory(board.id)}
                className={`flex w-full items-center gap-3 rounded-md p-2.5 text-left transition ${
                  active ? "bg-[#171A20] text-white" : "text-text-secondary hover:bg-[#121417] hover:text-white"
                }`}
              >
                <img
                  src={board.image}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-black">{board.label}</span>
                  <span className="mt-0.5 block text-[13px] font-bold text-text-tertiary">
                    {referenceCountFor(board.id)}개
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const sidebarButton = (item: (typeof boardItems)[number]) => {
    const Icon = item.icon;
    const active = boardView === item.id;
    return (
      <div key={item.id}>
        <button
          onClick={() => setBoardView(item.id)}
          className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition ${
            active
              ? "border-brand-primary/50 bg-brand-primary/10 text-white"
              : "border-transparent text-text-secondary hover:border-[#2A2E36] hover:bg-[#111317] hover:text-white"
          }`}
        >
          <Icon className={`h-5 w-5 shrink-0 ${active ? "text-brand-primary" : "text-text-tertiary"}`} />
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-black">{item.label}</span>
            <span className="mt-0.5 block truncate text-[13px] font-semibold text-text-tertiary">{item.desc}</span>
          </span>
        </button>
        {item.id === "notes" && boardView === "notes" && renderNoteSubMenu()}
        {item.id === "references" && boardView === "references" && renderReferenceSubMenu()}
      </div>
    );
  };

  const renderOverviewNote = (note: (typeof NOTES)[number]) => (
    <div
      key={note.id}
      className="group flex min-h-[240px] flex-col rounded-lg border border-[#242832] bg-[#121419] p-4 text-left transition hover:border-brand-primary/50 hover:bg-[#171A20]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[17px] font-black leading-tight text-white">{note.title}</h3>
          <p className="mt-1 text-[12px] font-semibold text-text-tertiary">{note.date}</p>
        </div>
        {note.starred && <Star className="h-4 w-4 shrink-0 fill-brand-primary text-brand-primary" />}
      </div>
      <p className="line-clamp-3 text-[13px] leading-relaxed text-text-secondary">{note.desc}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-[#2A2E36] px-2 py-1 text-[11px] font-bold text-text-tertiary">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
        {note.images.slice(0, 3).map((image) => (
          <img key={image} src={image} alt="" className="aspect-square rounded object-cover" referrerPolicy="no-referrer" />
        ))}
      </div>
    </div>
  );

  const renderOverviewReference = (asset: (typeof ASSETS)[number]) => (
    <div
      key={asset.id}
      className="group h-[260px] overflow-hidden rounded-lg border border-[#242832] bg-[#080A0E] transition hover:border-brand-primary/50"
    >
      <img
        src={asset.image}
        alt={asset.title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        referrerPolicy="no-referrer"
      />
    </div>
  );

  return (
    <main className="flex h-[calc(100vh-76px)] overflow-hidden bg-bg-dark text-text-primary">
      <aside className="hidden w-[300px] shrink-0 border-r border-[#1C1E24] bg-[#0B0D10] p-5 lg:flex lg:flex-col">
        <div className="mb-6">
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-brand-primary">Board</p>
          <h1 className="mt-2 text-[25px] font-black text-white">작업 보드</h1>
          <p className="mt-2 text-[13px] font-semibold leading-relaxed text-text-tertiary">
            노트와 레퍼런스를 같은 공간에서 정리합니다.
          </p>
        </div>
        <div className="space-y-2">{boardItems.map(sidebarButton)}</div>
        <div className="mt-auto rounded-lg border border-dashed border-[#2A2E36] p-4">
          <p className="text-[13px] font-black text-white">연결맵</p>
          <p className="mt-1 text-[12px] leading-relaxed text-text-tertiary">
            노트와 레퍼런스의 직접 연결, AI 추천 연결은 다음 단계에서 붙일 수 있어요.
          </p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 overflow-hidden p-4 lg:p-5">
        <div className="mb-4 flex gap-2 lg:hidden">
          {boardItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setBoardView(item.id)}
              className={`flex-1 rounded-lg border px-3 py-2 text-[14px] font-black ${
                boardView === item.id
                  ? "border-brand-primary bg-brand-primary text-bg-dark"
                  : "border-[#2A2E36] bg-[#111317] text-text-secondary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {boardView === "all" ? (
          <div className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="min-w-0 overflow-hidden rounded-lg border border-[#1C1E24] bg-bg-dark">
              <div className="flex items-center justify-between border-b border-[#1C1E24] px-5 py-4">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.12em] text-brand-primary">Notes</p>
                  <h2 className="mt-1 text-[22px] font-black text-white">노트</h2>
                </div>
                <span className="text-[14px] font-bold text-text-tertiary">{liveNotes.length}개</span>
              </div>
              <div className="grid min-h-0 flex-1 content-start grid-cols-1 gap-3 overflow-y-auto p-4 pb-8 md:grid-cols-3">
                {liveNotes.map(renderOverviewNote)}
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-lg border border-[#1C1E24] bg-bg-dark">
              <div className="flex items-center justify-between border-b border-[#1C1E24] px-5 py-4">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.12em] text-brand-primary">References</p>
                  <h2 className="mt-1 text-[22px] font-black text-white">레퍼런스</h2>
                </div>
                <span className="text-[14px] font-bold text-text-tertiary">{liveReferences.length}개</span>
              </div>
              <div className="grid min-h-0 flex-1 content-start grid-cols-1 gap-3 overflow-y-auto p-4 pb-8 md:grid-cols-3">
                {liveReferences.map(renderOverviewReference)}
              </div>
            </div>
          </div>
        ) : boardView === "notes" ? (
          <NotesPage
            onNavigate={onNavigate}
            isPopup
            hideSidebar
            hideDetailPanel
            boardFilter={boardNoteFilter}
          />
        ) : (
          <ReferencePage
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onNavigate={onNavigate}
            isPopup
            hideSidebar
            boardCategory={boardReferenceCategory}
          />
        )}
      </section>
    </main>
  );
}

function ProductPurchasePanel({ asset, product }: { asset: any; product: typeof PRODUCT_DETAIL_DATA[number] }) {
  return (
    <>
      <div className="px-1">
        <span className="mb-1 block text-[12px] font-bold text-brand-primary">{product.category}</span>
        <h1 className="text-[24px] font-bold text-white">{product.title}</h1>
      </div>

      <div className="rounded-lg border border-[#1F2329] bg-[#141518] p-4">
        <p className="mb-4 text-[14px] font-bold text-white">Artist</p>
        <div className="flex items-center gap-3">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=kimjihwan" alt="" className="h-10 w-10 rounded-full bg-white" />
          <div>
            <p className="text-[13px] font-bold text-white">Kim ji hwan</p>
            <p className="text-[12px] text-text-tertiary">3D Character Artist</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-text-tertiary">
          <span>작품 수</span>
          <span className="text-right text-text-secondary">8개</span>
          <span>팔로워</span>
          <span className="text-right text-text-secondary">0.3K</span>
        </div>
        <button className="mt-4 w-full rounded-md bg-[#3A3A3A] py-2.5 text-[13px] font-bold text-white transition hover:bg-[#4A4A4A]">
          팔로우
        </button>
      </div>

      <div className="rounded-lg border border-[#1F2329] bg-[#141518] p-4">
        <div className="mb-4 flex items-end gap-3">
          <span className="text-[24px] font-black text-brand-primary">{product.price}</span>
          {product.originalPrice && <span className="pb-1 text-[13px] text-text-tertiary line-through">{product.originalPrice}</span>}
        </div>
        <button className="mb-2 w-full rounded-md bg-brand-primary py-3 text-[14px] font-black text-bg-dark transition hover:bg-brand-hover">
          구매하기
        </button>
        <button className="mb-3 w-full rounded-md bg-[#333] py-3 text-[13px] font-bold text-white transition hover:bg-[#444]">
          장바구니에 추가
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 rounded-md bg-[#262626] py-2 text-[12px] font-bold text-text-secondary hover:text-white">
            <Heart className="h-4 w-4 text-brand-primary" />
            568
          </button>
          <button className="flex items-center justify-center gap-2 rounded-md bg-[#262626] py-2 text-[12px] font-bold text-text-secondary hover:text-white">
            <ShoppingBag className="h-4 w-4" />
            공유
          </button>
        </div>
      </div>
    </>
  );
}

function ProductLicensePanel() {
  return (
    <div className="rounded-lg border border-[#1F2329] bg-[#141518] p-5">
      <h2 className="mb-4 text-[15px] font-bold text-white">라이센스</h2>
      {['상업적 사용 가능', '무제한 다운로드', 'AI 변환 가능'].map((item) => (
        <div key={item} className="mb-4 last:mb-0">
          <p className="text-[13px] font-bold text-white">{item}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-text-tertiary">게임, 영상, 광고 등 모든 상업적 프로젝트에 사용 가능합니다.</p>
        </div>
      ))}
    </div>
  );
}

function ProductStatsPanel({ stats }: { stats: [string, string, string] }) {
  return (
    <div className="grid grid-cols-3 rounded-lg border border-[#1F2329] bg-[#141518] p-5 text-center">
      {[
        ['조회수', stats[0]],
        ['구매', stats[1]],
        ['평점', stats[2]],
      ].map(([label, value]) => (
        <div key={label}>
          <p className="text-[20px] font-black text-white">{value}</p>
          <p className="mt-1 text-[12px] text-text-tertiary">{label}</p>
        </div>
      ))}
    </div>
  );
}

function ProductInfoPanel({ product }: { product: typeof PRODUCT_DETAIL_DATA[number] }) {
  return (
    <div className="rounded-lg border border-[#1F2329] bg-[#141518] p-5">
      <h2 className="mb-4 text-[15px] font-bold text-white">파일 정보</h2>
      <div className="space-y-3 border-b border-[#2A2E36] pb-5">
        {product.fileInfo.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-[12px]">
            <span className="text-text-tertiary">{label}</span>
            <span className="text-right font-semibold text-text-secondary">{value}</span>
          </div>
        ))}
      </div>
      <h2 className="mb-3 mt-5 text-[15px] font-bold text-white">상세 설명</h2>
      <p className="text-[12px] leading-relaxed text-text-secondary">{product.description}</p>
      <h2 className="mb-3 mt-5 text-[15px] font-bold text-white">태그</h2>
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[#3A404F] px-2.5 py-1 text-[11px] font-bold text-text-secondary">
            {tag}
          </span>
        ))}
      </div>
      <h2 className="mb-3 mt-5 text-[15px] font-bold text-white">용도</h2>
      <div className="flex gap-3 text-text-tertiary">
        <Box className="h-5 w-5" />
        <Video className="h-5 w-5" />
      </div>
    </div>
  );
}

// --- Sidebar Sub-components ---

function SidebarProject({ title, thumb, status, progress }: any) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer py-4 border-b border-[#161618] last:border-0">
      <div className="w-24 h-24 shrink-0 rounded-lg bg-surface-secondary overflow-hidden border border-border-soft shadow-inner">
        <img src={thumb} alt="" className="w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-[1.007]" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <p className="text-[17px] font-normal text-text-primary group-hover:text-brand-primary transition-colors line-clamp-2 leading-[1.3] flex-1">{title}</p>
          <span className="text-[12px] font-sans text-[#8B909A] font-medium pt-1">{progress}%</span>
        </div>
        <div className="space-y-2">
          <div className="text-[12px] text-text-secondary font-semibold uppercase tracking-wider">{status}</div>
          <div className="h-[4px] bg-border-soft rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary shadow-[0_0_8px_rgba(224,161,46,0.4)]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarNote({ title, tags }: any) {
  return (
    <div className="py-4 border-b border-[#161618] last:border-0 cursor-pointer group">
      <h4 className="text-[17px] font-normal text-text-primary mb-3 group-hover:text-brand-primary transition-colors">{title}</h4>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag: string) => (
          <span key={tag} className="text-[12px] px-2.5 py-1 bg-surface-primary text-text-secondary rounded font-bold border border-border-primary/35 uppercase tracking-tighter">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Sections ---

function DiscoverSection({
  isSidebarOpen,
  favorites,
  toggleFavorite,
  activeNav,
  onOpenProduct,
  onQuickCollect,
  onAssetDragStart,
}: {
  isSidebarOpen: boolean,
  favorites: number[],
  toggleFavorite: (id: number) => void,
  activeNav?: 'market' | 'art' | 'studio' | 'support' | null,
  onOpenProduct?: (assetId: number) => void,
  onQuickCollect?: (target: QuickDropTarget, asset: any) => void,
  onAssetDragStart?: (asset: any, e: React.DragEvent) => void,
}) {
  const [activeTab, setActiveTab] = useState('추천');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [priceType, setPriceType] = useState<'all' | 'free' | 'paid'>('all');
  const [priceRange, setPriceRange] = useState({ min: '0', max: '1,000,000+' });
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [polyCount, setPolyCount] = useState<string[]>([]);
  const [polyRange, setPolyRange] = useState({ min: '0', max: '1,000,000' });
  const [license, setLicense] = useState<string[]>([]);

  const tabs = ['추천', '최신', '팔로잉', '에디터 픽'];
  
  const formats = ['.FBX', '.OBJ', '.ABC', '.BLEND', '.MAX', '.GLB'];
  const polyOptions = ['Low Poly', 'Mid Poly', 'High Poly'];
  const licenseOptions = ['표준', '확장', '상업적'];

  const toggleFilter = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const togglePolyFilter = (opt: string) => {
    if (opt === '직접 설정') {
      if (polyCount.includes('직접 설정')) {
        setPolyCount(polyCount.filter(p => p !== '직접 설정'));
      } else {
        // 직접 설정 선택 시 다른 모든 폴리곤 카테고리(Low, Mid, High) 체크 해제
        setPolyCount(['직접 설정']);
      }
    } else {
      if (!polyCount.includes('직접 설정')) {
        if (polyCount.includes(opt)) {
          setPolyCount(polyCount.filter(p => p !== opt));
        } else {
          setPolyCount([...polyCount, opt]);
        }
      }
    }
  };

  const toggleAllFormats = () => {
    if (selectedFormats.length === formats.length) {
      setSelectedFormats([]);
    } else {
      setSelectedFormats([...formats]);
    }
  };

  // Active filters for display
  const activeFilters = [
    ...(priceType !== 'all' 
      ? [`가격: ${priceType === 'free' ? '무료' : `₩${priceRange.min}~${priceRange.max}`}`] 
      : []),
    ...((selectedFormats.length > 0 && selectedFormats.length < formats.length)
      ? [`파일형식: ${selectedFormats.length > 3 ? `${selectedFormats.slice(0, 3).join(', ')}...` : selectedFormats.join(', ')}`]
      : []),
    ...(polyCount.length > 0
      ? [`${polyCount.map(p => p === '직접 설정' ? `${polyRange.min}~${polyRange.max} Poly` : p).join(', ')}`]
      : []),
    ...(license.length > 0
      ? [`${license.join(', ')}`]
      : [])
  ];

  const removeFilter = (filterText: string) => {
    if (filterText.startsWith('가격:')) {
      setPriceType('all');
      return;
    }
    if (filterText.startsWith('파일형식:')) {
      setSelectedFormats([]);
      return;
    }
    if (
      filterText.endsWith(' Poly') || 
      polyOptions.some(opt => filterText.includes(opt))
    ) {
      setPolyCount([]);
      return;
    }
    if (licenseOptions.some(opt => filterText.includes(opt))) {
      setLicense([]);
      return;
    }
  };

  return (
    <div className="flex-1 min-w-0 relative">
      <div className="flex items-end justify-between mb-6 pb-2 border-b border-border-soft/50 h-[46px]">
        <div className="flex items-end gap-10">
          <h2 className="text-[30px] font-bold tracking-tight text-text-primary leading-none font-display">Discover</h2>
          <div className="flex items-center gap-6 mb-[-2px]">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[17px] font-semibold transition-all relative py-1 ${
                  activeTab === tab ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeUnderline" className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-brand-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 pl-[1px] pt-0 flex-1 justify-end min-w-0 h-8 self-end">
          {/* Active Filter Tags */}
          <div className="hidden xl:flex items-center justify-end flex-nowrap gap-2 max-w-[700px] overflow-x-auto scrollbar-hide h-8 flex-1 min-w-0">
            {activeFilters.map((filter) => (
              <span key={filter} className="flex items-center gap-1.5 h-7 px-3 bg-surface-primary border border-border-soft text-[15px] font-bold text-text-tertiary rounded-sm whitespace-nowrap">
                {filter}
                <button
                  type="button"
                  onClick={() => removeFilter(filter)}
                  className="p-0.5 rounded-full hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center justify-center ml-0.5"
                  aria-label={`${filter} 필터 삭제`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-[17px] font-semibold transition-all h-8 ${
              showFilters ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            <Sliders className="w-5 h-5" /> 필터
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            className="absolute top-[50px] right-0 z-50 bg-[#0E1011]/95 backdrop-blur-md rounded-[8px] border border-border-primary p-6 shadow-[0_30px_60px_rgba(0,0,0,0.9)] w-[80%] max-w-[1000px]"
          >
            <button 
              onClick={() => setShowFilters(false)}
              className="absolute top-5 right-5 text-text-tertiary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* 가격 필터 */}
              <div className="space-y-4 col-span-1 md:col-span-3">
                <h4 className="text-[15px] font-bold text-text-tertiary uppercase tracking-wider">가격</h4>
                <div className="flex gap-2">
                  {['free', 'paid'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        if (priceType === type) {
                          setPriceType('all');
                        } else {
                          setPriceType(type as any);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-sm text-[15px] font-bold border transition-all ${
                        priceType === type 
                        ? 'bg-brand-primary border-brand-primary text-bg-dark' 
                        : 'bg-surface-primary border-border-soft text-text-tertiary hover:border-brand-primary/50'
                      }`}
                    >
                      {type === 'free' ? '무료' : '유료'}
                    </button>
                  ))}
                </div>
                
                <div className={`space-y-3 pt-2 transition-opacity duration-300 ${priceType !== 'paid' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      placeholder="최소" 
                      disabled={priceType !== 'paid'}
                      className="w-full bg-surface-primary border border-border-soft rounded-sm px-3 py-1.5 text-[15px] text-text-secondary focus:outline-none focus:border-brand-primary/50 transition-all font-sans" 
                    />
                    <span className="text-text-tertiary text-[12px]">~</span>
                    <input 
                      type="text" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      placeholder="최대" 
                      disabled={priceType !== 'paid'}
                      className="w-full bg-surface-primary border border-border-soft rounded-sm px-3 py-1.5 text-[15px] text-text-secondary focus:outline-none focus:border-brand-primary/50 transition-all font-sans" 
                    />
                  </div>
                </div>
              </div>

              {/* 파일 형식 */}
              <div className="space-y-4 col-span-1 md:col-span-3">
                <h4 className="text-[15px] font-bold text-text-tertiary uppercase tracking-wider">파일 형식</h4>
                <div className="flex flex-wrap gap-2">
                  {formats.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => toggleFilter(selectedFormats, setSelectedFormats, fmt)}
                      className={`px-3 py-1.5 min-w-[60px] rounded-sm text-[15px] font-bold border transition-all ${
                        selectedFormats.includes(fmt)
                        ? 'bg-brand-primary border-brand-primary text-bg-dark'
                        : 'bg-surface-primary border-border-soft text-text-tertiary hover:border-brand-primary/50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 폴리곤 수 */}
              <div className="space-y-4 col-span-1 md:col-span-4 flex flex-col">
                <h4 className="text-[15px] font-bold text-text-tertiary uppercase tracking-wider">폴리곤 수</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {[...polyOptions, '직접 설정'].map((opt) => {
                    let tooltipText = '';
                    if (opt === 'Low Poly') tooltipText = '10,000개 이하 (Under 10k)';
                    if (opt === 'Mid Poly') tooltipText = '10,000 ~ 50,000개 (10k ~ 50k)';
                    if (opt === 'High Poly') tooltipText = '50,000개 이상 (Over 50k)';

                    const isDirectActive = polyCount.includes('직접 설정');
                    const isDisabled = isDirectActive && opt !== '직접 설정';

                    return (
                      <label 
                        key={opt}
                        className={`relative group/item flex items-center gap-3 ${
                          isDisabled 
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'cursor-pointer'
                        }`}
                        onClick={() => {
                          if (!isDisabled) {
                            togglePolyFilter(opt);
                          }
                        }}
                      >
                        <div 
                          className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-all ${
                            polyCount.includes(opt) 
                              ? 'bg-brand-primary border-brand-primary' 
                              : `bg-surface-primary border-border-soft ${isDisabled ? '' : 'group-hover/item:border-brand-primary/30'}`
                          }`}
                        >
                          {polyCount.includes(opt) && <Check className="w-3.5 h-3.5 text-bg-dark" />}
                        </div>
                        <span className={`text-[15px] transition-colors font-medium ${
                          isDisabled ? 'text-text-tertiary/50' : 'text-text-tertiary group-hover/item:text-text-secondary'
                        }`}>{opt}</span>
                        
                        {tooltipText && !isDisabled && (
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover/item:block bg-surface-secondary border border-border-primary/80 text-[12px] text-text-secondary px-2.5 py-1.5 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap z-[110] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                            <span className="text-brand-primary font-bold mr-1">범위:</span> {tooltipText}
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
                
                {polyCount.includes('직접 설정') && (
                  <div className="space-y-3 pt-3 mt-1 border-t border-border-soft/20 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between text-[12px] font-sans text-text-tertiary">
                      <span>최소: 0 Poly</span>
                      <span>최대: {polyRange.max} Poly</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1000000" 
                      step="5000"
                      value={parseInt(polyRange.max.replace(/,/g, '')) || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPolyRange({
                          min: '0',
                          max: val.toLocaleString('ko-KR')
                        });
                      }}
                      className="w-full h-[2px] bg-border-soft rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                  </div>
                )}
              </div>

              {/* 라이선스 */}
              <div className="space-y-4 col-span-1 md:col-span-2">
                <h4 className="text-[15px] font-bold text-text-tertiary uppercase tracking-wider">라이선스</h4>
                <div className="space-y-3">
                  {licenseOptions.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleFilter(license, setLicense, opt)}
                    >
                      <div 
                        className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-all ${
                          license.includes(opt) ? 'bg-brand-primary border-brand-primary' : 'bg-surface-primary border-border-soft group-hover:border-brand-primary/30'
                        }`}
                      >
                        {license.includes(opt) && <Check className="w-3.5 h-3.5 text-bg-dark" />}
                      </div>
                      <span className="text-[15px] text-text-tertiary group-hover:text-text-secondary transition-colors font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-5 border-t border-border-soft/20">
              <div className="text-[12px] text-text-tertiary select-none flex items-center gap-1.5 pl-1 font-sans sm:translate-y-[2px]">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                선택하지 않은 영역은 전체로 분류됩니다.
              </div>
              <div className="flex gap-4 w-full sm:w-auto justify-end">
                <button 
                  onClick={() => {
                    setPriceType('all');
                    setSelectedFormats([]);
                    setPolyCount([]);
                    setLicense([]);
                  }}
                  className="text-[15px] font-bold text-text-tertiary hover:text-text-primary px-4 py-2 transition-colors uppercase tracking-wider"
                >
                  초기화
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="bg-brand-primary text-bg-dark text-[15px] font-bold px-6 py-2 rounded-sm hover:bg-brand-hover transition-all uppercase tracking-wider shadow-none"
                >
                  필터 적용
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid gap-1.5 transition-all duration-300 ${
        isSidebarOpen 
          ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" 
          : "grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      }`}>
        {ASSETS.filter(asset => !activeNav || (activeNav === 'market' ? asset.badge === 'M' : asset.badge === 'A'))
        .map((asset, index) => {
          let displayedAsset = { ...asset };
          
          
          return (
            <AssetCard
              key={displayedAsset.id}
              asset={displayedAsset}
              isFavorite={favorites.includes(displayedAsset.id)}
              onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(displayedAsset.id); }}
              onOpenProduct={() => {
                if (displayedAsset.id <= 8) onOpenProduct?.(displayedAsset.id);
              }}
              onQuickCollect={onQuickCollect}
              onAssetDragStart={onAssetDragStart}
            />
          );
        })}
      </div>
      <div className="flex justify-center mt-8 py-6 pb-20">
        <button className="flex items-center gap-2 px-4 py-2 text-[14px] font-bold text-text-tertiary hover:text-white transition-colors">
          더보기 <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Sidebar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <aside className="w-full lg:w-[300px] space-y-6 shrink-0 relative">
      <section className="bg-surface-primary rounded-[8px] border border-border-soft/40 p-5 shadow-2xl relative min-h-[100px]">
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-bold text-text-primary tracking-tight">내 프로젝트</h3>
            {onToggleSidebar && (
              <button 
                onClick={onToggleSidebar}
                className="hidden lg:flex items-center text-text-tertiary hover:text-brand-primary transition-all"
                title="사이드바 접기"
              >
                <PanelRightClose className="w-5 h-5" />
              </button>
            )}
          </div>
          <button className="text-[12px] font-bold text-text-tertiary hover:text-text-primary transition-colors">모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" /></button>
        </div>
        <div className="divide-y divide-[#161618]">
          <SidebarProject 
            title="판타지 성 전체 씬" 
            thumb="/images/work_%2036.png" 
            status="Modeling" 
            progress={75} 
          />
          <SidebarProject 
            title="사이버펑크 시티" 
            thumb="/images/work_%2037.png" 
            status="Image Gen" 
            progress={45} 
          />
          <SidebarProject 
            title="우주 전함 컨셉" 
            thumb="/images/work_%2038.png" 
            status="Concept" 
            progress={90} 
          />
        </div>
      </section>

      <section className="bg-surface-primary rounded-[8px] border border-border-soft/40 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-[18px] font-semibold text-text-primary tracking-tight">최근 노트</h3>
          <button className="text-[12px] font-bold text-text-tertiary hover:text-text-primary transition-colors">모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" /></button>
        </div>
        <div className="divide-y divide-[#161618]">
          <SidebarNote 
            title="판타지 성 컨셉 방향" 
            tags={['아이디어 정리', '레퍼런스']} 
          />
          <SidebarNote 
            title="메카 워커 디자인 노트" 
            tags={['구조', '무장', '애니메이션']} 
          />
          <SidebarNote 
            title="사이버펑크 환경 분석" 
            tags={['레퍼런스', '컬러', '무드']} 
          />
        </div>
      </section>

      <section className="bg-surface-primary rounded-[8px] border border-border-soft/40 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-[18px] font-semibold text-text-primary tracking-tight">레퍼런스 보드</h3>
          <button className="text-[12px] font-bold text-text-tertiary hover:text-text-primary transition-colors">모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" /></button>
        </div>
        <div className="divide-y divide-[#161618]">
          {[
            { name: '판타지 성', count: '128 items' },
            { name: '다크 판타지', count: '318 items' },
            { name: '사이버펑크 무드', count: '542 items' },
          ].map((item) => (
            <div key={item.name} className="flex items-center py-4 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-primary flex items-center justify-center border border-border-soft text-text-tertiary group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[17px] font-normal text-text-primary group-hover:text-brand-primary transition-colors">{item.name}</div>
                  <div className="text-[12px] text-text-secondary font-medium">{item.count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 flex items-center gap-2 px-4 py-3 bg-surface-primary/30 hover:bg-surface-primary rounded-[8px] text-[12px] font-bold text-brand-primary border border-dashed border-brand-primary/20 hover:border-border-primary/60 transition-all justify-center group">
            <Plus className="w-3.5 h-3.5" /> 새 보드 만들기
        </button>
      </section>
    </aside>
  );
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-[40px] right-[40px] z-[100] p-3.5 bg-surface-primary hover:bg-[#22252B] text-text-secondary hover:text-brand-primary hover:border-brand-primary/50 border border-border-primary/50 shadow-lg rounded-full transition-colors group"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// --- Main App ---

export type PageType = 'home' | 'uploads' | 'purchases' | 'favorites' | 'settings' | 'board' | 'references' | 'projects' | 'notes' | 'note-editor' | 'studio' | 'support' | 'full_workflow' | 'full_workflow_chat' | 'turnaround' | 'modeling_generation' | 'product_detail';

export default function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const rawHash = window.location.hash.replace('#', '');
    const hashPage = rawHash.split('/')[0] as PageType;
    const validPages: PageType[] = ['home', 'uploads', 'purchases', 'favorites', 'settings', 'board', 'references', 'projects', 'notes', 'note-editor', 'studio', 'support', 'full_workflow', 'full_workflow_chat', 'turnaround', 'modeling_generation', 'product_detail'];
    return validPages.includes(hashPage) ? hashPage : 'home';
  });
  const [activeNav, setActiveNav] = useState<'market' | 'art' | 'studio' | 'support' | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number>(() => {
    const hashProductId = Number(window.location.hash.replace('#', '').split('/')[1]);
    if (hashProductId >= 1 && hashProductId <= 8) return hashProductId;
    const saved = Number(localStorage.getItem('neopoly_selected_product_id'));
    return saved >= 1 && saved <= 8 ? saved : 1;
  });

  useEffect(() => {
    const nextHash = currentPage === 'home' ? '' : currentPage === 'product_detail' ? `#product_detail/${selectedProductId}` : `#${currentPage}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', `${window.location.pathname}${nextHash}`);
    }
  }, [currentPage, selectedProductId]);

  // Initialize dummy UserProfile (usually fetched from an API or local storage in reality)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('neopoly_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      username: 'mainuser',
      nickname: 'NeoCreator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator9',
      email: 'neo.creator@example.com',
      bio: '3D Artist specializing in Dark Fantasy & Sci-Fi environments.',
      role: 'Diamond Member',
      credits: 12500,
      completedProjects: []
    };
  });

  // Dummy state proxies required by UserProfilePage
  const [assets, setAssets] = useState<any[]>([]); // UserProfilePage will use this if needed, but ASSETS constant is global too.
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isAssetDragging, setIsAssetDragging] = useState(false);
  const [isPanelDropMode, setIsPanelDropMode] = useState(false);
  const [quickCollections, setQuickCollections] = useState<QuickCollections>(() => {
    try {
      const saved = localStorage.getItem(QUICK_COLLECTIONS_KEY);
      return saved ? { ...emptyQuickCollections(), ...JSON.parse(saved) } : emptyQuickCollections();
    } catch {
      return emptyQuickCollections();
    }
  });
  const [quickDialog, setQuickDialog] = useState<{ target: "notes" | "references"; asset: QuickCollectAsset } | null>(null);

  useEffect(() => {
    localStorage.setItem(QUICK_COLLECTIONS_KEY, JSON.stringify(quickCollections));
  }, [quickCollections]);

  useEffect(() => {
    const stopDragging = () => setIsAssetDragging(false);
    window.addEventListener("dragend", stopDragging);
    window.addEventListener("drop", stopDragging);
    return () => {
      window.removeEventListener("dragend", stopDragging);
      window.removeEventListener("drop", stopDragging);
    };
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addQuickCollection = (
    target: QuickDropTarget,
    asset: QuickCollectAsset,
    groupName?: string,
    memo?: string,
  ) => {
    const nextAsset = { ...asset, addedAt: Date.now(), groupName, memo };
    setQuickCollections((prev) => ({
      ...prev,
      [target]: [nextAsset, ...prev[target]].slice(0, 12),
    }));
  };

  const handleQuickCollect = (target: QuickDropTarget, asset: any) => {
    if (target === "notes") {
      setCurrentPage("notes");
      return;
    }
    if (target === "references") {
      setCurrentPage("references");
      return;
    }
  };

  const handleDropTarget = (target: QuickDropTarget, asset: QuickCollectAsset) => {
    setIsPanelDropMode(true);
    setIsPanelOpen(true);
    if (target === "projects") {
      addQuickCollection("projects", asset, "수집 프로젝트");
      return;
    }
    setQuickDialog({ target, asset });
  };

  const handleAssetDragStart = (asset: any, event: React.DragEvent) => {
    const quickAsset = toQuickCollectAsset(asset);
    setIsAssetDragging(true);
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(QUICK_ASSET_MIME, JSON.stringify(quickAsset));
    event.dataTransfer.setData("application/json", JSON.stringify(quickAsset));
    event.dataTransfer.setData("text/plain", quickAsset.image);
  };

  const openProductDetail = (assetId: number) => {
    setSelectedProductId(assetId);
    localStorage.setItem('neopoly_selected_product_id', String(assetId));
    setCurrentPage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col font-sans selection:bg-brand-primary/30 scroll-smooth">
      <Header onNavigate={(page) => setCurrentPage(page as PageType)} currentPage={currentPage} activeNav={activeNav} setActiveNav={setActiveNav} />
      
      {currentPage === 'uploads' ? (
        <ContentManagementPage />
      ) : currentPage === 'purchases' ? (
        <PurchasedAssetsPage />
      ) : currentPage === 'favorites' ? (
        <FavoritesPage favorites={favorites} toggleFavorite={toggleFavorite} />
      ) : currentPage === 'board' ? (
        <BoardPage
          onNavigate={(page) => setCurrentPage(page as PageType)}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      ) : currentPage === 'references' ? (
        <ReferencePage favorites={favorites} toggleFavorite={toggleFavorite} onNavigate={(page) => setCurrentPage(page as PageType)} />
      ) : currentPage === 'projects' ? (
        <ProjectPage onNavigate={(page) => setCurrentPage(page as PageType)} />
      ) : currentPage === 'notes' ? (
        <NotesPage onNavigate={(page) => setCurrentPage(page as PageType)} />
      ) : currentPage === 'note-editor' ? (
        <NoteEditorPage onNavigate={(page) => setCurrentPage(page as PageType)} />
      ) : currentPage === 'settings' ? (
        <AccountSettingsPage userProfile={userProfile} setUserProfile={setUserProfile} />
      ) : currentPage === 'studio' ? (
        <AIStudioPage onNavigate={(page) => setCurrentPage(page as PageType)} />
      ) : currentPage === 'turnaround' ? (
        <TurnaroundPage onNavigate={(page) => setCurrentPage(page as PageType)} />
      ) : currentPage === 'modeling_generation' ? (
        <ModelingGenerationPage onNavigate={(page) => setCurrentPage(page as PageType)} />
      ) : currentPage === 'product_detail' ? (
        <ProductDetailPage
          assetId={selectedProductId}
          onNavigateHome={() => setCurrentPage('home')}
          onOpenProduct={openProductDetail}
          onQuickCollect={handleQuickCollect}
          onAssetDragStart={handleAssetDragStart}
        />
      ) : currentPage === 'support' ? (
        <SupportPage />
      ) : currentPage === 'full_workflow' ? (
        <FullWorkflowPage onNavigate={(page) => setCurrentPage(page as PageType)} showIntroOverlay={true} />
      ) : currentPage === 'full_workflow_chat' ? (
        <FullWorkflowPage onNavigate={(page) => setCurrentPage(page as PageType)} showIntroOverlay={false} />
      ) : (
        <main className="flex-1 pb-32 bg-bg-dark">
          <Hero onNavigate={(page) => setCurrentPage(page as PageType)} />
          
          <div className="max-w-[2560px] mx-auto px-6 py-6">
            <div className="flex flex-col gap-8 xl:gap-12">
              <div className="flex-1 min-w-0 space-y-6">
                <CategoryNav />
                <DiscoverSection
                  isSidebarOpen={false}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  activeNav={activeNav}
                  onOpenProduct={openProductDetail}
                  onQuickCollect={handleQuickCollect}
                  onAssetDragStart={handleAssetDragStart}
                />
              </div>
            </div>
          </div>

          {/* Floating Panel Open Button */}
        <AnimatePresence>
          {!isAssetDragging && !isPanelDropMode && !isPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-8 left-1/2 z-40 transform"
            >
              <button
                onClick={() => {
                  setIsPanelDropMode(false);
                  setIsPanelOpen(true);
                }}
                className="flex items-center gap-2 px-8 py-3 bg-bg-secondary/95 backdrop-blur-md rounded-[8px] text-[15px] font-bold text-text-primary border border-border-primary/80 hover:border-brand-primary hover:text-brand-primary transition-all shadow-[0_15px_40px_rgba(0,0,0,0.9)] cursor-pointer tracking-wide"
              >
                패널 열기
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Floating Panel */}
        <AnimatePresence>
          {!isAssetDragging && !isPanelDropMode && isPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 150, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 150, x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed bottom-6 left-1/2 z-50 w-[1536px] max-w-[95%] h-auto bg-[#0E1011]/95 md:bg-[#0E1011]/93 backdrop-blur-xl border border-border-primary/50 rounded-[12px] pt-[46px] pl-[24px] pr-[24px] pb-[20px] ml-0 shadow-[0_30px_60px_rgba(0,0,0,0.95)]"
            >
              {/* Close Button - Inside but safe from overlap */}
              <button
                onClick={() => setIsPanelOpen(false)}
                className="absolute top-3 right-3 text-text-tertiary hover:text-brand-primary hover:bg-[#1c1d22]/80 border-0 transition-all p-1.5 rounded-md cursor-pointer z-50"
                title="패널 닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* 내 프로젝트 Section */}
                <div className="xl:col-span-6 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 onClick={() => { setIsPanelOpen(false); setCurrentPage('projects'); }} className="text-[17px] font-bold text-text-primary tracking-tight cursor-pointer hover:text-brand-primary transition-colors">내 프로젝트</h3>
                    <button onClick={() => { setIsPanelOpen(false); setCurrentPage('projects'); }} className="text-[12px] font-bold text-text-tertiary hover:text-text-primary transition-colors">
                      모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Project 1 */}
                    <div className="bg-surface-primary/80 hover:bg-surface-primary border border-border-primary/20 rounded-[10px] p-2.5 transition-all hover:scale-[1.005] flex flex-col gap-3 group cursor-pointer hover:border-border-primary/60 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                      <div className="w-full aspect-[16/10] rounded-[6px] overflow-hidden bg-bg-secondary relative border border-border-primary/10">
                        <img src="/images/work_%2045.png" alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-100 group-hover:opacity-90" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <p className="text-[15px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">판타지 성 전체 씬</p>
                        <div className="flex items-center justify-between text-[12px] font-sans mt-1">
                          <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Modeling</span>
                          <span className="text-[12px] font-medium text-[#8B909A]">75%</span>
                        </div>
                        <div className="h-[3px] bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-brand-primary shadow-[0_0_8px_rgba(224,161,46,0.5)]" style={{ width: `75%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Project 2 */}
                    <div className="bg-surface-primary/80 hover:bg-surface-primary border border-border-primary/20 rounded-[10px] p-2.5 transition-all hover:scale-[1.005] flex flex-col gap-3 group cursor-pointer hover:border-border-primary/60 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                      <div className="w-full aspect-[16/10] rounded-[6px] overflow-hidden bg-bg-secondary relative border border-border-primary/10">
                        <img src="/images/work_46.png" alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-100 group-hover:opacity-90" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <p className="text-[15px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">사이버펑크 시티</p>
                        <div className="flex items-center justify-between text-[12px] font-sans mt-1">
                          <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Image Gen</span>
                          <span className="text-[12px] font-medium text-[#8B909A]">45%</span>
                        </div>
                        <div className="h-[3px] bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-brand-primary shadow-[0_0_8px_rgba(224,161,46,0.5)]" style={{ width: `45%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Project 3 */}
                    <div className="bg-surface-primary/80 hover:bg-surface-primary border border-border-primary/20 rounded-[10px] p-2.5 transition-all hover:scale-[1.005] flex flex-col gap-3 group cursor-pointer hover:border-border-primary/60 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                      <div className="w-full aspect-[16/10] rounded-[6px] overflow-hidden bg-bg-secondary relative border border-border-primary/10">
                        <img src="/images/work_47.png" alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-100 group-hover:opacity-90" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <p className="text-[15px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">우주 전함 컨셉</p>
                        <div className="flex items-center justify-between text-[12px] font-sans mt-1">
                          <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Concept</span>
                          <span className="text-[12px] font-medium text-[#8B909A]">90%</span>
                        </div>
                        <div className="h-[3px] bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-brand-primary shadow-[0_0_8px_rgba(224,161,46,0.5)]" style={{ width: `90%` }}></div>
                        </div>
                      </div>
                    </div>



                  </div>
                </div>

                {/* 최근 노트 Section */}
                <div className="xl:col-span-3 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 onClick={() => { setIsPanelOpen(false); setCurrentPage('notes'); }} className="text-[17px] font-bold text-text-primary tracking-tight cursor-pointer hover:text-brand-primary transition-colors">최근 노트</h3>
                    <button onClick={() => { setIsPanelOpen(false); setCurrentPage('notes'); }} className="text-[12px] font-bold text-text-tertiary hover:text-text-primary transition-colors">
                      모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {/* Note 1 */}
                    <div className="h-[82px] flex flex-col justify-center bg-surface-primary/85 hover:bg-surface-primary px-3.5 rounded-[10px] border border-border-primary/20 transition-all hover:scale-[1.005] hover:border-border-primary/60 shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer group">
                      <div className="flex flex-col gap-2 w-full">
                        <h4 className="text-[15px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">판타지 성 컨셉 방향</h4>
                        <div className="flex gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 bg-surface-primary text-text-secondary rounded font-bold border border-border-primary/35 uppercase tracking-tighter">아이디어</span>
                          <span className="text-[10px] px-2 py-0.5 bg-surface-primary text-text-secondary rounded font-bold border border-border-primary/35 uppercase tracking-tighter">레퍼런스</span>
                        </div>
                      </div>
                    </div>

                    {/* Note 2 */}
                    <div className="h-[82px] flex flex-col justify-center bg-surface-primary/85 hover:bg-surface-primary px-3.5 rounded-[10px] border border-border-primary/20 transition-all hover:scale-[1.005] hover:border-border-primary/60 shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer group">
                      <div className="flex flex-col gap-2 w-full">
                        <h4 className="text-[15px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">메카 워커 디자인 노트</h4>
                        <div className="flex gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 bg-surface-primary text-text-secondary rounded font-bold border border-border-primary/35 uppercase tracking-tighter">구조</span>
                          <span className="text-[10px] px-2 py-0.5 bg-surface-primary text-text-secondary rounded font-bold border border-border-primary/35 uppercase tracking-tighter">무장</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 레퍼런스 보드 Section */}
                <div className="xl:col-span-3 space-y-4 xl:pr-6">
                  <div className="flex items-center justify-between px-1">
                    <h3 onClick={() => { setIsPanelOpen(false); setCurrentPage('references'); }} className="text-[17px] font-bold text-text-primary tracking-tight cursor-pointer hover:text-brand-primary transition-colors">레퍼런스 보드</h3>
                    <button 
                      onClick={() => { setIsPanelOpen(false); setCurrentPage('references'); }}
                      className="text-[12px] font-bold text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { name: '판타지 성', count: '128 items', tag: '3D Assets', img: '/images/work_%2043.png' },
                      { name: '다크 판타지', count: '318 items', tag: 'Concept', img: '/images/work_%2044.png' },
                    ].map((item) => (
                      <div 
                        key={item.name} 
                        className="relative h-[82px] rounded-[10px] border border-border-primary/20 overflow-hidden transition-all hover:scale-[1.005] hover:border-brand-primary/45 shadow-[0_4px_15px_rgba(0,0,0,0.3)] cursor-pointer group"
                      >
                        {/* Background Image with elegant ambient dark gradient overlay */}
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={item.img} 
                            alt="" 
                            className="w-full h-full object-cover opacity-[0.32] transition-transform duration-300 group-hover:scale-100 group-hover:opacity-90" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1011] via-[#0e1011]/80 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0e1011] via-[#0e1011]/60 to-[#0e1011]/20" />
                        </div>
                        
                        {/* Foreground content safely situated on top of backdrop */}
                        <div className="relative z-10 flex flex-col justify-end h-full p-3.5">
                          <h4 className="text-[15px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">{item.name}</h4>
                          <div className="flex gap-1.5 mt-2">
                            <span className="text-[10px] px-2 py-0.5 bg-bg-dark/80 text-text-secondary rounded font-bold border border-border-primary/30 uppercase tracking-tighter">{item.count}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-bg-dark/80 text-text-secondary rounded font-bold border border-border-primary/30 uppercase tracking-tighter">{item.tag}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      )}

      {(currentPage === 'product_detail' || (currentPage === 'home' && (isAssetDragging || isPanelDropMode))) && (
        <QuickCollectPanel
          isOpen={isPanelOpen}
          collections={quickCollections}
          onOpen={() => setIsPanelOpen(true)}
          onClose={() => {
            setIsPanelOpen(false);
            setIsPanelDropMode(false);
          }}
          onOpenDrop={() => {
            setIsPanelDropMode(true);
            setIsPanelOpen(true);
          }}
          onDropTarget={handleDropTarget}
          onNavigate={(page) => {
            setIsPanelOpen(false);
            setIsPanelDropMode(false);
            setCurrentPage(page);
          }}
        />
      )}

      <QuickCollectDialog
        request={quickDialog}
        onClose={() => setQuickDialog(null)}
        onSave={(mode, groupName, memo) => {
          if (!quickDialog) return;
          const suffix = mode === "new" ? "새로 저장" : "기존에 추가";
          addQuickCollection(quickDialog.target, quickDialog.asset, `${groupName} · ${suffix}`, memo);
          setQuickDialog(null);
          setIsPanelDropMode(true);
          setIsPanelOpen(true);
        }}
      />

      {/* Premium Multi-Column Footer (Custom designed in Neo-Poly aesthetic matching reference screenshot) */}
      {currentPage !== 'board' && currentPage !== 'projects' && currentPage !== 'notes' && currentPage !== 'note-editor' && currentPage !== 'uploads' && currentPage !== 'full_workflow' && currentPage !== 'full_workflow_chat' && currentPage !== 'studio' && currentPage !== 'turnaround' && currentPage !== 'modeling_generation' && (
        <footer className="bg-[#08080a] border-t border-border-soft/60 pt-16 pb-12 px-6">
          <div className="max-w-[2006px] mx-auto">
            {/* Main Footer columns */}
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 pb-12 border-b border-border-soft/30">
              {/* Column 1: 회사 소개 */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[16px] font-bold text-text-primary tracking-tight font-sans">회사 소개</h4>
              <ul className="space-y-3 text-[15px] text-text-secondary">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">회사 정보</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">회사 블로그</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">채용 정보</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">사이트 맵</li>
              </ul>
            </div>

            {/* Column 2: 고객 지원 */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[16px] font-bold text-text-primary tracking-tight font-sans">고객 지원</h4>
              <ul className="space-y-3 text-[15px] text-text-secondary">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">고객 지원 채팅</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">AI 답변 채팅</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">도움말</li>
              </ul>
            </div>

            {/* Column 3: 법률 정책 */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[16px] font-bold text-text-primary tracking-tight font-sans">법률 정책</h4>
              <ul className="space-y-3 text-[15px] text-text-secondary">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">서비스 약관</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">3D 모델 라이선스</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">개인 정보 정책</li>
              </ul>
            </div>

            {/* Column 4: 기업 */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[16px] font-bold text-text-primary tracking-tight font-sans">기업</h4>
              <ul className="space-y-3 text-[15px] text-text-secondary">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">브랜드 관리</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">제휴사</li>
              </ul>
            </div>

            {/* Column 5: 제휴사 WITH DOG block */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[16px] font-bold text-text-primary tracking-tight font-sans">제휴사</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 bg-surface-primary hover:bg-[#1A1C22] px-3.5 py-1.5 border border-border-primary rounded-[6px] w-fit cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <span className="text-text-primary text-[12px] font-extrabold font-sans">With</span>
                  <span className="text-[#3282f6] text-[12px] font-black font-sans tracking-tight">DOG</span>
                </div>
                <p className="text-[15px] text-text-secondary hover:text-brand-primary cursor-pointer transition-colors">제휴사</p>
              </div>
            </div>

            {/* Column 6: Social links (Flat, stream-aligned, no border or backdrop background) */}
            <div className="col-span-2 lg:col-span-2 flex flex-col lg:items-end justify-start space-y-4">
              <div className="flex items-center gap-6">
                <a 
                  href="#" 
                  className="flex items-center justify-center text-text-secondary hover:text-brand-primary transition-all p-1 hover:scale-105" 
                  aria-label="Instagram"
                >
                  <Instagram className="w-[24px] h-[24px]" />
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center text-text-secondary hover:text-brand-primary transition-all p-1 group hover:scale-105" 
                  aria-label="Naver Blog"
                >
                  <div className="flex items-center font-sans font-extrabold text-[12px] tracking-tight text-text-secondary group-hover:text-brand-primary whitespace-nowrap">
                    <span className="text-bg-dark bg-[#a7a8ab] group-hover:bg-brand-primary group-hover:text-bg-dark text-[9px] px-1 py-[1.5px] rounded-[3px] mr-[3px] leading-none font-sans font-black transition-colors">N</span>
                    blog
                  </div>
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center text-text-secondary hover:text-brand-primary transition-all p-1 hover:scale-105" 
                  aria-label="YouTube"
                >
                  <Youtube className="w-[26px] h-[26px]" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-text-tertiary">
            <div className="flex items-center gap-2 font-sans">
              <span>NEOPOLY</span>
              <span className="w-1 h-1 rounded-full bg-brand-primary/40" />
              <span>PRODUCTION PIPELINE v0.8.4</span>
            </div>
            <div className="flex gap-8 font-sans">
              <span className="hover:text-text-primary cursor-pointer transition-colors">CONTACT</span>
              <span className="hover:text-text-primary cursor-pointer transition-colors">TERMS OF USE</span>
              <span>© 2026 NEOPOLY CORP. ALL RIGHTS RESERVED.</span>
            </div>
          </div>
        </div>
      </footer>
      )}
      
      {currentPage === 'home' && <ScrollToTopButton />}
    </div>
  );
}
