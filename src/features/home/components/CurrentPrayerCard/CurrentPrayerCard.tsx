import { Card } from '@/common/components/Card';
import { Icon } from '@/common/components/Icon';
import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import type { PrayerName } from '../../types';
import { styles } from './CurrentPrayerCard.styles';
import type { CurrentPrayerCardProps } from './CurrentPrayerCard.types';

export function CurrentPrayerCard({
  prayers,
  currentPrayer,
  nextPrayer,
  countdown,
  isStale,
  onRefresh,
}: CurrentPrayerCardProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerName | null>(null);

  const defaultPrayer = currentPrayer ?? nextPrayer;
  const displayPrayer = selectedPrayer ?? defaultPrayer;
  const selectedPrayerData = prayers.find((p) => p.name === displayPrayer);
  const isUserSelected = selectedPrayer !== null && selectedPrayer !== defaultPrayer;

  const label = isUserSelected
    ? t('screens.home.currentPrayer.selectedLabel')
    : currentPrayer
      ? t('screens.home.currentPrayer.label')
      : t('screens.home.currentPrayer.nextLabel');

  const handleDotPress = (prayerName: PrayerName) => {
    setSelectedPrayer((prev) => (prev === prayerName ? null : prayerName));
  };

  return (
    <Card
      variant="gradient"
      gradientColors={[theme.colors.gradient.sacred[0], theme.colors.gradient.sacred[1]]}
      radius="xl"
      padding="none"
      style={styles.cardContainer}
    >
      <ImageBackground
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        source={require('../../../../../assets/images/mosque.jpeg')}
        resizeMode="stretch"
        style={styles.bgImage}
        imageStyle={styles.bgImageInner}
      >
        <View style={styles.topSection}>
          <Typography
            size="xxs"
            weight="bold"
            color="brandSecondary"
            uppercase
            style={styles.currentLabel}
          >
            {label}
          </Typography>
          <View style={styles.nameTimeRow}>
            <Typography size="3xl" weight="bold" color="brandSecondary">
              {displayPrayer ? t(`prayers.names.${displayPrayer}`) : '--'}
            </Typography>
            <Typography size="xl" weight="bold" color="brandPrimary" style={styles.prayerTime}>
              {selectedPrayerData?.time ?? '--:--'}
            </Typography>
          </View>
          <View style={styles.timerRow}>
            <Icon familyName="MaterialIcons" iconName="schedule" size={14} variant="brandPrimary" />
            <Typography
              size="xs"
              weight="bold"
              color="brandPrimary"
              uppercase
              style={styles.timerText}
            >
              {currentPrayer
                ? t('screens.home.currentPrayer.endsIn', { countdown })
                : t('screens.home.currentPrayer.startsIn', { countdown })}
            </Typography>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />
          {prayers.map((prayer) => {
            const isSelected = displayPrayer === prayer.name;
            const isCurrent = prayer.status === 'current';
            const showSelectedRing = isSelected && !isCurrent;
            return (
              <Pressable
                key={prayer.name}
                onPress={() => handleDotPress(prayer.name)}
                style={styles.timelineItemPressable}
              >
                <View style={styles.timelineItem}>
                  <View style={showSelectedRing ? styles.dotSelectedRing : undefined}>
                    {prayer.status === 'completed' && (
                      <View style={styles.dotCompleted}>
                        <Icon
                          familyName="MaterialIcons"
                          iconName="check"
                          size={10}
                          variant="brandSecondary"
                        />
                      </View>
                    )}
                    {isCurrent && (
                      <View style={styles.dotCurrent}>
                        <View style={styles.dotCurrentInner} />
                      </View>
                    )}
                    {prayer.status === 'upcoming' && (
                      <View style={styles.dotUpcoming}>
                        <View style={styles.dotUpcomingInner} />
                      </View>
                    )}
                  </View>
                  <Typography
                    size="xxs"
                    weight={isSelected ? 'bold' : 'semiBold'}
                    uppercase
                    style={[
                      styles.prayerLabel,
                      prayer.status === 'completed' && styles.labelCompleted,
                      isCurrent && styles.labelCurrent,
                      prayer.status === 'upcoming' && styles.labelUpcoming,
                      isSelected && styles.labelSelected,
                    ]}
                  >
                    {t(`prayers.names.${prayer.name}`)}
                  </Typography>
                </View>
              </Pressable>
            );
          })}
        </View>

        {isStale && onRefresh && (
          <View style={styles.staleBar}>
            <Typography size="xxs" color="brandSecondary">
              {t('screens.home.currentPrayer.staleHint')}
            </Typography>
            <IconButton
              familyName="MaterialIcons"
              iconName="refresh"
              variant="ghost"
              size="small"
              iconVariant="brandPrimary"
              onPress={onRefresh}
            />
          </View>
        )}
      </ImageBackground>
    </Card>
  );
}
