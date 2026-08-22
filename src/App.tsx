/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { 
  Search, ShoppingCart, Bell, LayoutGrid, User, Mountain, Building2, Menu, 
  Car, Sword, Box, Leaf, Wand2, Heart, Eye, Sliders, Plus, Folder, ChevronRight,
  Sparkles, Video, BrainCircuit, GripVertical, FileText, Skull,
  PanelRightClose, X, ChevronDown, Check, Instagram, Youtube, ShoppingBag,
  Upload, Trash2, Clock, LogOut, Settings, Star, ImageIcon, ArrowUp, CircleHelp,
  Moon, Sun
} from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import ContentManagementPage from './components/ContentManagementPage';
import PurchasedAssetsPage from './components/PurchasedAssetsPage';
import FavoritesPage from './components/FavoritesPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import ReferencePage, {
  REFERENCE_BOARDS,
  boardMatchesAsset,
  type ReferenceAIGroup,
} from './components/ReferencePage';
import ProjectPage, { DEFAULT_PROJECTS } from './components/ProjectPage';
import NotesPage, { NOTES, type NoteItem } from './components/NotesPage';
import NoteEditorPage from './components/NoteEditorPage';
import {
  AIBoardOrganizer,
  AIOrganizedBoard,
  type AIBoardPlan,
} from './components/AIBoardOrganizer';
import AIOrganizeOptionsDialog, {
  type AIOrganizationScope,
  type AIOrganizerTarget,
} from './components/AIOrganizeOptionsDialog';
import AIReferenceOrganizer from './components/AIReferenceOrganizer';
import UserProfilePage from './components/UserProfilePage';
import AIStudioPage from './components/AIStudioPage';
import FullWorkflowPage from './components/FullWorkflowPage';
import FullWorkflowIntroPage from './components/FullWorkflowIntroPage';
import SupportPage from './components/SupportPage';
import TurnaroundPage from './components/TurnaroundPage';
import ModelingGenerationPage from './components/ModelingGenerationPage';
import { type ThemeMode, UserProfile } from './types';
import { PRODUCT_DETAIL_CONTAINER_CLASS } from './productDetailLayout';
import { isPersistentModelingWorkflowPage } from './workflowPageCache';

// --- Constants & Updated Asset Data ---

const PROFILE_IMAGE = '/images/profile/UserProfile.png';
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

const ASSET_CATEGORY_FILTERS: Record<string, number[]> = {
  all: [],
  character: [1, 2, 5, 6, 11, 16, 17, 19, 22, 25, 26, 27, 34, 39, 40, 41, 42, 44, 46, 47, 48, 49, 50, 53, 54, 58, 59, 60],
  environment: [9, 12, 15, 25, 28, 29, 51, 52, 53, 54],
  architecture: [7, 8, 9, 10, 12, 13, 28, 29, 32, 35, 51, 52],
  vehicle: [4, 21, 28],
  weapon: [18, 23, 31, 34, 36, 45, 48],
  prop: [7, 8, 10, 13, 14, 18, 20, 24, 30, 31, 33, 35, 36, 56, 57],
  nature: [4, 15, 25, 32, 43, 51, 55, 57],
  animation: [1, 2, 3, 4, 5, 6, 11, 16, 17, 19, 22, 25, 26, 27, 34, 39, 40, 41, 42, 44, 46, 47, 48, 49, 50, 53, 54, 55, 58, 59, 60],
  ai: [1, 2, 3, 4, 5, 6, 7, 8, 16, 19, 21, 25, 26, 27, 34, 39, 40, 41, 42, 48, 49, 50, 53, 54, 55, 59, 60],
  material: [56, 57],
  creature: [2, 3, 4, 6, 37, 38, 42, 43, 53, 55],
  concept: [1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 25, 26, 27, 34, 39, 41, 42, 48, 49, 50, 51, 53, 54, 55],
};

const assetMatchesCategory = (assetId: number, categoryId?: string) => {
  if (!categoryId || categoryId === 'all') return true;
  return ASSET_CATEGORY_FILTERS[categoryId]?.includes(assetId) ?? true;
};

const MAIN_PANEL_PROJECT_PROGRESS: Record<number, number> = {
  1: 82,
  2: 86,
  3: 64,
  4: 38,
  5: 78,
  6: 68,
  7: 100,
  8: 100,
};

const MAIN_PANEL_PROJECTS = DEFAULT_PROJECTS.map((project) => ({
  id: project.id,
  title: project.name,
  image: project.listImage || project.image || "",
  status: project.status,
  progress: MAIN_PANEL_PROJECT_PROGRESS[project.id] ?? 0,
}));

export const ASSETS = [
  {
    id: 1,
    title: '엘프궁수',
    author: 'Hwan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    likes: '1.2K',
    views: '98',
    image: "/images/work_%201.png",
    badge: 'M'
  },
  {
    id: 2,
    title: '오크',
    author: 'Hwan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v1',
    likes: '754',
    views: '52',
    image: "/images/work_%202.png",
    badge: 'M'
  },
  {
    id: 3,
    title: '와이번',
    author: 'Hwan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    likes: '1.1K',
    views: '87',
    image: "/images/work_%203.png",
    badge: 'A'
  },
  {
    id: 4,
    title: '공룡',
    author: 'Hwan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    likes: '982',
    views: '76',
    image: "/images/work_%204.png",
    badge: 'M'
  },
  {
    id: 5,
    title: '스트릿 패션',
    author: 'Hwan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v2',
    likes: '1.1K',
    views: '89',
    image: "/images/work_%205.png",
    badge: 'M'
  },
  {
    id: 6,
    title: '코뿔소 전사',
    author: 'Hwan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    likes: '2.3K',
    views: '189',
    image: "/images/work_%206.png",
    badge: 'M'
  },
  {
    id: 7,
    title: 'MY POSCO 01',
    author: 'Hwan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    likes: '633',
    views: '33',
    image: "/images/work_%207.png",
    badge: 'A'
  },
  {
    id: 8,
    title: 'MY POSCO 02',
    author: 'Hwan',
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

type PrototypePurchaseItem = {
  id: number;
  title: string;
  author: string;
  price: string;
  rawPrice: number;
  image: string;
  category: string;
  badge: 'M' | 'A';
  license: string;
  fileFormat: string;
  purchasedAt?: number;
};

const PURCHASE_CART_KEY = 'neopoly_cart_items_v1';
const PURCHASED_ASSETS_KEY = 'neopoly_purchased_assets_v1';
const PROTOTYPE_CART_ADD_EVENT = 'neopoly:add-to-cart';
const PROTOTYPE_CART_REMOVE_EVENT = 'neopoly:remove-from-cart';
const PROTOTYPE_PURCHASE_EVENT = 'neopoly:purchased';

const safeReadPurchaseItems = (key: string): PrototypePurchaseItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const safeWritePurchaseItems = (key: string, items: PrototypePurchaseItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Storage can be blocked in preview browsers.
  }
};

const parseWonAmount = (value: string) => {
  const parsed = Number(String(value).replace(/[^0-9]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatWonAmount = (value: number) => `\u20A9${value.toLocaleString('ko-KR')}`;

const getPurchaseTotalText = (items: PrototypePurchaseItem[]) => {
  const total = items.reduce((acc, item) => acc + item.rawPrice, 0);
  if (total === 0 && items.some((item) => item.price.includes('\uBB38\uC758'))) return '\uBB38\uC758';
  return formatWonAmount(total);
};

const addPurchasedItemsToStorage = (items: PrototypePurchaseItem[]) => {
  const now = Date.now();
  const nextItems = items.map((item) => ({ ...item, purchasedAt: now }));
  const existing = safeReadPurchaseItems(PURCHASED_ASSETS_KEY);
  const nextIds = new Set(nextItems.map((item) => item.id));
  const merged = [...nextItems, ...existing.filter((item) => !nextIds.has(item.id))];
  safeWritePurchaseItems(PURCHASED_ASSETS_KEY, merged);
  window.dispatchEvent(new CustomEvent(PROTOTYPE_PURCHASE_EVENT, { detail: nextItems }));
  return nextItems;
};

function CheckoutDialog({
  items,
  onClose,
  onConfirm,
}: {
  items: PrototypePurchaseItem[] | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/58 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-[560px] rounded-[12px] border border-border-primary bg-[#0E1011] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-border-primary pb-4">
          <div>
            <p className="text-[14px] font-medium uppercase tracking-[0.12em] text-brand-primary">Prototype Checkout</p>
            <h2 className="mt-1 text-[24px] font-bold text-white">{'\uAD6C\uB9E4 \uD655\uC778'}</h2>
            <p className="mt-2 text-[15px] leading-[1.55] text-text-secondary">
              {'\uC2E4\uC81C \uACB0\uC81C\uB294 \uC9C4\uD589\uB418\uC9C0 \uC54A\uB294 \uD504\uB85C\uD1A0\uD0C0\uC785 \uACB0\uC81C \uD750\uB984\uC785\uB2C8\uB2E4.'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-text-tertiary transition hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-lg border border-border-soft bg-surface-primary/55 p-3">
              <img src={item.image} alt="" className="h-16 w-20 rounded-md object-cover" referrerPolicy="no-referrer" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-[14px] text-text-tertiary">by {item.author}</p>
                  </div>
                  <p className="shrink-0 text-[16px] font-semibold text-brand-primary">{item.price}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[14px] text-text-tertiary">
                  <span>{'\uB77C\uC774\uC120\uC2A4'}</span>
                  <span className="text-right text-text-secondary">{item.license}</span>
                  <span>{'\uD30C\uC77C \uD615\uC2DD'}</span>
                  <span className="text-right text-text-secondary">{item.fileFormat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-brand-primary/20 bg-brand-primary/5 p-4">
          <div className="flex items-center justify-between text-[16px]">
            <span className="font-medium text-text-secondary">{'\uCD1D \uACB0\uC81C \uAE08\uC561'}</span>
            <span className="text-[24px] font-bold text-brand-primary">{getPurchaseTotalText(items)}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={onClose} className="rounded-md border border-border-primary bg-transparent py-3 text-[15px] font-medium text-text-secondary transition hover:bg-white/5 hover:text-white">
            {'\uCDE8\uC18C'}
          </button>
          <button onClick={onConfirm} className="np-primary-action rounded-md bg-brand-primary py-3 text-[15px] font-medium text-bg-dark transition hover:bg-brand-hover">
            {'\uACB0\uC81C\uD558\uAE30'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PurchaseCompleteDialog({
  items,
  onClose,
  onViewPurchases,
}: {
  items: PrototypePurchaseItem[] | null;
  onClose: () => void;
  onViewPurchases?: () => void;
}) {
  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[230] flex items-center justify-center bg-black/58 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-[460px] rounded-[12px] border border-border-primary bg-[#0E1011] p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-green-500/30 bg-green-500/12 text-green-400">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="text-[24px] font-bold text-white">{'\uAD6C\uB9E4 \uC644\uB8CC'}</h2>
        <p className="mt-2 text-[15px] leading-[1.6] text-text-secondary">
          {items.length === 1 ? items[0].title : `${items.length}\uAC1C \uC791\uD488`}{'\uC774 \uAD6C\uB9E4\uD55C \uC791\uC5C5\uBB3C\uC5D0 \uCD94\uAC00\uB418\uC5C8\uC2B5\uB2C8\uB2E4.'}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={onClose} className="rounded-md border border-border-primary bg-transparent py-3 text-[15px] font-medium text-text-secondary transition hover:bg-white/5 hover:text-white">
            {'\uACC4\uC18D \uB458\uB7EC\uBCF4\uAE30'}
          </button>
          <button
            onClick={() => {
              onClose();
              onViewPurchases?.();
            }}
            className="np-primary-action rounded-md bg-brand-primary py-3 text-[15px] font-medium text-bg-dark transition hover:bg-brand-hover"
          >
            {'\uAD6C\uB9E4\uD55C \uC791\uC5C5\uBB3C'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Header({
  onNavigate,
  currentPage,
  activeNav,
  setActiveNav,
  theme,
  onThemeChange,
}: {
  onNavigate?: (page: any) => void;
  currentPage?: string;
  activeNav?: 'market' | 'art' | 'studio' | 'projects' | 'support' | null;
  setActiveNav?: (nav: 'market' | 'art' | 'studio' | 'projects' | 'support' | null) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [similarityResults, setSimilarityResults] = useState<any[] | null>(null);
  
  // Interactive Cart, Notifications, and Profile state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [cartItems, setCartItems] = useState<PrototypePurchaseItem[]>(() => safeReadPurchaseItems(PURCHASE_CART_KEY));
  const [checkoutItems, setCheckoutItems] = useState<PrototypePurchaseItem[] | null>(null);
  const [completeItems, setCompleteItems] = useState<PrototypePurchaseItem[] | null>(null);

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
  const themeToggleTimerRef = useRef<number | null>(null);
  const [isThemeTogglePrimed, setIsThemeTogglePrimed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('neopoly_recent_searches', JSON.stringify(recentSearches));
    } catch (e) {
      // safe fallback if storage is blocked
    }
  }, [recentSearches]);

  useEffect(() => {
    safeWritePurchaseItems(PURCHASE_CART_KEY, cartItems);
  }, [cartItems]);

  useEffect(() => {
    setIsThemeTogglePrimed(false);
  }, [theme]);

  useEffect(() => () => {
    if (themeToggleTimerRef.current !== null) {
      window.clearTimeout(themeToggleTimerRef.current);
    }
  }, []);

  useEffect(() => {
    const handleAddToCart = (event: Event) => {
      const item = (event as CustomEvent<PrototypePurchaseItem>).detail;
      if (!item) return;
      setCartItems((prev) => (prev.some((cartItem) => cartItem.id === item.id) ? prev : [item, ...prev]));
      setIsCartOpen(true);
      setIsNotifOpen(false);
      setIsProfileMenuOpen(false);
    };

    const handleRemoveFromCart = (event: Event) => {
      const itemId = (event as CustomEvent<number>).detail;
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const handlePurchased = (event: Event) => {
      const items = (event as CustomEvent<PrototypePurchaseItem[]>).detail || [];
      const purchasedIds = new Set(items.map((item) => item.id));
      setCartItems((prev) => prev.filter((item) => !purchasedIds.has(item.id)));
    };

    window.addEventListener(PROTOTYPE_CART_ADD_EVENT, handleAddToCart as EventListener);
    window.addEventListener(PROTOTYPE_CART_REMOVE_EVENT, handleRemoveFromCart as EventListener);
    window.addEventListener(PROTOTYPE_PURCHASE_EVENT, handlePurchased as EventListener);
    return () => {
      window.removeEventListener(PROTOTYPE_CART_ADD_EVENT, handleAddToCart as EventListener);
      window.removeEventListener(PROTOTYPE_CART_REMOVE_EVENT, handleRemoveFromCart as EventListener);
      window.removeEventListener(PROTOTYPE_PURCHASE_EVENT, handlePurchased as EventListener);
    };
  }, []);

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

  const handleCartCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    setCheckoutItems(cartItems);
  };

  const handleConfirmCartCheckout = () => {
    if (!checkoutItems || checkoutItems.length === 0) return;
    const purchased = addPurchasedItemsToStorage(checkoutItems);
    setCartItems((prev) => prev.filter((item) => !purchased.some((purchasedItem) => purchasedItem.id === item.id)));
    setCheckoutItems(null);
    setCompleteItems(purchased);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleEclipseThemeToggle = () => {
    if (isThemeTogglePrimed) return;

    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onThemeChange(nextTheme);
      return;
    }

    setIsThemeTogglePrimed(true);
    themeToggleTimerRef.current = window.setTimeout(() => {
      themeToggleTimerRef.current = null;
      onThemeChange(nextTheme);
    }, 120);
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
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
    setIsCartOpen(false);
    setIsFocused(false);
  };

  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.rawPrice, 0);
  const formattedTotalPrice = totalCartPrice.toLocaleString() + '₩';

  const mobileNavItems = [
    {
      label: 'Discover',
      icon: LayoutGrid,
      isActive: currentPage === 'home',
      action: () => { if(setActiveNav) setActiveNav(null); if(onNavigate) onNavigate('home'); },
    },
    {
      label: 'AI Studio',
      icon: Sparkles,
      isActive: activeNav === 'studio' || currentPage === 'studio' || currentPage === 'full_workflow' || currentPage === 'full_workflow_chat' || currentPage === 'turnaround' || currentPage === 'modeling_generation',
      action: () => { if(setActiveNav) setActiveNav('studio'); if(onNavigate) onNavigate('studio'); },
    },
    {
      label: 'Projects',
      icon: Folder,
      isActive: activeNav === 'projects' || currentPage === 'projects',
      action: () => { if(setActiveNav) setActiveNav('projects'); if(onNavigate) onNavigate('projects'); },
    },
    {
      label: 'Board',
      icon: FileText,
      isActive: currentPage === 'board' || currentPage === 'notes' || currentPage === 'references' || currentPage === 'note-editor',
      action: () => { if(setActiveNav) setActiveNav(null); if(onNavigate) onNavigate('board'); },
    },
    {
      label: 'Support',
      icon: CircleHelp,
      isActive: activeNav === 'support' || currentPage === 'support',
      action: () => { if(setActiveNav) setActiveNav('support'); if(onNavigate) onNavigate('support'); },
    },
  ];
  const handleMobileNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsNotifOpen(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 flex h-[60px] w-full items-center justify-between gap-2 border-b border-border-primary/45 bg-[#08090B]/80 px-3 backdrop-blur-xl sm:px-5 md:gap-6 lg:h-[76px] lg:px-6">
      {/* Left section: Logo + Left-aligned menu with comfortable custom spacing */}
      <div className="flex items-center gap-3 md:gap-8 lg:gap-12 xl:gap-16 shrink-0">
        <button
          type="button"
          onClick={() => {
            setIsMobileMenuOpen(prev => !prev);
            setIsCartOpen(false);
            setIsNotifOpen(false);
            setIsProfileMenuOpen(false);
            setIsFocused(false);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-transparent bg-transparent text-text-secondary transition hover:bg-white/5 hover:text-text-primary lg:hidden"
          aria-label={isMobileMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center">
          <img referrerPolicy="no-referrer" 
            src="/images/logo.png?v=2" 
            alt="NeoPoly" 
            onClick={() => { if(onNavigate) onNavigate('home'); if(setActiveNav) setActiveNav(null); }} 
            className="np-brand-logo absolute left-1/2 top-1/2 h-[28px] w-auto max-h-[37px] -translate-x-1/2 -translate-y-1/2 cursor-pointer object-contain transition-all sm:h-[32px] md:h-[35px] lg:static lg:translate-x-0 lg:translate-y-0"
          />
        </div>
        
        {/* Navigation Menu (Left-aligned, comfortable spacing) */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-5 lg:gap-7 xl:gap-10 text-[17px] lg:text-[17px] xl:text-[17px] font-medium text-text-tertiary whitespace-nowrap">
            <li 
              className={`${currentPage === 'home' ? 'text-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
              onClick={() => { if(setActiveNav) setActiveNav(null); if(onNavigate) onNavigate('home'); }}
            >
              Discover
            </li>
            <li 
              className={`${activeNav === 'studio' || currentPage === 'studio' || currentPage === 'full_workflow' || currentPage === 'full_workflow_chat' || currentPage === 'turnaround' || currentPage === 'modeling_generation' ? 'text-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
              onClick={() => { if(setActiveNav) setActiveNav('studio'); if(onNavigate) onNavigate('studio'); }}
            >
              AI Studio
            </li>
            <li 
              className={`${activeNav === 'projects' || currentPage === 'projects' ? 'text-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
              onClick={() => { if(setActiveNav) setActiveNav('projects'); if(onNavigate) onNavigate('projects'); }}
            >
              Projects
            </li>
            <li 
              className={`${currentPage === 'board' || currentPage === 'notes' || currentPage === 'references' || currentPage === 'note-editor' ? 'text-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
              onClick={() => { if(setActiveNav) setActiveNav(null); if(onNavigate) onNavigate('board'); }}
            >
              Board
            </li>

            <li 
              className={`${activeNav === 'support' || currentPage === 'support' ? 'text-brand-primary' : 'hover:text-text-primary'} py-1.5 cursor-pointer font-sans transition-colors`}
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
        <div className="relative hidden w-[210px] shrink-0 items-center gap-2 lg:flex xl:w-[290px]" ref={searchContainerRef}>
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
              placeholder="에셋·컬렉션 검색"
              className="h-[40px] w-full rounded-full border border-border-primary/80 bg-surface-primary pl-4 pr-10 font-sans text-[14px] font-medium leading-relaxed text-text-primary/95 outline-none transition-all placeholder:text-text-tertiary/75 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/10 md:text-[15px]"
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
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary transition-colors" />
          </div>

          {/* Floating Search Dropdown Board */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="np-header-popover absolute top-full right-0 mt-3.5 w-[310px] sm:w-[500px] md:w-[600px] bg-[#0E1011]/98 border border-border-primary rounded-[12px] p-5.5 shadow-[0_25px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl z-50 flex flex-col gap-5.5 text-left"
              >
                {/* 1. 유사 항목 찾기 Drag & Drop Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-text-primary flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> AI 이미지 유사도 검색
                    </span>
                    {uploadedImage && (
                      <button 
                        type="button"
                        onClick={() => { setUploadedImage(null); setSimilarityResults(null); }}
                        className="text-[14px] text-brand-primary hover:underline font-medium font-sans"
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
                      <p className="text-[14px] font-medium text-text-secondary font-sans">유사 이미지 검색 (드롭 / 클릭)</p>
                      <p className="text-[14px] text-text-tertiary font-sans">여기에 이미지를 놓으시면 유사 3D 모델을 매칭합니다</p>
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
                          <p className="text-[14px] font-medium text-text-primary font-sans">업로드된 이미지 기반 매칭 중</p>
                          <p className="text-[14px] text-brand-primary/80 flex items-center gap-1 font-medium font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" /> AI 알고리즘 비전 스캔 완료
                          </p>
                        </div>
                      </div>

                      {/* Display Similarity Results */}
                      <div className="space-y-2 border-t border-border-primary/20 pt-3">
                        <p className="text-[14px] font-sans font-medium uppercase tracking-wider text-text-secondary">유사 항목 매칭 결과</p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {similarityResults?.map((res, index) => (
                            <div key={index} className="bg-surface-primary/60 hover:bg-surface-primary p-2.5 rounded-[6px] border border-border-primary/20 flex flex-col gap-2 group cursor-pointer">
                              <div className="relative aspect-[16/10] rounded-[4px] overflow-hidden bg-black/40">
                                <img referrerPolicy="no-referrer" src={res.img} alt="" className="w-full h-full object-cover" />
                                <span className="absolute top-1 right-1 bg-brand-primary text-bg-dark px-1 py-0.5 rounded-[3px] text-[14px] font-medium font-sans">{res.simLevel}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[14px] font-medium text-text-primary truncate group-hover:text-brand-primary transition-colors font-sans">{res.title}</p>
                                <p className="text-[14px] text-text-tertiary font-sans truncate font-sans">by {res.creator}</p>
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
                        <span className="text-[14px] text-text-tertiary uppercase tracking-wider font-medium flex items-center gap-1 font-sans">
                          <Clock className="w-3 h-3" /> 최근 검색어
                        </span>
                        {recentSearches.length > 0 && (
                          <button 
                            onClick={() => setRecentSearches([])}
                            className="text-[14px] text-brand-primary font-medium hover:underline cursor-pointer border-0 bg-transparent font-sans"
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
                              className="flex items-center gap-1.5 bg-surface-primary/60 hover:bg-surface-primary border border-border-primary/45 rounded-full px-3 py-1 text-[14px] font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer group"
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
                        <p className="text-[14px] text-text-tertiary pl-0.5 font-sans">최근 검색 기록이 없습니다.</p>
                      )}
                    </div>

                    {/* Highly curated Suggested Keywords */}
                    <div className="space-y-2.5 pt-1">
                      <span className="text-[14px] text-text-tertiary uppercase tracking-wider font-medium flex items-center gap-1 font-sans">
                        <Sparkles className="w-3 h-3 text-brand-primary" /> 추천 태그 키워드
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {suggestedKeywords.map((item, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setSearchQuery(item)}
                            className="bg-brand-primary/5 hover:bg-brand-primary/15 border border-brand-primary/20 hover:border-border-primary/60 rounded-full px-3 py-1 text-[14px] font-medium text-brand-primary transition-all cursor-pointer font-sans"
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
                    <span className="text-[14px] text-text-tertiary uppercase tracking-wider font-medium block font-sans">매칭 추천 에셋</span>
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
                              <h5 className="text-[14px] font-medium text-text-primary group-hover:text-brand-primary transition-colors truncate font-sans">{asset.title}</h5>
                              <p className="text-[14px] text-text-tertiary font-sans truncate">by {asset.author}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary transition-colors hover:scale-105" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-7 font-sans">
                        <p className="text-[14px] text-text-tertiary">"{searchQuery}"에 일치하는 에셋이 캐시에 없습니다.</p>
                        <p className="text-[14px] text-text-tertiary mt-1">자유롭게 다른 키워드 또는 다크 판타지 등으로 검색해보세요.</p>
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
          <div className="relative hidden lg:block" ref={cartRef}>
            <button 
              onClick={toggleCart}
              className={`text-text-tertiary hover:text-text-primary transition-all p-2 hover:scale-110 relative cursor-pointer rounded-full hover:bg-surface-primary/30 ${isCartOpen ? 'text-brand-primary' : ''}`}
              aria-label="장바구니"
            >
              <ShoppingBag className="w-[19px] h-[19px] md:w-[21px] md:h-[21px]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-bg-dark text-[14px] font-medium min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center font-sans border border-[#08090B]">
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
                    className="np-header-popover absolute top-full right-[-50px] sm:right-0 mt-3.5 w-80 md:w-96 bg-[#0E1011]/98 border border-border-primary rounded-[12px] p-4.5 shadow-[0_25px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl z-50 flex flex-col gap-4 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-border-primary pb-3">
                      <span className="text-[15px] font-medium text-text-primary font-sans flex items-center gap-2">
                        <ShoppingBag className="w-[18px] h-[18px] text-brand-primary" /> 장바구니 <span className="text-[14px] text-brand-primary font-sans font-medium bg-brand-primary/15 px-2 py-0.5 rounded-full">{cartItems.length}</span>
                      </span>
                      {cartItems.length > 0 && (
                        <button 
                          onClick={() => setCartItems([])} 
                          className="text-[14px] text-text-tertiary hover:text-red-400 font-medium transition-colors font-sans border-0 bg-transparent cursor-pointer"
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
                              <h5 className="text-[15px] font-medium text-text-primary truncate font-sans">{item.title}</h5>
                              <span className="text-[14px] text-text-tertiary font-sans">{item.category}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[15px] font-medium text-brand-primary font-sans">{item.price}</p>
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
                          <p className="text-[14px] text-text-tertiary/60">인기 다크 판타지 에셋을 추가해 보세요.</p>
                        </div>
                      )}
                    </div>

                    {cartItems.length > 0 && (
                      <div className="border-t border-border-primary pt-3.5 space-y-3.5">
                        <div className="flex items-center justify-between text-[15px]">
                          <span className="text-text-secondary font-sans font-medium">총 주문 금액:</span>
                          <span className="text-[18px] font-semibold text-brand-primary font-sans">{formattedTotalPrice}</span>
                        </div>
                        <button onClick={handleCartCheckout} className="np-primary-action w-full py-2.5 bg-brand-primary hover:bg-[#F2B038] text-bg-dark text-[15px] font-medium rounded-[6px] tracking-wide transition-colors cursor-pointer text-center font-sans shadow-lg shadow-brand-primary/10 border-0">
                          결제 진행하기
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Icon + Dropdown */}
            <div className="relative hidden lg:block" ref={notifRef}>
              <button 
                onClick={toggleNotif}
                className={`text-text-tertiary hover:text-text-primary transition-all relative p-2 hover:scale-110 cursor-pointer rounded-full hover:bg-surface-primary/30 ${isNotifOpen ? 'text-brand-primary' : ''}`}
                aria-label="알림"
              >
                <Bell className="w-[19px] h-[19px] md:w-[21px] md:h-[21px]" />
                {notifications.some(n => n.unread) && (
                  <span className="np-notification-status absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-[#08090B] animate-pulse"></span>
                )}
              </button>
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="np-header-popover np-notification-popover absolute top-full right-[-10px] sm:right-0 mt-3.5 w-[340px] md:w-[420px] bg-[#0E1011]/98 border border-border-primary rounded-[12px] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl z-50 flex flex-col gap-4 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-border-primary pb-3.5">
                      <span className="text-[15px] font-medium text-text-primary font-sans flex items-center gap-2 tracking-tight">
                        <Bell className="w-[18px] h-[18px] text-brand-primary" /> 알림 센터 
                        <span className="text-[14px] text-brand-primary font-medium bg-brand-primary/10 px-2 py-0.5 rounded-md">
                          {notifications.filter(n => n.unread).length}개 안읽음
                        </span>
                      </span>
                      <div className="flex gap-4">
                        <button 
                          onClick={handleMarkAllRead} 
                          className="np-light-brand-text-action text-[14px] text-brand-primary hover:text-[#f3ba4b] font-medium font-sans border-0 bg-transparent cursor-pointer transition-colors"
                        >
                          모두 읽음
                        </button>
                        {notifications.length > 0 && (
                          <button 
                            onClick={() => setNotifications([])} 
                            className="text-[14px] text-text-secondary hover:text-red-400 font-medium font-sans border-0 bg-transparent cursor-pointer transition-colors"
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
                                <span className="block w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_8px_var(--color-brand-primary)] animate-pulse" />
                              ) : (
                                <span className="block w-2 h-2 rounded-full bg-text-tertiary/60" />
                              )}
                            </div>
                            
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className={`text-[15px] leading-relaxed transition-colors font-sans ${notif.unread ? 'text-text-primary font-medium' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[14px] text-text-tertiary block mt-1 font-sans">{notif.time}</span>
                            </div>

                            <button 
                              onClick={(e) => handleRemoveNotif(notif.id, e)}
                              aria-label={`${notif.title} 알림 삭제`}
                              className="self-center cursor-pointer rounded-full border-0 bg-transparent p-1.5 text-text-tertiary opacity-100 transition-colors duration-150 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
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
  <button
    type="button"
    aria-label="프로필 메뉴 열기"
    aria-expanded={isProfileMenuOpen}
    onClick={toggleProfileMenu}
    className="h-11 w-11 rounded-full bg-surface-secondary border border-border-soft cursor-pointer overflow-hidden hover:border-brand-primary transition-colors sm:h-10 sm:w-10 lg:h-8 lg:w-8"
  >
    <img src={PROFILE_IMAGE} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
  </button>

  <AnimatePresence>
    {isProfileMenuOpen && (
      <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        onMouseDown={() => setIsProfileMenuOpen(false)}
        className="fixed inset-x-0 bottom-0 top-[60px] z-[230] bg-black/45 backdrop-blur-[2px] lg:hidden"
      />
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="np-header-popover np-profile-popover safe-area-bottom fixed inset-x-0 top-[60px] z-[240] flex max-h-[calc(100dvh-60px)] flex-col overflow-y-auto border-b border-[#242831] bg-[#0B0D10]/98 px-4 pb-2 shadow-[0_18px_45px_rgba(0,0,0,0.72)] backdrop-blur-xl font-sans custom-scrollbar lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:mt-3.5 lg:max-h-[calc(100dvh-96px)] lg:w-[300px] lg:rounded-[12px] lg:border lg:border-[#2A2E36]/80 lg:bg-[#0E1011] lg:px-0 lg:pb-1 lg:shadow-[0_25px_60px_rgba(0,0,0,0.95)] lg:backdrop-blur-3xl"
      >
        {/* Header: User Info */}
        <div className="flex items-center gap-3 p-4 border-b border-[#2A2E36]/50">
          <img referrerPolicy="no-referrer" src={PROFILE_IMAGE} alt="Profile" className="w-[42px] h-[42px] rounded-full border border-border-soft object-cover" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium text-text-primary tracking-tight">Hwan</span>
              <span className="text-[14px] bg-brand-primary/20 text-brand-primary border border-brand-primary/30 px-1.5 py-[1px] rounded uppercase font-medium tracking-wider">PRO</span>
            </div>
            <span className="text-[14px] text-text-secondary">rlawlghks898@gmail.com</span>
          </div>
        </div>

        {/* AI Studio Credit Box */}
        <div className="mx-4 mt-4 p-3.5 bg-surface-primary/60 border border-border-soft/60 rounded-[8px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-text-secondary flex items-center gap-1.5 font-medium tracking-tight">
              <Sparkles className="w-4 h-4 text-brand-primary" /> AI Studio 크레딧
            </span>
            <span className="text-[14px] text-brand-primary font-sans font-medium tracking-tight">320 / 500 CC</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-full mt-2.5">
            <div className="h-full bg-brand-primary w-[64%] shadow-[0_0_8px_rgba(224,161,46,0.6)]"></div>
          </div>
        </div>

        <div className="mx-4 mt-3 flex items-center justify-between rounded-[8px] border border-border-soft/60 bg-surface-primary/45 px-3.5 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-text-secondary">
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-[14px] font-medium tracking-tight text-text-primary">화면 모드</span>
              <span className="text-[12px] leading-[18px] text-text-tertiary">
                {theme === 'dark' ? '다크 모드' : '라이트 모드'}
              </span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'light'}
            aria-label={`현재 ${theme === 'dark' ? '다크 모드' : '라이트 모드'}, 화면 모드 전환`}
            onClick={handleEclipseThemeToggle}
            disabled={isThemeTogglePrimed}
            data-mode={theme}
            className={`np-eclipse-toggle shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 ${
              isThemeTogglePrimed ? 'is-priming' : ''
            }`}
          >
            <span aria-hidden="true" className="np-eclipse-orbit" />
            <span aria-hidden="true" className="np-eclipse-sparkle np-eclipse-sparkle-one" />
            <span aria-hidden="true" className="np-eclipse-sparkle np-eclipse-sparkle-two" />
            <span aria-hidden="true" className="np-eclipse-sparkle np-eclipse-sparkle-three" />
            <span aria-hidden="true" className="np-eclipse-orb" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col mt-3 px-2">
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('uploads'); }} className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-medium tracking-tight">
            <Upload className="w-[20px] h-[20px]" /> 콘텐츠 관리
          </button>
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('projects'); }} className="hidden lg:flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-medium tracking-tight">
            <Folder className="w-[20px] h-[20px]" /> 내 프로젝트
          </button>
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('board'); }} className="hidden lg:flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-medium tracking-tight">
            <LayoutGrid className="w-[20px] h-[20px]" /> 보드
          </button>
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('favorites'); }} className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-medium tracking-tight">
            <Heart className="w-[20px] h-[20px]" /> 찜한 작품
          </button>
          <button onClick={() => { setIsProfileMenuOpen(false); if(onNavigate) onNavigate('purchases'); }} className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-medium tracking-tight">
            <ShoppingBag className="w-[20px] h-[20px]" /> 구매한 에셋
          </button>
          <button 
            onClick={() => {
              setIsProfileMenuOpen(false);
              if(onNavigate) onNavigate('settings');
            }}
            className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-text-secondary hover:text-text-primary hover:bg-surface-primary/50 transition-colors cursor-pointer rounded-lg text-[14px] font-medium tracking-tight"
          >
            <Settings className="w-[20px] h-[20px]" /> 계정 설정
          </button>
        </div>
        {/* Footer */}
        <div className="border-t border-[#2A2E36]/50 mt-2 p-1.5 px-2">
          <button className="flex items-center gap-3.5 px-3 py-3 w-full text-left bg-transparent border-0 text-[#9A9DA3] hover:bg-red-500/10 hover:text-[#E46B6B] transition-colors cursor-pointer rounded-lg text-[14px] font-medium tracking-tight">
            <LogOut className="w-[20px] h-[20px]" /> 로그아웃
          </button>
        </div>
      </motion.div>
      </>
    )}
  </AnimatePresence>
</div>
        </div>
      </div>
    </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onMouseDown={() => setIsMobileMenuOpen(false)}
            className="fixed inset-x-0 bottom-0 top-[60px] z-[240] bg-black/45 backdrop-blur-[2px] lg:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onMouseDown={(event) => event.stopPropagation()}
              className="safe-area-bottom max-h-[calc(100dvh-60px)] overflow-y-auto border-b border-[#242831] bg-[#0B0D10]/98 px-4 pb-4 pt-5 shadow-[0_18px_45px_rgba(0,0,0,0.72)] backdrop-blur-xl custom-scrollbar"
              aria-label="모바일 메뉴"
            >
              <div className="mx-auto flex max-w-[720px] flex-col gap-1 md:flex-row md:items-center md:justify-center md:gap-9">
                {mobileNavItems.map(({ label, isActive, action }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleMobileNav(action)}
                    className={`group flex h-12 w-full items-center justify-start rounded-md bg-transparent px-3 text-left text-[17px] transition-colors md:h-11 md:w-auto md:px-0 md:hover:bg-transparent ${
                      isActive
                        ? "font-semibold text-brand-primary"
                        : "font-medium text-text-tertiary hover:bg-white/[0.04] hover:text-text-primary"
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {checkoutItems && (
          <CheckoutDialog
            items={checkoutItems}
            onClose={() => setCheckoutItems(null)}
            onConfirm={handleConfirmCartCheckout}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {completeItems && (
          <PurchaseCompleteDialog
            items={completeItems}
            onClose={() => setCompleteItems(null)}
            onViewPurchases={() => {
              setCompleteItems(null);
              onNavigate?.('purchases');
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}


function Hero({ onNavigate }: { onNavigate?: (page: any) => void }) {
  return (
    <section className="relative h-[300px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={HERO_IMAGE} 
          alt="Hero" 
          className="h-[calc(100%+20px)] w-full -translate-y-2 object-cover object-[62%_top] sm:object-[58%_top] md:object-top"
          referrerPolicy="no-referrer"
        />
        {/* Adjusted cinematic overlays (reduced opacity) */}
        <div className="np-hero-gradient absolute inset-0 bg-gradient-to-r from-bg-dark/75 via-bg-dark/30 to-transparent"></div>
        <div className="np-hero-gradient absolute inset-0 bg-gradient-to-t from-bg-dark/70 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative z-10 mx-auto flex h-full max-w-[2560px] flex-col items-start justify-center px-5 pt-4 text-left sm:px-6 2xl:px-8 min-[2200px]:px-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="np-hero-content w-full max-w-[560px] md:ml-[18vw] lg:ml-[28vw] xl:ml-[30vw]"
        >
          <div className="mb-7 space-y-3 sm:mb-8">
            <h1 className="text-[30px] font-bold leading-[1.3] tracking-tight text-text-primary drop-shadow-2xl font-display sm:text-[36px] md:text-[40px] md:leading-[1.3]">
              아이디어를 현실로<br />
              <span className="text-text-primary/95">3D 제작의 모든 과정</span>
            </h1>
            <p className="np-hero-copy max-w-sm text-[14px] font-medium leading-[1.65] text-text-secondary/85 sm:text-[15px]">
              레퍼런스 수집부터 AI 생성, 모델링까지<br />
              당신의 3D 워크플로우를 하나로 연결합니다.
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate && onNavigate('studio')}
            className="np-hero-cta group relative min-h-11 rounded-sm border border-brand-primary/80 bg-black/15 px-6 py-2 text-[14px] font-medium text-brand-primary transition-all hover:bg-brand-primary hover:text-bg-dark">
            AI 스튜디오 시작
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryNav({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}) {
  return (
    <section className="relative hidden md:block">
      <div className="flex h-[92px] items-center gap-0 overflow-x-auto scrollbar-hide lg:h-[100px]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`group flex h-full w-[88px] min-w-[88px] shrink-0 flex-col items-center justify-center transition-all lg:w-[104px] lg:min-w-[104px] xl:w-[110px] xl:min-w-[110px] ${
              activeCategory === cat.id 
                ? 'text-brand-primary' 
                : 'text-text-tertiary hover:text-brand-primary/60'
            }`}
          >
            <div className={`flex items-center justify-center transition-all mb-1`}>
              <cat.icon className={activeCategory === cat.id ? "h-7 w-7 lg:h-[30px] lg:w-[30px]" : "h-7 w-7 opacity-60 transition-opacity group-hover:opacity-100 lg:h-[30px] lg:w-[30px]"} />
            </div>
            <span className="text-[14px] font-medium tracking-tight lg:text-[15px]">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function MobileCategoryRail({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0, hasMoved: false });
  const suppressClickRef = useRef(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      hasMoved: false,
    };
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;
    if (!scroller || !dragState.isDragging) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 4) {
      dragState.hasMoved = true;
      suppressClickRef.current = true;
    }

    scroller.scrollLeft = dragState.scrollLeft - deltaX;
  };

  const endPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const didMove = dragStateRef.current.hasMoved;

    dragStateRef.current.isDragging = false;
    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
    if (didMove) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  return (
    <section className="md:hidden border-b border-[#1F2329]/80 pb-1" aria-label="모바일 카테고리">
      <div
        ref={scrollerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        onPointerLeave={endPointerDrag}
        className="-mx-4 flex cursor-grab touch-pan-x select-none items-center gap-5 overflow-x-auto px-4 scrollbar-hide active:cursor-grabbing"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              if (suppressClickRef.current) return;
              onCategoryChange(cat.id);
            }}
            aria-pressed={activeCategory === cat.id}
            className={`relative flex h-10 shrink-0 items-center text-[14px] font-medium transition-colors ${
              activeCategory === cat.id
                ? 'text-brand-primary'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            <span>{cat.label}</span>
            {activeCategory === cat.id && (
              <motion.span layoutId="mobileCategoryUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

function MobileCategoryPicker({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}) {
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const categorySheetDragControls = useDragControls();
  const activeCategoryMeta = CATEGORIES.find((cat) => cat.id === activeCategory) ?? CATEGORIES[0];
  const ActiveCategoryIcon = activeCategoryMeta.icon;

  const handleCategorySheetDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 84 || info.velocity.y > 480) {
      setIsCategorySheetOpen(false);
    }
  };

  return (
    <section className="md:hidden" aria-label="모바일 카테고리">
      <button
        type="button"
        onClick={() => setIsCategorySheetOpen(true)}
        aria-expanded={isCategorySheetOpen}
        className="inline-flex h-11 items-center gap-2 rounded-md bg-transparent px-0 text-left text-[14px] font-medium text-text-tertiary transition-colors hover:text-text-primary"
      >
        <ActiveCategoryIcon className="h-4 w-4 text-brand-primary" />
        <span className="text-text-primary">{activeCategoryMeta.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isCategorySheetOpen ? 'rotate-180 text-brand-primary' : 'text-text-tertiary'}`} />
      </button>

      <AnimatePresence>
        {isCategorySheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onMouseDown={() => setIsCategorySheetOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[60px] z-[245] bg-black/45 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: "100%", opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 1 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              drag="y"
              dragControls={categorySheetDragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.35 }}
              onDragEnd={handleCategorySheetDragEnd}
              className="fixed inset-x-0 bottom-0 z-[260] max-h-[76dvh] overflow-hidden rounded-t-[16px] border-t border-[#242831] bg-[#0B0D10]/98 shadow-[0_-18px_45px_rgba(0,0,0,0.72)] backdrop-blur-xl"
            >
              <div
                className="flex cursor-grab touch-none flex-col items-center border-b border-[#242831] px-4 pb-4 pt-3 active:cursor-grabbing"
                onPointerDown={(event) => categorySheetDragControls.start(event)}
              >
                <span className="h-1 w-10 rounded-full bg-[#3A3F48]" />
                <div className="mt-3 flex w-full items-center justify-center">
                  <span className="text-[16px] font-semibold tracking-tight text-text-primary">카테고리</span>
                </div>
              </div>

              <div className="grid max-h-[calc(76dvh-68px)] grid-cols-2 gap-2 overflow-y-auto p-4 pb-6 custom-scrollbar">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onCategoryChange(cat.id);
                        setIsCategorySheetOpen(false);
                      }}
                      aria-pressed={isActive}
                      className={`flex h-11 items-center gap-2 rounded-[8px] border px-3 text-left transition-colors ${
                        isActive
                          ? 'border-brand-primary/55 bg-brand-primary/12 text-brand-primary'
                          : 'border-[#1F2329] bg-[#0A0B0D] text-text-secondary hover:border-[#2A2E36] hover:text-text-primary'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-brand-primary' : 'text-text-tertiary'}`} />
                      <span className="min-w-0 truncate text-[14px] font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
            <h3 className="text-[15px] font-medium text-white">{title}</h3>
            <p className="text-[14px] text-text-tertiary">{description}</p>
          </div>
        </div>
        <button
          onClick={onNavigate}
          className="text-[14px] font-medium text-text-tertiary transition hover:text-brand-primary"
        >
          열기 <ChevronRight className="inline h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.slice(0, 4).map((item) => (
          <div key={`${item.id}-${item.addedAt}`} className="overflow-hidden rounded-lg border border-[#1F2329] bg-[#141518]">
            <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover" referrerPolicy="no-referrer" />
            <div className="p-2">
              <p className="truncate text-[14px] font-medium text-white">{item.title}</p>
              {item.groupName && <p className="mt-0.5 truncate text-[14px] text-brand-primary">{item.groupName}</p>}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex h-[120px] items-center justify-center rounded-lg border border-dashed border-[#2A2E36] text-[14px] font-medium text-text-tertiary">
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
    setNewName(request.target === "notes" ? `${request.asset.title} 메모` : `${request.asset.title} 레퍼런스`);
  }, [request]);

  if (!request) return null;

  const isNote = request.target === "notes";
  const availableNotes = (() => {
    try {
      const saved = localStorage.getItem("neopoly_notes_v3");
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
            <p className="text-[14px] font-medium text-brand-primary">{isNote ? "노트에 추가" : "레퍼런스에 추가"}</p>
            <h3 className="mt-1 text-[20px] font-bold text-white">{request.asset.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-text-tertiary transition hover:bg-[#1A1C20] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex gap-2 rounded-lg bg-[#08090B] p-1">
          {[
            ["existing", "기존에 추가"],
            ["new", isNote ? "새 노트" : "새 레퍼런스"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMode(id as "existing" | "new")}
              className={`flex-1 rounded-md px-3 py-2 text-[14px] font-medium transition ${
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
                  <span className="block truncate text-[14px] font-medium text-white">{option.name}</span>
                  <span className="mt-0.5 block text-[14px] font-medium text-text-tertiary">{option.count}</span>
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
              className="w-full rounded-lg border border-[#2A2E36] bg-[#08090B] px-4 py-3 text-[14px] font-medium text-white outline-none focus:border-brand-primary"
              placeholder={isNote ? "새 노트 이름" : "새 레퍼런스 이름"}
            />
            <textarea
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              className="h-28 w-full resize-none rounded-lg border border-[#2A2E36] bg-[#08090B] px-4 py-3 text-[14px] text-white outline-none focus:border-brand-primary"
              placeholder={isNote ? "옆에 남길 메모를 입력하세요." : "레퍼런스 설명이나 참고 메모를 입력하세요."}
            />
            <button
              onClick={() => onSave("new", newName.trim() || (isNote ? "새 노트" : "새 레퍼런스"), memo)}
              className="np-primary-action w-full rounded-lg bg-brand-primary py-3 text-[14px] font-medium text-bg-dark transition hover:bg-brand-hover"
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-40 flex justify-center sm:bottom-8"
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
              className="np-panel-trigger flex min-h-11 items-center gap-2 rounded-[8px] border border-border-primary/80 bg-bg-secondary/95 px-4 py-2.5 text-[14px] font-medium tracking-wide text-text-primary shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all hover:border-brand-primary hover:text-brand-primary sm:px-8 sm:py-3 sm:text-[15px]"
            >
              <Plus className="h-4 w-4" />
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
            className="np-main-panel fixed bottom-6 left-1/2 z-50 w-[1536px] max-w-[95%] rounded-[12px] border border-border-primary/50 bg-[#0E1011]/95 p-5 pt-12 shadow-[0_30px_60px_rgba(0,0,0,0.95)] backdrop-blur-xl"
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
                  onNavigate={() => onNavigate("board")}
                  onDropAsset={(asset) => onDropTarget("notes", asset)}
                />
              </div>
              <div className="xl:col-span-4">
                <QuickDropCard
                  title="레퍼런스"
                  description="새 레퍼런스 저장 또는 기존 목록 추가"
                  icon={LayoutGrid}
                  items={collections.references}
                  onNavigate={() => onNavigate("board")}
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
  const authorInitial = String(asset.author ?? "").trim().charAt(0).toUpperCase() || "?";
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => onOpenProduct?.(asset)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onOpenProduct?.(asset);
      }}
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => onAssetDragStart?.(asset, e as unknown as React.DragEvent)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[6px] border border-border-soft bg-surface-primary shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Main Image */}
        <img 
          src={asset.image} 
          alt={asset.title} 
          className="h-full w-full origin-center transform-gpu object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.006]"
          referrerPolicy="no-referrer"
        />

        {/* Badge - M or A */}
        <div className={`np-asset-type-badge absolute right-1.5 top-1.5 z-20 flex h-6 min-w-6 items-center justify-center rounded-[5px] px-1 text-[12px] font-medium backdrop-blur-[8px] transition-all duration-200 sm:right-2 sm:top-2 sm:h-7 sm:min-w-7 sm:rounded-[6px] sm:text-[14px] ${
          isMarket 
            ? 'np-asset-type-badge-market bg-brand-primary/40 text-[#F0B43A] group-hover:bg-brand-primary/50'
            : 'np-asset-type-badge-art bg-[#4C88D9]/40 text-[#A0C5FF] group-hover:bg-[#4C88D9]/50'
        }`}>
          {asset.badge}
        </div>

        {/* Always-visible Information Overlay (Mobile & Tablet) */}
        <div className="np-dark-media pointer-events-none absolute inset-x-0 bottom-0 z-10 flex min-h-[52%] flex-col justify-end bg-gradient-to-t from-black/98 via-black/68 to-transparent px-3 pb-3 pt-10 sm:px-3.5 sm:pb-3.5 lg:hidden">
          <p className="truncate text-[16px] font-semibold leading-6 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-[14px] sm:leading-5 md:text-[15px] md:leading-[22px]">
            {asset.title}
          </p>
          <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
              {authorInitial}
            </span>
            <span className="truncate text-[12px] leading-[18px] text-white/65">
              {asset.author}
            </span>
          </div>
        </div>

        {/* Hover Information Overlay (Desktop) */}
        <div className="np-dark-media absolute inset-x-0 bottom-0 z-10 hidden h-[56%] flex-col justify-end bg-gradient-to-t from-black/98 via-black/72 to-transparent p-4 pb-4 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 lg:flex">
          <p className="text-[15px] text-text-secondary font-medium">
            {asset.author}
          </p>
          <div className="flex items-center gap-3 mt-2 text-[14px] text-text-secondary">
            <div className="flex items-center gap-1 opacity-75 cursor-pointer hover:opacity-100 transition-opacity" onClick={onToggleFavorite}>
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} /> {asset.likes}
            </div>
            <div className="flex items-center gap-1 opacity-75">
              <Eye className="w-3.5 h-3.5" /> {asset.views}
            </div>
          </div>
          <div className="hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickCollect?.("references", asset);
              }}
              className="rounded-md border border-white/15 bg-black/55 px-2.5 py-1.5 text-[14px] font-medium text-white backdrop-blur transition hover:border-brand-primary hover:text-brand-primary"
            >
              레퍼런스
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickCollect?.("notes", asset);
              }}
              className="rounded-md border border-white/15 bg-black/55 px-2.5 py-1.5 text-[14px] font-medium text-white backdrop-blur transition hover:border-brand-primary hover:text-brand-primary"
            >
              메모
            </button>
          </div>
        </div>
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

function createPurchaseItem(asset: any, product: typeof PRODUCT_DETAIL_DATA[number], displayTitle: string): PrototypePurchaseItem {
  const fileFormat = product.fileInfo[0]?.[1] ?? 'FBX, OBJ, Blend';
  const rawPrice = parseWonAmount(product.price);
  return {
    id: asset.id,
    title: displayTitle,
    author: asset.author,
    price: product.price,
    rawPrice,
    image: asset.image,
    category: product.category === 'Market' ? '3D Market Asset' : 'Art Asset',
    badge: asset.badge,
    license: product.category === 'Market' ? '\uD45C\uC900 \uC0C1\uC5C5 \uB77C\uC774\uC120\uC2A4' : '\uD504\uB85C\uD1A0\uD0C0\uC785 \uC0C1\uB2F4\uD615 \uB77C\uC774\uC120\uC2A4',
    fileFormat,
  };
}

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
  draggable,
  ariaHidden,
}: {
  candidates: string[];
  fallback: string;
  alt: string;
  className: string;
  draggable?: boolean;
  ariaHidden?: boolean;
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
      draggable={draggable}
      aria-hidden={ariaHidden}
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
  onViewPurchases,
}: {
  assetId: number;
  onNavigateHome: () => void;
  onOpenProduct: (assetId: number) => void;
  onQuickCollect?: (target: QuickDropTarget, asset: any) => void;
  onAssetDragStart?: (asset: any, e: React.DragEvent) => void;
  onViewPurchases?: () => void;
}) {
  const asset = ASSETS.find((item) => item.id === assetId) ?? ASSETS[0];
  const product = PRODUCT_DETAIL_DATA[asset.id] ?? PRODUCT_DETAIL_DATA[1];
  const displayTitle = asset.title || product.title;
  const recommended = [5, 2, 1, 6]
    .map((id) => ASSETS.find((item) => item.id === id))
    .filter(Boolean) as typeof ASSETS;

  const gallery = PRODUCT_IMAGE_ORDER[asset.id] ?? Array.from({ length: product.galleryCount }, (_, index) => index + 1);
  const [heroOrder, ...detailOrders] = gallery;
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const mobileThumbnailRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveMobileSlide(0);
    mobileGalleryRef.current?.scrollTo({ left: 0 });
    mobileThumbnailRailRef.current?.scrollTo({ left: 0 });
  }, [asset.id]);

  const moveMobileGallery = (nextIndex: number) => {
    const galleryElement = mobileGalleryRef.current;
    if (!galleryElement) return;

    const boundedIndex = Math.min(Math.max(nextIndex, 0), gallery.length - 1);
    galleryElement.scrollTo({
      left: boundedIndex * galleryElement.clientWidth,
      behavior: "smooth",
    });
    setActiveMobileSlide(boundedIndex);
  };

  useEffect(() => {
    const thumbnailRail = mobileThumbnailRailRef.current;
    const activeThumbnail = thumbnailRail?.querySelector<HTMLElement>(
      `[data-thumbnail-index="${activeMobileSlide}"]`,
    );
    if (!thumbnailRail || !activeThumbnail) return;

    const centeredScrollPosition =
      activeThumbnail.offsetLeft - (thumbnailRail.clientWidth - activeThumbnail.clientWidth) / 2;
    thumbnailRail.scrollTo({
      left: Math.max(0, centeredScrollPosition),
      behavior: "smooth",
    });
  }, [activeMobileSlide]);

  return (
    <main className="np-product-detail flex-1 bg-[#08090B]">
      <div className={PRODUCT_DETAIL_CONTAINER_CLASS}>
        <button
          onClick={onNavigateHome}
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-md text-[14px] font-medium text-text-tertiary transition hover:text-brand-primary"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Discover로 돌아가기
        </button>

        <div
          draggable
          onDragStart={(event) => onAssetDragStart?.(asset, event)}
          className="np-product-media group relative mb-6 hidden aspect-[1456/744] overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D] md:block md:aspect-auto"
        >
          <SmartProductImage
            candidates={detailImageCandidates(product, asset.id, heroOrder)}
            fallback={productFallbackImage(asset.id, heroOrder, asset.image)}
            alt={displayTitle}
            className="h-full w-full object-cover md:h-auto md:object-contain"
          />
          <div className="absolute right-2 top-2 flex gap-1.5 opacity-100 transition md:right-4 md:top-4 md:gap-2 md:opacity-0 md:group-hover:opacity-100">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onQuickCollect?.("references", asset);
              }}
              className="np-product-media-action min-h-11 rounded-md border px-2.5 py-1.5 text-[12px] font-medium backdrop-blur transition sm:min-h-9 sm:px-3 sm:py-2 sm:text-[14px]"
            >
              레퍼런스
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onQuickCollect?.("notes", asset);
              }}
              className="np-product-media-action min-h-11 rounded-md border px-2.5 py-1.5 text-[12px] font-medium backdrop-blur transition sm:min-h-9 sm:px-3 sm:py-2 sm:text-[14px]"
            >
              메모
            </button>
          </div>
        </div>

        <section className="relative -mx-4 mb-5 w-[calc(100%+2rem)] md:hidden" aria-label={`${displayTitle} 이미지 갤러리`}>
          <div
            ref={mobileGalleryRef}
            onScroll={(event) => {
              const slideWidth = event.currentTarget.clientWidth;
              if (!slideWidth) return;
              const nextIndex = Math.round(event.currentTarget.scrollLeft / slideWidth);
              setActiveMobileSlide((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex);
            }}
            className="scrollbar-hide flex aspect-video w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
          >
            {gallery.map((order, index) => (
              <div
                key={order}
                className="np-product-media np-product-carousel-slide group relative h-full w-full shrink-0 snap-center overflow-hidden bg-[#0A0B0D]"
                aria-label={`${gallery.length}개 중 ${index + 1}번째 이미지`}
              >
                <SmartProductImage
                  candidates={detailImageCandidates(product, asset.id, order)}
                  fallback={productFallbackImage(asset.id, order, asset.image)}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-xl"
                  draggable={false}
                  ariaHidden
                />
                <span
                  className="pointer-events-none absolute inset-0 bg-black/25"
                  aria-hidden="true"
                />
                <SmartProductImage
                  candidates={detailImageCandidates(product, asset.id, order)}
                  fallback={productFallbackImage(asset.id, order, asset.image)}
                  alt={index === 0 ? displayTitle : `${displayTitle} detail ${order}`}
                  className="relative z-[1] h-full w-full object-contain"
                  draggable={false}
                />
                <div className="absolute right-2 top-2 z-[2] flex gap-1.5">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onQuickCollect?.("references", asset);
                    }}
                    className="np-product-media-action np-product-mobile-media-action min-h-8 rounded-md border px-2.5 py-1 text-[12px] font-medium backdrop-blur transition"
                  >
                    레퍼런스
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onQuickCollect?.("notes", asset);
                    }}
                    className="np-product-media-action np-product-mobile-media-action min-h-8 rounded-md border px-2.5 py-1 text-[12px] font-medium backdrop-blur transition"
                  >
                    메모
                  </button>
                </div>
              </div>
            ))}
          </div>

          {gallery.length > 1 && (
            <div
              ref={mobileThumbnailRailRef}
              className="np-product-thumbnail-rail scrollbar-hide flex touch-pan-x snap-x snap-proximity gap-1.5 overflow-x-auto overscroll-x-contain px-4 py-2.5 scroll-smooth"
              role="tablist"
              aria-label="상세 이미지 선택"
            >
              {gallery.map((order, index) => (
                <button
                  key={order}
                  type="button"
                  role="tab"
                  aria-selected={index === activeMobileSlide}
                  aria-label={`${gallery.length}개 중 ${index + 1}번째 이미지 보기`}
                  data-active={index === activeMobileSlide}
                  data-thumbnail-index={index}
                  onClick={() => moveMobileGallery(index)}
                  className="np-product-gallery-thumbnail relative h-11 w-14 shrink-0 snap-center overflow-hidden rounded-md border-2"
                >
                  <SmartProductImage
                    candidates={detailImageCandidates(product, asset.id, order)}
                    fallback={productFallbackImage(asset.id, order, asset.image)}
                    alt={`${displayTitle} ${index + 1}번째 이미지 썸네일`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  <span className="np-product-gallery-thumbnail-veil absolute inset-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px] min-[2200px]:grid-cols-[minmax(0,1fr)_420px]">
          <section className="hidden min-w-0 space-y-3 md:block">
            {detailOrders.map((order) => (
              <div
                key={order}
                draggable
                onDragStart={(event) => onAssetDragStart?.(asset, event)}
                className="np-product-media group relative overflow-hidden rounded-lg border border-[#1F2329] bg-[#0A0B0D]"
              >
                <SmartProductImage
                  candidates={detailImageCandidates(product, asset.id, order)}
                  fallback={productFallbackImage(asset.id, order, asset.image)}
                  alt={`${displayTitle} detail ${order}`}
                  className="h-auto w-full object-contain"
                />
                <div className="absolute right-2 top-2 flex gap-1.5 opacity-100 transition md:right-4 md:top-4 md:gap-2 md:opacity-0 md:group-hover:opacity-100">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onQuickCollect?.("references", asset);
                    }}
                    className="np-product-media-action min-h-11 rounded-md border px-2.5 py-1.5 text-[12px] font-medium backdrop-blur transition sm:min-h-9 sm:px-3 sm:py-2 sm:text-[14px]"
                  >
                    레퍼런스
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onQuickCollect?.("notes", asset);
                    }}
                    className="np-product-media-action min-h-11 rounded-md border px-2.5 py-1.5 text-[12px] font-medium backdrop-blur transition sm:min-h-9 sm:px-3 sm:py-2 sm:text-[14px]"
                  >
                    메모
                  </button>
                </div>
              </div>
            ))}
          </section>

          <aside className="xl:sticky xl:top-[92px] xl:self-start">
            <div className="flex flex-col gap-5">
              <ProductPurchasePanel asset={asset} product={product} displayTitle={displayTitle} onViewPurchases={onViewPurchases} />
              <ProductLicensePanel />
              <ProductStatsPanel stats={product.stats} />
              <ProductInfoPanel product={product} />
            </div>
          </aside>
        </div>
      </div>

      <section className="np-product-recommend-section border-t border-[#1F2329] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[2560px]">
          <h2 className="mb-8 text-[24px] font-bold text-white">추천 모델링</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {recommended.map((item) => (
              <button
                key={item.id}
                onClick={() => onOpenProduct(item.id)}
                draggable
                onDragStart={(event) => onAssetDragStart?.(item, event)}
                className="np-product-recommend-card overflow-hidden rounded-lg border border-[#242832] bg-[#101215] text-left transition hover:border-brand-primary/50"
              >
                <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover" referrerPolicy="no-referrer" />
                <div className="np-product-recommend-info border-t border-[#262A31] bg-[#15171D] p-4">
                  <span className="mb-2.5 inline-flex rounded-sm bg-brand-primary px-2 py-0.5 text-[14px] font-medium text-bg-dark">
                    Market
                  </span>
                  <h3 className="text-[15px] font-medium leading-tight text-white line-clamp-1">{item.id === 5 ? 'Street Dunker' : 'Fantasy Character 1'}</h3>
                  <p className="mt-1.5 text-[14px] font-medium leading-snug text-text-secondary">고품질 3D 캐릭터 모델</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[15px] font-medium text-brand-primary">{item.id === 5 ? '₩89,000' : '₩62K'}</span>
                    <span className="flex items-center gap-1.5 text-[14px] font-medium text-text-tertiary">
                      <Heart className="h-3.5 w-3.5" />
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

const readStoredIdSet = (key: string) => {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? (JSON.parse(saved) as number[]) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set<number>();
  }
};

const NOTE_TRASH_STORAGE_KEY = "neopoly_note_trash_v3";
const REFERENCE_TRASH_STORAGE_KEY = "neopoly_reference_trash_v3";

function BoardPage({
  onNavigate,
  favorites,
  toggleFavorite,
  initialView = "all",
  onEditNote,
}: {
  onNavigate: (page: PageType) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  initialView?: "all" | "notes" | "references";
  onEditNote: (note: NoteItem | null) => void;
}) {
  const [boardView, setBoardView] = useState<"all" | "notes" | "references">(initialView);
  const [boardNoteFilter, setBoardNoteFilter] = useState("all");
  const [boardReferenceCategory, setBoardReferenceCategory] = useState("all");
  const [activeBoardNoteId, setActiveBoardNoteId] = useState<number | null>(null);
  const [aiOrganizerTarget, setAiOrganizerTarget] = useState<AIOrganizerTarget | null>(null);
  const [aiOrganizerStep, setAiOrganizerStep] = useState<"options" | "review">("options");
  const [aiOrganizerScope, setAiOrganizerScope] = useState<AIOrganizationScope>("ungrouped");
  const [aiBoardPlan, setAiBoardPlan] = useState<AIBoardPlan | null>(null);
  const [referenceAiGroups, setReferenceAiGroups] = useState<ReferenceAIGroup[]>([]);
  const [focusedAiGroupCode, setFocusedAiGroupCode] = useState<string | null>(null);
  const [boardDeletedNoteIds, setBoardDeletedNoteIds] = useState<Set<number>>(
    () => readStoredIdSet(NOTE_TRASH_STORAGE_KEY),
  );
  const [boardDeletedReferenceIds, setBoardDeletedReferenceIds] = useState<Set<number>>(
    () => readStoredIdSet(REFERENCE_TRASH_STORAGE_KEY),
  );

  useEffect(() => {
    setBoardView(initialView);
  }, [initialView]);

  useEffect(() => {
    if (boardView !== "notes") {
      setActiveBoardNoteId(null);
    }
  }, [boardView]);

  useEffect(() => {
    localStorage.setItem(NOTE_TRASH_STORAGE_KEY, JSON.stringify(Array.from(boardDeletedNoteIds)));
  }, [boardDeletedNoteIds]);

  useEffect(() => {
    localStorage.setItem(REFERENCE_TRASH_STORAGE_KEY, JSON.stringify(Array.from(boardDeletedReferenceIds)));
  }, [boardDeletedReferenceIds]);

  const boardItems = [
    { id: "all" as const, label: "전체", icon: LayoutGrid },
    { id: "notes" as const, label: "노트", icon: FileText },
    { id: "references" as const, label: "레퍼런스", icon: ImageIcon },
  ];

  const liveNotes = NOTES.filter((note) => !boardDeletedNoteIds.has(note.id));
  const liveReferences = ASSETS.filter((asset) =>
    !boardDeletedReferenceIds.has(asset.id) &&
    REFERENCE_BOARDS.some((board) => boardMatchesAsset(board, asset as any)),
  );
  const savedReferenceIds = new Set(liveReferences.map((asset) => asset.id));
  const groupedNoteIds = new Set(
    aiBoardPlan?.groups
      .filter((group) => group.id !== "ungrouped")
      .flatMap((group) => group.noteIds) ?? [],
  );
  const groupedReferenceIds = new Set(
    referenceAiGroups.flatMap((group) => group.assetIds),
  );
  const notesForAI = aiOrganizerScope === "all"
    ? liveNotes
    : liveNotes.filter((note) => !groupedNoteIds.has(note.id));
  const referencesForAI = aiOrganizerScope === "all"
    ? liveReferences
    : liveReferences.filter((asset) => !groupedReferenceIds.has(asset.id));
  const activeBoardNote = activeBoardNoteId
    ? liveNotes.find((note) => note.id === activeBoardNoteId) || null
    : null;
  const noteTags = liveNotes.flatMap((note) => note.tags);
  const noteFilterFor = (noteIndex: number, tagIndex: number) => liveNotes[noteIndex]?.tags[tagIndex] ?? "all";
  const noteCountFor = (filter: string) =>
    filter === "all" ? liveNotes.length : liveNotes.filter((note) => note.tags.includes(filter)).length;
  const referenceCountFor = (category: string) => {
    if (category === "all") return liveReferences.length;
    if (category === "favorites") return favorites.length;
    if (category === "recent") return Math.min(12, liveReferences.length);
    const board = REFERENCE_BOARDS.find((item) => item.id === category);
    return board ? liveReferences.filter((asset) => boardMatchesAsset(board, asset as any)).length : 0;
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
      className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-[15px] font-medium transition ${
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

  const openAIOrganizer = (target: AIOrganizerTarget) => {
    setAiOrganizerTarget(target);
    setAiOrganizerScope("ungrouped");
    setAiOrganizerStep("options");
  };

  const contextualAIButton = (target: AIOrganizerTarget) => {
    const isNotes = target === "notes";
    return (
      <button
        type="button"
        onClick={() => openAIOrganizer(target)}
        className="flex w-full items-center gap-3 rounded-lg border border-brand-primary/30 bg-brand-primary/[0.06] px-3 py-3 text-left transition hover:border-brand-primary/50 hover:bg-brand-primary/[0.10]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary text-[#050505]">
          <Wand2 className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-[13px] font-semibold text-white">AI 정리</span>
          <span className="mt-0.5 block truncate text-[11px] text-text-tertiary">
            {isNotes ? "내용을 분석해 노트 그룹 제안" : "이미지와 태그로 컬렉션 제안"}
          </span>
        </span>
      </button>
    );
  };

  const renderNoteSubMenu = () => (
    <div className="ml-4 mt-3 space-y-4 pl-1">
      <div className="space-y-1.5">
        {submenuButton("전체 노트", liveNotes.length, boardNoteFilter === "all", () => setBoardNoteFilter("all"), <LayoutGrid className="h-4 w-4" />)}
        {submenuButton("즐겨찾기", liveNotes.filter((note) => note.starred).length, boardNoteFilter === "starred", () => setBoardNoteFilter("starred"), <Star className="h-4 w-4" />)}
        {submenuButton("최근 수정", liveNotes.length, false, () => setBoardNoteFilter("all"), <Clock className="h-4 w-4" />)}
        {submenuButton("휴지통", boardDeletedNoteIds.size, boardNoteFilter === "trash", () => setBoardNoteFilter("trash"), <Trash2 className="h-4 w-4" />)}
      </div>
      <div>
        <p className="mb-2 px-4 text-[14px] font-medium uppercase tracking-[0.08em] text-text-tertiary">폴더</p>
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
      {contextualAIButton("notes")}
    </div>
  );

  const renderReferenceSubMenu = () => (
    <div className="ml-4 mt-3 space-y-4 pl-1">
      <div className="space-y-1.5">
        {submenuButton("전체", referenceCountFor("all"), boardReferenceCategory === "all", () => setBoardReferenceCategory("all"), <LayoutGrid className="h-4 w-4" />)}
        {submenuButton("즐겨찾기", referenceCountFor("favorites"), boardReferenceCategory === "favorites", () => setBoardReferenceCategory("favorites"), <Star className="h-4 w-4" />)}
        {submenuButton("최근 추가", referenceCountFor("recent"), boardReferenceCategory === "recent", () => setBoardReferenceCategory("recent"), <Clock className="h-4 w-4" />)}
      </div>
      <div>
        <p className="mb-2 px-4 text-[14px] font-medium uppercase tracking-[0.08em] text-text-tertiary">보드</p>
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
                  <span className="block truncate text-[15px] font-medium">{board.label}</span>
                  <span className="mt-0.5 block text-[14px] font-medium text-text-tertiary">
                    {referenceCountFor(board.id)}개
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {contextualAIButton("references")}
    </div>
  );

  const sidebarButton = (item: (typeof boardItems)[number]) => {
    const Icon = item.icon;
    const active = boardView === item.id;
    return (
      <div key={item.id} className="py-2 first:pt-0 last:pb-0">
        <button
          onClick={() => setBoardView(item.id)}
          className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
            active
              ? "border-brand-primary/50 bg-brand-primary/10 text-white"
              : "border-transparent text-text-secondary hover:border-[#2A2E36] hover:bg-[#111317] hover:text-white"
          }`}
        >
          <Icon className={`h-5 w-5 shrink-0 ${active ? "text-brand-primary" : "text-text-tertiary"}`} />
          <span className="min-w-0 flex-1 text-[15px] font-medium">{item.label}</span>
        </button>
        {item.id === "notes" && boardView === "notes" && renderNoteSubMenu()}
        {item.id === "references" && boardView === "references" && renderReferenceSubMenu()}
      </div>
    );
  };

  const openBoardNoteDetail = (noteId: number) => {
    setActiveBoardNoteId(noteId);
  };

  const createManualNoteGroup = (name: string, noteIds: number[]) => {
    if (noteIds.length < 2) return;
    const selected = new Set(noteIds);
    setAiBoardPlan((current) => {
      const remainingGroups = (current?.groups ?? [])
        .filter((group) => group.id !== "ungrouped")
        .map((group) => ({
          ...group,
          noteIds: group.noteIds.filter((noteId) => !selected.has(noteId)),
        }))
        .filter((group) => group.noteIds.length > 0);
      const manualIndex = remainingGroups.filter((group) => group.id.startsWith("manual-note-")).length + 1;
      return {
        groups: [
          ...remainingGroups,
          {
            id: `manual-note-${Date.now()}`,
            code: `M${manualIndex}`,
            title: name,
            rationale: "사용자가 직접 선택해 만든 노트 그룹입니다.",
            noteIds,
          },
        ],
        relations: current?.relations ?? [],
        duplicates: current?.duplicates ?? [],
        recommendations: current?.recommendations ?? [],
      };
    });
  };

  const createManualReferenceGroup = (name: string, assetIds: number[]) => {
    if (assetIds.length < 2) return;
    const selected = new Set(assetIds);
    setReferenceAiGroups((current) => {
      const remainingGroups = current
        .map((group) => ({
          ...group,
          assetIds: group.assetIds.filter((assetId) => !selected.has(assetId)),
        }))
        .filter((group) => group.assetIds.length > 0);
      const manualIndex = remainingGroups.filter((group) => group.id.startsWith("manual-reference-")).length + 1;
      return [
        ...remainingGroups,
        {
          id: `manual-reference-${Date.now()}`,
          code: `M${manualIndex}`,
          title: name,
          rationale: "사용자가 직접 선택해 만든 레퍼런스 그룹입니다.",
          assetIds,
        },
      ];
    });
  };

  const renderOverviewNote = (note: (typeof NOTES)[number]) => (
    <button
      key={note.id}
      type="button"
      onClick={() => openBoardNoteDetail(note.id)}
      className="group flex min-h-[300px] min-w-0 flex-col overflow-hidden rounded-lg border border-[#242832] bg-[#121419] p-4 text-left transition hover:border-brand-primary/50 hover:bg-[#171A20]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[17px] font-semibold leading-tight text-white">{note.title}</h3>
          <p className="mt-1 text-[14px] font-medium text-text-tertiary">{note.date}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {note.starred && <Star className="h-4 w-4 fill-brand-primary text-brand-primary" />}
        </div>
      </div>
      <p className="line-clamp-2 text-[15px] leading-[1.6] text-text-secondary">{note.desc}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-[#2A2E36] px-2 py-1 text-[14px] font-medium text-text-tertiary">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
        {note.images.slice(0, 3).map((image) => (
          <img
            key={image}
            src={image}
            alt=""
            className="h-24 min-w-0 w-full rounded object-cover"
            referrerPolicy="no-referrer"
          />
        ))}
      </div>
    </button>
  );

  const renderBoardNoteDetail = (note: (typeof NOTES)[number]) => (
    <article className="flex h-full min-h-0 flex-col bg-[#0A0B0D]">
      <header className="shrink-0 border-b border-[#1C1E24] px-6 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-brand-primary">노트 보기</p>
            <h2 className="mt-2 text-[30px] font-medium leading-tight text-white sm:text-[34px]">{note.title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-medium text-text-tertiary">
              <span>{note.date}</span>
              <span className="h-1 w-1 rounded-full bg-[#4A4F5A]" />
              <span>이미지 {note.images.length}개</span>
              <span className="h-1 w-1 rounded-full bg-[#4A4F5A]" />
              <span>{note.starred ? "즐겨찾기 설정됨" : "즐겨찾기 미설정"}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onEditNote(note)}
              className="rounded-lg border border-brand-primary/35 bg-brand-primary/10 px-4 py-2 text-[14px] font-medium text-brand-primary transition hover:border-brand-primary/60 hover:bg-brand-primary/15"
            >
              노트 편집
            </button>
            <button
              type="button"
              title="닫기"
              onClick={() => setActiveBoardNoteId(null)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2A2E36] text-text-secondary transition hover:border-brand-primary/45 hover:text-white sm:h-9 sm:w-9"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
        <div className="space-y-5">
          <section className="space-y-3">
            <label className="block text-[16px] font-medium text-white" htmlFor={`board-note-memo-${note.id}`}>
              메모
            </label>
            <textarea
              id={`board-note-memo-${note.id}`}
              key={note.id}
              defaultValue={note.desc}
              placeholder="아이디어나 참고할 내용을 메모하세요."
              className="min-h-[260px] w-full resize-y rounded-xl border border-[#252A33] bg-[#101216] px-5 py-4 text-[17px] leading-[1.75] text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-brand-primary/55 focus:bg-[#12161D]"
            />
          </section>

          <section className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[14px] font-medium text-text-tertiary">태그</span>
            {note.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[#2A2E36] bg-[#151820] px-3 py-1.5 text-[14px] font-medium text-text-secondary">
                {tag}
              </span>
            ))}
          </section>

          <section className="pt-1">
            {note.images.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {note.images.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${note.title} image ${index + 1}`}
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-text-tertiary">저장된 이미지가 없습니다.</p>
            )}
          </section>
        </div>
      </div>
    </article>
  );

  const renderBoardNoteModal = () => {
    if (!activeBoardNote) return null;

    return (
      <div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-4 py-5 backdrop-blur-sm"
        onClick={() => setActiveBoardNoteId(null)}
      >
        <div
          className="h-[min(780px,calc(100dvh-32px))] w-full max-w-[960px] overflow-hidden rounded-xl border border-[#252A33] bg-[#08090B] shadow-2xl sm:h-[min(780px,calc(100dvh-48px))]"
          onClick={(event) => event.stopPropagation()}
        >
          {renderBoardNoteDetail(activeBoardNote)}
        </div>
      </div>
    );
  };

  const renderReferenceCollectionRail = () => {
    const priorityByGroup: Record<string, string[]> = {
      A: ["character", "armor", "weapon", "orc", "environment"],
      B: ["environment", "character", "armor", "orc", "weapon"],
      C: ["weapon", "environment", "armor", "character", "orc"],
    };
    const priority = focusedAiGroupCode
      ? priorityByGroup[focusedAiGroupCode] ?? REFERENCE_BOARDS.map((board) => board.id)
      : REFERENCE_BOARDS.map((board) => board.id);
    const orderedBoards = [...REFERENCE_BOARDS].sort(
      (first, second) => priority.indexOf(first.id) - priority.indexOf(second.id),
    );

    return (
      <aside className="flex min-h-[420px] min-w-0 flex-col overflow-hidden rounded-xl border border-[#20232A] bg-[#0D0F12] xl:min-h-0">
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#242832] px-4 sm:h-16">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-[16px] font-semibold text-white">레퍼런스</h2>
            {focusedAiGroupCode && (
              <span className="shrink-0 rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-semibold text-brand-primary">
                PROJECT {focusedAiGroupCode} 연관
              </span>
            )}
          </div>
          <span className="shrink-0 text-[12px] font-medium text-text-tertiary">
              {liveReferences.length}개
          </span>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 custom-scrollbar">
          {orderedBoards.map((board, index) => {
            const isAiRelated = Boolean(focusedAiGroupCode && index < 2);
            return (
              <button
                key={board.id}
                type="button"
                onClick={() => {
                  setBoardReferenceCategory(board.id);
                  setBoardView("references");
                }}
                className={`group flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition ${
                  isAiRelated
                    ? "border-brand-primary/30 bg-brand-primary/[0.05]"
                    : "border-[#252932] bg-[#101216] hover:border-brand-primary/35"
                }`}
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-[#08090B]">
                  <img
                    src={board.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    referrerPolicy="no-referrer"
                  />
                  {isAiRelated && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-semibold text-brand-primary">
                      AI 연관
                    </span>
                  )}
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-white">{board.label}</span>
                  <span className="mt-1 block text-[11px] text-text-tertiary">
                    {referenceCountFor(board.id)}개 · 컬렉션
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary transition group-hover:translate-x-0.5 group-hover:text-brand-primary" />
              </button>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-[#242832] px-4 py-3">
          <p className="text-[11px] leading-5 text-text-tertiary">
            노트에 추가된 이미지는 노트 안에서만 표시해 중복을 줄였습니다.
          </p>
        </div>
      </aside>
    );
  };

  return (
    <>
      <main className="flex h-[calc(100dvh-60px)] overflow-hidden bg-bg-dark text-text-primary lg:h-[calc(100dvh-76px)]">
      <aside className="np-primary-sidebar-surface hidden w-[300px] shrink-0 overflow-hidden border-r border-[#1C1E24] bg-[#0B0D10] p-5 lg:flex lg:flex-col">
        <div className="mb-6 shrink-0">
          <p className="text-[14px] font-medium uppercase tracking-[0.18em] text-brand-primary">Board</p>
          <h1 className="np-primary-sidebar-title mt-2 text-white">작업 보드</h1>
        </div>
        <nav
          aria-label="보드 메뉴"
          className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2 custom-scrollbar"
        >
          <div className="divide-y divide-[#1C1E24]">{boardItems.map(sidebarButton)}</div>
        </nav>
      </aside>

      <section className="min-w-0 flex-1 overflow-hidden p-4 lg:p-5">
        <div className="mb-4 flex gap-2 lg:hidden">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto scrollbar-hide">
            {boardItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setBoardView(item.id)}
                className={`min-w-[72px] flex-1 rounded-lg border px-3 py-2 text-[14px] font-medium ${
                  boardView === item.id
                    ? "border-brand-primary bg-brand-primary text-bg-dark"
                    : "border-[#2A2E36] bg-[#111317] text-text-secondary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {boardView !== "all" && (
            <button
              type="button"
              onClick={() => openAIOrganizer(boardView)}
              className="np-light-brand-action flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-brand-primary/40 bg-brand-primary/10 px-3 text-[13px] font-semibold text-brand-primary"
            >
              <Sparkles className="h-4 w-4" />
              AI 정리
            </button>
          )}
        </div>

        {boardView === "all" ? (
          aiBoardPlan ? (
            <div className="grid h-[calc(100%_-_60px)] min-h-0 grid-cols-1 gap-4 overflow-y-auto lg:h-full xl:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)] xl:overflow-hidden">
              <div className="min-h-[620px] min-w-0 xl:min-h-0">
                <AIOrganizedBoard
                  plan={aiBoardPlan}
                  notes={liveNotes}
                  onOpenNote={openBoardNoteDetail}
                  onRefine={() => openAIOrganizer("notes")}
                  onReset={() => {
                    setAiBoardPlan(null);
                    setFocusedAiGroupCode(null);
                  }}
                  onDissolveGroup={(groupId) => {
                    setFocusedAiGroupCode(null);
                    setAiBoardPlan((current) => {
                      if (!current) return current;
                      const targetGroup = current.groups.find((group) => group.id === groupId);
                      if (!targetGroup) return current;
                      const existingUngrouped = current.groups.find((group) => group.id === "ungrouped");
                      const ungroupedNoteIds = Array.from(
                        new Set([...(existingUngrouped?.noteIds ?? []), ...targetGroup.noteIds]),
                      );
                      return {
                        ...current,
                        groups: [
                          ...current.groups.filter(
                            (group) => group.id !== groupId && group.id !== "ungrouped",
                          ),
                          {
                            id: "ungrouped",
                            code: "U",
                            title: "그룹 없음",
                            rationale: "그룹에서 해제한 노트입니다. 연결 관계와 레퍼런스는 그대로 유지됩니다.",
                            noteIds: ungroupedNoteIds,
                          },
                        ],
                      };
                    });
                  }}
                  onDisconnectRelation={(relationId) => {
                    setAiBoardPlan((current) =>
                      current
                        ? {
                            ...current,
                            relations: current.relations.filter(
                              (relation) => relation.id !== relationId,
                            ),
                          }
                        : current,
                    );
                  }}
                  focusedGroupCode={focusedAiGroupCode}
                  onFocusedGroupChange={setFocusedAiGroupCode}
                />
              </div>
              {renderReferenceCollectionRail()}
            </div>
          ) : (
          <div className="grid h-[calc(100%_-_60px)] min-h-0 grid-cols-1 gap-4 overflow-y-auto lg:h-full xl:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)] xl:overflow-hidden">
            <div className="flex min-h-[560px] min-w-0 flex-col overflow-hidden rounded-xl border border-[#20232A] bg-[#090A0C] xl:min-h-0">
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#1C1E24] px-4 sm:h-16 sm:px-5">
                <h2 className="text-[16px] font-semibold text-white">노트</h2>
                <span className="text-[12px] font-medium text-text-tertiary">{liveNotes.length}개</span>
              </div>
              <div className="grid min-h-0 flex-1 content-start grid-cols-1 gap-3 overflow-y-auto p-4 pb-8 sm:grid-cols-2 2xl:grid-cols-3">
                {liveNotes.map(renderOverviewNote)}
              </div>
            </div>
            {renderReferenceCollectionRail()}
          </div>
          )
        ) : boardView === "notes" ? (
          <NotesPage
            onNavigate={onNavigate}
            isPopup
            hideSidebar
            hideDetailPanel
            onOpenNote={openBoardNoteDetail}
            onCreateNote={() => onEditNote(null)}
            boardFilter={boardNoteFilter}
            initialTrashIds={boardDeletedNoteIds}
            onTrashChange={setBoardDeletedNoteIds}
            aiGroups={aiBoardPlan?.groups.filter((group) => group.id !== "ungrouped") ?? []}
            onDissolveAIGroup={(groupId) => {
              setAiBoardPlan((current) =>
                current
                  ? {
                      ...current,
                      groups: current.groups.filter((group) => group.id !== groupId),
                    }
                  : current,
              );
            }}
            onCreateManualGroup={createManualNoteGroup}
          />
        ) : (
          <ReferencePage
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onNavigate={onNavigate}
            isPopup
            hideSidebar
            boardCategory={boardReferenceCategory}
            initialTrashIds={boardDeletedReferenceIds}
            onTrashChange={setBoardDeletedReferenceIds}
            aiGroups={referenceAiGroups}
            onDissolveAIGroup={(groupId) =>
              setReferenceAiGroups((current) => current.filter((group) => group.id !== groupId))
            }
            onCreateManualGroup={createManualReferenceGroup}
          />
        )}
      </section>
      </main>
      {renderBoardNoteModal()}
      {aiOrganizerTarget && aiOrganizerStep === "options" && (
        <AIOrganizeOptionsDialog
          target={aiOrganizerTarget}
          totalCount={aiOrganizerTarget === "notes" ? liveNotes.length : liveReferences.length}
          groupedCount={aiOrganizerTarget === "notes" ? groupedNoteIds.size : groupedReferenceIds.size}
          onClose={() => setAiOrganizerTarget(null)}
          onStart={(scope) => {
            setAiOrganizerScope(scope);
            setAiOrganizerStep("review");
          }}
        />
      )}
      {aiOrganizerTarget === "notes" && aiOrganizerStep === "review" && (
        <AIBoardOrganizer
          notes={notesForAI}
          references={ASSETS}
          savedReferenceIds={savedReferenceIds}
          onClose={() => setAiOrganizerTarget(null)}
          onApply={(plan) => {
            setAiBoardPlan((current) => {
              if (aiOrganizerScope === "all" || !current) return plan;
              const existingGroups = current.groups.filter((group) => group.id !== "ungrouped");
              const offset = existingGroups.length;
              const appendedGroups = plan.groups.map((group, index) => ({
                ...group,
                id: `group-ai-${offset + index + 1}`,
                code: String.fromCharCode(65 + ((offset + index) % 26)),
              }));
              return {
                groups: [...existingGroups, ...appendedGroups],
                relations: [...current.relations, ...plan.relations],
                duplicates: [...current.duplicates, ...plan.duplicates],
                recommendations: [...current.recommendations, ...plan.recommendations],
              };
            });
            setFocusedAiGroupCode(null);
            setBoardView("notes");
            setAiOrganizerTarget(null);
          }}
        />
      )}
      {aiOrganizerTarget === "references" && aiOrganizerStep === "review" && (
        <AIReferenceOrganizer
          assets={referencesForAI}
          onClose={() => setAiOrganizerTarget(null)}
          onApply={(groups) => {
            setReferenceAiGroups((current) => {
              if (aiOrganizerScope === "all") return groups;
              const offset = current.length;
              return [
                ...current,
                ...groups.map((group, index) => ({
                  ...group,
                  id: `reference-ai-${offset + index + 1}`,
                  code: `R${offset + index + 1}`,
                })),
              ];
            });
            setBoardView("references");
            setAiOrganizerTarget(null);
          }}
        />
      )}
    </>
  );
}

function ProductPurchasePanel({
  asset,
  product,
  displayTitle,
  onViewPurchases,
}: {
  asset: any;
  product: typeof PRODUCT_DETAIL_DATA[number];
  displayTitle: string;
  onViewPurchases?: () => void;
}) {
  const purchaseItem = createPurchaseItem(asset, product, displayTitle);
  const [checkoutItems, setCheckoutItems] = useState<PrototypePurchaseItem[] | null>(null);
  const [completeItems, setCompleteItems] = useState<PrototypePurchaseItem[] | null>(null);
  const [isInCart, setIsInCart] = useState(() => safeReadPurchaseItems(PURCHASE_CART_KEY).some((item) => item.id === asset.id));
  const [isPurchased, setIsPurchased] = useState(() => safeReadPurchaseItems(PURCHASED_ASSETS_KEY).some((item) => item.id === asset.id));

  useEffect(() => {
    const syncState = () => {
      setIsInCart(safeReadPurchaseItems(PURCHASE_CART_KEY).some((item) => item.id === asset.id));
      setIsPurchased(safeReadPurchaseItems(PURCHASED_ASSETS_KEY).some((item) => item.id === asset.id));
    };

    const handleCartAdd = (event: Event) => {
      const item = (event as CustomEvent<PrototypePurchaseItem>).detail;
      if (item?.id === asset.id) syncState();
    };

    const handleCartRemove = (event: Event) => {
      const itemId = (event as CustomEvent<number>).detail;
      if (itemId === asset.id) syncState();
    };

    const handlePurchased = (event: Event) => {
      const items = (event as CustomEvent<PrototypePurchaseItem[]>).detail || [];
      if (items.some((item) => item.id === asset.id)) syncState();
    };

    window.addEventListener(PROTOTYPE_CART_ADD_EVENT, handleCartAdd as EventListener);
    window.addEventListener(PROTOTYPE_CART_REMOVE_EVENT, handleCartRemove as EventListener);
    window.addEventListener(PROTOTYPE_PURCHASE_EVENT, handlePurchased as EventListener);
    window.addEventListener('storage', syncState);
    syncState();
    return () => {
      window.removeEventListener(PROTOTYPE_CART_ADD_EVENT, handleCartAdd as EventListener);
      window.removeEventListener(PROTOTYPE_CART_REMOVE_EVENT, handleCartRemove as EventListener);
      window.removeEventListener(PROTOTYPE_PURCHASE_EVENT, handlePurchased as EventListener);
      window.removeEventListener('storage', syncState);
    };
  }, [asset.id]);

  const handleAddToCart = () => {
    if (isInCart) return;
    window.dispatchEvent(new CustomEvent(PROTOTYPE_CART_ADD_EVENT, { detail: purchaseItem }));
    setIsInCart(true);
  };

  const handleConfirmDirectCheckout = () => {
    const purchased = addPurchasedItemsToStorage([purchaseItem]);
    window.dispatchEvent(new CustomEvent(PROTOTYPE_CART_REMOVE_EVENT, { detail: purchaseItem.id }));
    setCheckoutItems(null);
    setCompleteItems(purchased);
    setIsPurchased(true);
    setIsInCart(false);
  };

  return (
    <>
      <div className="px-1">
        <span className="mb-1 block text-[14px] font-medium text-brand-primary">{product.category}</span>
        <h1 className="text-[24px] font-bold text-white">{displayTitle}</h1>
      </div>

      <div className="np-product-panel rounded-lg border border-[#1F2329] bg-[#141518] p-4">
        <p className="mb-4 text-[14px] font-medium text-white">Artist</p>
        <div className="flex items-center gap-3">
          <img src={PROFILE_IMAGE} alt="" className="h-10 w-10 rounded-full bg-white object-cover" />
          <div>
            <p className="text-[14px] font-medium text-white">Kim ji hwan</p>
            <p className="text-[14px] text-text-tertiary">3D Character Artist</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[14px] text-text-tertiary">
          <span>{'\uC791\uD488 \uC218'}</span>
          <span className="text-right text-text-secondary">8{'\uAC1C'}</span>
          <span>{'\uD314\uB85C\uC6CC'}</span>
          <span className="text-right text-text-secondary">0.3K</span>
        </div>
        <button className="np-product-secondary-action mt-4 min-h-11 w-full rounded-md bg-[#3A3A3A] py-2.5 text-[14px] font-medium text-white transition hover:bg-[#4A4A4A]">
          {'\uD314\uB85C\uC6B0'}
        </button>
      </div>

      <div className="np-product-panel rounded-lg border border-[#1F2329] bg-[#141518] p-4">
        <div className="mb-4 flex items-end gap-3">
          <span className="text-[24px] font-bold text-brand-primary">{product.price}</span>
          {product.originalPrice && <span className="pb-1 text-[14px] text-text-tertiary line-through">{product.originalPrice}</span>}
        </div>
        <button
          onClick={() => {
            if (isPurchased) {
              onViewPurchases?.();
              return;
            }
            setCheckoutItems([purchaseItem]);
          }}
          className="np-primary-action mb-2 w-full rounded-md bg-brand-primary py-3 text-[14px] font-medium text-bg-dark transition hover:bg-brand-hover"
        >
          {isPurchased ? '\uAD6C\uB9E4\uD55C \uC791\uC5C5\uBB3C \uBCF4\uAE30' : '\uAD6C\uB9E4\uD558\uAE30'}
        </button>
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`np-product-cart-action mb-3 w-full rounded-md py-3 text-[14px] font-medium transition ${
            isInCart
              ? 'np-product-cart-action-active cursor-default bg-[#262A31] text-brand-primary'
              : 'bg-[#333] text-white hover:bg-[#444]'
          }`}
        >
          {isInCart ? '\uC7A5\uBC14\uAD6C\uB2C8\uC5D0 \uB2F4\uAE40' : '\uC7A5\uBC14\uAD6C\uB2C8\uC5D0 \uCD94\uAC00'}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="np-product-icon-action flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#262626] py-2 text-[14px] font-medium text-text-secondary hover:text-white">
            <Heart className="h-4 w-4 text-brand-primary" />
            568
          </button>
          <button className="np-product-icon-action flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#262626] py-2 text-[14px] font-medium text-text-secondary hover:text-white">
            <ShoppingBag className="h-4 w-4" />
            {'\uACF5\uC720'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {checkoutItems && (
          <CheckoutDialog
            items={checkoutItems}
            onClose={() => setCheckoutItems(null)}
            onConfirm={handleConfirmDirectCheckout}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {completeItems && (
          <PurchaseCompleteDialog
            items={completeItems}
            onClose={() => setCompleteItems(null)}
            onViewPurchases={() => {
              setCompleteItems(null);
              onViewPurchases?.();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ProductLicensePanel() {
  return (
    <div className="np-product-panel rounded-lg border border-[#1F2329] bg-[#141518] p-5">
      <h2 className="mb-4 text-[15px] font-medium text-white">라이선스</h2>
      {['상업적 사용 가능', '무제한 다운로드', 'AI 변환 가능'].map((item) => (
        <div key={item} className="mb-4 last:mb-0">
          <p className="text-[14px] font-medium text-white">{item}</p>
          <p className="mt-1 text-[15px] leading-[1.6] text-text-tertiary">게임, 영상, 광고 등 모든 상업적 프로젝트에 사용 가능합니다.</p>
        </div>
      ))}
    </div>
  );
}

function ProductStatsPanel({ stats }: { stats: [string, string, string] }) {
  return (
    <div className="np-product-panel grid grid-cols-3 rounded-lg border border-[#1F2329] bg-[#141518] p-5 text-center">
      {[
        ['조회수', stats[0]],
        ['구매', stats[1]],
        ['평점', stats[2]],
      ].map(([label, value]) => (
        <div key={label}>
          <p className="text-[20px] font-bold text-white">{value}</p>
          <p className="mt-1 text-[14px] text-text-tertiary">{label}</p>
        </div>
      ))}
    </div>
  );
}

function ProductInfoPanel({ product }: { product: typeof PRODUCT_DETAIL_DATA[number] }) {
  return (
    <div className="np-product-panel rounded-lg border border-[#1F2329] bg-[#141518] p-5">
      <h2 className="mb-4 text-[15px] font-medium text-white">파일 정보</h2>
      <div className="space-y-3 border-b border-[#2A2E36] pb-5">
        {product.fileInfo.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-[14px]">
            <span className="text-text-tertiary">{label}</span>
            <span className="text-right font-semibold text-text-secondary">{value}</span>
          </div>
        ))}
      </div>
      <h2 className="mb-3 mt-5 text-[15px] font-medium text-white">상세 설명</h2>
      <p className="text-[15px] leading-[1.65] text-text-secondary">{product.description}</p>
      <h2 className="mb-3 mt-5 text-[15px] font-medium text-white">태그</h2>
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span key={tag} className="np-product-tag rounded-full border border-[#3A404F] px-2.5 py-1 text-[14px] font-medium text-text-secondary">
            {tag}
          </span>
        ))}
      </div>
      <h2 className="mb-3 mt-5 text-[15px] font-medium text-white">용도</h2>
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
          <span className="text-[14px] font-sans text-[#8B909A] font-medium pt-1">{progress}%</span>
        </div>
        <div className="space-y-2">
          <div className="text-[14px] text-text-secondary font-medium uppercase tracking-wider">{status}</div>
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
          <span key={tag} className="text-[14px] px-2.5 py-1 bg-surface-primary text-text-secondary rounded font-medium border border-border-primary/35 uppercase tracking-tighter">
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
  activeCategory = 'all',
  onCategoryChange,
  onOpenProduct,
  onQuickCollect,
  onAssetDragStart,
}: {
  isSidebarOpen: boolean,
  favorites: number[],
  toggleFavorite: (id: number) => void,
  activeNav?: 'market' | 'art' | 'studio' | 'projects' | 'support' | null,
  activeCategory?: string,
  onCategoryChange?: (categoryId: string) => void,
  onOpenProduct?: (assetId: number) => void,
  onQuickCollect?: (target: QuickDropTarget, asset: any) => void,
  onAssetDragStart?: (asset: any, e: React.DragEvent) => void,
}) {
  const [activeTab, setActiveTab] = useState<'전체' | '마켓' | '아트' | '최신' | '팔로잉'>('전체');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [priceType, setPriceType] = useState<'all' | 'free' | 'paid'>('all');
  const [priceRange, setPriceRange] = useState({ min: '0', max: '1,000,000+' });
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [polyCount, setPolyCount] = useState<string[]>([]);
  const [polyRange, setPolyRange] = useState({ min: '0', max: '1,000,000' });
  const [license, setLicense] = useState<string[]>([]);
  const [appliedPriceType, setAppliedPriceType] = useState<'all' | 'free' | 'paid'>('all');
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: '0', max: '1,000,000+' });
  const [appliedFormats, setAppliedFormats] = useState<string[]>([]);
  const [appliedPolyCount, setAppliedPolyCount] = useState<string[]>([]);
  const [appliedPolyRange, setAppliedPolyRange] = useState({ min: '0', max: '1,000,000' });
  const [appliedLicense, setAppliedLicense] = useState<string[]>([]);
  const filterSheetDragControls = useDragControls();
  const [isMobileFilterSheet, setIsMobileFilterSheet] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  ));


  const tabs: Array<typeof activeTab> = ['전체', '마켓', '아트', '최신', '팔로잉'];
  const followingAssetIds = new Set([1, 2, 3, 4, 5, 6, 7, 8]);
  const formats = ['.FBX', '.OBJ', '.ABC', '.BLEND', '.MAX', '.GLB'];
  const polyOptions = ['Low Poly', 'Mid Poly', 'High Poly'];
  const licenseOptions = ['\uD45C\uC900', '\uD655\uC7A5', '\uC0C1\uC5C5\uC801'];

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const updateMobileFilterMode = () => setIsMobileFilterSheet(query.matches);

    updateMobileFilterMode();
    query.addEventListener('change', updateMobileFilterMode);
    return () => query.removeEventListener('change', updateMobileFilterMode);
  }, []);

  const parseFilterNumber = (value: string, fallback: number) => {
    const parsed = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const getAssetFilterMeta = (asset: typeof ASSETS[number]) => {
    const id = asset.id;
    const isFree = id % 7 === 0 || asset.badge === 'A';
    const price = isFree ? 0 : 30000 + (id % 12) * 10000;
    const assetFormats = formats.filter((_, index) => (id + index) % 3 !== 1);
    const polyLabel = polyOptions[id % polyOptions.length];
    const polyValue = 5000 + (id % 24) * 4200;
    const assetLicenses = licenseOptions.filter((_, index) => (id + index) % 2 === 0);

    return {
      isFree,
      price,
      formats: assetFormats.length ? assetFormats : [formats[id % formats.length]],
      polyLabel,
      polyValue,
      licenses: assetLicenses.length ? assetLicenses : [licenseOptions[id % licenseOptions.length]],
    };
  };

  const assetMatchesAdvancedFilters = (asset: typeof ASSETS[number]) => {
    const meta = getAssetFilterMeta(asset);

    if (appliedPriceType === 'free' && !meta.isFree) return false;
    if (appliedPriceType === 'paid') {
      const minPrice = parseFilterNumber(appliedPriceRange.min, 0);
      const maxPrice = parseFilterNumber(appliedPriceRange.max, Number.POSITIVE_INFINITY);
      if (meta.isFree || meta.price < minPrice || meta.price > maxPrice) return false;
    }

    if (appliedFormats.length > 0 && appliedFormats.length < formats.length) {
      if (!appliedFormats.some((format) => meta.formats.includes(format))) return false;
    }

    if (appliedPolyCount.includes('\uC9C1\uC811 \uC124\uC815')) {
      const minPoly = parseFilterNumber(appliedPolyRange.min, 0);
      const maxPoly = parseFilterNumber(appliedPolyRange.max, Number.POSITIVE_INFINITY);
      if (meta.polyValue < minPoly || meta.polyValue > maxPoly) return false;
    } else if (appliedPolyCount.length > 0 && !appliedPolyCount.includes(meta.polyLabel)) {
      return false;
    }

    if (appliedLicense.length > 0 && !appliedLicense.some((item) => meta.licenses.includes(item))) return false;

    return true;
  };

  const activeTabIndex = tabs.indexOf(activeTab);
  const tabAssets = (() => {
    if (activeTabIndex === 0) {
      return ASSETS;
    }
    if (activeTabIndex === 1) {
      return ASSETS.filter((asset) => asset.badge === 'M');
    }
    if (activeTabIndex === 2) {
      return ASSETS.filter((asset) => asset.badge === 'A');
    }
    if (activeTabIndex === 3) {
      return [...ASSETS].sort((a, b) => b.id - a.id);
    }
    return ASSETS.filter((asset) => followingAssetIds.has(asset.id));
  })();
  const discoverAssets = tabAssets
    .filter((asset) => assetMatchesCategory(asset.id, activeCategory))
    .filter(assetMatchesAdvancedFilters);

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
    ...(appliedPriceType !== 'all' 
      ? [`\uAC00\uACA9: ${appliedPriceType === 'free' ? '\uBB34\uB8CC' : `\u20A9${appliedPriceRange.min}~${appliedPriceRange.max}`}`] 
      : []),
    ...((appliedFormats.length > 0 && appliedFormats.length < formats.length)
      ? [`\uD30C\uC77C\uD615\uC2DD: ${appliedFormats.length > 3 ? `${appliedFormats.slice(0, 3).join(', ')}...` : appliedFormats.join(', ')}`]
      : []),
    ...(appliedPolyCount.length > 0
      ? [`${appliedPolyCount.map(p => p === '\uC9C1\uC811 \uC124\uC815' ? `${appliedPolyRange.min}~${appliedPolyRange.max} Poly` : p).join(', ')}`]
      : []),
    ...(appliedLicense.length > 0
      ? [`${appliedLicense.join(', ')}`]
      : [])
  ];
  const isFilterButtonActive = showFilters || activeFilters.length > 0;


  const resetDraftFilters = () => {
    setPriceType('all');
    setPriceRange({ min: '0', max: '1,000,000+' });
    setSelectedFormats([]);
    setPolyCount([]);
    setPolyRange({ min: '0', max: '1,000,000' });
    setLicense([]);
  };

  const syncDraftFilters = () => {
    setPriceType(appliedPriceType);
    setPriceRange({ ...appliedPriceRange });
    setSelectedFormats([...appliedFormats]);
    setPolyCount([...appliedPolyCount]);
    setPolyRange({ ...appliedPolyRange });
    setLicense([...appliedLicense]);
  };

  const openFilterPanel = () => {
    if (!showFilters) syncDraftFilters();
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    setAppliedPriceType(priceType);
    setAppliedPriceRange({ ...priceRange });
    setAppliedFormats([...selectedFormats]);
    setAppliedPolyCount([...polyCount]);
    setAppliedPolyRange({ ...polyRange });
    setAppliedLicense([...license]);
    setShowFilters(false);
  };

  const handleFilterSheetDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (!isMobileFilterSheet) return;
    if (info.offset.y > 96 || info.velocity.y > 520) {
      setShowFilters(false);
    }
  };

  const removeFilter = (filterText: string) => {
    if (filterText.startsWith('\uAC00\uACA9:')) {
      setPriceType('all');
      setAppliedPriceType('all');
      return;
    }
    if (filterText.startsWith('\uD30C\uC77C\uD615\uC2DD:')) {
      setSelectedFormats([]);
      setAppliedFormats([]);
      return;
    }
    if (
      filterText.endsWith(' Poly') || 
      polyOptions.some(opt => filterText.includes(opt))
    ) {
      setPolyCount([]);
      setAppliedPolyCount([]);
      return;
    }
    if (licenseOptions.some(opt => filterText.includes(opt))) {
      setLicense([]);
      setAppliedLicense([]);
      return;
    }
  };


  return (
    <div className="flex-1 min-w-0 relative">
      <div className="mb-5 flex flex-col gap-3 border-b border-border-soft/50 pb-3 sm:mb-6 sm:h-[46px] sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pb-2">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-8 lg:gap-10">
          <h2 className="text-[28px] font-bold leading-[38px] tracking-tight text-text-primary font-display sm:leading-none">Discover</h2>
          <div className="mb-[-2px] flex min-w-0 items-end gap-2 sm:self-end md:translate-y-[7px]">
            <div className="flex min-w-0 flex-1 flex-nowrap items-end gap-4 overflow-visible pr-1 sm:gap-6">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                    className={`relative min-h-11 min-w-11 py-2 text-[15px] font-medium transition-all sm:min-h-0 sm:min-w-0 sm:py-1 sm:text-[16px] md:text-[18px] ${
                    activeTab === tab ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-primary'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeUnderline" className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-brand-primary sm:bottom-[-8px] md:bottom-[-1px]" />
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={openFilterPanel}
              aria-label="필터 열기"
              aria-expanded={showFilters}
              className={`mb-[-2px] flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-transparent bg-transparent transition-colors md:hidden ${
                isFilterButtonActive ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              <Sliders className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="hidden h-8 min-w-0 flex-1 items-center justify-end gap-4 self-end pl-[1px] pt-0 md:flex">
          {/* Active Filter Tags */}
          <div className="hidden xl:flex items-center justify-end flex-nowrap gap-2 max-w-[700px] overflow-x-auto scrollbar-hide h-8 flex-1 min-w-0">
            {activeFilters.map((filter) => (
              <span key={filter} className="flex items-center gap-1.5 h-7 px-3 bg-surface-primary border border-border-soft text-[15px] font-medium text-text-tertiary rounded-sm whitespace-nowrap">
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
            onClick={openFilterPanel}
            className={`flex items-center gap-2 text-[17px] font-semibold transition-all h-8 ${
              isFilterButtonActive ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            <Sliders className="w-5 h-5" /> 필터
          </button>
        </div>
      </div>

      {onCategoryChange && (
        <div className="-mt-4 mb-4 flex">
          <MobileCategoryPicker activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
        </div>
      )}

      <AnimatePresence>
        {showFilters && (
          <>
          {isMobileFilterSheet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onMouseDown={() => setShowFilters(false)}
              className="fixed inset-x-0 bottom-0 top-[60px] z-[245] bg-black/45 backdrop-blur-[2px] md:hidden"
            />
          )}
          <motion.div
            initial={isMobileFilterSheet ? { y: "100%", opacity: 1 } : { y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={isMobileFilterSheet ? { y: "100%", opacity: 1 } : { y: 5, opacity: 0 }}
            transition={{ duration: isMobileFilterSheet ? 0.28 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            drag={isMobileFilterSheet ? "y" : false}
            dragControls={filterSheetDragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={handleFilterSheetDragEnd}
            className="fixed inset-x-0 bottom-0 z-[260] max-h-[82dvh] overflow-hidden rounded-t-[16px] border-t border-[#242831] bg-[#0B0D10]/98 shadow-[0_-18px_45px_rgba(0,0,0,0.72)] backdrop-blur-xl md:absolute md:bottom-auto md:left-auto md:right-0 md:top-[50px] md:z-50 md:max-h-none md:w-[80%] md:max-w-[1000px] md:rounded-[8px] md:border md:border-border-primary md:bg-[#0E1011]/95 md:p-6 md:shadow-[0_30px_60px_rgba(0,0,0,0.9)] md:backdrop-blur-md"
          >
            <div
              className="flex cursor-grab touch-none flex-col items-center border-b border-[#242831] px-4 pb-3 pt-2.5 active:cursor-grabbing md:hidden"
              onPointerDown={(event) => filterSheetDragControls.start(event)}
            >
              <span className="h-1 w-10 rounded-full bg-[#3A3F48]" />
              <div className="mt-2.5 flex w-full items-center justify-center">
                <span className="text-[16px] font-semibold tracking-tight text-text-primary">필터</span>
              </div>
            </div>
            <button 
              onClick={() => setShowFilters(false)}
              className="absolute top-5 right-5 hidden text-text-tertiary transition-colors hover:text-text-primary md:block"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="safe-area-bottom max-h-[calc(82dvh-58px)] overflow-y-auto px-4 pb-5 pt-4 custom-scrollbar md:max-h-none md:overflow-visible md:p-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* 가격 필터 */}
              <div className="space-y-4 col-span-1 md:col-span-3">
                <h4 className="text-[15px] font-medium text-text-tertiary uppercase tracking-wider">가격</h4>
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
                      className={`px-3 py-1.5 rounded-sm text-[15px] font-medium border transition-all ${
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
                    <span className="text-text-tertiary text-[14px]">~</span>
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
                <h4 className="text-[15px] font-medium text-text-tertiary uppercase tracking-wider">파일 형식</h4>
                <div className="flex flex-wrap gap-2">
                  {formats.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => toggleFilter(selectedFormats, setSelectedFormats, fmt)}
                      className={`px-3 py-1.5 min-w-[60px] rounded-sm text-[15px] font-medium border transition-all ${
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
                <h4 className="text-[15px] font-medium text-text-tertiary uppercase tracking-wider">폴리곤 수</h4>
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
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover/item:block bg-surface-secondary border border-border-primary/80 text-[14px] text-text-secondary px-2.5 py-1.5 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap z-[110] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                            <span className="text-brand-primary font-bold mr-1">범위:</span> {tooltipText}
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
                
                {polyCount.includes('직접 설정') && (
                  <div className="space-y-3 pt-3 mt-1 border-t border-border-soft/20 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between text-[14px] font-sans text-text-tertiary">
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
                <h4 className="text-[15px] font-medium text-text-tertiary uppercase tracking-wider">라이선스</h4>
                <div className="grid grid-cols-3 gap-2 md:block md:space-y-3">
                  {licenseOptions.map((opt) => (
                    <label 
                      key={opt} 
                      className="flex min-w-0 cursor-pointer items-center gap-2 group md:gap-3"
                      onClick={() => toggleFilter(license, setLicense, opt)}
                    >
                      <div 
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-all md:h-5 md:w-5 ${
                          license.includes(opt) ? 'bg-brand-primary border-brand-primary' : 'bg-surface-primary border-border-soft group-hover:border-brand-primary/30'
                        }`}
                      >
                        {license.includes(opt) && <Check className="h-3 w-3 text-bg-dark md:h-3.5 md:w-3.5" />}
                      </div>
                      <span className="min-w-0 truncate text-[14px] font-medium text-text-tertiary transition-colors group-hover:text-text-secondary md:text-[15px]">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-5 border-t border-border-soft/20">
              <div className="text-[14px] text-text-tertiary select-none flex items-center gap-1.5 pl-1 font-sans sm:translate-y-[2px]">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                선택하지 않은 영역은 전체로 분류됩니다.
              </div>
              <div className="flex gap-4 w-full sm:w-auto justify-end">
                <button 
                  onClick={resetDraftFilters}
                  className="text-[15px] font-medium text-text-tertiary hover:text-text-primary px-4 py-2 transition-colors uppercase tracking-wider"
                >
                  초기화
                </button>
                <button 
                  onClick={applyFilters}
                  className="np-primary-action bg-brand-primary text-bg-dark text-[15px] font-medium px-6 py-2 rounded-sm hover:bg-brand-hover transition-all uppercase tracking-wider shadow-none"
                >
                  필터 적용
                </button>
              </div>
            </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={`grid grid-cols-1 gap-3 transition-all duration-300 sm:grid-cols-2 md:gap-2 ${
        isSidebarOpen 
          ? "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2200px]:grid-cols-5"
          : "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2200px]:grid-cols-6"
      }`}>
        {discoverAssets.map((asset, index) => {
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
        <button className="flex min-h-11 items-center gap-2 px-4 py-2 text-[14px] font-medium text-text-tertiary transition-colors hover:text-white">
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
            <h3 className="text-[18px] font-semibold text-text-primary tracking-tight">내 프로젝트</h3>
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
          <button className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors">모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" /></button>
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
          <h3 className="text-[18px] font-semibold text-text-primary tracking-tight">노트</h3>
          <button className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors">모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" /></button>
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
          <h3 className="text-[18px] font-semibold text-text-primary tracking-tight">레퍼런스</h3>
          <button className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors">모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" /></button>
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
                  <div className="text-[15px] text-text-secondary font-medium">{item.count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="np-light-brand-action w-full mt-4 flex items-center gap-2 px-4 py-3 bg-surface-primary/30 hover:bg-surface-primary rounded-[8px] text-[14px] font-medium text-brand-primary border border-dashed border-brand-primary/20 hover:border-border-primary/60 transition-all justify-center group">
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
          aria-label="페이지 맨 위로 이동"
          className="group fixed bottom-4 right-4 z-[100] rounded-full border border-border-primary/50 bg-surface-primary p-3 text-text-secondary shadow-lg transition-colors hover:border-brand-primary/50 hover:bg-[#22252B] hover:text-brand-primary sm:bottom-6 sm:right-6 sm:p-3.5 lg:bottom-10 lg:right-10"
        >
          <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 sm:h-6 sm:w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// --- Main App ---

export type PageType = 'home' | 'uploads' | 'purchases' | 'favorites' | 'settings' | 'board' | 'projects' | 'note-editor' | 'studio' | 'support' | 'full_workflow' | 'full_workflow_chat' | 'turnaround' | 'modeling_generation' | 'product_detail';

export default function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const isThemeTransitioningRef = useRef(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const documentTheme = document.documentElement.dataset.theme;
    if (documentTheme === 'light' || documentTheme === 'dark') return documentTheme;
    try {
      return localStorage.getItem('neopoly_theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const rawHash = window.location.hash.replace('#', '');
    const legacyHashPage = rawHash.split('/')[0];
    const normalizedHashPage = legacyHashPage === 'notes' || legacyHashPage === 'references' ? 'board' : legacyHashPage;
    const hashPage = normalizedHashPage as PageType;
    const validPages: PageType[] = ['home', 'uploads', 'purchases', 'favorites', 'settings', 'board', 'projects', 'note-editor', 'studio', 'support', 'full_workflow', 'full_workflow_chat', 'turnaround', 'modeling_generation', 'product_detail'];
    return validPages.includes(hashPage) ? hashPage : 'home';
  });
  const [visitedModelingWorkflowPages, setVisitedModelingWorkflowPages] = useState<Set<PageType>>(
    () => new Set(isPersistentModelingWorkflowPage(currentPage) ? [currentPage] : []),
  );
  const [activeNav, setActiveNav] = useState<'market' | 'art' | 'studio' | 'projects' | 'support' | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState<number>(() => {
    const hashProductId = Number(window.location.hash.replace('#', '').split('/')[1]);
    if (hashProductId >= 1 && hashProductId <= 8) return hashProductId;
    const saved = Number(localStorage.getItem('neopoly_selected_product_id'));
    return saved >= 1 && saved <= 8 ? saved : 1;
  });
  const [focusedProjectId, setFocusedProjectId] = useState<number | null>(null);
  const [focusedBoardView, setFocusedBoardView] = useState<"all" | "notes" | "references">("all");
  const mainPanelRef = useRef<HTMLDivElement>(null);
  const quickDropAcceptedRef = useRef(false);
  const homeScrollYRef = useRef(0);
  const shouldRestoreHomeScrollRef = useRef(false);

  useEffect(() => {
    const nextHash = currentPage === 'home' ? '' : currentPage === 'product_detail' ? `#product_detail/${selectedProductId}` : `#${currentPage}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', `${window.location.pathname}${nextHash}`);
    }
  }, [currentPage, selectedProductId]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem('neopoly_theme', theme);
    } catch {
      // The selected theme still applies for the current session.
    }
  }, [theme]);

  const handleThemeChange = (nextTheme: ThemeMode) => {
    if (nextTheme === theme || isThemeTransitioningRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> };
    };

    if (!transitionDocument.startViewTransition || reduceMotion) {
      setTheme(nextTheme);
      return;
    }

    isThemeTransitioningRef.current = true;
    document.documentElement.dataset.themeTransition = nextTheme;

    const transition = transitionDocument.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });

    transition.finished.finally(() => {
      delete document.documentElement.dataset.themeTransition;
      isThemeTransitioningRef.current = false;
    });
  };

  useEffect(() => {
    if (currentPage !== 'home' || !shouldRestoreHomeScrollRef.current) return;

    shouldRestoreHomeScrollRef.current = false;
    const restoreY = homeScrollYRef.current;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: restoreY, behavior: 'auto' });
      });
    });
  }, [currentPage]);

  // Initialize dummy UserProfile (usually fetched from an API or local storage in reality)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('neopoly_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          avatar: PROFILE_IMAGE,
          username: 'kimjihwan',
          nickname: 'Hwan',
        };
      } catch (e) {}
    }
    return {
      username: 'kimjihwan',
      nickname: 'Hwan',
      avatar: PROFILE_IMAGE,
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
  const [quickCollections, setQuickCollections] = useState<QuickCollections>(() => emptyQuickCollections());
  const [quickDialog, setQuickDialog] = useState<{ target: "notes" | "references"; asset: QuickCollectAsset } | null>(null);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  const panelNotes = (() => {
    try {
      const saved = localStorage.getItem("neopoly_notes_v3");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : NOTES;
    } catch {
      return NOTES;
    }
  })().slice(0, 2);

  const panelReferenceBoards = REFERENCE_BOARDS.slice(0, 2).map((board) => ({
    ...board,
    count: ASSETS.filter((asset) => boardMatchesAsset(board, asset as any)).length,
  }));

  useEffect(() => {
    localStorage.removeItem(QUICK_COLLECTIONS_KEY);
  }, []);

  useEffect(() => {
    const stopDragging = () => {
      setIsAssetDragging(false);
      if (!quickDropAcceptedRef.current) {
        setIsPanelOpen(false);
        setIsPanelDropMode(false);
      }
      quickDropAcceptedRef.current = false;
    };
    window.addEventListener("dragend", stopDragging);
    window.addEventListener("drop", stopDragging);
    return () => {
      window.removeEventListener("dragend", stopDragging);
      window.removeEventListener("drop", stopDragging);
    };
  }, []);

  useEffect(() => {
    if (currentPage !== 'home' || !isPanelOpen || isAssetDragging || isPanelDropMode) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (mainPanelRef.current?.contains(target)) return;
      setIsPanelOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [currentPage, isPanelOpen, isAssetDragging, isPanelDropMode]);

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
      setCurrentPage("board");
      return;
    }
    if (target === "references") {
      setCurrentPage("board");
      return;
    }
  };

  const handleDropTarget = (target: QuickDropTarget, asset: QuickCollectAsset) => {
    quickDropAcceptedRef.current = true;
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
    quickDropAcceptedRef.current = false;
    setIsAssetDragging(true);
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(QUICK_ASSET_MIME, JSON.stringify(quickAsset));
    event.dataTransfer.setData("application/json", JSON.stringify(quickAsset));
    event.dataTransfer.setData("text/plain", quickAsset.image);
  };

  const openProductDetail = (assetId: number) => {
    if (currentPage === 'home') {
      homeScrollYRef.current = window.scrollY;
    }
    setSelectedProductId(assetId);
    localStorage.setItem('neopoly_selected_product_id', String(assetId));
    setCurrentPage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToDiscover = () => {
    shouldRestoreHomeScrollRef.current = true;
    setCurrentPage('home');
  };

  const openProjectsPage = (projectId?: number) => {
    setFocusedProjectId(typeof projectId === 'number' ? projectId : null);
    setCurrentPage('projects');
  };

  const openBoardPage = (view: "all" | "notes" | "references" = "all") => {
    setFocusedBoardView(view);
    setCurrentPage('board');
  };

  const openNoteEditor = (note: NoteItem | null = null) => {
    setEditingNote(note);
    setCurrentPage('note-editor');
  };

  const navigateModelingWorkflow = (page: string) => {
    const nextPage = page as PageType;
    if (isPersistentModelingWorkflowPage(nextPage)) {
      setVisitedModelingWorkflowPages((current) => {
        if (current.has(nextPage)) return current;
        const next = new Set(current);
        next.add(nextPage);
        return next;
      });
    }
    setCurrentPage(nextPage);
  };

  const handleHeaderNavigate = (page: PageType) => {
    if (page === 'board') {
      setFocusedBoardView('all');
    }
    if (page === 'home' && currentPage === 'product_detail') {
      returnToDiscover();
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg-dark font-sans selection:bg-brand-primary/30 scroll-smooth">
      <Header
        onNavigate={(page) => handleHeaderNavigate(page as PageType)}
        currentPage={currentPage}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
      
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
          initialView={focusedBoardView}
          onEditNote={openNoteEditor}
        />
      ) : currentPage === 'projects' ? (
        <ProjectPage onNavigate={(page) => setCurrentPage(page as PageType)} selectedProjectId={focusedProjectId ?? undefined} />
      ) : currentPage === 'note-editor' ? (
        <NoteEditorPage onNavigate={(page) => setCurrentPage(page as PageType)} initialNote={editingNote} />
      ) : currentPage === 'settings' ? (
        <AccountSettingsPage
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          theme={theme}
          onThemeChange={handleThemeChange}
        />
      ) : currentPage === 'studio' ? (
        <AIStudioPage onNavigate={(page) => setCurrentPage(page as PageType)} />
      ) : isPersistentModelingWorkflowPage(currentPage) ? (
        <div className="flex-1">
          {visitedModelingWorkflowPages.has('turnaround') && (
            <div className={currentPage === 'turnaround' ? 'block' : 'hidden'} aria-hidden={currentPage !== 'turnaround'}>
              <TurnaroundPage onNavigate={navigateModelingWorkflow} />
            </div>
          )}
          {visitedModelingWorkflowPages.has('modeling_generation') && (
            <div className={currentPage === 'modeling_generation' ? 'block' : 'hidden'} aria-hidden={currentPage !== 'modeling_generation'}>
              <ModelingGenerationPage onNavigate={navigateModelingWorkflow} />
            </div>
          )}
        </div>
      ) : currentPage === 'product_detail' ? (
        <ProductDetailPage
          assetId={selectedProductId}
          onNavigateHome={returnToDiscover}
          onOpenProduct={openProductDetail}
          onQuickCollect={handleQuickCollect}
          onAssetDragStart={handleAssetDragStart}
          onViewPurchases={() => setCurrentPage('purchases')}
        />
      ) : currentPage === 'support' ? (
        <SupportPage />
      ) : currentPage === 'full_workflow' ? (
        <FullWorkflowPage onNavigate={navigateModelingWorkflow} showIntroOverlay={true} />
      ) : currentPage === 'full_workflow_chat' ? (
        <FullWorkflowPage onNavigate={navigateModelingWorkflow} showIntroOverlay={false} />
      ) : (
        <main className="flex-1 pb-32 bg-bg-dark">
          <Hero onNavigate={(page) => setCurrentPage(page as PageType)} />
          
          <div className="mx-auto w-full max-w-[2560px] px-4 py-5 sm:px-6 sm:py-6 2xl:px-8 min-[2200px]:px-10">
            <div className="flex flex-col gap-8 xl:gap-12">
              <div className="flex-1 min-w-0 space-y-6">
                <CategoryNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                <DiscoverSection
                  isSidebarOpen={false}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  activeNav={activeNav}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-40 flex justify-center sm:bottom-8"
            >
              <button
                onClick={() => {
                  setIsPanelDropMode(false);
                  setIsPanelOpen(true);
                }}
                className="np-panel-trigger flex min-h-11 items-center gap-2 rounded-[8px] border border-border-primary/80 bg-bg-secondary/95 px-6 py-2.5 text-[14px] font-medium tracking-wide text-text-primary shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all hover:border-brand-primary hover:text-brand-primary sm:px-8 sm:py-3 sm:text-[15px]"
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
              ref={mainPanelRef}
              initial={{ opacity: 0, y: 150, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 150, x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="np-main-panel safe-area-bottom fixed bottom-0 left-1/2 z-50 max-h-[88dvh] w-full max-w-full overflow-y-auto rounded-t-[16px] border border-border-primary/50 bg-[#0E1011]/95 px-4 pb-5 pt-[46px] shadow-[0_30px_60px_rgba(0,0,0,0.95)] backdrop-blur-xl custom-scrollbar sm:bottom-4 sm:w-[calc(100%_-_32px)] sm:max-w-[95%] sm:rounded-[12px] sm:px-6 md:bottom-6 md:max-h-[82dvh] md:w-[1536px] md:bg-[#0E1011]/93"
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
                    <h3 onClick={() => { setIsPanelOpen(false); openProjectsPage(); }} className="text-[17px] font-semibold text-text-primary tracking-tight cursor-pointer hover:text-brand-primary transition-colors">내 프로젝트</h3>
                    <button onClick={() => { setIsPanelOpen(false); openProjectsPage(); }} className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors">
                      모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MAIN_PANEL_PROJECTS.slice(0, 3).map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => { setIsPanelOpen(false); openProjectsPage(project.id); }}
                        className="bg-surface-primary/80 hover:bg-surface-primary border border-border-primary/20 rounded-[10px] p-2.5 transition-colors flex flex-col gap-3 group cursor-pointer hover:border-border-primary/60 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-left"
                      >
                        <div className="w-full aspect-[16/10] rounded-[6px] overflow-hidden bg-bg-secondary relative border border-border-primary/10">
                          <img src={project.image} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-100 group-hover:opacity-90" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-[15px] font-medium text-text-primary group-hover:text-brand-primary transition-colors truncate">{project.title}</p>
                          <div className="flex items-center justify-between text-[14px] font-sans mt-1">
                            <span className="text-[14px] text-text-secondary font-medium uppercase tracking-wider">{project.status}</span>
                            <span className="text-[14px] font-medium text-[#8B909A]">{project.progress}%</span>
                          </div>
                          <div className="h-[3px] bg-white/5 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-brand-primary shadow-[0_0_8px_rgba(224,161,46,0.5)]" style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                      </button>
                    ))}



                  </div>
                </div>

                {/* 최근 노트 Section */}
                <div className="xl:col-span-3 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 onClick={() => { setIsPanelOpen(false); openBoardPage('notes'); }} className="text-[17px] font-semibold text-text-primary tracking-tight cursor-pointer hover:text-brand-primary transition-colors">노트</h3>
                    <button onClick={() => { setIsPanelOpen(false); openBoardPage('notes'); }} className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors">
                      모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {panelNotes.map((note) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => { setIsPanelOpen(false); openBoardPage('notes'); }}
                        className="h-[82px] flex flex-col justify-center bg-surface-primary/85 hover:bg-surface-primary px-3.5 rounded-[10px] border border-border-primary/20 transition-all hover:scale-[1.005] hover:border-border-primary/60 shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer group text-left"
                      >
                        <div className="flex flex-col gap-2 w-full">
                          <h4 className="text-[15px] font-medium text-text-primary group-hover:text-brand-primary transition-colors truncate">{note.title}</h4>
                          <div className="flex gap-1.5 overflow-hidden">
                            {(note.tags || []).slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-[14px] px-2 py-0.5 bg-surface-primary text-text-secondary rounded font-medium border border-border-primary/35 uppercase tracking-tighter truncate">{tag.replace('#', '')}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPanelOpen(false);
                        openNoteEditor(null);
                      }}
                      className="flex h-9 items-center justify-center gap-2 rounded-md px-2 text-[14px] font-medium text-text-tertiary transition hover:bg-white/5 hover:text-brand-primary"
                    >
                      <Plus className="h-4 w-4" />
                      노트 추가
                    </button>
                  </div>
                </div>

                {/* 레퍼런스 Section */}
                <div className="xl:col-span-3 space-y-4 xl:pr-6">
                  <div className="flex items-center justify-between px-1">
                    <h3 onClick={() => { setIsPanelOpen(false); openBoardPage('references'); }} className="text-[17px] font-semibold text-text-primary tracking-tight cursor-pointer hover:text-brand-primary transition-colors">레퍼런스</h3>
                    <button 
                      onClick={() => { setIsPanelOpen(false); openBoardPage('references'); }}
                      className="text-[14px] font-medium text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      모두 보기 <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {panelReferenceBoards.map((board) => (
                      <button
                        key={board.id}
                        type="button"
                        onClick={() => { setIsPanelOpen(false); openBoardPage('references'); }}
                        className="np-panel-reference-card relative h-[82px] rounded-[10px] border border-border-primary/20 overflow-hidden transition-all hover:scale-[1.005] hover:border-brand-primary/45 shadow-[0_4px_15px_rgba(0,0,0,0.3)] cursor-pointer group text-left"
                      >
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={board.image} 
                            alt="" 
                            className="np-panel-reference-image w-full h-full object-cover opacity-[0.32] transition-transform duration-300 group-hover:scale-100 group-hover:opacity-90"
                            referrerPolicy="no-referrer" 
                          />
                          <div className="np-panel-reference-gradient-vertical absolute inset-0 bg-gradient-to-t from-[#0e1011] via-[#0e1011]/80 to-transparent" />
                          <div className="np-panel-reference-gradient-horizontal absolute inset-0 bg-gradient-to-r from-[#0e1011] via-[#0e1011]/60 to-[#0e1011]/20" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col justify-end h-full p-3.5">
                          <h4 className="text-[15px] font-medium text-text-primary group-hover:text-brand-primary transition-colors truncate">{board.label}</h4>
                          <div className="flex gap-1.5 mt-2">
                            <span className="np-panel-reference-meta text-[14px] px-2 py-0.5 bg-bg-dark/80 text-text-secondary rounded font-medium border border-border-primary/30 uppercase tracking-tighter">{board.count}개</span>
                            <span className="np-panel-reference-meta text-[14px] px-2 py-0.5 bg-bg-dark/80 text-text-secondary rounded font-medium border border-border-primary/30 uppercase tracking-tighter truncate">{board.keyword}</span>
                          </div>
                        </div>
                      </button>
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
          onOpenDrop={(asset) => {
            if (asset) {
              quickDropAcceptedRef.current = true;
            }
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
      {currentPage !== 'board' && currentPage !== 'projects' && currentPage !== 'note-editor' && currentPage !== 'uploads' && currentPage !== 'full_workflow' && currentPage !== 'full_workflow_chat' && currentPage !== 'studio' && currentPage !== 'turnaround' && currentPage !== 'modeling_generation' && (
        <footer className="bg-[#08080a] border-t border-border-soft/60 pt-16 pb-12 px-4 sm:px-6 2xl:px-8 min-[2200px]:px-10">
          <div className="max-w-[2560px] mx-auto">
            {/* Main Footer columns */}
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 pb-12 border-b border-border-soft/30">
              {/* Column 1: 회사 소개 */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[15px] font-medium text-text-primary tracking-tight font-sans">회사 소개</h4>
              <ul className="space-y-3 text-[15px] text-text-secondary">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">회사 정보</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">회사 블로그</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">채용 정보</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">사이트 맵</li>
              </ul>
            </div>

            {/* Column 2: 고객 지원 */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[15px] font-medium text-text-primary tracking-tight font-sans">고객 지원</h4>
              <ul className="space-y-3 text-[15px] text-text-secondary">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">고객 지원 채팅</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">AI 답변 채팅</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">도움말</li>
              </ul>
            </div>

            {/* Column 3: 법률 정책 */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[15px] font-medium text-text-primary tracking-tight font-sans">법률 정책</h4>
              <ul className="space-y-3 text-[15px] text-text-secondary">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">서비스 약관</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">3D 모델 라이선스</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">개인 정보 정책</li>
              </ul>
            </div>

            {/* Column 4: 기업 */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[15px] font-medium text-text-primary tracking-tight font-sans">기업</h4>
              <ul className="space-y-3 text-[15px] text-text-secondary">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">브랜드 관리</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">제휴사</li>
              </ul>
            </div>

            {/* Column 5: 제휴사 WITH DOG block */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h4 className="text-[15px] md:text-[15px] font-medium text-text-primary tracking-tight font-sans">제휴사</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 bg-surface-primary hover:bg-[#1A1C22] px-3.5 py-1.5 border border-border-primary rounded-[6px] w-fit cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <span className="text-text-primary text-[14px] font-medium font-sans">With</span>
                  <span className="text-[#3282f6] text-[14px] font-medium font-sans tracking-tight">DOG</span>
                </div>
                <p className="text-[15px] text-text-secondary hover:text-brand-primary cursor-pointer transition-colors">제휴사</p>
              </div>
            </div>

            {/* Column 6: Social links (Flat, stream-aligned, no border or backdrop background) */}
            <div className="col-span-2 lg:col-span-2 flex flex-col lg:items-end justify-start space-y-4">
              <div className="flex items-center gap-6">
                <a 
                  href="#" 
                  className="flex h-11 min-w-11 items-center justify-center text-text-secondary transition-all hover:scale-105 hover:text-brand-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="w-[24px] h-[24px]" />
                </a>
                <a 
                  href="#" 
                  className="group flex h-11 min-w-11 items-center justify-center text-text-secondary transition-all hover:scale-105 hover:text-brand-primary"
                  aria-label="Naver Blog"
                >
                  <div className="flex items-center font-sans font-medium text-[14px] tracking-tight text-text-secondary group-hover:text-brand-primary whitespace-nowrap">
                    <span className="text-bg-dark bg-[#a7a8ab] group-hover:bg-brand-primary group-hover:text-bg-dark text-[14px] px-1 py-[1.5px] rounded-[3px] mr-[3px] leading-none font-sans font-medium transition-colors">N</span>
                    blog
                  </div>
                </a>
                <a 
                  href="#" 
                  className="flex h-11 min-w-11 items-center justify-center text-text-secondary transition-all hover:scale-105 hover:text-brand-primary"
                  aria-label="YouTube"
                >
                  <Youtube className="w-[26px] h-[26px]" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-text-tertiary">
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
