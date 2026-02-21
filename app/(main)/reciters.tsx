import { AllRecitersScreen } from '@/features/library/components/AllRecitersScreen';
import { useLocalSearchParams } from 'expo-router';

export default function RecitersRoute() {
  const { rewayaId } = useLocalSearchParams<{ rewayaId?: string }>();
  return <AllRecitersScreen initialRewayaId={rewayaId ? Number(rewayaId) : undefined} />;
}
