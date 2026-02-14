import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import type { StatsData } from '../../types';
import { styles } from './StatsCard.styles';

interface StatsCardProps {
  stats: StatsData;
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return num.toLocaleString();
  }
  return String(num);
};

export function StatsCard({ stats }: StatsCardProps) {
  const { t } = useTranslation();

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.statItem}>
        <Icon
          familyName="MaterialIcons"
          iconName="local-fire-department"
          size={20}
          variant="accent"
        />
        <Typography size="sm" weight="bold" style={styles.statValue}>
          {formatNumber(stats.dayStreak)}
        </Typography>
        <Typography size="xxs" weight="bold" color="tertiary" uppercase style={styles.statLabel}>
          {t('screens.home.stats.dayStreak')}
        </Typography>
      </View>
      <Divider orientation="vertical" length={32} />
      <View style={styles.statItem}>
        <Icon familyName="MaterialIcons" iconName="stars" size={20} variant="accent" />
        <Typography size="sm" weight="bold" style={styles.statValue}>
          {formatNumber(stats.totalPoints)}
        </Typography>
        <Typography size="xxs" weight="bold" color="tertiary" uppercase style={styles.statLabel}>
          {t('screens.home.stats.totalPoints')}
        </Typography>
      </View>
      <Divider orientation="vertical" length={32} />
      <View style={styles.statItem}>
        <Icon familyName="MaterialIcons" iconName="military-tech" size={20} variant="accent" />
        <Typography size="sm" weight="bold" style={styles.statValue}>
          {formatNumber(stats.bestStreak)}
        </Typography>
        <Typography size="xxs" weight="bold" color="tertiary" uppercase style={styles.statLabel}>
          {t('screens.home.stats.bestStreak')}
        </Typography>
      </View>
    </Card>
  );
}
