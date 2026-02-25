import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './RewayahCard.styles';
import type { RewayahCardProps } from './RewayahCard.types';

const RewayahCard: React.FC<RewayahCardProps> = ({ rewayah, onPress }) => {
  const { theme } = useUnistyles();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        Platform.OS === 'ios' && pressed && { opacity: 0.85 },
      ]}
      onPress={() => onPress?.(rewayah)}
      android_ripple={{
        color: theme.colors.overlay.pressed,
        borderless: false,
        foreground: true,
      }}
    >
      <View style={styles.iconContainer}>
        <Icon
          familyName="MaterialCommunityIcons"
          iconName="book-open-variant"
          size={36}
          variant="brandPrimary"
        />
      </View>
      <Typography size="sm" weight="bold" align="center" numberOfLines={2}>
        {rewayah.name}
      </Typography>
    </Pressable>
  );
};

export default RewayahCard;
