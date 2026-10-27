import { createContext, useContext, useState, type ReactNode } from "react";
import { loadBookmarks, saveBookmarks, toggleBookmark } from "./bookmarks";

interface BookmarksValue {
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

const BookmarksContext = createContext<BookmarksValue | null>(null);

// Demo 5: the ONE place where the bookmark state lives (lifted state).
// Demo 8: exposed through Context, so Dashboard, Evidence and Workspace
// can read it without drilling props through App.
export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(loadBookmarks);

  // Demo 6: this callback contains the real setter.
  const onToggleBookmark = (id: string) => {
    const next = toggleBookmark(bookmarks, id); // Demo 3: new array
    setBookmarks(next);
    saveBookmarks(next);
  };

  return (
    <BookmarksContext.Provider value={{ bookmarks, onToggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks(): BookmarksValue {
  const value = useContext(BookmarksContext);
  if (!value)
    throw new Error("useBookmarks must be used inside BookmarksProvider");
  return value;
}
