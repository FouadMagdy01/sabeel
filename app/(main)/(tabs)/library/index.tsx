import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function LibraryScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text>{t('screens.library.title')}</Text>
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
