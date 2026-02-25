import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { DownloadedReciter } from '../../types';
import { styles } from './DownloadedReciterCard.styles';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

interface DownloadedReciterCardProps {
  reciter: DownloadedReciter;
  onPress?: (reciter: DownloadedReciter) => void;
  onPlay?: (reciter: DownloadedReciter) => void;
  onDelete?: (reciter: DownloadedReciter) => void;
}

const DownloadedReciterCard: React.FC<DownloadedReciterCardProps> = ({
  reciter,
  onPress,
  onPlay,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const reciterDisplayName = isArabic
    ? reciter.reciterNameAr || reciter.reciterNameEn
    : reciter.reciterNameEn || reciter.reciterNameAr;
  const moshafDisplayName = isArabic
    ? reciter.moshafNameAr || reciter.moshafNameEn
    : reciter.moshafNameEn || reciter.moshafNameAr;

  return (
    <Card
      variant="outlined"
      style={styles.cardLayout}
      onPress={onPress ? () => onPress(reciter) : undefined}
    >
      <View style={styles.avatar}>
        <Icon familyName="MaterialIcons" iconName="person" size={24} variant="brandPrimary" />
      </View>
      <View style={styles.content}>
        <Typography size="sm" weight="bold">
          {reciterDisplayName}
        </Typography>
        <View style={styles.metaRow}>
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {moshafDisplayName}
          </Typography>
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {t('screens.library.reciter.suras', {
              count: reciter.surasCount,
            })}
          </Typography>
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {formatFileSize(reciter.totalSize)}
          </Typography>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <IconButton
          familyName="MaterialIcons"
          iconName="play-arrow"
          variant="tinted"
          size="medium"
          onPress={onPlay ? () => onPlay(reciter) : undefined}
        />
        <IconButton
          familyName="MaterialIcons"
          iconName="delete-outline"
          variant="ghost"
          size="medium"
          color="error"
          onPress={onDelete ? () => onDelete(reciter) : undefined}
        />
      </View>
    </Card>
  );
};

export default DownloadedReciterCard;
