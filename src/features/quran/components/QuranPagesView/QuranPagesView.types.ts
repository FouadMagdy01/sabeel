export interface QuranPagesViewProps {
  initialPage?: number;
  onPageChange?: (page: number) => void;
  highlightAyah?: { sura: number; ayah: number };
  onTap?: () => void;
}
