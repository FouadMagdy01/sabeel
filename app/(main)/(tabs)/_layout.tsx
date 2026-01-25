import Icon from '@/common/components/Icon/icon';
import { ICON_FAMILIES } from '@/common/components/Icon/icon.constants';
import { TabList, Tabs, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { ComponentProps, forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type IconName<T extends keyof typeof ICON_FAMILIES> = ComponentProps<
  (typeof ICON_FAMILIES)[T]
>['name'];

type TabButtonProps = TabTriggerSlotProps & {
  children: string;
  icon: IconName<'Ionicons'> | IconName<'MaterialCommunityIcons'>;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
};

const TabButton = forwardRef<View, TabButtonProps>(
  ({ children, isFocused, icon, iconFamily = 'Ionicons', ...props }, ref) => {
    return (
      <Pressable ref={ref} {...props} style={styles.tabButton}>
        <View style={[styles.tabButtonInner, isFocused && styles.tabButtonInnerFocused]}>
          <Icon
            familyName={iconFamily}
            iconName={icon as IconName<'Ionicons'>}
            size={24}
            color={isFocused ? TAB_COLORS.textActive : TAB_COLORS.inactive}
          />
          <Text style={[styles.tabButtonText, isFocused && styles.tabButtonTextFocused]}>
            {children}
          </Text>
        </View>
      </Pressable>
    );
  }
);

TabButton.displayName = 'TabButton';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs>
      <TabSlot />

      <TabList style={styles.tabList}>
        <TabTrigger name="settings" href="/settings" asChild>
          <TabButton icon="settings-outline" iconFamily="Ionicons">
            {t('tabs.settings')}
          </TabButton>
        </TabTrigger>
        <TabTrigger name="prayers" href="/prayers" asChild>
          <TabButton icon="mosque" iconFamily="MaterialCommunityIcons">
            {t('tabs.prayers')}
          </TabButton>
        </TabTrigger>
        <TabTrigger name="quran" href="/quran" asChild>
          <TabButton icon="book-outline" iconFamily="Ionicons">
            {t('tabs.quran')}
          </TabButton>
        </TabTrigger>
        <TabTrigger name="library" href="/library" asChild>
          <TabButton icon="library-outline" iconFamily="Ionicons">
            {t('tabs.library')}
          </TabButton>
        </TabTrigger>
        <TabTrigger name="home" href="/" asChild>
          <TabButton icon="home" iconFamily="Ionicons">
            {t('tabs.home')}
          </TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

// Tab bar colors - these will be moved to theme in future iterations
const TAB_COLORS = {
  active: '#335f31ff',
  inactive: '#8E8E93',
  textActive: '#FFFFFF',
  background: '#fff',
  border: '#e5e5e5',
  shadow: '#000',
  transparent: 'transparent',
} as const;

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
  },
  tabButtonInner: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: TAB_COLORS.transparent,
    borderRadius: 20,
    minWidth: 70,
  },
  tabButtonInnerFocused: {
    backgroundColor: TAB_COLORS.active,
  },
  tabButtonText: {
    color: TAB_COLORS.inactive,
    fontSize: 12,
    fontWeight: '400',
  },
  tabButtonTextFocused: {
    color: TAB_COLORS.textActive,
    fontWeight: '600',
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: TAB_COLORS.background,
    borderTopWidth: 1,
    borderTopColor: TAB_COLORS.border,
    shadowColor: TAB_COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
});
