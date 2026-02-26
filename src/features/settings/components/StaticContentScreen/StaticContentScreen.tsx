import React from 'react';
import { I18nManager, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { useReaderBottomPadding } from '@/hooks/useBottomPadding';
import { styles } from './StaticContentScreen.styles';
import type { StaticContentScreenProps } from './StaticContentScreen.types';

export function StaticContentScreen({
  title,
  lastUpdated,
  heroIcon,
  sections,
}: StaticContentScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = useReaderBottomPadding();
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.app }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <IconButton
          familyName="MaterialIcons"
          iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
          onPress={() => router.back()}
          variant="ghost"
          size="medium"
        />
        <Typography type="heading" size="lg" weight="bold" style={styles.headerTitle}>
          {title}
        </Typography>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: theme.colors.background.surface }]}>
          <View
            style={[
              styles.heroIconContainer,
              { backgroundColor: `${theme.colors.brand.primary}15` },
            ]}
          >
            <Icon familyName="Ionicons" iconName={heroIcon} size={28} variant="accent" />
          </View>
          <Typography type="heading" size="lg" weight="bold" style={styles.heroTitle}>
            {title}
          </Typography>
          <Typography type="caption" color="muted">
            {lastUpdated}
          </Typography>
        </View>

        {sections.map((section, index) => (
          <View
            key={index}
            style={[styles.sectionCard, { backgroundColor: theme.colors.background.surface }]}
          >
            <Typography type="body" size="md" weight="semiBold" style={styles.sectionHeading}>
              {section.heading}
            </Typography>
            <Typography type="body" size="sm" color="secondary" style={styles.sectionBody}>
              {section.body}
            </Typography>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
