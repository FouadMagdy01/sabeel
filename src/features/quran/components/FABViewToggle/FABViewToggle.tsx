import { Icon } from '@/common/components/Icon';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './FABViewToggle.styles';
import type { FABViewToggleProps } from './FABViewToggle.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FABViewToggle: React.FC<FABViewToggleProps> = React.memo(
  ({ viewType, onToggle, visible = true, bottomOffset = 0 }) => {
    const { theme } = useUnistyles();

    const opacity = useSharedValue(visible ? 1 : 0);
    const translateY = useSharedValue(visible ? 0 : 20);

    useEffect(() => {
      opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
      translateY.value = withTiming(visible ? 0 : 20, { duration: 200 });
    }, [visible, opacity, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    return (
      <AnimatedPressable
        style={[
          styles.fab,
          { backgroundColor: theme.colors.brand.primary, bottom: 24 + bottomOffset },
          animatedStyle,
        ]}
        onPress={onToggle}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Icon
          familyName="Ionicons"
          iconName={viewType === 'pages' ? 'list' : 'book'}
          size={24}
          color={theme.colors.text.inverse}
        />
      </AnimatedPressable>
    );
  }
);

FABViewToggle.displayName = 'FABViewToggle';

export default FABViewToggle;
