import type { Surah } from '../../data/surahData';

export interface SurahListItemProps {
  surah: Surah;
  onPress?: (surah: Surah) => void;
  onPlayPress?: (surah: Surah) => void;
  onFavoritePress?: (surah: Surah) => void;
  onDownloadPress?: (surah: Surah) => void;
  isFavorite?: boolean;
  isDownloaded?: boolean;
}
