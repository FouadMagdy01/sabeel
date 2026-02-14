import { Card } from '@/common/components/Card';
import { Divider } from '@/common/components/Divider';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { DownloadedSura } from '../../types';
import { styles } from './DownloadedSuraCard.styles';

interface DownloadedSuraCardProps {
  sura: DownloadedSura;
}

const DownloadedSuraCard: React.FC<DownloadedSuraCardProps> = ({ sura }) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" style={styles.cardLayout}>
      <View style={styles.numberBadge}>
        <Typography size="md" weight="bold" color="brandPrimary">
          {sura.id}
        </Typography>
      </View>
      <View style={styles.content}>
        <Typography size="sm" weight="bold">
          {sura.name}
        </Typography>
        <View style={styles.metaRow}>
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {sura.translation}
          </Typography>
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {t('screens.library.sura.verses', { count: sura.versesCount })}
          </Typography>
          <Divider variant="dot" />
          <Typography size="xs" weight="medium" color="muted" style={styles.metaText}>
            {sura.fileSize}
          </Typography>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <IconButton
          familyName="MaterialIcons"
          iconName="play-arrow"
          variant="tinted"
          size="medium"
          onPress={() => console.warn('Play sura:', sura.name)}
        />
        <IconButton
          familyName="MaterialIcons"
          iconName="delete-outline"
          variant="ghost"
          size="medium"
          color="error"
          onPress={() => console.warn('Delete sura:', sura.name)}
        />
      </View>
    </Card>
  );
};

export default DownloadedSuraCard;
