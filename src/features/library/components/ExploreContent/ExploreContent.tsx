import { Button } from '@/common/components/Button';
import { Typography } from '@/common/components/Typography';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, View } from 'react-native';

import { DUMMY_FEATURED_RECITERS, DUMMY_RECOMMENDED_RECITERS } from '../../data';
import type { FeaturedReciter } from '../../types';
import { FeaturedReciterCard } from '../FeaturedReciterCard';
import { RecommendedReciterCard } from '../RecommendedReciterCard';
import { styles } from './ExploreContent.styles';

const ExploreContent: React.FC = () => {
  const { t } = useTranslation();

  const renderFeaturedItem = useCallback(
    ({ item }: { item: FeaturedReciter }) => <FeaturedReciterCard reciter={item} />,
    []
  );

  const featuredKeyExtractor = useCallback((item: FeaturedReciter) => item.id, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Typography size="md" weight="bold">
          {t('screens.library.explore.featuredReciters')}
        </Typography>
        <Button
          variant="transparent"
          size="small"
          onPress={() => console.warn('See all featured reciters')}
        >
          {t('screens.library.explore.seeAll')}
        </Button>
      </View>

      <FlatList
        data={DUMMY_FEATURED_RECITERS}
        renderItem={renderFeaturedItem}
        keyExtractor={featuredKeyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredList}
      />

      <View style={styles.recommendedHeader}>
        <Typography size="md" weight="bold">
          {t('screens.library.explore.recommendedForYou')}
        </Typography>
      </View>

      <View style={styles.recommendedSection}>
        {DUMMY_RECOMMENDED_RECITERS.map((reciter) => (
          <RecommendedReciterCard key={reciter.id} reciter={reciter} />
        ))}
      </View>
    </ScrollView>
  );
};

export default ExploreContent;
