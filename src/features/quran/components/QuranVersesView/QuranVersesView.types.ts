export interface QuranVersesViewProps {
  initialPage?: number;
  onPageChange?: (page: number) => void;
  highlightAyah?: { sura: number; ayah: number };
}
