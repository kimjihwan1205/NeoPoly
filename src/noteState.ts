import type { NoteItem } from "./components/NotesPage";
import { readJSON, writeJSON } from "./localStore";

export const NOTES_KEY = "neopoly_notes_v3";
export const NOTE_DRAFT_KEY = "neopoly_note_editor_draft_v1";

export function upsertNote(notes: NoteItem[], note: NoteItem): NoteItem[] {
  const index = notes.findIndex((item) => item.id === note.id);
  return index < 0 ? [note, ...notes] : notes.map((item) => item.id === note.id ? note : item);
}

export function saveNote(note: NoteItem, defaults: NoteItem[]): boolean {
  const current = readJSON<NoteItem[]>(NOTES_KEY, defaults);
  if (!Array.isArray(current)) return false;
  return writeJSON(NOTES_KEY, upsertNote(current, note));
}

export function parseNoteTags(input: string): string[] {
  return [...new Set(input.split(/[,#\s]+/).filter(Boolean).map((tag) => `#${tag}`))].slice(0, 16);
}

export function noteDate() {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
}
