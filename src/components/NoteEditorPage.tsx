import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Save, X } from "lucide-react";
import NoteSidebar from "./NoteSidebar";
import { NOTES, type NoteItem } from "./NotesPage";
import { NOTE_DRAFT_KEY, noteDate, parseNoteTags, saveNote } from "../noteState";
import { removeStoredValue, useStoredState } from "../localStore";

type Draft = { id: number; title: string; desc: string; tags: string; images: string[] };

export default function NoteEditorPage({ onNavigate, initialNote = null }: {
  onNavigate: (page: string) => void;
  initialNote?: NoteItem | null;
}) {
  const [draft, setDraft] = useStoredState<Draft>(`${NOTE_DRAFT_KEY}:${initialNote?.id ?? "new"}`, () => ({
    id: initialNote?.id ?? Date.now(), title: initialNote?.title ?? "", desc: initialNote?.desc ?? "",
    tags: initialNote?.tags.join(" ") ?? "", images: initialNote?.images ?? [],
  }));
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isReading, setIsReading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const committed = useRef(false);
  useEffect(() => {
    const discardCommittedDraft = () => {
      if (committed.current) removeStoredValue(`${NOTE_DRAFT_KEY}:${initialNote?.id ?? "new"}`);
    };
    window.addEventListener("pagehide", discardCommittedDraft);
    return () => {
      window.removeEventListener("pagehide", discardCommittedDraft);
      discardCommittedDraft();
    };
  }, [initialNote?.id]);
  const update = (patch: Partial<Draft>) => {
    committed.current = false;
    if (setDraft((current) => ({ ...current, ...patch }))) {
      setStatus("이 기기에 임시 저장됨"); setError("");
    } else setError("임시 저장 공간이 부족합니다. 이미지 용량을 줄여 주세요.");
  };
  const save = useCallback(() => {
    if (!draft.title.trim()) { setError("노트 제목을 입력해 주세요."); return false; }
    const note: NoteItem = {
      ...initialNote, id: draft.id, title: draft.title.trim(), desc: draft.desc,
      tags: parseNoteTags(draft.tags), images: draft.images, date: noteDate(),
      starred: initialNote?.starred ?? false,
      authorImage: initialNote?.authorImage ?? "/images/profile/UserProfile.png",
    };
    if (!saveNote(note, NOTES)) { setError("저장하지 못했습니다. 기기 저장 공간을 확인해 주세요."); return false; }
    committed.current = true;
    setError(""); setStatus("노트 저장 완료 · 보드에 반영됨");
    return true;
  }, [draft, initialNote]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault(); save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);
  const addImageUrl = () => {
    const value = imageUrl.trim();
    if (!/^(https:\/\/|\/images\/)/.test(value)) {
      setError("https:// 이미지 주소 또는 /images/ 경로를 입력해 주세요."); return;
    }
    if (draft.images.length >= 12) { setError("이미지는 최대 12장까지 추가할 수 있습니다."); return; }
    update({ images: [...new Set([...draft.images, value])] }); setImageUrl("");
  };
  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files);
    if (selected.some((file) => !/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 750 * 1024)) {
      setError("PNG·JPG·WebP 이미지를 장당 750KB 이하로 선택해 주세요."); return;
    }
    if (draft.images.length + selected.length > 12) { setError("한 노트에 이미지를 최대 12장까지 추가할 수 있습니다."); return; }
    setIsReading(true);
    try {
      const images = await Promise.all(selected.map((file) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file);
      })));
      if (setDraft((current) => ({ ...current, images: [...new Set([...current.images, ...images])] }))) {
        committed.current = false;
        setError(""); setStatus("이미지 임시 저장됨");
      } else setError("이미지를 저장할 공간이 부족합니다. 더 작은 이미지를 선택해 주세요.");
    } catch { setError("이미지를 읽을 수 없습니다. 다른 파일을 선택해 주세요."); }
    finally { setIsReading(false); if (fileRef.current) fileRef.current.value = ""; }
  };
  return (
    <div className="np-workspace-shell flex h-[calc(100dvh-60px)] min-w-0 overflow-hidden bg-bg-dark font-sans text-text-primary lg:h-[calc(100dvh-76px)]">
      <NoteSidebar onNavigate={onNavigate} mode="editor" editorTitle={draft.title} isNewNote={!initialNote} />
      <main className="min-w-0 flex-1 overflow-y-auto custom-scrollbar">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-border-soft bg-surface-primary px-4 py-3 sm:px-6">
          <button type="button" onClick={() => onNavigate("notes")} className="flex min-h-10 items-center gap-2 text-[14px] text-text-secondary hover:text-text-primary">
            <ArrowLeft className="h-4 w-4" /> 노트 목록
          </button>
          <button type="button" disabled={isReading} onClick={save} className="np-primary-action flex min-h-11 items-center gap-2 rounded-lg bg-brand-primary px-4 text-[14px] font-semibold text-[#050505] disabled:opacity-50">
            <Save className="h-4 w-4" /> 노트 저장
          </button>
        </header>
        <form className="mx-auto flex w-full max-w-[1040px] flex-col gap-6 px-4 py-6 sm:px-6" onSubmit={(event) => { event.preventDefault(); save(); }}>
          <div>
            <h1 className="text-[20px] font-semibold leading-[30px]">{initialNote ? "노트 편집" : "새 노트"}</h1>
            <p className="mt-1 text-[12px] leading-[18px] text-text-secondary">입력은 기기에 임시 저장됩니다. ‘노트 저장’을 눌러 보드에 반영하세요. 클라우드 동기화는 지원하지 않습니다.</p>
          </div>
          <div aria-live="polite" className="min-h-[24px] text-[14px] text-text-secondary">
            {error ? <p role="alert" className="text-red-400">{error}</p> : status && <p className="flex items-center gap-2"><Check className="h-4 w-4" />{status}</p>}
          </div>
          <label className="space-y-2 text-[14px] font-medium">
            <span>제목 <span className="text-text-secondary">(필수)</span></span>
            <input value={draft.title} onChange={(event) => update({ title: event.target.value })} maxLength={120} required placeholder="제목을 입력하세요" className="block w-full rounded-lg border border-border-primary bg-surface-primary px-4 py-3 text-[20px] font-semibold leading-[30px] outline-none focus:border-brand-primary" />
          </label>
          <label className="space-y-2 text-[14px] font-medium">
            <span>내용</span>
            <textarea value={draft.desc} onChange={(event) => update({ desc: event.target.value })} placeholder="아이디어와 작업 메모를 적어 보세요." rows={10} maxLength={30000} className="block min-h-[280px] w-full resize-y rounded-lg border border-border-primary bg-surface-primary p-4 text-[16px] font-normal leading-7 outline-none focus:border-brand-primary" />
          </label>
          <label className="space-y-2 text-[14px] font-medium">
            <span>태그</span>
            <input value={draft.tags} onChange={(event) => update({ tags: event.target.value })} placeholder="#캐릭터 #컨셉 · 쉼표 또는 공백으로 구분" maxLength={300} className="block w-full rounded-lg border border-border-primary bg-surface-primary px-4 py-3 font-normal outline-none focus:border-brand-primary" />
          </label>
          <section aria-labelledby="note-images-title" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="note-images-title" className="text-[16px] font-semibold">레퍼런스 이미지 <span className="text-text-secondary">{draft.images.length}</span></h2>
              <button type="button" disabled={isReading} onClick={() => fileRef.current?.click()} className="flex min-h-10 items-center gap-2 rounded-md border border-border-primary px-3 text-[14px] hover:bg-surface-secondary"><ImagePlus className="h-4 w-4" />{isReading ? "읽는 중…" : "이미지 추가"}</button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={(event) => void uploadImages(event.target.files)} />
            </div>
            <p className="text-[12px] leading-[18px] text-text-secondary">PNG·JPG·WebP · 장당 750KB 이하 · 최대 12장. 큰 이미지는 이미지 주소로 추가할 수 있습니다.</p>
            <div className="flex gap-2">
              <input aria-label="레퍼런스 이미지 주소" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https:// 이미지 주소" className="min-w-0 flex-1 rounded-lg border border-border-primary bg-surface-primary px-3 py-2 text-[14px]" />
              <button type="button" onClick={addImageUrl} className="min-h-11 shrink-0 rounded-lg border border-border-primary px-3 text-[14px] hover:bg-surface-secondary">주소 추가</button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {draft.images.map((image, index) => <div key={image} className="relative overflow-hidden rounded-lg border border-border-soft bg-surface-primary">
                <img src={image} alt={`노트 레퍼런스 ${index + 1}`} className="aspect-[4/3] w-full object-contain" />
                <button type="button" aria-label={`레퍼런스 ${index + 1} 제거`} onClick={() => update({ images: draft.images.filter((item) => item !== image) })} className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white"><X className="h-4 w-4" /></button>
              </div>)}
            </div>
          </section>
          <div className="flex justify-end border-t border-border-soft pt-5">
            <button type="button" onClick={() => { if (save()) onNavigate("notes"); }} className="np-primary-action min-h-11 rounded-lg bg-brand-primary px-5 text-[14px] font-semibold text-[#050505]">저장하고 목록으로</button>
          </div>
        </form>
      </main>
    </div>
  );
}
