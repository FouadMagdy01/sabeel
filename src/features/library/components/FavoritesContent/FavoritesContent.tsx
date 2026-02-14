import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';

import { FavoriteAyaCard } from '../FavoriteAyaCard';
import { FavoriteReciterCard } from '../FavoriteReciterCard';
import { FavoriteSuraCard } from '../FavoriteSuraCard';
import { LibraryList } from '../LibraryList';
import { LibraryTabBar } from '../LibraryTabBar';

import { DUMMY_FAVORITE_AYAS, DUMMY_FAVORITE_RECITERS, DUMMY_FAVORITE_SURAS } from '../../data';

import type { FavoriteAya, FavoriteReciter, FavoriteSura } from '../../types';

const renderScene = ({ route }: { route: { key: string } }) => {
  switch (route.key) {
    case 'suras':
      return (
        <LibraryList
          data={DUMMY_FAVORITE_SURAS}
          renderItem={({ item }: { item: FavoriteSura }) => <FavoriteSuraCard sura={item} />}
          keyExtractor={(item: FavoriteSura) => item.id.toString()}
        />
      );
    case 'reciters':
      return (
        <LibraryList
          data={DUMMY_FAVORITE_RECITERS}
          renderItem={({ item }: { item: FavoriteReciter }) => (
            <FavoriteReciterCard reciter={item} />
          )}
          keyExtractor={(item: FavoriteReciter) => item.id}
        />
      );
    case 'ayas':
      return (
        <LibraryList
          data={DUMMY_FAVORITE_AYAS}
          renderItem={({ item }: { item: FavoriteAya }) => <FavoriteAyaCard aya={item} />}
          keyExtractor={(item: FavoriteAya) => item.id}
        />
      );
    default:
      return null;
  }
};

export const FavoritesContent = () => {
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
