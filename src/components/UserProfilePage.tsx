/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Image as ImageIcon, Heart, Eye, Edit3, Save, X, Plus, 
  Trash2, Globe, Sparkles, BookOpen, Layers, Check, Upload, Award, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, CompletedProject, Asset } from '../types';

const PROFILE_BANNER_IMAGE = '/images/profile/profile_banner.png';

interface UserProfilePageProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  onOpenCreationsModal: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const BANNER_PRESETS = [
  { id: 'grad1', label: 'Neo-Poly Gold', class: 'bg-gradient-to-r from-[#141518] via-[#2A2315] to-[#403118]' },
  { id: 'grad2', label: 'Twilight Dark', class: 'bg-gradient-to-r from-[#141518] via-[#1B1B26] to-[#0D0D14]' },
  { id: 'grad3', label: 'Cosmic Nebula', class: 'bg-gradient-to-r from-[#1F112D] via-[#141518] to-[#0F1E29]' },
  { id: 'castle', label: 'Classic Castle', url: '/images/work_%205.png' },
  { id: 'dark_ref', label: 'Minimalist Dark', url: '/images/work_%205.png' },
];

export default function UserProfilePage({
  assets,
  setAssets,
  favorites,
  toggleFavorite,
  onOpenCreationsModal,
  userProfile,
  setUserProfile
}: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'assets' | 'favorites'>('projects');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  
  // Profile Form States
  const [editedNickname, setEditedNickname] = useState(userProfile.nickname);
  const [editedBio, setEditedBio] = useState(userProfile.bio);
  const [editedInsta, setEditedInsta] = useState(userProfile.instagramUrl || '');
  const [editedYoutube, setEditedYoutube] = useState(userProfile.youtubeUrl || '');
  const [selectedBanner, setSelectedBanner] = useState<string>(() => `url(${PROFILE_BANNER_IMAGE})`);

  // Project Dialog State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<CompletedProject | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectProgress, setProjectProgress] = useState<number>(100);
  const [projectStatus, setProjectStatus] = useState('Completed');
  const [projectTags, setProjectTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [projectImage, setProjectImage] = useState('/images/work_%201.png');

  // File Input Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const projectImgInputRef = useRef<HTMLInputElement>(null);

  // Sync profile edits back to local state
  const handleSaveProfile = () => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        nickname: editedNickname,
        bio: editedBio,
        instagramUrl: editedInsta,
        youtubeUrl: editedYoutube,
      };
      localStorage.setItem('neopoly_user_profile', JSON.stringify(updated));
      return updated;
    });
    setIsEditingBio(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const updatedAvatar = event.target.result as string;
          setUserProfile(prev => {
            const updated = { ...prev, avatar: updatedAvatar };
            localStorage.setItem('neopoly_user_profile', JSON.stringify(updated));
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const updatedBanner = event.target.result as string;
          setSelectedBanner(updatedBanner);
          localStorage.setItem('neopoly_user_banner', updatedBanner);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectBannerPreset = (preset: typeof BANNER_PRESETS[0]) => {
    let val = '';
    if ('url' in preset) {
      val = `url(${preset.url})`;
    } else {
      val = preset.id;
    }
    setSelectedBanner(val);
    localStorage.setItem('neopoly_user_banner', val);
  };

  // Add/Edit Project Actions
  const handleOpenProjectModal = (project?: CompletedProject) => {
    if (project) {
      setEditingProject(project);
      setProjectTitle(project.title);
      setProjectDesc(project.description);
      setProjectProgress(project.progress);
      setProjectStatus(project.status);
      setProjectTags(project.tags);
      setProjectImage(project.thumbnail);
    } else {
      setEditingProject(null);
      setProjectTitle('');
      setProjectDesc('');
      setProjectProgress(100);
      setProjectStatus('Completed');
      setProjectTags(['3D Render', 'ArtStation']);
      setProjectImage('/images/work_%201.png');
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    if (editingProject) {
      // Editing
      setUserProfile(prev => {
        const updatedProjects = prev.completedProjects.map(p => {
          if (p.id === editingProject.id) {
            return {
              ...p,
              title: projectTitle,
              description: projectDesc,
              progress: projectProgress,
              status: projectStatus,
              tags: projectTags,
              thumbnail: projectImage
            };
          }
          return p;
        });
        const updated = { ...prev, completedProjects: updatedProjects };
        localStorage.setItem('neopoly_user_profile', JSON.stringify(updated));
        return updated;
      });
    } else {
      // Creation
      const newProj: CompletedProject = {
        id: Date.now(),
        title: projectTitle,
        description: projectDesc,
        progress: projectProgress,
        status: projectStatus,
        completedAt: new Date().toISOString().split('T')[0],
        tags: projectTags,
        thumbnail: projectImage
      };
      setUserProfile(prev => {
        const updated = { ...prev, completedProjects: [newProj, ...prev.completedProjects] };
        localStorage.setItem('neopoly_user_profile', JSON.stringify(updated));
        return updated;
      });
    }

    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (projId: number) => {
    setUserProfile(prev => {
      const remaining = prev.completedProjects.filter(p => p.id !== projId);
      const updated = { ...prev, completedProjects: remaining };
      localStorage.setItem('neopoly_user_profile', JSON.stringify(updated));
      return updated;
    });
    setProjectToDelete(null);
  };

  const handleProjectImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProjectImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !projectTags.includes(trimmed)) {
      setProjectTags([...projectTags, trimmed]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProjectTags(projectTags.filter(t => t !== tagToRemove));
  };

  // Predefined project presets for easy testing
  const projectPresets = [
    '/images/work_%201.png',
    '/images/work_%202.png',
    '/images/work_%203.png',
    '/images/work_%204.png',
    '/images/work_%2016.png',
    '/images/work_%2017.png',
  ];

  // Filters for user assets and favorite assets
  const userUploadedAssets = assets.filter(a => a.author === 'NeoCreator');
  const favoriteAssets = assets.filter(a => favorites.includes(a.id));

  // Determine Banner visual style
  const bannerStyle: React.CSSProperties = {};
  let bannerClass = 'bg-surface-primary';
  
  if (selectedBanner.startsWith('url(')) {
    bannerStyle.backgroundImage = selectedBanner;
    bannerStyle.backgroundSize = 'cover';
    bannerStyle.backgroundPosition = 'center';
  } else if (selectedBanner.startsWith('data:image')) {
    bannerStyle.backgroundImage = `url(${selectedBanner})`;
    bannerStyle.backgroundSize = 'cover';
    bannerStyle.backgroundPosition = 'center';
  } else {
    const matchingPreset = BANNER_PRESETS.find(p => p.id === selectedBanner);
    if (matchingPreset && 'class' in matchingPreset) {
      bannerClass = matchingPreset.class || '';
    } else {
      bannerClass = 'bg-gradient-to-r from-[#141518] via-[#2A2315] to-[#403118]';
    }
  }

  return (
    <div className="w-full text-text-primary pb-32">
      {/* 1. Cover Banner Block */}
      <div 
        className={`w-full h-80 relative overflow-hidden flex items-end justify-between px-6 md:px-14 pb-8 transition-all ${bannerClass}`}
        style={bannerStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-[#08090B]/30 to-transparent z-1" />
        
        {/* Banner Editor controls */}
        <div className="absolute top-4 right-6 md:right-14 z-10 flex items-center gap-2">
          {/* Preset Pill Buttons */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0e1011]/80 backdrop-blur-md p-1 border border-border-primary rounded-full">
            {BANNER_PRESETS.map((preset) => {
              const matchesPreset = ('url' in preset && selectedBanner.includes(preset.url || '')) || 
                                    (!('url' in preset) && selectedBanner === preset.id);
              return (
                <button
                  key={preset.id}
                  onClick={() => selectBannerPreset(preset)}
                  className={`px-3 py-1 rounded-full text-[15px] font-medium transition-all cursor-pointer ${
                    matchesPreset 
                      ? 'bg-brand-primary text-bg-dark' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                  title={preset.label}
                >
                  {preset.label.replace('Classic ', '').replace('Minimalist ', '')}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => bannerInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0e1011]/90 backdrop-blur-md border border-border-primary hover:border-brand-primary rounded-[4px] text-[15px] leading-relaxed font-medium text-text-secondary hover:text-text-primary cursor-pointer transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>배너 업로드</span>
          </button>
          <input 
            type="file" 
            ref={bannerInputRef} 
            onChange={handleBannerChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 w-full mt-12">
          {/* Avatar frame */}
          <div className="group relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-bg-dark overflow-hidden shrink-0 shadow-2xl bg-surface-secondary">
            <img 
              src={userProfile.avatar} 
              alt="Profile Avatar" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            {/* Hover Camera overlay */}
            <button
              type="button"
              aria-label="프로필 이미지 업로드"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1 rounded-full bg-black/70 opacity-100 transition-opacity duration-200 md:inset-0 md:h-auto md:w-auto md:rounded-none md:bg-black/60 md:opacity-0 md:group-hover:opacity-100"
            >
              <Upload className="h-4 w-4 text-brand-primary md:h-5 md:w-5" />
              <span className="hidden text-[14px] font-medium uppercase tracking-widest text-text-primary md:block">UPLOAD</span>
            </button>
            <input 
              type="file" 
              ref={avatarInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
              <h1 className="text-[24px] font-bold leading-tight font-display text-text-primary tracking-tight">{userProfile.nickname}</h1>
              <span className="text-[14px] md:self-center font-sans font-medium tracking-wide uppercase px-2 py-0.5 bg-brand-primary/15 border border-brand-primary/45 text-brand-primary rounded-sm h-fit self-center">
                {userProfile.role}
              </span>
            </div>
            <p className="text-[14px] text-text-tertiary">@{userProfile.username} • {userProfile.email}</p>
          </div>
        </div>
      </div>

      {/* 2. Page Content & Column Split */}
      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 2xl:px-8 min-[2200px]:px-10 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Bios, Stats, Socials (Editable inline) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#141518] rounded-[10px] border border-[#2A2E36] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#2A2E36] pb-3">
              <h3 className="text-[15px] leading-relaxed font-medium text-text-primary flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary" /> 크리에이터 세부 사양
              </h3>
              <button
                onClick={() => {
                  if (isEditingBio) {
                    handleSaveProfile();
                  } else {
                    setIsEditingBio(true);
                  }
                }}
                className={`flex items-center gap-1 text-[15px] leading-relaxed font-medium px-2.5 py-1.5 rounded transition-all cursor-pointer ${
                  isEditingBio 
                    ? 'bg-brand-primary text-bg-dark hover:bg-brand-hover' 
                    : 'bg-white/5 border border-border-primary hover:border-brand-primary/40 text-brand-primary'
                }`}
              >
                {isEditingBio ? (
                  <>
                    <Save className="w-3 h-3" />
                    <span>저장</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3 h-3" />
                    <span>수정</span>
                  </>
                )}
              </button>
            </div>

            {isEditingBio ? (
              <div className="space-y-4 font-sans animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-text-tertiary">닉네임</label>
                  <input
                    type="text"
                    value={editedNickname}
                    onChange={(e) => setEditedNickname(e.target.value)}
                    className="w-full bg-bg-secondary border border-border-primary rounded px-3 py-2 text-[15px] leading-relaxed text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-text-tertiary">크리에이터 약력 (Bio)</label>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows={4}
                    className="w-full bg-bg-secondary border border-border-primary rounded px-3 py-2 text-[15px] leading-relaxed text-text-primary focus:outline-none focus:border-brand-primary resize-none custom-scrollbar"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-text-secondary uppercase">Instagram URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/..."
                    value={editedInsta}
                    onChange={(e) => setEditedInsta(e.target.value)}
                    className="w-full bg-bg-secondary border border-border-primary rounded px-3 py-2 text-[15px] leading-relaxed text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-text-secondary uppercase">YouTube URL</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/@..."
                    value={editedYoutube}
                    onChange={(e) => setEditedYoutube(e.target.value)}
                    className="w-full bg-bg-secondary border border-border-primary rounded px-3 py-2 text-[15px] leading-relaxed text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Short Bio Block */}
                <div className="space-y-2">
                  <span className="text-[15px] font-medium tracking-wider text-text-secondary uppercase block">크리에이터 한 줄 설명</span>
                  <p className="text-[15px] leading-relaxed leading-relaxed text-text-secondary whitespace-pre-line font-medium">{userProfile.bio}</p>
                </div>

                {/* Performance Metrics Block */}
                <div className="bg-surface-secondary border border-border-soft p-4 rounded-lg space-y-4">
                  <span className="text-[15px] font-medium tracking-wider text-text-secondary uppercase block">AI Studio 클라우드 등급</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-text-tertiary flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" /> 누적 크레딧 파이프라인
                    </span>
                    <span className="text-[15px] leading-relaxed text-brand-primary font-sans font-medium">{userProfile.credits} / 500 CC</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary shadow-[0_0_8px_rgba(224,161,46,0.6)]" style={{ width: `${(userProfile.credits / 500) * 100}%` }} />
                  </div>
                </div>

                {/* Interactive Project Milestones or Achievements */}
                <div className="space-y-3">
                  <span className="text-[15px] font-medium tracking-wider text-text-secondary uppercase block">인증 뱃지 현황</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-surface-secondary/60 border border-border-soft/60 px-3 py-2.5 rounded hover:border-brand-primary/20 transition-all">
                      <Award className="w-5 h-5 text-brand-primary" />
                      <div>
                        <p className="text-[15px] leading-relaxed font-medium text-text-primary">마스터 셀러</p>
                        <p className="text-[14px] text-text-tertiary">3D 에셋 10+ 판매</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-secondary/60 border border-border-soft/60 px-3 py-2.5 rounded hover:border-brand-primary/20 transition-all">
                      <Layers className="w-5 h-5 text-[#4C88D9]" />
                      <div>
                        <p className="text-[15px] leading-relaxed font-medium text-text-primary">비주얼 파이오니어</p>
                        <p className="text-[14px] text-text-tertiary">완성된 프로젝트 3+</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="space-y-3 border-t border-border-primary/30 pt-4">
                  <span className="text-[15px] font-medium tracking-wider text-text-secondary uppercase block">소셜 네트워크 연동</span>
                  <div className="flex flex-col gap-2">
                    {userProfile.instagramUrl ? (
                      <a 
                        href={userProfile.instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-between text-[15px] leading-relaxed text-text-secondary hover:text-brand-primary transition-colors bg-surface-secondary/30 hover:bg-surface-secondary/80 p-2.5 rounded border border-border-primary/10"
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-brand-primary" /> Instagram
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      <p className="text-[14px] text-text-tertiary">인스타그램이 연동되지 않았습니다.</p>
                    )}

                    {userProfile.youtubeUrl ? (
                      <a 
                        href={userProfile.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-between text-[15px] leading-relaxed text-text-secondary hover:text-brand-primary transition-colors bg-surface-secondary/30 hover:bg-surface-secondary/80 p-2.5 rounded border border-border-primary/10"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-brand-primary" /> YouTube Channel
                        </span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      <p className="text-[15px] text-text-tertiary">유튜브 채널이 연동되지 않았습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Main Showcase Workspace (Tabs) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Header Tab List Bar */}
          <div className="flex border-b border-[#2A2E36] bg-[#141518]/80 p-1.5 rounded-lg gap-2">
            {[
              { id: 'projects', label: '완료된 포트폴리오', count: userProfile.completedProjects.length, icon: Layers },
              { id: 'assets', label: '내 등록 에셋', count: userUploadedAssets.length, icon: ImageIcon },
              { id: 'favorites', label: '관심 에셋', count: favoriteAssets.length, icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 px-5 py-3 text-[14px] leading-relaxed font-medium rounded-md transition-all cursor-pointer flex-1 md:flex-initial text-center ${
                  activeTab === tab.id
                    ? 'bg-[#181A1F] text-[#E0A12E] border border-[#2A2E36] shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-[#181A1F]'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                <span className="text-[14px] font-sans px-1.5 py-0.5 rounded-full bg-white/5 font-medium text-text-primary/50">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Render Tab Contents */}
          <div className="min-h-[460px]">
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-border-soft/60">
                  <div className="space-y-1">
                    <h2 className="text-[18px] font-semibold leading-snug text-text-primary tracking-tight flex items-center gap-2 font-display">
                      완료 포트폴리오 리스트 <span className="text-text-secondary font-normal text-[14px]">Completed Showcase</span>
                    </h2>
                    <p className="text-[14px] text-text-tertiary">상업적 배포 및 스튜디오 라이브 프로덕션에서 컴파일 완료를 검증받은 고사양 마이크로 씬입니다.</p>
                  </div>
                  <button
                    onClick={() => handleOpenProjectModal()}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-bg-dark text-[15px] leading-relaxed font-medium rounded-sm transition-all cursor-pointer border-0 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 프로젝트 등록</span>
                  </button>
                </div>

                {userProfile.completedProjects.length === 0 ? (
                  <div className="min-h-[300px] bg-surface-primary/30 border border-dashed border-border-primary rounded-[10px] flex flex-col items-center justify-center text-center p-8">
                    <Layers className="w-12 h-12 text-text-tertiary opacity-30 animate-pulse mb-3" />
                    <p className="text-[15px] leading-relaxed font-medium text-text-primary">등록된 완료 프로젝트가 없습니다.</p>
                    <p className="text-[14px] text-text-tertiary mt-1">상단의 "새 프로젝트 등록" 버튼을 눌러 당신의 3D 마일스톤 성과를 박제해 보세요!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {userProfile.completedProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        layout
                        className="bg-surface-primary border border-border-soft group rounded-[10px] overflow-hidden flex flex-col relative hover:border-brand-primary/40 transition-all shadow-lg"
                      >
                        {/* Thumbnail cover */}
                        <div className="aspect-[16/10] bg-bg-secondary relative overflow-hidden flex-shrink-0 border-b border-border-soft/30">
                          {projectToDelete === project.id && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center">
                              <Trash2 className="w-8 h-8 text-red-500 mb-2 animate-bounce" />
                              <p className="text-[15px] leading-relaxed font-medium text-text-primary mb-4">정말 이 프로젝트를 삭제하시겠습니까?</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setProjectToDelete(null)}
                                  className="px-3 py-1.5 bg-[#1C1E22] hover:bg-[#2A2E36] text-[15px] font-medium rounded text-text-primary transition-all border-0 cursor-pointer"
                                >
                                  취소
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-[15px] font-medium rounded text-text-primary transition-all border-0 cursor-pointer"
                                >
                                  삭제하기
                                </button>
                              </div>
                            </div>
                          )}
                          <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.007]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-[#0e1011]/80 backdrop-blur-md px-2.5 py-1 rounded border border-border-primary/55">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[14px] font-sans font-medium text-emerald-400 uppercase tracking-widest">{project.status}</span>
                          </div>
                        </div>

                        {/* Mid Meta */}
                        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[15px] leading-relaxed font-medium text-text-primary tracking-tight group-hover:text-brand-primary transition-colors line-clamp-1">{project.title}</h4>
                              <span className="text-[14px] font-sans text-text-tertiary shrink-0">{project.completedAt}</span>
                            </div>
                            <p className="text-[14px] leading-relaxed text-text-tertiary line-clamp-2">{project.description || '작성된 세부 설명이 없습니다.'}</p>
                          </div>

                          <div className="space-y-2.5 pt-3 border-t border-border-soft/20">
                            {/* Tags display */}
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags.map((tag) => (
                                <span key={tag} className="text-[14px] font-medium tracking-tight uppercase px-2 py-0.5 bg-[#1B1D22] border border-border-soft text-text-secondary rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Options Button Box */}
                            <div className="flex items-center justify-between pt-1">
                              {/* progress gauge */}
                              <div className="flex items-center gap-2 flex-1 mr-4">
                                <span className="text-[14px] font-sans text-text-secondary font-medium shrink-0">진척도: {project.progress}%</span>
                                <div className="h-[4px] bg-white/5 rounded-full overflow-hidden flex-1">
                                  <div className="h-full bg-brand-primary" style={{ width: `${project.progress}%` }} />
                                </div>
                              </div>

                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleOpenProjectModal(project)}
                                  className="p-1 px-2.5 rounded bg-[#1C1E22] border border-border-primary hover:border-brand-primary text-brand-primary text-[15px] font-medium cursor-pointer transition-all"
                                  title="프로젝트 세부 속성 수정"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => setProjectToDelete(project.id)}
                                  className="p-1 px-[7px] rounded bg-red-500/10 hover:bg-red-500/30 text-red-400 border-0 cursor-pointer transition-all"
                                  title="삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-border-soft/60">
                  <div className="space-y-1">
                    <h2 className="text-[18px] font-semibold leading-snug text-text-primary tracking-tight flex items-center gap-2 font-display">
                      내 등록 에셋 리스트 <span className="text-text-secondary font-normal text-[14px] font-sans">Registered Portfolio</span>
                    </h2>
                    <p className="text-[14px] text-text-tertiary">스튜디오 및 메인 Discover 서칭 허브에 실시간으로 배포 연동된 나만의 3D 그래픽 파일 카탈로그입니다.</p>
                  </div>
                  <button
                    onClick={onOpenCreationsModal}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-bg-dark text-[15px] leading-relaxed font-medium rounded-sm transition-all cursor-pointer border-0 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 에셋 올리기</span>
                  </button>
                </div>

                {userUploadedAssets.length === 0 ? (
                  <div className="min-h-[300px] bg-surface-primary/30 border border-dashed border-border-primary rounded-[10px] flex flex-col items-center justify-center text-center p-8">
                    <ImageIcon className="w-12 h-12 text-text-tertiary opacity-30 animate-pulse mb-3" />
                    <p className="text-[15px] leading-relaxed font-medium text-text-primary">업로드 보증된 등록 에셋이 없습니다.</p>
                    <p className="text-[14px] text-text-tertiary mt-1">"새 에셋 올리기" 버튼을 통해 메인 Discover 마켓에 배포할 멋진 그래픽 리소스를 등록해 보세요!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userUploadedAssets.map((asset) => {
                      const isM = asset.badge === 'M';
                      return (
                        <div key={asset.id} className="group relative rounded-[6px] overflow-hidden bg-surface-primary border border-border-soft shadow-xl cursor-pointer flex flex-col aspect-[16/10]">
                          <div className="relative flex-1 overflow-hidden">
                            <img src={asset.image} alt={asset.title} className="w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-[1.007] group-hover:brightness-[0.82]" referrerPolicy="no-referrer" />
                            <div className={`absolute top-2 right-2 h-7 min-w-7 px-1 rounded-[6px] flex items-center justify-center text-[14px] font-medium backdrop-blur-[8px] z-20 ${
                              isM ? 'bg-[#E0A12E]/40 text-[#F0B43A]' : 'bg-[#4C88D9]/40 text-[#A0C5FF]'
                            }`}>
                              {asset.badge}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 z-10 flex h-[88%] translate-y-0 flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-2.5 opacity-100 transition-all duration-[300ms] ease-out md:h-[80%] md:translate-y-1.5 md:p-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                              <h3 className="mb-1 line-clamp-2 text-[12px] font-medium leading-tight text-text-primary sm:text-[14px]">{asset.title}</h3>
                              <div className="flex items-center gap-2 text-[11px] text-text-secondary sm:text-[13px]">
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3 fill-red-500/10 text-red-500/80" /> {asset.likes}</span>
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-text-tertiary" /> {asset.views}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-2 border-b border-border-soft/60 space-y-1">
                  <h2 className="text-[18px] font-semibold leading-snug text-text-primary tracking-tight flex items-center gap-2 font-display">
                    관심 등록 보관소 <span className="text-text-secondary font-normal text-[14px]">Curated Favorites</span>
                  </h2>
                  <p className="text-[14px] text-text-tertiary">피드 레이아웃 카탈로그에서 하트(관심)를 누르신 에셋 리스트입니다. 실시간 렌더 스펙을 보관합니다.</p>
                </div>

                {favoriteAssets.length === 0 ? (
                  <div className="min-h-[300px] bg-surface-primary/30 border border-dashed border-border-primary rounded-[10px] flex flex-col items-center justify-center text-center p-8">
                    <Heart className="w-12 h-12 text-text-tertiary opacity-30 animate-pulse mb-3" />
                    <p className="text-[15px] leading-relaxed font-medium text-text-primary">보관된 관심 에셋이 없습니다.</p>
                    <p className="text-[14px] text-text-tertiary mt-1">메인 마켓 플레이스의 피드 에셋 프리뷰 하트 아이콘을 클릭하시면 이 보관소에 자동으로 영구 보관됩니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-sans">
                    {favoriteAssets.map((asset) => {
                      const isM = asset.badge === 'M';
                      return (
                        <div key={asset.id} className="group relative rounded-[6px] overflow-hidden bg-surface-primary border border-border-soft shadow-xl flex flex-col aspect-[16/10]">
                          <div className="relative flex-1 overflow-hidden">
                            <img src={asset.image} alt={asset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            
                            {/* Toggle click handler for quick unfavorite */}
                            <button
                              type="button"
                              onClick={() => toggleFavorite(asset.id)}
                              className="absolute top-2 left-2 z-30 p-1.5 rounded-full bg-black/50 hover:bg-black/90 text-red-500 cursor-pointer border-0 transition-all hover:scale-110"
                              title="관심 등록 취소"
                            >
                              <Heart className="w-4 h-4 fill-red-500" />
                            </button>

                            <div className={`absolute top-2 right-2 h-7 min-w-7 px-1 rounded-[6px] flex items-center justify-center text-[14px] font-medium backdrop-blur-[8px] z-20 ${
                              isM ? 'bg-[#E0A12E]/40 text-[#F0B43A]' : 'bg-[#4C88D9]/40 text-[#A0C5FF]'
                            }`}>
                              {asset.badge}
                            </div>

                            <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3 z-10">
                              <h3 className="text-[15px] font-medium text-text-primary line-clamp-1 leading-tight mb-1">{asset.title}</h3>
                              <p className="text-[14px] text-text-secondary truncate">by {asset.author}</p>
                              <div className="flex items-center gap-2.5 text-[14px] text-text-secondary mt-1.5">
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500 fill-red-500/10" /> {asset.likes}</span>
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-text-tertiary" /> {asset.views}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Completed Project Create/Edit Dialogue Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4Dialog font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl bg-[#0E1011] border border-border-primary rounded-[16px] overflow-hidden shadow-2xl flex flex-col text-left text-text-primary"
            >
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-border-primary bg-bg-secondary">
                <h3 className="text-[18px] leading-relaxed font-semibold text-text-primary tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-brand-primary rounded-full" />
                  {editingProject ? '프로젝트 메타 정보 수정' : '완료 프로젝트 신규 발급'}
                </h3>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="text-text-tertiary hover:text-brand-primary p-2 cursor-pointer border-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="p-6 space-y-4 font-sans">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[15px] leading-relaxed font-medium text-text-tertiary">프로젝트 명칭</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="예: 판타지 아르고 성전 씬"
                    className="w-full bg-bg-secondary border border-border-primary rounded-[6px] px-3.5 py-2.5 text-[15px] leading-relaxed focus:outline-none focus:border-brand-primary"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[15px] leading-relaxed font-medium text-text-tertiary">세부 설명</label>
                  <textarea
                    required
                    rows={3}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="이 마이크로 씬의 컨셉과 수행 역할을 설명해 주세요..."
                    className="w-full bg-bg-secondary border border-border-primary rounded-[6px] px-3.5 py-2.5 text-[15px] leading-relaxed focus:outline-none focus:border-brand-primary resize-none custom-scrollbar"
                  />
                </div>

                {/* Grid Progress & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[15px] leading-relaxed font-medium text-text-tertiary">상태 (Status)</label>
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value)}
                      className="w-full h-[40px] bg-bg-secondary border border-border-primary rounded-[6px] px-3 text-[15px] leading-relaxed focus:outline-none focus:border-brand-primary cursor-pointer text-text-primary"
                    >
                      <option value="Completed" className="bg-[#0e1011]">완료 (Completed)</option>
                      <option value="In Modeling" className="bg-[#0e1011]">모델링 중</option>
                      <option value="In Rendering" className="bg-[#0e1011]">스캔/렌더 중</option>
                      <option value="Drafting" className="bg-[#0e1011]">초안 작성 중</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[15px] leading-relaxed font-medium text-text-tertiary">진척도 (Progress): {projectProgress}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={projectProgress}
                      onChange={(e) => setProjectProgress(parseInt(e.target.value))}
                      className="w-full h-[2px] mt-4 bg-border-soft rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                  </div>
                </div>

                {/* Tags manager */}
                <div className="space-y-2">
                  <label className="text-[15px] leading-relaxed font-medium text-text-tertiary">기술 스택 또는 태그</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="예: Blender, ZBrush"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 bg-bg-secondary border border-border-primary rounded-[6px] px-3.5 py-1.5 text-[15px] leading-relaxed focus:outline-none focus:border-brand-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 bg-[#1C1E22] hover:bg-brand-primary hover:text-bg-dark border border-border-primary rounded-[6px] text-[15px] leading-relaxed font-medium transition-colors cursor-pointer"
                    >
                      추가
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 min-h-[30px] pt-1">
                    {projectTags.map((t) => (
                      <span key={t} className="flex items-center gap-1.5 px-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded text-[15px] font-medium">
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-red-400 p-0 text-brand-primary hover:bg-transparent border-0 cursor-pointer text-[14px]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Artwork selection */}
                <div className="space-y-2">
                  <label className="text-[15px] leading-relaxed font-medium text-text-tertiary">프로젝트 대표 이미지 업로드 / 무작위 매칭</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => projectImgInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-3 w-28 h-20 bg-bg-secondary hover:bg-surface-primary rounded-[6px] border border-dashed border-border-primary hover:border-brand-primary cursor-pointer transition-all space-y-1"
                    >
                      <Upload className="w-4 h-4 text-brand-primary" />
                      <span className="text-[14px] text-text-secondary">PC 불러오기</span>
                    </button>
                    <input
                      type="file"
                      ref={projectImgInputRef}
                      onChange={handleProjectImageFile}
                      accept="image/*"
                      className="hidden"
                    />

                    {/* Quick presets list */}
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-[14px] text-text-tertiary font-medium">크리에이터 데모 작품 프리셋 중 빠른 선정:</span>
                      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                        {projectPresets.map((pr, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setProjectImage(pr)}
                            className={`w-14 h-10 rounded border overflow-hidden shrink-0 bg-surface-primary cursor-pointer transition-all ${
                              projectImage === pr ? 'border-brand-primary ring-1 ring-brand-primary/50 scale-105' : 'border-border-primary hover:border-brand-primary/40'
                            }`}
                          >
                            <img referrerPolicy="no-referrer" src={pr} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="aspect-[16/6] bg-bg-secondary rounded-[6px] overflow-hidden border border-border-soft flex items-center justify-center relative mt-2">
                    <img src={projectImage} alt="Selected project representive" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[14px] px-2 py-0.5 rounded font-sans border border-white/5 font-medium">선정된 이미지 라이브 프리뷰</span>
                  </div>
                </div>

                {/* Submits */}
                <div className="flex gap-3 pt-4 border-t border-border-primary/40">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="flex-1 py-3 bg-[#1C1E22] hover:bg-[#25282e] text-text-secondary hover:text-text-primary rounded-[6px] text-[15px] leading-relaxed font-medium transition-all cursor-pointer border-0 text-center"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-primary hover:bg-brand-hover text-bg-dark rounded-[6px] text-[15px] leading-relaxed font-medium transition-all cursor-pointer border-0 text-center shadow-lg"
                  >
                    {editingProject ? '변경 사항 적용하기' : '포트폴리오 등재 완료'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
