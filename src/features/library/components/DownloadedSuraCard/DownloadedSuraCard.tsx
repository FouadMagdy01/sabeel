import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { getSurahById } from '../../data/surahData';
import type { DownloadedSura } from '../../types';
import { styles } from './DownloadedSuraCard.styles';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DownloadedSuraCardProps {
  sura: DownloadedSura;
  onPlay?: (sura: DownloadedSura) => void;
  onDelete?: (sura: DownloadedSura) => void;
}

const DownloadedSuraCard: React.FC<DownloadedSuraCardProps> = ({ sura, onPlay, onDelete }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const surahInfo = getSurahById(sura.surahId);
  const surahName = isArabic ? surahInfo?.nameArabic : surahInfo?.nameSimple;
  const reciterDisplayName = isArabic
    ? sura.reciterNameAr || sura.reciterNameEn
    : sura.reciterNameEn || sura.reciterNameAr;

  return (
    <Card variant="outlined" style={styles.cardLayout}>
      <View style={styles.numberBadge}>
        <Typography size="md" weight="bold" color="brandPrimary">
          {sura.surahId}
        </Typography>
      </View>
      <View style={styles.content}>
        <Typography size="sm" weight="bold">
          {surahName ?? String(sura.surahId)}
        </Typography>
        <View style={styles.metaRow}>
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {reciterDisplayName}
          </Typography>
          {surahInfo ? (
            <>
              <Divider variant="dot" />
              <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
                {t('screens.library.sura.verses', { count: surahInfo.versesCount })}
              </Typography>
            </>
          ) : null}
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {formatFileSize(sura.fileSize)}
          </Typography>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <IconButton
          familyName="MaterialIcons"
          iconName="play-arrow"
          variant="tinted"
          size="medium"
          onPress={onPlay ? () => onPlay(sura) : undefined}
        />
        <IconButton
          familyName="MaterialIcons"
          iconName="delete-outline"
          variant="ghost"
          size="medium"
          color="error"
          onPress={onDelete ? () => onDelete(sura) : undefined}
        />
      </View>
    </Card>
  );
};

export default DownloadedSuraCard;
