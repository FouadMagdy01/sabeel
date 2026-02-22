export interface BookmarksTabProps {
  onVersePress: (surahId: number, page: number, ayah: number) => void;
  refreshKey?: number;
  bottomPadding?: number;
}
