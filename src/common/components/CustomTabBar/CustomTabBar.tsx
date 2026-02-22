import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { CommonActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useCallback } from 'react';
import { Platform, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { styles } from './CustomTabBar.styles';
import type { CustomTabBarProps } from './CustomTabBar.types';

const ICON_SIZE = 22;

/**
 * Custom bottom tab bar with blur effect and theme-aware styling.
 * Integrates with React Navigation's bottom tab navigator.
 *
 * @example
 * <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
 *   <Tab.Screen name="Home" component={HomeScreen} />
 * </Tab.Navigator>
 */
export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const { theme } = useUnistyles();
  const isDark = theme.colors.mode === 'dark';
  const { bottom } = useSafeAreaInsets();
  const setTabBarHeight = usePlayerStore((s) => s.setTabBarHeight);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setTabBarHeight(e.nativeEvent.layout.height);
    },
    [setTabBarHeight]
  );

  return (
    <View
      style={[styles.container, { paddingBottom: bottom + theme.metrics.spacingV.p8 }]}
      onLayout={handleLayout}
    >
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={Platform.OS === 'ios' ? 40 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blur}
      />
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;

          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);

          const activeColor = theme.colors.brand.primary;
          const inactiveColor = theme.colors.icon.secondary;
          const color = focused ? activeColor : inactiveColor;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              {options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
