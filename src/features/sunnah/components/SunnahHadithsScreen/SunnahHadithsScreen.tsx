import { Button } from '@/common/components/Button';
import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, I18nManager, Share, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';
import { useHadiths } from '../../hooks';
import { stripHtml } from '../../services/sunnahApi';
import type { SunnahHadith } from '../../types';
import { styles } from './SunnahHadithsScreen.styles';

function getLocalizedBody(hadith: SunnahHadith, lang: string): string {
  const localized = hadith.hadith.find((h) => h.lang === lang);
  const body = localized?.body ?? hadith.hadith[0]?.body ?? '';
  return stripHtml(body);
}

function getGrade(hadith: SunnahHadith, lang: string): string | null {
  const localized = hadith.hadith.find((h) => h.lang === lang);
  const grades = localized?.grades ?? hadith.hadith[0]?.grades;
  if (!grades || grades.length === 0) return null;
  return grades[0].grade;
}

function formatHadithForShare(
  hadith: SunnahHadith,
  lang: string,
  bookTitle: string,
  collectionName: string
): string {
  const body = getLocalizedBody(hadith, lang);
  const grade = getGrade(hadith, lang);
  const gradeText = grade ? `\n[${grade}]` : '';
  return `${body}${gradeText}\n\n— ${bookTitle}, ${collectionName} #${hadith.hadithNumber}`;
}

function CopiedToast({ visible, opacity }: { visible: boolean; opacity: SharedValue<number> }) {
  const { t } = useTranslation();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: opacity.value > 0 ? ('auto' as const) : ('none' as const),
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.copiedToast, animatedStyle]}>
      <Icon familyName="Feather" iconName="check" variant="inverse" size={16} />
      <Typography size="xs" weight="semiBold" color="inverse">
        {t('screens.sunnahBooks.copied')}
      </Typography>
    </Animated.View>
  );
}

export function SunnahHadithsScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = useReaderBottomPadding();
  const { theme } = useUnistyles();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { collectionName, bookNumber, bookTitle } = useLocalSearchParams<{
    collectionName: string;
    bookNumber: string;
    bookTitle: string;
  }>();

  const [showCopied, setShowCopied] = useState(false);
  const toastOpacity = useSharedValue(0);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    toastOpacity.value = withTiming(showCopied ? 1 : 0, { duration: 200 });
  }, [showCopied, toastOpacity]);

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useHadiths(collectionName ?? '', bookNumber ?? '');

  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const hadiths = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCopy = useCallback(
    (hadith: SunnahHadith) => {
      const text = formatHadithForShare(hadith, lang, bookTitle ?? '', collectionName ?? '');
      void Clipboard.setStringAsync(text);
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
      setShowCopied(true);
      copiedTimeout.current = setTimeout(() => setShowCopied(false), 2000);
    },
    [lang, bookTitle, collectionName]
  );

  const handleShare = useCallback(
    (hadith: SunnahHadith) => {
      const text = formatHadithForShare(hadith, lang, bookTitle ?? '', collectionName ?? '');
      void Share.share({ message: text });
    },
    [lang, bookTitle, collectionName]
  );

  const renderItem = useCallback(
    ({ item }: { item: SunnahHadith }) => {
      const body = getLocalizedBody(item, lang);
      const grade = getGrade(item, lang);

      return (
        <Card variant="elevated" padding="md" radius="lg">
          <View style={styles.hadithCard}>
            <View style={styles.hadithTopRow}>
              <View style={styles.hadithNumberContainer}>
                <View style={styles.hadithNumberBadge}>
                  <Typography size="xs" weight="bold" color="inverse">
                    {item.hadithNumber}
                  </Typography>
                </View>
                <Typography size="xxs" color="muted">
                  {t('screens.sunnahBooks.hadithLabel')}
                </Typography>
              </View>
              <View style={styles.actionRow}>
                <IconButton
                  familyName="Feather"
                  iconName="copy"
                  size="small"
                  onPress={() => handleCopy(item)}
                />
                <IconButton
                  familyName="Feather"
                  iconName="share-2"
                  size="small"
                  onPress={() => handleShare(item)}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <Typography size="sm" color="secondary" style={styles.hadithBody}>
              {body}
            </Typography>

            <View style={styles.bottomRow}>
              {grade ? (
                <View style={styles.gradeBadge}>
                  <Icon
                    familyName="MaterialCommunityIcons"
                    iconName="shield-check-outline"
                    variant="tertiary"
                    size={12}
                  />
                  <Typography size="xxs" color="tertiary" weight="medium">
                    {grade}
                  </Typography>
                </View>
              ) : (
                <View />
              )}
              <View style={styles.collectionTag}>
                <Icon
                  familyName="MaterialCommunityIcons"
                  iconName="book-outline"
                  variant="muted"
                  size={11}
                />
                <Typography size="xxs" color="muted">
                  {collectionName}
                </Typography>
              </View>
            </View>
          </View>
        </Card>
      );
    },
    [lang, t, handleCopy, handleShare, collectionName]
  );

  const keyExtractor = useCallback(
    (item: SunnahHadith, index: number) => `${item.hadithNumber}-${index}`,
    []
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={theme.colors.brand.primary} />
        <Typography size="xxs" color="tertiary">
          {t('screens.sunnahBooks.loadingMore')}
        </Typography>
      </View>
    );
  }, [isFetchingNextPage, theme, t]);

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
          {bookTitle}
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
          data={hadiths}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}

      <CopiedToast visible={showCopied} opacity={toastOpacity} />
    </View>
  );
}
