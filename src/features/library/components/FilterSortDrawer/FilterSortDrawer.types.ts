import type { FilterSortState } from '../../types/filter.types';

export interface FilterSortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterSortState: FilterSortState;
  onApply: (state: FilterSortState) => void;
  onReset: () => void;
}
