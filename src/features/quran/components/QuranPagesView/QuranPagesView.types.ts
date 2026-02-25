export type SelectedAyah = { sura: number; ayah: number };

export interface QuranPagesViewRef {
  scrollToPage: (page: number) => void;
}

export interface QuranPagesViewProps {
  initialPage?: number;
  onPageChange?: (page: number) => void;
  highlightAyah?: { sura: number; ayah: number };
  onTap?: () => void;
  onTafseer?: (ayahs: SelectedAyah[]) => void;
  onShare?: (ayahs: SelectedAyah[]) => void;
}
