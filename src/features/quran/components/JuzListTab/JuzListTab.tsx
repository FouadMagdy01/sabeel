import { Typography } from '@/common/components/Typography';
import { juzData } from '@/features/quran/data/juzData';
import { getSurahById } from '@/features/library/data/surahData';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './JuzListTab.styles';
import type { JuzListTabProps } from './JuzListTab.types';

type JuzItemData = {
  juzNumber: number;
  versesCount: number;
  firstSurahName: string;
  firstSurahNameArabic: string;
};

type JuzItemProps = JuzItemData & {
  onPress: (juzNumber: number) => void;
};

const JuzItem = React.memo(
  ({ juzNumber, versesCount, firstSurahName, firstSurahNameArabic, onPress }: JuzItemProps) => {
    const { t, i18n } = useTranslation();
    const { theme } = useUnistyles();

    const isArabic = i18n.language === 'ar';
    const surahName = isArabic ? firstSurahNameArabic : firstSurahName;

    const handlePress = useCallback(() => {
      onPress(juzNumber);
    }, [onPress, juzNumber]);

    return (
      <Pressable
        style={[styles.item, { backgroundColor: theme.colors.background.surface }]}
        onPress={handlePress}
        android_ripple={{ color: theme.colors.overlay.pressed }}
      >
        <View style={[styles.numberCircle, { backgroundColor: `${theme.colors.brand.primary}15` }]}>
          <Typography size="xs" weight="bold" color="brandPrimary">
            {String(juzNumber)}
          </Typography>
        </View>
        <View style={styles.content}>
          <Typography size="sm" weight="semiBold">
            {`${t('screens.quran.tabs.juz')} ${String(juzNumber)}`}
          </Typography>
          <View style={styles.metaRow}>
            <Typography size="xs" color="secondary">
              {surahName}
            </Typography>
            <Typography size="xs" color="muted">
              {'·'}
            </Typography>
            <Typography size="xs" color="secondary">
              {t('screens.quran.verses.versesCount', { count: versesCount })}
            </Typography>
          </View>
        </View>
      </Pressable>
    );
  }
);
JuzItem.displayName = 'JuzItem';

const JuzListTab: React.FC<JuzListTabProps> = React.memo(({ onJuzPress, bottomPadding = 0 }) => {
  const processedData = useMemo((): JuzItemData[] => {
    return juzData.map((juz) => {
      const firstSurahId = Number(Object.keys(juz.verseMapping)[0]);
      const surah = getSurahById(firstSurahId);
      return {
        juzNumber: juz.juzNumber,
        versesCount: juz.versesCount,
        firstSurahName: surah?.nameSimple ?? '',
        firstSurahNameArabic: surah?.nameArabic ?? '',
      };
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: JuzItemData }) => (
      <JuzItem
        juzNumber={item.juzNumber}
        versesCount={item.versesCount}
        firstSurahName={item.firstSurahName}
        firstSurahNameArabic={item.firstSurahNameArabic}
        onPress={onJuzPress}
      />
    ),
    [onJuzPress]
  );

  const keyExtractor = useCallback((item: JuzItemData) => String(item.juzNumber), []);

  return (
    <FlatList
      data={processedData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
      style={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
});

JuzListTab.displayName = 'JuzListTab';

export default JuzListTab;
