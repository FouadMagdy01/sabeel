import type { Moshaf } from '../../types/api.types';

export interface MoshafSelectionSheetProps {
  reciterName: string;
  moshafList: Moshaf[];
  onSelect: (moshaf: Moshaf) => void;
}
