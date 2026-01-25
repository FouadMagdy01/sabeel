import { supabase } from '@/integrations/supabase';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  const handlePress = () => {
    void supabase.auth.getSession().then(({ data: session, error }) => {
      if (error) {
        console.error('Session error:', error);
      } else {
        console.warn('Session:', session);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text>{t('screens.home.title')}</Text>
      <Button title={t('screens.home.testButton')} onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
