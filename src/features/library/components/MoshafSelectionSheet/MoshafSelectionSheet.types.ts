import type { Moshaf } from '../../types/api.types';

export interface MoshafSelectionSheetProps {
  reciterName: string;
  moshafList: Moshaf[];
  onSelect: (moshaf: Moshaf) => void;
  onFavoriteToggle?: (moshaf: Moshaf) => void;
  isMoshafFavorited?: (moshafId: number) => boolean;
  onPlay?: (moshaf: Moshaf) => void;
  isMoshafPlaying?: (moshafId: number) => boolean;
}
