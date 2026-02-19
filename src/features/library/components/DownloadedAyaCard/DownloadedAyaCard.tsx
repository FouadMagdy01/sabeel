import { Card } from '@/common/components/Card';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { DownloadedAya } from '../../types';
import { styles } from './DownloadedAyaCard.styles';

interface DownloadedAyaCardProps {
  aya: DownloadedAya;
}

const DownloadedAyaCard: React.FC<DownloadedAyaCardProps> = ({ aya }) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" style={styles.cardLayout}>
      <View style={styles.headerRow}>
        <View style={styles.suraInfo}>
          <View style={styles.numberBadge}>
            <Typography size="xs" weight="bold" color="brandPrimary">
              {aya.suraNumber}
            </Typography>
          </View>
          <View>
            <Typography size="xs" weight="bold">
              {aya.suraName}
            </Typography>
            <Typography size="xs" weight="medium" color="muted" style={styles.verseLabel}>
              {t('screens.library.aya.verse', { number: aya.ayaNumber })}
            </Typography>
          </View>
        </View>
        <View style={styles.actionsRow}>
          <IconButton
            familyName="MaterialIcons"
            iconName="play-arrow"
            variant="tinted"
            size="medium"
            onPress={() => console.warn('Play aya:', aya.id)}
          />
          <IconButton
            familyName="MaterialIcons"
            iconName="delete-outline"
            variant="ghost"
            size="medium"
            color="error"
            onPress={() => console.warn('Delete aya:', aya.id)}
          />
        </View>
      </View>
      <Typography size="lg" align="right" style={styles.arabicText}>
        {aya.arabicText}
      </Typography>
      <Typography size="xs" color="tertiary" style={styles.translationText}>
        {aya.translation}
      </Typography>
    </Card>
  );
};

export default DownloadedAyaCard;
