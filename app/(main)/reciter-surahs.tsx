import { ReciterSurahsScreen } from '@/features/library/components/ReciterSurahsScreen';
import { useLocalSearchParams } from 'expo-router';

export default function ReciterSurahsRoute() {
  const { reciterId, moshafId, reciterName, moshafName, server, surahList } = useLocalSearchParams<{
    reciterId: string;
    moshafId: string;
    reciterName: string;
    moshafName: string;
    server: string;
    surahList: string;
  }>();

  return (
    <ReciterSurahsScreen
      reciterId={Number(reciterId)}
      moshafId={Number(moshafId)}
      reciterName={reciterName ?? ''}
      moshafName={moshafName ?? ''}
      server={server ?? ''}
      surahList={surahList ?? ''}
    />
  );
}
