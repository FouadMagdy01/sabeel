import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './LibraryTabBar.styles';

import type { LibraryTabBarProps } from './LibraryTabBar.types';

export const LibraryTabBar = ({ routes, activeIndex, onTabPress }: LibraryTabBarProps) => (
  <View style={styles.container}>
    {routes.map((route, i) => {
      const isActive = activeIndex === i;
      return (
        <Pressable key={route.key} onPress={() => onTabPress(i)} style={styles.tabItem}>
          <Text style={isActive ? styles.tabLabelActive : styles.tabLabel}>{route.title}</Text>
          {isActive && <View style={styles.tabIndicator} />}
        </Pressable>
      );
    })}
  </View>
);
