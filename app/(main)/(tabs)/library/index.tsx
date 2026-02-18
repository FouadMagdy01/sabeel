import { SegmentedControl } from '@/common/components/SegmentedControl';
import { DownloadsContent, ExploreContent, FavoritesContent } from '@/features/library';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomPadding } from '@/hooks/useBottomPadding';
import { StyleSheet } from 'react-native-unistyles';

export default function LibraryScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomPadding = useBottomPadding();
  const [selectedTab, setSelectedTab] = useState<'explore' | 'favorites' | 'downloads'>('explore');

  const options = useMemo(
    () => [
      { label: t('screens.library.tabs.explore'), value: 'explore' as const },
      { label: t('screens.library.tabs.favorites'), value: 'favorites' as const },
      { label: t('screens.library.tabs.downloads'), value: 'downloads' as const },
    ],
    [t]
  );

  return (
    <View style={screenStyles.screen}>
      <View style={[screenStyles.header, { paddingTop: insets.top + 16 }]}>
        <SegmentedControl
          options={options}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value as 'explore' | 'favorites' | 'downloads')}
          fullWidth
        />
      </View>

      <View style={[screenStyles.content, { paddingBottom: bottomPadding }]}>
        {selectedTab === 'explore' && <ExploreContent />}
        {selectedTab === 'favorites' && <FavoritesContent />}
        {selectedTab === 'downloads' && <DownloadsContent />}
      </View>
    </View>
  );
}

const screenStyles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  header: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacingV.p16,
  },
  content: {
    flex: 1,
  },
}));
