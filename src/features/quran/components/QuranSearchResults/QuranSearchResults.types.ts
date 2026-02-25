export interface QuranSearchResultsProps {
  query: string;
  onResultPress: (surahId: number, page: number, ayahNumber: number) => void;
}
