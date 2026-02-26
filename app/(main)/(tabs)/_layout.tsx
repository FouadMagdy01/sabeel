import { CustomTabBar } from '@/common/components/CustomTabBar';
import { Icon } from '@/common/components/Icon';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUnistyles } from 'react-native-unistyles';

export default function TabLayout() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background.app },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Icon familyName="Ionicons" iconName="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran/index"
        options={{
          title: t('tabs.quran'),
          tabBarIcon: ({ color, size }) => (
            <Icon familyName="Ionicons" iconName="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayers/index"
        options={{
          title: t('tabs.prayers'),
          tabBarIcon: ({ color, size }) => (
            <Icon
              familyName="MaterialCommunityIcons"
              iconName={'mosque'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library/index"
        options={{
          title: t('tabs.library'),
          tabBarIcon: ({ color, size }) => (
            <Icon familyName="Ionicons" iconName="headset-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            <Icon familyName="Ionicons" iconName="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
