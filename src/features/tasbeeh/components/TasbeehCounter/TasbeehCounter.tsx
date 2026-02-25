import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import CircularProgress from '@/common/components/CircularProgress/CircularProgress';
import { Typography } from '@/common/components/Typography';
import { rf } from '@/theme/metrics';
import { INFINITE_TARGET } from '../../constants';
import { styles } from './TasbeehCounter.styles';
import type { TasbeehCounterProps } from './TasbeehCounter.types';

const COUNTER_SIZE = 200;
const STROKE_WIDTH = 6;

function getCountFontSize(count: number): number {
  const digits = String(count).length;
  if (digits <= 2) return rf(48);
  if (digits <= 3) return rf(40);
  if (digits <= 4) return rf(32);
  return rf(24);
}

export function TasbeehCounter({ count, target, onPress, isTargetReached }: TasbeehCounterProps) {
  const { theme } = useUnistyles();

  const isInfinite = target === INFINITE_TARGET;
  const progress = isInfinite ? 0 : Math.min(count / target, 1);
  const countColor = isTargetReached ? theme.colors.state.success : theme.colors.text.primary;
  const subtitleColor = isTargetReached ? theme.colors.state.success : theme.colors.text.tertiary;
  const countFontSize = useMemo(() => getCountFontSize(count), [count]);

  const countTextStyle = useMemo(
    () => ({
      color: countColor,
      fontSize: countFontSize,
      fontFamily: 'Cairo-Bold',
    }),
    [countColor, countFontSize]
  );

  const renderCountContent = () => (
    <View style={[styles.countContainer, styles.countInner]}>
      <Text style={countTextStyle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
        {String(count)}
      </Text>
      {!isInfinite && (
        <Typography type="caption" size="sm" style={{ color: subtitleColor }}>
          {`/ ${String(target)}`}
        </Typography>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.pressable}>
        {isInfinite ? (
          <View style={[styles.countContainer, { width: COUNTER_SIZE, height: COUNTER_SIZE }]}>
            <Text
              style={countTextStyle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {String(count)}
            </Text>
          </View>
        ) : (
          <CircularProgress
            progress={progress}
            size={COUNTER_SIZE}
            strokeWidth={STROKE_WIDTH}
            status={isTargetReached ? 'success' : 'normal'}
          >
            {renderCountContent()}
          </CircularProgress>
        )}
      </Pressable>
    </View>
  );
}
