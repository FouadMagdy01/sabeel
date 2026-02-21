import type { Reciter } from '../../types/api.types';

export interface ReciterCardProps {
  reciter: Reciter;
  onPress?: (reciter: Reciter) => void;
}
