export type ViewType = 'pages' | 'verses';

export interface FABViewToggleProps {
  viewType: ViewType;
  onToggle: () => void;
  visible?: boolean;
  bottomOffset?: number;
}
