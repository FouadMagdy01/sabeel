import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text>{t('screens.auth.login')}</Text>
      <Text>{t('screens.auth.login')}</Text>
      <Text>{t('screens.auth.login')}</Text>
      <Text>{t('screens.auth.login')}</Text>
      <Text>{t('screens.auth.login')}</Text>
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
