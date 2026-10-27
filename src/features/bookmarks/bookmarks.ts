const STORAGE_KEY = "remotion_bookmarks";

export function loadBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

// Demo 3 (immutable update): returns a NEW array and never touches the old one.
// The vanilla version did `bookmarks.push(id)` / `bookmarks.splice(idx, 1)`,
// i.e. it mutated the array in place. React compares references
// (Object.is(oldState, newState)), so a mutated array would look "unchanged".
export function toggleBookmark(bookmarks: string[], id: string): string[] {
  return bookmarks.includes(id)
    ? bookmarks.filter((b) => b !== id) // remove -> new array
    : [...bookmarks, id]; // add -> new array
}
