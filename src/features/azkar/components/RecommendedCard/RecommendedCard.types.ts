import type { CategoryMeta } from '../../types';

export interface RecommendedCardProps {
  category: CategoryMeta;
  onPress: () => void;
}
