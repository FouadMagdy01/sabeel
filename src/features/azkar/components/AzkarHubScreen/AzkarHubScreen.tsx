import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/common/components/Card';
import { IconButton } from '@/common/components/IconButton';
import { SearchInput } from '@/common/components/SearchInput';
import { Typography } from '@/common/components/Typography';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';

import { AZKAR_CATEGORIES, ESSENTIAL_CATEGORIES, RECOMMENDED_CATEGORIES } from '../../constants';
import { useAzkarSearch, useDuaOfTheDay } from '../../hooks';
import type { AzkarCategory, AzkarItem } from '../../types';
import { CategoryCard } from '../CategoryCard';
import { DuaOfTheDayCard } from '../DuaOfTheDayCard';
import { RecommendedCard } from '../RecommendedCard';
import { styles } from './AzkarHubScreen.styles';

export function AzkarHubScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = useReaderBottomPadding();
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { query, setQuery, results, clearSearch, isSearching } = useAzkarSearch();
  const duaOfTheDay = useDuaOfTheDay();

  const navigateToSession = useCallback(
    (categoryId: AzkarCategory) => {
      router.push({
        pathname: '/(main)/azkar-session',
        params: { categoryId },
      });
    },
    [router]
  );

  const getCategoryLabel = useCallback(
    (categoryId: AzkarCategory) => {
      const cat = AZKAR_CATEGORIES.find((c) => c.id === categoryId);
      return cat ? t(cat.labelKey as never) : categoryId;
    },
    [t]
  );

  const renderSearchResult = useCallback(
    (item: AzkarItem) => (
      <Card key={item.id} variant="elevated" onPress={() => navigateToSession(item.categoryId)}>
        <View style={styles.searchResultCard}>
          <View style={styles.searchResultText}>
            <Typography size="lg" weight="bold" align="right">
              {item.arabic}
            </Typography>
            <View
              style={[styles.categoryBadge, { backgroundColor: theme.colors.background.surface }]}
            >
              <Typography size="xs" color="muted">
                {getCategoryLabel(item.categoryId)}
              </Typography>
            </View>
          </View>
        </View>
      </Card>
    ),
    [navigateToSession, getCategoryLabel, theme.colors.background.surface]
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          familyName="Feather"
          iconName="arrow-left"
          onPress={() => router.back()}
          variant="ghost"
          size="medium"
        />
        <View style={styles.headerTitle}>
          <Typography type="heading" size="xl" weight="bold" align="center">
            {t('screens.azkar.hub.title')}
          </Typography>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('screens.azkar.hub.searchPlaceholder')}
          onClear={clearSearch}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: bottomPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isSearching ? (
          <>
            {results.length > 0 ? (
              results.map(renderSearchResult)
            ) : (
              <Typography size="sm" color="muted" align="center">
                {t('screens.azkar.hub.noResults')}
              </Typography>
            )}
          </>
        ) : (
          <>
            {/* Recommended Section */}
            <View style={styles.sectionHeader}>
              <Typography type="heading" size="lg" weight="semiBold">
                {t('screens.azkar.hub.recommended')}
              </Typography>
            </View>
            {RECOMMENDED_CATEGORIES.map((category) => (
              <RecommendedCard
                key={category.id}
                category={category}
                onPress={() => navigateToSession(category.id)}
              />
            ))}

            {/* Essential Collections */}
            <View style={styles.sectionHeader}>
              <Typography type="heading" size="lg" weight="semiBold">
                {t('screens.azkar.hub.essentialCollections')}
              </Typography>
            </View>
            <View style={styles.grid}>
              {ESSENTIAL_CATEGORIES.map((category) => (
                <View key={category.id} style={styles.gridItem}>
                  <CategoryCard
                    category={category}
                    onPress={() => navigateToSession(category.id)}
                  />
                </View>
              ))}
            </View>

            {/* Dua of the Day */}
            {duaOfTheDay && (
              <>
                <View style={styles.sectionHeader}>
                  <Typography type="heading" size="lg" weight="semiBold">
                    {t('screens.azkar.hub.duaOfTheDay')}
                  </Typography>
                </View>
                <DuaOfTheDayCard item={duaOfTheDay} />
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
