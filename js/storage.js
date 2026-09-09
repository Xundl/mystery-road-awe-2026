import { bookmarks, notesStore, STORAGE_KEY_BOOKMARKS, STORAGE_KEY_NOTES } from "../app.js";

export function saveBookmarksToStorage() {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function loadBookmarksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed = raw ? JSON.parse(raw) : [];
    bookmarks.length = 0;
    if (Array.isArray(parsed)) {
      parsed.forEach(function (id) { bookmarks.push(id); });
    }
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    bookmarks.length = 0;
  }
}

export function saveNoteForEvidence(evidenceId, text) {
  notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
}

export function loadNoteForEvidence(evidenceId) {
  return notesStore[evidenceId] || "";
}

export function loadNotesFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);
  Object.keys(notesStore).forEach(function (key) { delete notesStore[key]; });
  if (raw) {
    Object.assign(notesStore, JSON.parse(raw));
  }
}