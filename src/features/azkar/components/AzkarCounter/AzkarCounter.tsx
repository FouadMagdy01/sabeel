import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';

import CircularProgress from '@/common/components/CircularProgress/CircularProgress';
import { Typography } from '@/common/components/Typography';
import { rf } from '@/theme/metrics';

import { styles } from './AzkarCounter.styles';
import type { AzkarCounterProps } from './AzkarCounter.types';

const COUNTER_SIZE = 200;
const STROKE_WIDTH = 6;

function getCountFontSize(count: number): number {
  const digits = String(count).length;
  if (digits <= 2) return rf(48);
  if (digits <= 3) return rf(40);
  if (digits <= 4) return rf(32);
  return rf(24);
}

export function AzkarCounter({ count, target, onPress, isComplete }: AzkarCounterProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const isSingleRepeat = target === 1;
  const progress = Math.min(count / target, 1);
  const countColor = isComplete ? theme.colors.state.success : theme.colors.text.primary;
  const subtitleColor = isComplete ? theme.colors.state.success : theme.colors.text.tertiary;
  const countFontSize = useMemo(() => getCountFontSize(count), [count]);

  const countTextStyle = useMemo(
    () => ({
      color: countColor,
      fontSize: countFontSize,
      fontFamily: 'Cairo-Bold',
    }),
    [countColor, countFontSize]
  );

  if (isSingleRepeat) {
    return (
      <View style={styles.container}>
        <Pressable onPress={onPress} style={styles.pressable}>
          <View
            style={[
              styles.doneButton,
              {
                borderColor: isComplete ? theme.colors.state.success : theme.colors.brand.primary,
                backgroundColor: isComplete
                  ? theme.colors.state.successBg
                  : theme.colors.background.surface,
              },
            ]}
          >
            <Typography
              type="heading"
              size="xl"
              weight="bold"
              style={{
                color: isComplete ? theme.colors.state.success : theme.colors.brand.primary,
              }}
            >
              {isComplete ? t('screens.azkar.session.done') : t('screens.azkar.session.tap')}
            </Typography>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <CircularProgress
          progress={progress}
          size={COUNTER_SIZE}
          strokeWidth={STROKE_WIDTH}
          status={isComplete ? 'success' : 'normal'}
        >
          <View style={[styles.countContainer, styles.countInner]}>
            <Text
              style={countTextStyle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {String(count)}
            </Text>
            <Typography type="caption" size="sm" style={{ color: subtitleColor }}>
              {`/ ${String(target)}`}
            </Typography>
          </View>
        </CircularProgress>
      </Pressable>
    </View>
  );
}
