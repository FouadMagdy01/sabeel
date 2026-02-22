import type { ViewType } from '@/features/quran/components/FABViewToggle';

export interface QuranSearchResultsProps {
  query: string;
  onResultPress: (surahId: number, page: number, viewType: ViewType, ayahNumber: number) => void;
  pagesReady: boolean;
}
