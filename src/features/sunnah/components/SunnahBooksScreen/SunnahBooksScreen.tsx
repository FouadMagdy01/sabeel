import { Button } from '@/common/components/Button';
import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, I18nManager, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';
import { useBooks } from '../../hooks';
import type { SunnahBook } from '../../types';
import { styles } from './SunnahBooksScreen.styles';

function getLocalizedBookName(book: SunnahBook, lang: string): string {
  const localized = book.book.find((b) => b.lang === lang);
  return localized?.name ?? book.book[0]?.name ?? book.bookNumber;
}

export function SunnahBooksScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = useReaderBottomPadding();
  const { theme } = useUnistyles();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { collectionName, collectionTitle } = useLocalSearchParams<{
    collectionName: string;
    collectionTitle: string;
  }>();

  const { data: books, isLoading, error, refetch } = useBooks(collectionName ?? '');
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const handlePress = useCallback(
    (book: SunnahBook) => {
      router.push({
        pathname: '/(main)/sunnah-hadiths',
        params: {
          collectionName: collectionName ?? '',
          bookNumber: book.bookNumber,
          bookTitle: getLocalizedBookName(book, lang),
        },
      });
    },
    [router, collectionName, lang]
  );

  const renderBanner = useCallback(
    () => (
      <View style={[styles.collectionBanner, { borderColor: `${theme.colors.brand.primary}30` }]}>
        <View
          style={[
            styles.bannerIconContainer,
            { backgroundColor: `${theme.colors.brand.primary}15` },
          ]}
        >
          <Icon
            familyName="MaterialCommunityIcons"
            iconName="bookshelf"
            variant="brandPrimary"
            size={20}
          />
        </View>
        <View style={styles.bannerText}>
          <Typography size="sm" weight="semiBold">
            {collectionTitle}
          </Typography>
          <Typography size="xxs" color="tertiary">
            {t('screens.sunnahBooks.booksCount', { count: books?.length ?? 0 })}
          </Typography>
        </View>
      </View>
    ),
    [collectionTitle, books, t, theme]
  );

  const renderItem = useCallback(
    ({ item }: { item: SunnahBook }) => (
      <Card variant="elevated" onPress={() => handlePress(item)} padding="md">
        <View style={styles.cardRow}>
          <View style={styles.bookNumber}>
            <Typography size="xs" weight="bold" color="brandPrimary">
              {item.bookNumber}
            </Typography>
          </View>
          <View style={styles.cardTextArea}>
            <Typography size="sm" weight="medium" numberOfLines={2}>
              {getLocalizedBookName(item, lang)}
            </Typography>
            <View style={styles.hadithRange}>
              <Icon
                familyName="MaterialCommunityIcons"
                iconName="text-box-outline"
                variant="tertiary"
                size={12}
              />
              <Typography size="xxs" color="tertiary">
                {t('screens.sunnahBooks.hadithCount', { count: item.numberOfHadith })}
              </Typography>
            </View>
          </View>
          <Icon familyName="Feather" iconName="chevron-right" variant="muted" size={18} />
        </View>
      </Card>
    ),
    [handlePress, lang, t]
  );

  const keyExtractor = useCallback((item: SunnahBook) => item.bookNumber, []);

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
        <Typography
          size="lg"
          weight="bold"
          align="center"
          style={styles.headerTitle}
          numberOfLines={1}
        >
          {collectionTitle}
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
          data={books}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderBanner}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
