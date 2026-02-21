import type { Reciter } from '../types/api.types';
import type { SortOption } from '../types/filter.types';

export function sortReciters(reciters: Reciter[], sortOption: SortOption): Reciter[] {
  const sorted = [...reciters];
  switch (sortOption) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'surah-count-desc':
      return sorted.sort(
        (a, b) => (b.moshaf[0]?.surah_total ?? 0) - (a.moshaf[0]?.surah_total ?? 0)
      );
    case 'surah-count-asc':
      return sorted.sort(
        (a, b) => (a.moshaf[0]?.surah_total ?? 0) - (b.moshaf[0]?.surah_total ?? 0)
      );
    default:
      return sorted;
  }
}
