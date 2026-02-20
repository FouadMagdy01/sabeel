import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './FeaturedReciterCard.styles';
import type { FeaturedReciterCardProps } from './FeaturedReciterCard.types';

const FeaturedReciterCard: React.FC<FeaturedReciterCardProps> = ({ reciter }) => {
  const { theme } = useUnistyles();
  const isIOS = Platform.OS === 'ios';

  return (
    <Pressable
      style={({ pressed }) => [styles.container, isIOS && pressed && { opacity: 0.85 }]}
      onPress={() => console.warn('Play featured reciter:', reciter.name)}
      android_ripple={{ color: theme.colors.overlay.pressed, borderless: false, foreground: true }}
    >
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Icon familyName="MaterialIcons" iconName="person" size={36} variant="brandPrimary" />
        </View>
        <View style={styles.playButton}>
          <Icon familyName="MaterialIcons" iconName="play-arrow" size={16} variant="inverse" />
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
