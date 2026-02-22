import { Typography } from '@/common/components/Typography';
import { SURAHS } from '@/features/library/data/surahData';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './SurahListTab.styles';
import type { SurahListTabProps } from './SurahListTab.types';

type SurahItemProps = {
  id: number;
  nameSimple: string;
  nameArabic: string;
  versesCount: number;
  revelationPlace: 'makkah' | 'madinah';
  onPress: (id: number) => void;
};

const SurahItem = React.memo(
  ({ id, nameSimple, nameArabic, versesCount, revelationPlace, onPress }: SurahItemProps) => {
    const { t, i18n } = useTranslation();
    const { theme } = useUnistyles();

    const isArabic = i18n.language === 'ar';
    const name = isArabic ? nameArabic : nameSimple;
    const place =
      revelationPlace === 'makkah'
        ? t('screens.quran.verses.makkah')
        : t('screens.quran.verses.madinah');

    const handlePress = useCallback(() => {
      onPress(id);
    }, [onPress, id]);

    return (
      <Pressable
        style={[styles.item, { backgroundColor: theme.colors.background.surface }]}
        onPress={handlePress}
        android_ripple={{ color: theme.colors.overlay.pressed }}
      >
        <View style={[styles.numberCircle, { backgroundColor: `${theme.colors.brand.primary}15` }]}>
          <Typography size="xs" weight="bold" color="brandPrimary">
            {String(id)}
          </Typography>
        </View>
        <View style={styles.content}>
          <Typography size="sm" weight="semiBold">
            {name}
          </Typography>
          <View style={styles.metaRow}>
            <Typography size="xs" color="secondary">
              {t('screens.quran.verses.versesCount', { count: versesCount })}
            </Typography>
            <Typography size="xs" color="muted">
              {'·'}
            </Typography>
            <Typography size="xs" color="secondary">
              {place}
            </Typography>
          </View>
        </View>
        {!isArabic && (
          <Typography size="md" color="muted">
            {nameArabic}
          </Typography>
        )}
      </Pressable>
    );
  }
);
SurahItem.displayName = 'SurahItem';

const SurahListTab: React.FC<SurahListTabProps> = React.memo(
  ({ onSurahPress, bottomPadding = 0 }) => {
    const renderItem = useCallback(
      ({ item }: { item: (typeof SURAHS)[0] }) => (
        <SurahItem
          id={item.id}
          nameSimple={item.nameSimple}
          nameArabic={item.nameArabic}
          versesCount={item.versesCount}
          revelationPlace={item.revelationPlace}
          onPress={onSurahPress}
        />
      ),
      [onSurahPress]
    );

    const keyExtractor = useCallback((item: (typeof SURAHS)[0]) => String(item.id), []);

    return (
      <FlatList
        data={SURAHS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    );
  }
);

SurahListTab.displayName = 'SurahListTab';

export default SurahListTab;
