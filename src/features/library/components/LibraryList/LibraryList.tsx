import React from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './LibraryList.styles';

import type { LibraryListProps } from './LibraryList.types';

export const LibraryList = <T,>({ data, renderItem, keyExtractor }: LibraryListProps<T>) => {
  const insets = useSafeAreaInsets();

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 120 }]}
      showsVerticalScrollIndicator={false}
    />
  );
};
