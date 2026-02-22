import { getItem, setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';

export type Bookmark = {
  verseKey: string;
  timestamp: number;
};

function loadBookmarks(): Bookmark[] {
  const result = getItem<Bookmark[]>(STORAGE_KEYS.quran.bookmarks);
  return result.data ?? [];
}

function saveBookmarks(bookmarks: Bookmark[]): void {
  setItem(STORAGE_KEYS.quran.bookmarks, bookmarks);
}

export function getBookmarks(): Bookmark[] {
  return loadBookmarks();
}

export function addBookmark(verseKey: string): void {
  const bookmarks = loadBookmarks();
  if (bookmarks.some((b) => b.verseKey === verseKey)) return;
  bookmarks.push({ verseKey, timestamp: Date.now() });
  saveBookmarks(bookmarks);
}

export function removeBookmark(verseKey: string): void {
  const bookmarks = loadBookmarks().filter((b) => b.verseKey !== verseKey);
  saveBookmarks(bookmarks);
}

export function isBookmarked(verseKey: string): boolean {
  return loadBookmarks().some((b) => b.verseKey === verseKey);
}
