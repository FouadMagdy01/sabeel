import { Button } from '@/common/components/Button';
import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, I18nManager, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';
import { useCollections } from '../../hooks';
import type { SunnahCollection } from '../../types';
import { styles } from './SunnahCollectionsScreen.styles';

function getLocalizedTitle(collection: SunnahCollection, lang: string): string {
  const localized = collection.collection.find((c) => c.lang === lang);
  return localized?.title ?? collection.collection[0]?.title ?? collection.name;
}

export function SunnahCollectionsScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = useReaderBottomPadding();
  const { theme } = useUnistyles();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: collections, isLoading, error, refetch } = useCollections();

  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const handlePress = useCallback(
    (collection: SunnahCollection) => {
      router.push({
        pathname: '/(main)/sunnah-books',
        params: {
          collectionName: collection.name,
          collectionTitle: getLocalizedTitle(collection, lang),
        },
      });
    },
    [router, lang]
  );

  const renderHero = useCallback(
    () => (
      <Card
        variant="gradient"
        radius="lg"
        padding="none"
        gradientColors={[theme.colors.brand.primary, theme.colors.brand.secondary]}
        gradientStart={{ x: 0, y: 0 }}
        gradientEnd={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroIconContainer}>
          <Icon
            familyName="MaterialCommunityIcons"
            iconName="book-open-page-variant"
            variant="inverse"
            size={28}
          />
        </View>
        <Typography size="xl" weight="bold" color="inverse">
          {t('screens.sunnahBooks.title')}
        </Typography>
        <Typography size="xs" color="inverse" align="center" style={styles.heroSubtitle}>
          {t('screens.sunnahBooks.subtitle')}
        </Typography>
      </Card>
    ),
    [theme, t]
  );

  const renderItem = useCallback(
    ({ item }: { item: SunnahCollection }) => (
      <Card variant="elevated" onPress={() => handlePress(item)} padding="md">
        <View style={styles.cardRow}>
          <View
            style={[
              styles.cardIconContainer,
              { backgroundColor: `${theme.colors.brand.primary}12` },
            ]}
          >
            <Icon
              familyName="MaterialCommunityIcons"
              iconName="book-outline"
              variant="brandPrimary"
              size={22}
            />
          </View>
          <View style={styles.cardTextArea}>
            <Typography size="sm" weight="semiBold" numberOfLines={1}>
              {getLocalizedTitle(item, lang)}
            </Typography>
            <View style={styles.cardMetaRow}>
              <View style={styles.hadithCountBadge}>
                <Icon
                  familyName="MaterialCommunityIcons"
                  iconName="text-box-outline"
                  variant="tertiary"
                  size={12}
                />
                <Typography size="xxs" color="tertiary">
                  {t('screens.sunnahBooks.hadithCount', { count: item.totalAvailableHadith })}
                </Typography>
              </View>
            </View>
          </View>
          <Icon familyName="Feather" iconName="chevron-right" variant="muted" size={18} />
        </View>
      </Card>
    ),
    [handlePress, lang, t, theme]
  );

  const keyExtractor = useCallback((item: SunnahCollection) => item.name, []);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <IconButton
          familyName="MaterialIcons"
          iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
          onPress={() => router.back()}
          variant="ghost"
          size="medium"
        />
        <Typography size="lg" weight="bold" align="center" style={styles.headerTitle}>
          {t('screens.sunnahBooks.title')}
        </Typography>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand.primary} />
          <Typography size="xs" color="tertiary">
            {t('screens.sunnahBooks.loading')}
          </Typography>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Icon
              familyName="MaterialCommunityIcons"
              iconName="cloud-off-outline"
              variant="muted"
              size={32}
            />
          </View>
          <Typography size="sm" color="tertiary" align="center">
            {t('screens.sunnahBooks.error')}
          </Typography>
          <Button variant="outlined" size="small" onPress={() => refetch()}>
            {t('screens.sunnahBooks.retry')}
          </Button>
        </View>
      ) : (
        <FlatList
          data={collections}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHero}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
