export type LastReadInfo = {
  page: number;
  surahId: number;
  timestamp: number;
};

export interface ContinueReadingCardProps {
  lastRead: LastReadInfo;
  onPress: () => void;
}
