import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React, { useMemo } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './FeaturedReciterCard.styles';
import type { FeaturedReciterCardProps } from './FeaturedReciterCard.types';

const FeaturedReciterCard: React.FC<FeaturedReciterCardProps> = ({ reciter }) => {
  const { theme } = useUnistyles();

  const isIOS = Platform.OS === 'ios';

  const androidRipple = useMemo(
    () =>
      Platform.OS === 'android'
        ? { color: theme.colors.overlay.pressed, foreground: true, borderless: false }
        : undefined,
    [theme.colors.overlay.pressed]
  );

  // Inline color styles to avoid flicker during theme switching
  const containerColors = {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.default,
  };
  const avatarBgColor = { backgroundColor: `${theme.colors.brand.primary}15` };
  const playButtonColors = {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.background.surface,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        containerColors,
        isIOS && pressed && { opacity: 0.85 },
      ]}
      onPress={() => console.warn('Play featured reciter:', reciter.name)}
      android_ripple={androidRipple}
    >
      <View style={styles.avatarWrapper}>
        <View style={[styles.avatarContainer, avatarBgColor]}>
          <Icon
            familyName="MaterialIcons"
            iconName="person"
            size={36}
            color={theme.colors.brand.primary}
          />
        </View>
        <View style={[styles.playButton, playButtonColors]}>
          <Icon
            familyName="MaterialIcons"
            iconName="play-arrow"
            size={16}
            color={theme.colors.text.inverse}
          />
        </View>
      </View>
      <Typography size="sm" weight="bold" align="center" numberOfLines={1}>
        {reciter.name}
      </Typography>
      <Typography
        size="xxs"
        weight="bold"
        color="brandTertiary"
        align="center"
        uppercase
        numberOfLines={1}
        style={styles.styleText}
      >
        {reciter.style}
      </Typography>
    </Pressable>
  );
};

export default FeaturedReciterCard;
