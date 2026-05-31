import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Settings2, Store, CreditCard, ExternalLink, Camera, ChevronDown, X, Plus, MapPin, Link2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AccountSettingsPageProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function AccountSettingsPage({ userProfile, setUserProfile }: AccountSettingsPageProps) {
  const [nickname, setNickname] = useState('Jisu');
  const [name, setName] = useState('지수');
  const [bio, setBio] = useState('3D 캐릭터와 판타지 세계관을 중심으로 작업하고 있습니다.\n게임과 영화 스타일의 퀄리티 높은 에셋을 제작합니다.');
  const [location, setLocation] = useState('Seoul, Korea');
  const [role, setRole] = useState('3D Character Artist');
  const [activeTab, setActiveTab] = useState('profile');

  const navItems = [
    { icon: User, title: '프로필', desc: '공개 프로필 및 기본 정보', id: 'profile' },
    { icon: Lock, title: '계정 / 보안', desc: '이메일, 비밀번호, 2단계 인증', id: 'security' },
    { icon: Bell, title: '알림', desc: '이메일, 푸시 알림 설정', id: 'notifications' },
    { icon: Globe, title: '공개 범위', desc: '프로필 및 콘텐츠 공개 설정', id: 'visibility' },
    { icon: Settings2, title: '작업 환경', desc: 'UI, 기본 설정, 파일 옵션', id: 'workspace' },
    { icon: Store, title: '마켓 / 판매자', desc: '판매자 정보 및 라이선스', id: 'seller' },
    { icon: CreditCard, title: '결제 / 구독', desc: '플랜, 결제 수단, 구독 관리', id: 'billing' },
  ];

  return (
    <div className="flex h-[calc(100vh-76px)] overflow-hidden bg-[#050505] font-sans w-full text-white">
      {/* Left Nav (Sidebar) */}
      <aside className="w-[240px] xl:w-[260px] border-r border-[#1F2329] h-full flex flex-col shrink-0 px-6 py-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-[22px] font-bold tracking-tight text-neutral-100 mb-6 px-1">계정 설정</h2>
        <div className="space-y-1.5 mb-12">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all ${
                activeTab === item.id
                  ? 'border-[#E0A12E]/30 bg-[#16140D] relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-[60%] after:bg-[#E0A12E] after:rounded-r-full shadow-sm'
                  : 'border-transparent hover:bg-[#141518]'
              }`}
            >
              <div className={`w-[22px] flex justify-center ${activeTab === item.id ? 'text-[#E0A12E]' : 'text-neutral-400'}`}>
                <item.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={`text-[14px] font-bold ${activeTab === item.id ? 'text-[#E0A12E]' : 'text-neutral-300'}`}>{item.title}</span>
                <span className={`text-[12px] opacity-80 ${activeTab === item.id ? 'text-neutral-400' : 'text-neutral-400'}`}>{item.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="border border-[#1F2329] rounded-xl p-5 bg-[#0A0B0D] mt-auto">
          <h3 className="font-bold text-[14px] text-neutral-200 mb-2">도움이 필요하신가요?</h3>
          <p className="text-[13px] text-neutral-400 leading-relaxed mb-5">고객센터에서 계정 관련<br/>도움을 받아보세요.</p>
          <button className="flex items-center justify-center w-full gap-2 text-[13px] font-bold text-[#E0A12E] border border-[#E0A12E]/40 rounded-lg px-4 py-2.5 hover:bg-[#E0A12E]/10 transition-colors">
            고객센터 바로가기 <ExternalLink className="w-3.5 h-3.5 gap-1 shrink-0" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,_1fr)_340px] 2xl:grid-cols-[minmax(0,_1fr)_360px] gap-6 xl:gap-8">
            
            {/* Middle Content */}
        {activeTab === 'profile' ? (
          <>
            <div className="rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex flex-col h-fit shadow-xl">
              <div className="mb-8">
                <h1 className="text-[22px] font-bold text-neutral-100 mb-2">프로필 편집</h1>
                <p className="text-neutral-400 font-medium text-[14px]">다른 사용자에게 공개되는 정보를 관리하세요.</p>
              </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-10 gap-y-8 border-b border-[#1F2329] pb-8 mb-8">
            <div className="flex flex-col gap-4">
              <span className="text-[15px] font-bold text-neutral-100">프로필 이미지</span>
              <div className="relative w-[150px] h-[150px] rounded-full border border-[#1F2329] bg-[#141518] overflow-hidden shrink-0 group mx-auto md:mx-0">
                <img referrerPolicy="no-referrer" src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                <button className="absolute bottom-2 right-2 w-[34px] h-[34px] rounded-full border border-[#1F2329] bg-[#0A0B0D]/80 backdrop-blur flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#141518] transition-all">
                  <Camera className="w-[16px] h-[16px]" strokeWidth={2} />
                </button>
              </div>
              <span className="text-[12px] text-neutral-400 font-medium">권장 사이즈 512x512, JPG 또는 PNG (최대 10MB)</span>
            </div>

            <div className="flex flex-col gap-4 min-w-0">
              <span className="text-[15px] font-bold text-neutral-100">배너 이미지</span>
              <div className="relative h-[150px] w-full rounded-[14px] border border-[#1F2329] bg-[#141518] overflow-hidden group">
                <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2016.png" alt="Banner" className="w-full h-full object-cover opacity-70" />
                <button className="absolute bottom-3 right-3 w-[34px] h-[34px] rounded-full border border-[#1F2329] bg-[#0A0B0D]/80 backdrop-blur flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#141518] transition-all">
                  <Camera className="w-[16px] h-[16px]" strokeWidth={2} />
                </button>
              </div>
              <span className="text-[12px] text-neutral-400 font-medium">권장 사이즈 1920x480, JPG 또는 PNG (최대 10MB)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pb-8 border-b border-[#1F2329]">
            {/* 기본 정보 */}
            <div className="space-y-6">
              <h3 className="text-[17px] font-bold text-neutral-100 mb-6">기본 정보</h3>
              
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-[13.5px] font-semibold text-neutral-300">닉네임 <span className="text-[#E46B6B]">*</span></label>
                  <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-[#E0A12E] hover:border-[#2A2E36] outline-none transition-colors" />
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-[13.5px] font-semibold text-neutral-300">이름</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-[#E0A12E] hover:border-[#2A2E36] outline-none transition-colors" />
                </div>

                <div className="space-y-2.5">
                  <label className="text-[13.5px] font-semibold text-neutral-300">소개 문구</label>
                  <div className="relative flex flex-col">
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium leading-[1.6] text-neutral-300 focus:border-[#E0A12E] hover:border-[#2A2E36] outline-none transition-colors min-h-[120px] resize-none" />
                    <span className="text-[12px] text-neutral-400 font-medium text-right mt-1.5">{bio.length} / 200</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[13.5px] font-semibold text-neutral-300">위치</label>
                  <div className="relative">
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} readOnly className="w-full bg-[#050505] border border-[#1F2329] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-neutral-100 focus:border-[#E0A12E] hover:border-[#2A2E36] outline-none transition-colors cursor-pointer" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* 크리에이터 정보 */}
            <div className="space-y-6">
              <h3 className="text-[17px] font-bold text-neutral-100 mb-6">크리에이터 정보</h3>
              
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-[13.5px] font-semibold text-neutral-300">직군</label>
                  <div className="relative">
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} readOnly className="w-full bg-[#050505] border border-[#1F2329] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-neutral-100 focus:border-[#E0A12E] hover:border-[#2A2E36] outline-none transition-colors cursor-pointer" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[13.5px] font-semibold text-neutral-300">전문 분야 (최대 5개)</label>
                  <div className="w-full bg-[#050505] border border-[#1F2329] hover:border-[#2A2E36] transition-colors rounded-lg p-3 min-h-[90px] flex flex-wrap content-start gap-2 relative">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">Character <X className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-white" /></div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">Fantasy <X className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-white" /></div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">Game Asset <X className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-white" /></div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">Environment <X className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-white" /></div>
                    <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-neutral-400 cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[13.5px] font-semibold text-neutral-300">사용 툴 (최대 6개)</label>
                  <div className="w-full bg-[#050505] border border-[#1F2329] hover:border-[#2A2E36] transition-colors rounded-lg p-3 min-h-[110px] flex flex-wrap content-start gap-2 relative">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">
                      <div className="w-[18px] h-[18px] rounded text-[10px] flex items-center justify-center font-bold bg-[#333] text-white">Z</div> ZBrush
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">
                      <div className="w-[18px] h-[18px] rounded text-[10px] flex items-center justify-center font-bold bg-[#E87D0D] text-white">B</div> Blender
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">
                      <div className="w-[18px] h-[18px] rounded text-[10px] flex items-center justify-center font-bold bg-[#0D8E9E] text-white">M</div> Maya
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">
                      <div className="w-[18px] h-[18px] rounded text-[10px] flex items-center justify-center font-bold bg-[#7BB12F] text-white">S3</div> Substance 3D
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">
                      <div className="w-[18px] h-[18px] rounded text-[10px] flex items-center justify-center font-bold bg-[#31A8FF] text-[#050505]">Ps</div> Photoshop
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141518] border border-[#1F2329] rounded-md text-[13px] font-medium text-neutral-300">
                      <div className="w-[18px] h-[18px] rounded text-[10px] flex items-center justify-center font-bold bg-[#fff] text-[#050505]">U</div> Unreal Engine
                    </div>
                    <button className="flex items-center justify-center w-[34px] h-[34px] bg-[#141518] hover:bg-[#1F2329] border border-[#1F2329] rounded-md text-neutral-400 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 외부 링크 */}
          <div className="space-y-5">
            <h3 className="text-[17px] font-bold text-neutral-100">외부 링크</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-4">
              <div className="flex items-center gap-4">
                <span className="w-[70px] text-[13.5px] font-semibold text-neutral-400 shrink-0">ArtStation</span>
                <div className="flex-1 relative">
                  <input type="text" value="https://www.artstation.com/jisu" readOnly className="w-full bg-[#050505] border border-[#1F2329] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-neutral-300" />
                  <X className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 hover:text-neutral-300 cursor-pointer" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-[70px] text-[13.5px] font-semibold text-neutral-400 shrink-0">Website</span>
                <div className="flex-1 relative">
                  <input type="text" value="https://www.jisu3d.com" readOnly className="w-full bg-[#050505] border border-[#1F2329] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-neutral-300" />
                  <X className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 hover:text-neutral-300 cursor-pointer" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-[70px] text-[13.5px] font-semibold text-neutral-400 shrink-0">Instagram</span>
                <div className="flex-1 relative">
                  <input type="text" value="https://www.instagram.com/jisu_3d" readOnly className="w-full bg-[#050505] border border-[#1F2329] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-neutral-300" />
                  <X className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 hover:text-neutral-300 cursor-pointer" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-[70px] text-[13.5px] font-semibold text-neutral-400 shrink-0">Twitter</span>
                <div className="flex-1 relative">
                  <input type="text" value="https://twitter.com/jisu_3d" readOnly className="w-full bg-[#050505] border border-[#1F2329] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-neutral-300" />
                  <X className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 hover:text-neutral-300 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-12 pt-1 border-t border-transparent">
            <button className="px-8 py-3 rounded-lg border border-[#1F2329] bg-[#141518] hover:bg-[#1F2329] text-[14px] font-bold transition-colors text-white">
              취소
            </button>
            <button className="px-6 py-3 rounded-lg bg-[#E0A12E] hover:bg-[#F0B43A] text-[#050505] text-[14px] font-extrabold transition-colors shadow-sm">
              변경사항 저장
            </button>
          </div>
        </div>

        {/* Right Nav (Preview) */}
        <div className="flex flex-col gap-[34px] lg:col-span-2 xl:col-span-1 mt-4 xl:mt-0">
          <div className="px-1 -mb-2">
            <h2 className="text-[19px] font-bold text-neutral-100 mb-2">공개 프로필 미리보기</h2>
            <p className="text-neutral-400 font-medium text-[14px]">다른 사용자에게 이렇게 표시됩니다.</p>
          </div>

          <div className="rounded-2xl border border-[#1F2329] bg-[#0A0B0D] overflow-hidden flex flex-col shadow-xl">
            <div className="h-[140px] bg-[#141518] relative">
              <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%2016.png" alt="Banner" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/20 flex"></div>
            </div>
            
            <div className="px-5 pb-6 relative -mt-10">
              <div className="flex flex-col mb-4">
                <div className="w-[84px] h-[84px] rounded-full border-[4px] border-[#0A0B0D] bg-[#141518] overflow-hidden relative z-10 shadow-lg mb-3">
                  <img referrerPolicy="no-referrer" src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <h3 className="text-[20px] font-extrabold tracking-tight text-white">{nickname}</h3>
                    <div className="flex items-center justify-center text-[#050505] bg-[#E0A12E] rounded border border-[#E0A12E] w-[18px] h-[18px] shadow-sm">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>
                    </div>
                  </div>
                  <p className="text-[13px] text-neutral-400 font-medium leading-none mb-4">{role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[12px] text-neutral-400 font-medium mb-5">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> <span className="leading-none pt-0.5">{location}</span></div>
                <div className="flex items-center gap-1.5 hover:text-[#E0A12E] cursor-pointer transition-colors group">
                  <Link2 className="w-3.5 h-3.5 group-hover:text-[#E0A12E]" /> <span className="leading-none pt-0.5">artstation.com/jisu</span> <ChevronDown className="w-3.5 h-3.5 ml-px" />
                </div>
              </div>

              <p className="text-[13.5px] font-medium leading-[1.6] text-neutral-300 mb-6 whitespace-pre-wrap">
                {bio}
              </p>

              <div className="grid grid-cols-4 items-center py-4 border-y border-[#1F2329] mb-6 text-center">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-neutral-400 font-bold">팔로워</span>
                  <span className="text-[17px] font-bold text-neutral-100 tracking-tight">1.2K</span>
                </div>
                <div className="flex flex-col gap-1.5 border-l border-[#1F2329]">
                  <span className="text-[11px] text-neutral-400 font-bold">팔로잉</span>
                  <span className="text-[17px] font-bold text-neutral-100 tracking-tight">320</span>
                </div>
                <div className="flex flex-col gap-1.5 border-l border-[#1F2329]">
                  <span className="text-[11px] text-neutral-400 font-bold">작업물</span>
                  <span className="text-[17px] font-bold text-neutral-100 tracking-tight">48</span>
                </div>
                <div className="flex flex-col gap-1.5 border-l border-[#1F2329]">
                  <span className="text-[11px] text-neutral-400 font-bold">판매 상품</span>
                  <span className="text-[17px] font-bold text-neutral-100 tracking-tight">24</span>
                </div>
              </div>

              {/* 대표 작업물 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13.5px] font-bold text-neutral-100">대표 작업물</span>
                  <span className="text-[12px] font-bold text-[#E0A12E] flex items-center gap-1 cursor-pointer transition-colors hover:text-[#F0B43A]">전체 보기 <ExternalLink className="w-3.5 h-3.5" /></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-[4/5] rounded-xl bg-[#141518] overflow-hidden border border-[#1F2329] group cursor-pointer shadow-sm">
                    <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%201.png" className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                  <div className="aspect-[4/5] rounded-xl bg-[#141518] overflow-hidden border border-[#1F2329] group cursor-pointer shadow-sm">
                    <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%205.png" className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                  <div className="aspect-[4/5] rounded-xl bg-[#141518] overflow-hidden border border-[#1F2329] group cursor-pointer shadow-sm">
                    <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/kimjihwan1205/NeoPoly/main/work_%209.png" className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </div>
              </div>

              {/* 활동 분야 */}
              <div className="mb-7">
                <span className="text-[13.5px] font-bold text-neutral-100 mb-3 block">활동 분야</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-[10px] border border-[#1F2329] bg-transparent text-[11px] font-medium text-neutral-300">Character</span>
                  <span className="px-3 py-1.5 rounded-[10px] border border-[#1F2329] bg-transparent text-[11px] font-medium text-neutral-300">Fantasy</span>
                  <span className="px-3 py-1.5 rounded-[10px] border border-[#1F2329] bg-transparent text-[11px] font-medium text-neutral-300">Game Asset</span>
                  <span className="px-3 py-1.5 rounded-[10px] border border-[#1F2329] bg-transparent text-[11px] font-medium text-neutral-300">Environment</span>
                </div>
              </div>

              {/* 사용 툴 */}
              <div>
                <span className="text-[13.5px] font-bold text-neutral-100 mb-3 block">사용 툴</span>
                <div className="flex flex-wrap gap-2.5">
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[12px] flex items-center justify-center font-black text-white hover:bg-[#141518] transition-colors relative overflow-hidden group">
                       <span className="relative z-10 flex items-center"><span className="text-[#888] font-mono mr-px">Z</span>B</span>
                    </div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[16px] flex items-center justify-center font-extrabold text-[#E87D0D] hover:bg-[#141518] transition-colors">B</div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[16px] flex items-center justify-center font-black text-[#0D8E9E] hover:bg-[#141518] transition-colors">M</div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] flex items-center justify-center font-extrabold text-[#7BB12F] hover:bg-[#141518] transition-colors">S</div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[14px] flex items-center justify-center font-bold text-[#31A8FF] hover:bg-[#141518] transition-colors">Ps</div>
                    <div className="w-[34px] h-[34px] rounded-[10px] border border-[#1F2329] bg-transparent text-[16px] flex items-center justify-center font-black text-white hover:bg-[#141518] transition-colors">U</div>
                </div>
              </div>

            </div>
          </div>
        </div>
        </>
        ) : activeTab === 'security' ? (
          <div className="col-span-1 xl:col-span-2 rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex flex-col h-fit shadow-xl">
            <div className="mb-8">
              <h1 className="text-[22px] font-bold text-neutral-100 mb-2">계정 및 보안</h1>
              <p className="text-neutral-400 font-medium text-[14px]">비밀번호 변경 및 2단계 인증을 관리하세요.</p>
            </div>
            <div className="space-y-8">
              <div className="border-b border-[#1F2329] pb-8">
                <h3 className="text-[17px] font-bold text-neutral-100 mb-6">비밀번호 변경</h3>
                <div className="space-y-4 max-w-md">
                  <input type="password" placeholder="현재 비밀번호" className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-[#E0A12E] hover:border-[#2A2E36] outline-none" />
                  <input type="password" placeholder="새 비밀번호" className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-[#E0A12E] hover:border-[#2A2E36] outline-none" />
                  <input type="password" placeholder="새 비밀번호 확인" className="w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-[#E0A12E] hover:border-[#2A2E36] outline-none" />
                  <button className="px-6 py-2.5 rounded-lg bg-[#141518] hover:bg-[#1F2329] border border-[#1F2329] text-[14px] font-bold transition-colors text-white mt-2">비밀번호 업데이트</button>
                </div>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-neutral-100 mb-6">2단계 인증 (2FA)</h3>
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#1F2329] bg-[#141518]">
                  <div className="flex flex-col">
                    <span className="text-[14.5px] font-bold text-neutral-100">인증기 앱 사용</span>
                    <span className="text-[13px] font-medium text-neutral-400 mt-1">로그인 시 OTP 코드를 요청하여 보안을 강화합니다.</span>
                  </div>
                  <button className="px-5 py-2 rounded-lg bg-[#E0A12E] hover:bg-[#F0B43A] text-[#050505] text-[13px] font-bold transition-colors shadow-sm">설정하기</button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'notifications' ? (
          <div className="col-span-1 xl:col-span-2 rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex flex-col h-fit shadow-xl">
            <div className="mb-8">
              <h1 className="text-[22px] font-bold text-neutral-100 mb-2">알림 설정</h1>
              <p className="text-neutral-400 font-medium text-[14px]">이메일 및 푸시 알림 수신 여부를 설정하세요.</p>
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
                    <span className="text-[14.5px] font-bold text-neutral-100">{item.title}</span>
                    <span className="text-[13px] font-medium text-neutral-400">{item.desc}</span>
                  </div>
                  <div className="w-11 h-6 rounded-full bg-[#E0A12E] relative cursor-pointer flex items-center px-1">
                     <div className="w-4 h-4 rounded-full bg-[#050505] absolute right-1 shadow-sm"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'workspace' ? (
          <div className="col-span-1 xl:col-span-2 rounded-[16px] border border-[#1F2329] bg-[#0A0B0D] p-6 flex flex-col h-fit shadow-xl">
            <div className="mb-8">
              <h1 className="text-[22px] font-bold text-neutral-100 mb-2">작업 환경</h1>
              <p className="text-neutral-400 font-medium text-[14px]">UI 테마, 언어 및 기본 파일 포맷을 설정하세요.</p>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[15px] font-bold text-neutral-100">테마</h3>
                <div className="flex gap-4">
                  <button className="flex-1 p-4 rounded-xl border-2 border-[#E0A12E] bg-[#141518] flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#050505] border border-[#2A2E36] shadow-inner"></div>
                    <span className="text-[13.5px] font-bold text-[#E0A12E]">다크 모드</span>
                  </button>
                  <button className="flex-1 p-4 rounded-xl border border-[#1F2329] bg-[#141518] flex flex-col items-center justify-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] shadow-sm"></div>
                    <span className="text-[13.5px] font-bold text-neutral-400">라이트 모드 (준비중)</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[15px] font-bold text-neutral-100">언어 및 지역</h3>
                <div className="relative max-w-sm">
                  <select className="appearance-none w-full bg-[#050505] border border-[#1F2329] rounded-lg px-4 py-3 text-[14px] font-medium text-neutral-100 focus:border-[#E0A12E] outline-none pr-10">
                    <option>한국어 (Korean)</option>
                    <option>English (US)</option>
                    <option>日本語 (Japanese)</option>
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
                    <h2 className="text-[18px] font-bold text-neutral-100 mb-2">{navItems.find(i => i.id === activeTab)?.title}</h2>
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
