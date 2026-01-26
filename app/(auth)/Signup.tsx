import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

export default function SignupScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text>{t('screens.auth.signup')}</Text>
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
