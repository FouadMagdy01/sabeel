import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/common/components/Button';
import CircularProgress from '@/common/components/CircularProgress/CircularProgress';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { useQuranDownload } from '../../hooks/useQuranDownload';

export function QuranDownloadPrompt({ onReady }: { onReady: () => void }) {
  const { status, progress, error, isReady, startDownload, cancelDownload } = useQuranDownload();
  const { t } = useTranslation();

  useEffect(() => {
    if (isReady) onReady();
  }, [isReady, onReady]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {status === 'loading' && (
          <CircularProgress progress={0} size={40} strokeWidth={4} indeterminate />
        )}

        {status === 'idle' && (
          <>
            <Icon familyName="MaterialIcons" iconName="menu-book" size={64} variant="muted" />
            <Typography type="heading" size="md" style={styles.title}>
              {t('screens.quran.download.title')}
            </Typography>
            <Typography type="body" size="sm" style={styles.subtitle}>
              {t('screens.quran.download.subtitle')}
            </Typography>
            {error && (
              <Typography type="body" size="sm" style={styles.error}>
                {error}
              </Typography>
            )}
            <Button onPress={startDownload}>{t('screens.quran.download.button')}</Button>
          </>
        )}

        {status === 'downloading' && (
          <>
            <CircularProgress progress={progress} size={80} strokeWidth={6} showLabel />
            <Typography type="body" size="sm" style={styles.subtitle}>
              {t('screens.quran.download.downloading')}
            </Typography>
            <Button variant="outlined" color="error" onPress={cancelDownload}>
              {t('screens.quran.download.cancelButton')}
            </Button>
          </>
        )}

        {status === 'extracting' && (
          <>
            <CircularProgress progress={0} size={80} strokeWidth={6} indeterminate />
            <Typography type="body" size="sm" style={styles.subtitle}>
              {t('screens.quran.download.extracting')}
            </Typography>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.metrics.spacing.p24,
  },
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.surfaceAlt,
    borderRadius: 16,
    padding: theme.metrics.spacing.p32,
    gap: theme.metrics.spacingV.p16,
    width: '100%',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  error: {
    textAlign: 'center',
    color: theme.colors.state.error,
  },
}));
