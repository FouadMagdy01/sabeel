import type { Reciter } from '../../types/api.types';

export interface ReciterCardProps {
  reciter: Reciter;
  onPress?: (reciter: Reciter) => void;
  onFavoriteToggle?: (reciter: Reciter) => void;
  isFavorited?: boolean;
  onPlay?: (reciter: Reciter) => void;
  isPlaying?: boolean;
}
