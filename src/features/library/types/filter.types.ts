export type SortOption = 'name-asc' | 'name-desc' | 'surah-count-desc' | 'surah-count-asc';

export interface FilterSortState {
  rewayahId: number | null;
  sortOption: SortOption;
}
