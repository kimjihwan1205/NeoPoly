import React, { useRef, useState } from 'react';
import { useStoredState, writeJSON } from '../localStore';
import { User, Lock, Bell, Globe, Settings2, Store, CreditCard, ExternalLink, Camera, ChevronDown, ChevronRight, X, Plus, MapPin, Link2, Moon, Sun, Check } from 'lucide-react';
import { type ThemeMode, UserProfile } from '../types';

interface AccountSettingsPageProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onNavigate?: (page: string) => void;
}

const THEME_OPTIONS = [
  { id: 'dark' as const, label: '다크 모드', icon: Moon },
  { id: 'light' as const, label: '라이트 모드', icon: Sun },
];

export default function AccountSettingsPage({
  userProfile,
  setUserProfile,
  theme,
  onThemeChange,
  onNavigate,
}: AccountSettingsPageProps) {
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [name, setName] = useState(userProfile.displayName ?? '');
  const [bio, setBio] = useState(userProfile.bio);
  const [location, setLocation] = useState(userProfile.location ?? '');
  const [role, setRole] = useState(userProfile.creatorRole ?? '');
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [banner, setBanner] = useState(userProfile.banner ?? '/images/profile/profile_banner.png');
  const [expertise, setExpertise] = useState((userProfile.expertise ?? ['Character', 'Fantasy']).join(', '));
  const [tools, setTools] = useState((userProfile.tools ?? ['Blender', 'ZBrush']).join(', '));
  const [links, setLinks] = useState<Record<string, string>>(userProfile.externalLinks ?? {});
  const [saveMessage, setSaveMessage] = useState('');
  const [notificationPrefs, setNotificationPrefs] = useStoredState<boolean[]>('neopoly_notification_preferences_v1', [true, true, true, false]);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageTarget = useRef<'avatar' | 'banner'>('avatar');
  const [activeTab, setActiveTab] = useState('profile');
  const splitTags = (value: string, limit: number) => [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))].slice(0, limit);
  const saveProfile = () => {
    if (!nickname.trim() || nickname.trim().length > 30) { setSaveMessage('닉네임은 1~30자로 입력해 주세요.'); return; }
    if (bio.length > 200) { setSaveMessage('소개 문구는 200자 이하로 입력해 주세요.'); return; }
    if (Object.values(links).some((url) => url.trim() && !/^https:\/\/[^\s]+$/.test(url.trim()))) { setSaveMessage('외부 링크는 https:// 주소로 입력해 주세요.'); return; }
    const profile = { ...userProfile, nickname: nickname.trim(), displayName: name, bio, location, creatorRole: role, avatar, banner, expertise: splitTags(expertise, 5), tools: splitTags(tools, 6), externalLinks: links };
    if (writeJSON('neopoly_user_profile', profile)) { setUserProfile(profile); setSaveMessage('프로필을 이 기기에 저장했습니다. 공개 서버에는 전송되지 않습니다.'); }
    else setSaveMessage('저장하지 못했습니다. 이미지 용량 또는 브라우저 저장 설정을 확인해 주세요.');
  };
  const resetProfile = () => {
    setNickname(userProfile.nickname); setName(userProfile.displayName ?? ''); setBio(userProfile.bio);
    setLocation(userProfile.location ?? ''); setRole(userProfile.creatorRole ?? ''); setAvatar(userProfile.avatar);
    setBanner(userProfile.banner ?? '/images/profile/profile_banner.png'); setLinks(userProfile.externalLinks ?? {});
    setExpertise((userProfile.expertise ?? ['Character', 'Fantasy']).join(', ')); setTools((userProfile.tools ?? ['Blender', 'ZBrush']).join(', ')); setSaveMessage('마지막 저장 상태로 되돌렸습니다.');
  };
  const chooseImage = (target: 'avatar' | 'banner') => { imageTarget.current = target; fileRef.current?.click(); };
  const readImage = (file?: File) => {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 750 * 1024) { setSaveMessage('PNG·JPG·WebP 파일을 750KB 이하로 선택해 주세요.'); return; }
    const reader = new FileReader();
    const target = imageTarget.current;
    reader.onload = () => { (target === 'avatar' ? setAvatar : setBanner)(String(reader.result)); setSaveMessage('이미지를 선택했습니다. 변경사항 저장을 눌러 주세요.'); };
    reader.onerror = () => setSaveMessage('이미지를 읽을 수 없습니다.'); reader.readAsDataURL(file);
  };

  const navItems = [
    { icon: User, title: '프로필', id: 'profile' },
    { icon: Lock, title: '계정 / 보안', id: 'security' },
    { icon: Bell, title: '알림', id: 'notifications' },
    { icon: Globe, title: '공개 범위', id: 'visibility' },
    { icon: Settings2, title: '작업 환경', id: 'workspace' },
    { icon: Store, title: '마켓 / 판매자', id: 'seller' },
    { icon: CreditCard, title: '결제 / 구독', id: 'billing' },
  ];

  return (
    <div className="np-workspace-shell flex h-[calc(100dvh-60px)] w-full flex-col overflow-hidden bg-[#050505] font-sans text-white lg:h-[calc(100dvh-76px)] lg:flex-row">
      {/* Left Nav (Sidebar) */}
      <aside className="np-primary-sidebar-surface shrink-0 border-b border-[#1F2329] px-4 py-4 lg:flex lg:h-full lg:w-[240px] lg:flex-col lg:overflow-hidden lg:border-b-0 lg:border-r lg:px-6 lg:py-6 xl:w-[260px]">
        <h2 className="np-primary-sidebar-title mb-3 px-1 tracking-tight text-neutral-100 lg:mb-4">계정 설정</h2>
        <div className="relative -mx-1 lg:mb-6">
          <div className="flex snap-x gap-2 overflow-x-auto px-1 pb-1 pr-10 scrollbar-hide lg:block lg:space-y-1 lg:overflow-visible lg:pr-1 lg:pb-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`flex h-11 shrink-0 snap-start items-center gap-2 rounded-lg border px-3 text-left transition-all lg:w-full lg:gap-3 ${
                  activeTab === item.id
                    ? 'relative border-brand-primary/30 bg-brand-primary/10 shadow-sm after:absolute after:left-0 after:top-1/2 after:h-[60%] after:w-1 after:-translate-y-1/2 after:rounded-r-full after:bg-brand-primary'
                    : 'border-transparent hover:bg-[#141518]'
                }`}
              >
                <div className={`flex w-[22px] justify-center ${activeTab === item.id ? 'text-brand-primary' : 'text-neutral-400'}`}>
                  <item.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <span className={`truncate text-[14px] leading-5 ${activeTab === item.id ? 'np-settings-nav-label-active font-semibold text-brand-primary' : 'font-medium text-neutral-300'}`}>{item.title}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-gradient-to-l from-bg-dark via-bg-dark/90 to-transparent pr-1 lg:hidden" aria-hidden="true">
            <ChevronRight className="h-4 w-4 text-brand-primary" />
          </div>
        </div>

        <div className="np-settings-help-panel mt-auto hidden rounded-xl border border-[#1F2329] bg-[#0A0B0D] p-4 lg:block">
          <h3 className="mb-1 text-[14px] font-medium text-neutral-200">도움이 필요하신가요?</h3>
          <p className="mb-3 text-[12px] leading-[18px] text-neutral-500">고객센터에서 계정 관련 도움을 받아보세요.</p>
          <button onClick={() => onNavigate?.('support')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-primary/40 px-3 py-2 text-[13px] font-medium text-brand-primary transition-colors hover:bg-brand-primary/10">
            <span className="np-settings-support-link-label">고객센터 바로가기</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto custom-scrollbar">
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { readImage(event.target.files?.[0]); event.target.value = ''; }} />
        {saveMessage && <p role="status" className="mx-4 mt-4 rounded-lg border border-border-primary bg-surface-primary p-3 text-[14px] text-text-secondary">{saveMessage}</p>}
        <div className="mx-auto max-w-[2560px] px-4 py-5 sm:px-6 sm:py-6 2xl:px-8 min-[2200px]:px-10">
          <div className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,_1fr)_340px] 2xl:grid-cols-[minmax(0,_1fr)_360px] gap-6 xl:gap-8">
            
            {/* Middle Content */}
        {activeTab === 'profile' ? (
          <>
            <div className="rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex flex-col h-fit shadow-xl">
              <div className="mb-8">
                <h1 className="text-[24px] font-bold text-neutral-100 mb-2">프로필 편집</h1>
                <p className="text-neutral-400 font-medium text-[14px]">MVP · 이 기기에 저장되는 프로필을 편집합니다. 계정 서버와 공개 프로필 동기화는 준비 중입니다.</p>
              </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-10 gap-y-8 border-b border-[#1F2329] pb-8 mb-8">
            <div className="flex flex-col gap-4">
              <span className="text-[15px] font-medium text-neutral-100">프로필 이미지</span>
              <div className="relative w-[150px] h-[150px] rounded-full border border-[#1F2329] bg-[#141518] overflow-hidden shrink-0 group mx-auto md:mx-0">
                <img referrerPolicy="no-referrer" src={avatar} alt="Profile" className="w-full h-full object-cover" />
                <button aria-label="프로필 이미지 변경" onClick={() => chooseImage('avatar')} className="absolute bottom-2 right-2 w-[34px] h-[34px] rounded-full border border-[#1F2329] bg-[#0A0B0D]/80 backdrop-blur flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#141518] transition-all">
                  <Camera className="w-[16px] h-[16px]" strokeWidth={2} />
                </button>
              </div>
              <span className="text-[14px] text-neutral-400 font-medium">권장 사이즈 512x512, JPG·PNG·WebP (최대 750KB)</span>
            </div>

            <div className="flex flex-col gap-4 min-w-0">
              <span className="text-[15px] font-medium text-neutral-100">배너 이미지</span>
              <div className="relative h-[150px] w-full rounded-[14px] border border-[#1F2329] bg-[#141518] overflow-hidden group">
                <img referrerPolicy="no-referrer" src={banner} alt="Banner" className="w-full h-full object-cover opacity-70" />
                <button aria-label="배너 이미지 변경" onClick={() => chooseImage('banner')} className="absolute bottom-3 right-3 w-[34px] h-[34px] rounded-full border border-[#1F2329] bg-[#0A0B0D]/80 backdrop-blur flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#141518] transition-all">
                  <Camera className="w-[16px] h-[16px]" strokeWidth={2} />
                </button>
              </div>
              <span className="text-[14px] text-neutral-400 font-medium">권장 사이즈 1920x480, JPG·PNG·WebP (최대 750KB)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pb-8 border-b border-[#1F2329]">
            {/* 기본 정보 */}
            <div className="space-y-6">
              <h3 className="text-[17px] font-semibold text-neutral-100 mb-6">기본 정보</h3>
              
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-[14px] font-medium text-neutral-300">닉네임 <span className="text-[#E46B6B]">*</span></label>
                  <input aria-label="닉네임" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-brand-primary hover:border-[#2A2E36] outline-none transition-colors" />
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-[14px] font-medium text-neutral-300">이름</label>
                  <input aria-label="이름" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-brand-primary hover:border-[#2A2E36] outline-none transition-colors" />
                </div>

                <div className="space-y-2.5">
                  <label className="text-[14px] font-medium text-neutral-300">소개 문구</label>
                  <div className="relative flex flex-col">
                    <textarea aria-label="소개 문구" maxLength={200} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium leading-[1.6] text-neutral-300 focus:border-brand-primary hover:border-[#2A2E36] outline-none transition-colors min-h-[120px] resize-none" />
                    <span className="text-[14px] text-neutral-400 font-medium text-right mt-1.5">{bio.length} / 200</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[14px] font-medium text-neutral-300">위치</label>
                  <div className="relative">
                    <input aria-label="위치" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-[#050505] border border-[#1F2329] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-neutral-100 focus:border-brand-primary hover:border-[#2A2E36] outline-none transition-colors cursor-pointer" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* 크리에이터 정보 */}
            <div className="space-y-6">
              <h3 className="text-[17px] font-semibold text-neutral-100 mb-6">크리에이터 정보</h3>
              
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-[14px] font-medium text-neutral-300">직군</label>
                  <div className="relative">
                    <input aria-label="직군" type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-[#050505] border border-[#1F2329] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-neutral-100 focus:border-brand-primary hover:border-[#2A2E36] outline-none transition-colors cursor-pointer" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                <label className="block space-y-2.5 text-[14px] text-neutral-300"><span>전문 분야 (쉼표로 구분, 최대 5개)</span><input value={expertise} onChange={(event) => setExpertise(event.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-primary px-4 py-3" /></label>
                <label className="block space-y-2.5 text-[14px] text-neutral-300"><span>사용 툴 (쉼표로 구분, 최대 6개)</span><input value={tools} onChange={(event) => setTools(event.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-primary px-4 py-3" /></label>
              </div>
            </div>
          </div>

          <section className="space-y-4"><h3 className="text-[16px] font-semibold">외부 링크</h3><div className="grid gap-4 lg:grid-cols-2">
            {['ArtStation', 'Website', 'Instagram', 'YouTube'].map((label) => <label key={label} className="block space-y-2 text-[14px] text-text-secondary"><span>{label}</span><input type="url" value={links[label] ?? ''} onChange={(event) => setLinks((previous) => ({ ...previous, [label]: event.target.value }))} placeholder="https://" className="w-full rounded-lg border border-border-primary bg-surface-primary px-4 py-3" /></label>)}
          </div></section>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-12 pt-1 border-t border-transparent">
            <button onClick={resetProfile} className="px-8 py-3 rounded-lg border border-[#1F2329] bg-[#141518] hover:bg-[#1F2329] text-[14px] font-medium transition-colors text-white">
              취소
            </button>
            <button onClick={saveProfile} className="np-primary-action px-6 py-3 rounded-lg bg-brand-primary hover:bg-[#F0B43A] text-[#050505] text-[14px] font-medium transition-colors shadow-sm">
              변경사항 저장
            </button>
          </div>
        </div>

        {/* Right Nav (Preview) */}
        <div className="flex flex-col gap-[34px] lg:col-span-2 xl:col-span-1 mt-4 xl:mt-0">
          <div className="px-1 -mb-2">
            <h2 className="text-[20px] font-bold text-neutral-100 mb-2">공개 프로필 미리보기</h2>
            <p className="text-neutral-400 font-medium text-[14px]">다른 사용자에게 이렇게 표시됩니다.</p>
          </div>

          <div className="rounded-2xl border border-[#1F2329] bg-[#0A0B0D] overflow-hidden flex flex-col shadow-xl">
            <div className="h-[140px] bg-[#141518] relative">
              <img referrerPolicy="no-referrer" src={banner} alt="Banner" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/20 flex"></div>
            </div>
            
            <div className="px-5 pb-6 relative -mt-10">
              <div className="flex flex-col mb-4">
                <div className="w-[84px] h-[84px] rounded-full border-[4px] border-[#0A0B0D] bg-[#141518] overflow-hidden relative z-10 shadow-lg mb-3">
                  <img referrerPolicy="no-referrer" src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <h3 className="text-[20px] font-bold tracking-tight text-white">{nickname}</h3>
                    <div className="flex items-center justify-center text-[#050505] bg-brand-primary rounded border border-brand-primary w-[18px] h-[18px] shadow-sm">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>
                    </div>
                  </div>
                  <p className="text-[14px] text-neutral-400 font-medium leading-none mb-4">{role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[14px] text-neutral-400 font-medium mb-5">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> <span className="leading-none pt-0.5">{location}</span></div>
                <div className="flex items-center gap-1.5 hover:text-brand-primary cursor-pointer transition-colors group">
                  <Link2 className="w-3.5 h-3.5 group-hover:text-brand-primary" /> <span className="leading-none pt-0.5">외부 링크</span> <ChevronDown className="w-3.5 h-3.5 ml-px" />
                </div>
              </div>

              <p className="text-[14px] font-medium leading-[1.6] text-neutral-300 mb-6 whitespace-pre-wrap">
                {bio}
              </p>

              <div className="mb-6 grid grid-cols-2 items-center border-y border-[#1F2329] py-4 text-center sm:grid-cols-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[14px] text-neutral-400 font-medium">팔로워</span>
                  <span className="text-[17px] font-semibold text-neutral-100 tracking-tight">1.2K</span>
                </div>
                <div className="flex flex-col gap-1.5 border-l border-[#1F2329]">
                  <span className="text-[14px] text-neutral-400 font-medium">팔로잉</span>
                  <span className="text-[17px] font-semibold text-neutral-100 tracking-tight">320</span>
                </div>
                <div className="flex flex-col gap-1.5 border-l border-[#1F2329]">
                  <span className="text-[14px] text-neutral-400 font-medium">작업물</span>
                  <span className="text-[17px] font-semibold text-neutral-100 tracking-tight">48</span>
                </div>
                <div className="flex flex-col gap-1.5 border-l border-[#1F2329]">
                  <span className="text-[14px] text-neutral-400 font-medium">판매 상품</span>
                  <span className="text-[17px] font-semibold text-neutral-100 tracking-tight">24</span>
                </div>
              </div>

              {/* 대표 작업물 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[14px] font-medium text-neutral-100">대표 작업물</span>
                  <span className="text-[14px] font-medium text-brand-primary flex items-center gap-1 cursor-pointer transition-colors hover:text-[#F0B43A]">전체 보기 <ExternalLink className="w-3.5 h-3.5" /></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-[4/5] rounded-xl bg-[#141518] overflow-hidden border border-[#1F2329] group cursor-pointer shadow-sm">
                    <img referrerPolicy="no-referrer" src="/images/work_%201.png" className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                  <div className="aspect-[4/5] rounded-xl bg-[#141518] overflow-hidden border border-[#1F2329] group cursor-pointer shadow-sm">
                    <img referrerPolicy="no-referrer" src="/images/work_%205.png" className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                  <div className="aspect-[4/5] rounded-xl bg-[#141518] overflow-hidden border border-[#1F2329] group cursor-pointer shadow-sm">
                    <img referrerPolicy="no-referrer" src="/images/work_%209.png" className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </div>
              </div>

              {/* 활동 분야 */}
              <div className="mb-7">
                <span className="text-[14px] font-medium text-neutral-100 mb-3 block">활동 분야</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] font-medium text-neutral-300">Character</span>
                  <span className="px-3 py-1.5 rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] font-medium text-neutral-300">Fantasy</span>
                  <span className="px-3 py-1.5 rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] font-medium text-neutral-300">Game Asset</span>
                  <span className="px-3 py-1.5 rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] font-medium text-neutral-300">Environment</span>
                </div>
              </div>

              {/* 사용 툴 */}
              <div>
                <span className="text-[14px] font-medium text-neutral-100 mb-3 block">사용 툴</span>
                <div className="flex flex-wrap gap-2.5">
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] flex items-center justify-center font-medium text-white hover:bg-[#141518] transition-colors relative overflow-hidden group">
                       <span className="relative z-10 flex items-center"><span className="text-[#888] font-mono mr-px">Z</span>B</span>
                    </div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[15px] flex items-center justify-center font-medium text-[#E87D0D] hover:bg-[#141518] transition-colors">B</div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[15px] flex items-center justify-center font-medium text-[#0D8E9E] hover:bg-[#141518] transition-colors">M</div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] flex items-center justify-center font-medium text-[#7BB12F] hover:bg-[#141518] transition-colors">S</div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] flex items-center justify-center font-medium text-[#31A8FF] hover:bg-[#141518] transition-colors">Ps</div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[15px] flex items-center justify-center font-medium text-white hover:bg-[#141518] transition-colors">U</div>
                </div>
              </div>

            </div>
          </div>
        </div>
        </>
        ) : activeTab === 'security' ? (
          <div className="col-span-1 xl:col-span-2 rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex flex-col h-fit shadow-xl">
            <div className="mb-8">
              <h1 className="text-[24px] font-bold text-neutral-100 mb-2">계정 및 보안</h1>
              <p id="security-unavailable" className="text-text-secondary text-[14px] leading-6">인증 서버 연결 전입니다. 비밀번호 변경과 2단계 인증은 아직 사용할 수 없습니다. 실제 비밀번호를 입력하지 마세요.</p>
            </div>
            <div className="space-y-8">
              <div className="border-b border-[#1F2329] pb-8">
                <h3 className="text-[17px] font-semibold text-neutral-100 mb-6">비밀번호 변경</h3>
                <fieldset disabled aria-describedby="security-unavailable" className="space-y-4 max-w-md opacity-60">
                  <input type="password" placeholder="현재 비밀번호" className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-brand-primary hover:border-[#2A2E36] outline-none" />
                  <input type="password" placeholder="새 비밀번호" className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-brand-primary hover:border-[#2A2E36] outline-none" />
                  <input type="password" placeholder="새 비밀번호 확인" className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-brand-primary hover:border-[#2A2E36] outline-none" />
                  <button className="px-6 py-2.5 rounded-lg bg-[#141518] border border-[#1F2329] text-[14px] font-medium text-white mt-2 cursor-not-allowed">비밀번호 변경 · 준비 중</button>
                </fieldset>
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-neutral-100 mb-6">2단계 인증 (2FA)</h3>
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#1F2329] bg-[#141518]">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-neutral-100">인증기 앱 사용</span>
                    <span className="text-[14px] font-medium text-neutral-400 mt-1">로그인 시 OTP 코드를 요청하여 보안을 강화합니다.</span>
                  </div>
                  <button disabled aria-describedby="security-unavailable" className="shrink-0 ml-3 px-4 py-2 rounded-lg border border-border-primary text-text-secondary text-[14px] cursor-not-allowed">준비 중</button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'notifications' ? (
          <div className="col-span-1 xl:col-span-2 rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex flex-col h-fit shadow-xl">
            <div className="mb-8">
              <h1 className="text-[24px] font-bold text-neutral-100 mb-2">알림 설정</h1>
              <p className="text-neutral-400 font-medium text-[14px]">MVP · 설정은 이 기기에 저장됩니다. 실제 이메일·푸시 발송은 아직 연결되지 않았습니다.</p>
            </div>
            <div className="space-y-6">
              {[
                { title: '새로운 팔로워', desc: '누군가 나를 팔로우할 때 알림을 받습니다.' },
                { title: '프로젝트 댓글', desc: '내 작업물에 댓글이 달리면 알림을 받습니다.' },
                { title: '마켓 판매', desc: '내 에셋이 판매되었을 때 알림을 받습니다.' },
                { title: '마케팅 이메일', desc: '업데이트, 프로모션 및 각종 이벤트 소식을 받습니다.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-[#1F2329] last:border-0 last:pb-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-medium text-neutral-100">{item.title}</span>
                    <span className="text-[14px] font-medium text-neutral-400">{item.desc}</span>
                  </div>
                  <button role="switch" aria-checked={notificationPrefs[i]} aria-label={`${item.title} 알림`} onClick={() => setNotificationPrefs((previous) => previous.map((value, index) => index === i ? !value : value))} className="flex h-11 w-12 shrink-0 items-center justify-center">
                    <span className={`relative block h-6 w-11 rounded-full ${notificationPrefs[i] ? 'bg-brand-primary' : 'bg-border-primary'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-[#050505] transition-transform ${notificationPrefs[i] ? 'left-1 translate-x-5' : 'left-1'}`} /></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'workspace' ? (
          <div className="col-span-1 xl:col-span-2 rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex flex-col h-fit shadow-xl">
            <div className="mb-8">
              <h1 className="text-[24px] font-bold text-neutral-100 mb-2">작업 환경</h1>
              <p className="text-neutral-400 font-medium text-[14px]">UI 테마를 설정하세요. 현재는 한국어만 지원합니다.</p>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[15px] font-medium text-neutral-100">테마</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {THEME_OPTIONS.map((option) => {
                    const selected = theme === option.id;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onThemeChange(option.id)}
                        className={`relative flex min-h-[150px] flex-col rounded-xl border p-4 text-left transition ${
                          selected
                            ? 'border-brand-primary bg-brand-primary/[0.06] ring-1 ring-brand-primary/35'
                            : 'border-border-primary bg-surface-primary hover:border-brand-primary/40'
                        }`}
                      >
                        <div
                          className="mb-4 flex h-[70px] w-full overflow-hidden rounded-lg border"
                          style={{
                            backgroundColor: option.id === 'dark' ? '#0A0B0D' : '#F4F5F7',
                            borderColor: option.id === 'dark' ? '#2A2E36' : '#D9DDE5',
                          }}
                        >
                          <span
                            className="w-[28%] border-r"
                            style={{
                              backgroundColor: option.id === 'dark' ? '#111317' : '#FFFFFF',
                              borderColor: option.id === 'dark' ? '#2A2E36' : '#D9DDE5',
                            }}
                          />
                          <span className="flex flex-1 flex-col gap-2 p-2.5">
                            <span
                              className="h-2 w-[56%] rounded-full"
                              style={{ backgroundColor: option.id === 'dark' ? '#E0A12E' : '#FFB83D' }}
                            />
                            <span
                              className="h-2 w-full rounded-full"
                              style={{ backgroundColor: option.id === 'dark' ? '#252932' : '#D9DDE5' }}
                            />
                            <span
                              className="h-2 w-[78%] rounded-full"
                              style={{ backgroundColor: option.id === 'dark' ? '#252932' : '#E5E8ED' }}
                            />
                          </span>
                        </div>
                        <div className="flex w-full items-center gap-2">
                          <Icon className={`h-4 w-4 ${selected ? 'text-brand-primary' : 'text-text-secondary'}`} />
                          <span className={`text-[14px] font-semibold ${selected ? 'text-brand-primary' : 'text-text-primary'}`}>
                            {option.label}
                          </span>
                          {selected && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[#050505]">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[12px] leading-5 text-text-tertiary">
                  선택한 테마는 이 기기에 저장되며 NeoPoly 전체 화면에 바로 적용됩니다.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[15px] font-medium text-neutral-100">언어 및 지역</h3>
                <div className="relative max-w-sm">
                  <select aria-label="언어 (한국어만 지원)" disabled className="appearance-none w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-text-secondary cursor-not-allowed outline-none pr-10">
                    <option>한국어 (Korean)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-1 xl:col-span-2 rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex items-center justify-center min-h-[500px]">
             <div className="flex flex-col items-center text-center gap-4 opacity-60">
                 <Settings2 className="w-12 h-12 text-neutral-400" />
                 <div>
                    <h2 className="text-[18px] font-semibold text-neutral-100 mb-2">{navItems.find(i => i.id === activeTab)?.title}</h2>
                    <p className="text-[14px] font-medium text-neutral-400">이 페이지는 개발 진행 중입니다.</p>
                 </div>
             </div>
          </div>
        )}

          </div>
        </div>
      </main>
    </div>
  );
}
