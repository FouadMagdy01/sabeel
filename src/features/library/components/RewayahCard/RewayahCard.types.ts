import type { Rewayah } from '../../types/api.types';

export interface RewayahCardProps {
  rewayah: Rewayah;
  onPress?: (rewayah: Rewayah) => void;
}
