import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import type { VerseData } from '../../types';
import { styles } from './VerseOfTheDay.styles';

interface VerseOfTheDayProps {
  verse: VerseData;
  onShare: () => void;
}

export function VerseOfTheDay({ verse, onShare }: VerseOfTheDayProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  // Inline color styles to avoid flicker during theme switching
  const containerBorderColor = { borderTopColor: theme.colors.brand.tertiary };
  const labelDotColor = { backgroundColor: theme.colors.brand.tertiary };
  const shareButtonShadow = { shadowColor: theme.colors.brand.tertiary };

  return (
    <Card
      variant="elevated"
      radius="xl"
      padding="lg"
      style={[styles.container, containerBorderColor]}
    >
      <View style={styles.decorativeIcon}>
        <Icon
          familyName="MaterialIcons"
          iconName="menu-book"
          size={140}
          color={theme.colors.brand.secondary}
        />
      </View>

      <View style={styles.headerRow}>
        <View style={styles.labelRow}>
          <View style={[styles.labelDot, labelDotColor]} />
          <Typography size="xxs" weight="bold" color="brandTertiary" uppercase style={styles.label}>
            {t('screens.home.verseOfTheDay.label')}
          </Typography>
        </View>
        <IconButton
          familyName="MaterialIcons"
          iconName="share"
          variant="filled"
          color="tertiary"
          iconVariant="inverse"
          size="medium"
          onPress={onShare}
          style={[styles.shareButton, shareButtonShadow]}
        />
      </View>

      <View style={styles.contentArea}>
        <Typography
          size="3xl"
          weight="bold"
          color="brandSecondary"
          align="right"
          style={styles.arabicText}
        >
          {verse.arabic}
        </Typography>
        <Typography
          size="lg"
          weight="medium"
          color="brandPrimary"
          align="center"
          italic
          style={styles.translationText}
        >
          {verse.translation}
        </Typography>
        <Typography type="overline" color="tertiary" align="center" style={styles.referenceText}>
          {verse.reference}
        </Typography>
      </View>
    </Card>
  );
}
