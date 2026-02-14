import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function PrayersScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('screens.prayers.title')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
  },
});
