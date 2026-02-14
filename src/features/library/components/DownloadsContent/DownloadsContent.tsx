import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';

import { DownloadedAyaCard } from '../DownloadedAyaCard';
import { DownloadedReciterCard } from '../DownloadedReciterCard';
import { DownloadedSuraCard } from '../DownloadedSuraCard';
import { LibraryList } from '../LibraryList';
import { LibraryTabBar } from '../LibraryTabBar';

import {
  DUMMY_DOWNLOADED_AYAS,
  DUMMY_DOWNLOADED_RECITERS,
  DUMMY_DOWNLOADED_SURAS,
} from '../../data';

import type { DownloadedAya, DownloadedReciter, DownloadedSura } from '../../types';

const renderScene = ({ route }: { route: { key: string } }) => {
  switch (route.key) {
    case 'suras':
      return (
        <LibraryList
          data={DUMMY_DOWNLOADED_SURAS}
          renderItem={({ item }: { item: DownloadedSura }) => <DownloadedSuraCard sura={item} />}
          keyExtractor={(item: DownloadedSura) => item.id.toString()}
        />
      );
    case 'reciters':
      return (
        <LibraryList
          data={DUMMY_DOWNLOADED_RECITERS}
          renderItem={({ item }: { item: DownloadedReciter }) => (
            <DownloadedReciterCard reciter={item} />
          )}
          keyExtractor={(item: DownloadedReciter) => item.id}
        />
      );
    case 'ayas':
      return (
        <LibraryList
          data={DUMMY_DOWNLOADED_AYAS}
          renderItem={({ item }: { item: DownloadedAya }) => <DownloadedAyaCard aya={item} />}
          keyExtractor={(item: DownloadedAya) => item.id}
        />
      );
    default:
      return null;
  }
};

export const DownloadsContent = () => {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);

  const routes = useMemo(
    () => [
      { key: 'suras', title: t('screens.library.subtabs.suras') },
      { key: 'reciters', title: t('screens.library.subtabs.reciters') },
      { key: 'ayas', title: t('screens.library.subtabs.ayas') },
    ],
    [t]
  );

  const renderTabBar = useCallback(
    (props: {
      navigationState: {
        index: number;
        routes: { key: string; title: string }[];
      };
    }) => (
      <LibraryTabBar
        routes={props.navigationState.routes}
        activeIndex={props.navigationState.index}
        onTabPress={setTabIndex}
      />
    ),
    []
  );

  return (
    <TabView
      navigationState={{ index: tabIndex, routes }}
      renderScene={renderScene}
      onIndexChange={setTabIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};
