import React from 'react';
import { I18nManager, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';
import { styles } from './AboutSabeelScreen.styles';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

const FEATURES = [
  { key: 'prayers', icon: 'time-outline' },
  { key: 'quran', icon: 'book-outline' },
  { key: 'azkar', icon: 'sunny-outline' },
  { key: 'tasbeeh', icon: 'radio-button-on-outline' },
  { key: 'qibla', icon: 'compass-outline' },
] as const;

export function AboutSabeelScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = useReaderBottomPadding();
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.app }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <IconButton
          familyName="MaterialIcons"
          iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
          onPress={() => router.back()}
          variant="ghost"
          size="medium"
        />
        <Typography type="heading" size="lg" weight="bold" style={styles.headerTitle}>
          {t('screens.about.title')}
        </Typography>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[theme.colors.brand.primary, theme.colors.brand.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroIconContainer}>
            <Icon
              familyName="MaterialCommunityIcons"
              iconName="mosque"
              size={36}
              color={theme.colors.text.inverse}
            />
          </View>
          <Typography type="heading" size="2xl" weight="bold" style={styles.heroAppName}>
            {t('screens.about.appName')}
          </Typography>
          <Typography type="body" size="sm" style={styles.heroTagline}>
            {t('screens.about.tagline')}
          </Typography>
          <View style={styles.versionBadge}>
            <Typography type="caption" weight="semiBold" style={styles.versionText}>
              {t('screens.about.version', { version: APP_VERSION })}
            </Typography>
          </View>
        </LinearGradient>

        <View
          style={[styles.descriptionCard, { backgroundColor: theme.colors.background.surface }]}
        >
          <Typography type="body" size="sm" color="secondary" style={styles.bodyText}>
            {t('screens.about.description')}
          </Typography>
        </View>

        <View style={[styles.featuresCard, { backgroundColor: theme.colors.background.surface }]}>
          <Typography type="body" size="md" weight="semiBold" style={styles.sectionTitle}>
            {t('screens.about.features.title')}
          </Typography>
          {FEATURES.map((feature) => (
            <View key={feature.key} style={styles.featureRow}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: `${theme.colors.brand.primary}15` },
                ]}
              >
                <Icon familyName="Ionicons" iconName={feature.icon} size={18} variant="accent" />
              </View>
              <Typography type="body" size="sm">
                {t(`screens.about.features.${feature.key}` as 'screens.about.features.prayers')}
              </Typography>
            </View>
          ))}
        </View>

        <View style={[styles.connectCard, { backgroundColor: theme.colors.background.surface }]}>
          <Typography type="body" size="md" weight="semiBold" style={styles.sectionTitle}>
            {t('screens.about.connect.title')}
          </Typography>
          <Typography type="body" size="sm" color="secondary" style={styles.bodyText}>
            {t('screens.about.connect.description')}
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}
