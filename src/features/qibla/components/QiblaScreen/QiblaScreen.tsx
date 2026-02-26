import { IconButton } from '@/common/components/IconButton';
import { Typography } from '@/common/components/Typography';
import { useQiblaCompass } from '../../hooks/useQiblaCompass';
import { useQiblaHaptics } from '../../hooks/useQiblaHaptics';
import { qiblaStyles } from './QiblaScreen.styles';
import { Icon } from '@/common/components/Icon';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  I18nManager,
  Image,
  type ImageSourcePropType,
  Linking,
  Pressable,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

const kaabaImage = require('../../../../../assets/images/kaaba.png') as ImageSourcePropType;

export function QiblaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const { heading, qiblaAngle, isFacingQibla, isLoading, error, permissionDenied, retry } =
    useQiblaCompass();
  useQiblaHaptics(isFacingQibla);

  // Animate compass rotation (negative heading so dial rotates opposite to device)
  const compassRotation = useDerivedValue(() => {
    return withTiming(-heading, { duration: 150 });
  });

  const compassStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${compassRotation.value}deg` }],
  }));

  // Animate qibla needle (independent of compass dial rotation)
  const qiblaRotation = useDerivedValue(() => {
    return withTiming(qiblaAngle, { duration: 150 });
  });

  const qiblaNeedleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${qiblaRotation.value}deg` }],
  }));

  const dialBorderColor = isFacingQibla ? theme.colors.brand.primary : theme.colors.border.default;

  const kaabaColor = isFacingQibla ? theme.colors.brand.primary : theme.colors.text.secondary;

  if (isLoading) {
    return (
      <View style={[qiblaStyles.container, { paddingTop: insets.top }]}>
        <View style={qiblaStyles.header}>
          <IconButton
            familyName="MaterialIcons"
            iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
            variant="ghost"
            size="medium"
            onPress={() => router.back()}
          />
          <View style={qiblaStyles.headerTitle}>
            <Typography size="lg" weight="bold">
              {t('screens.qibla.title')}
            </Typography>
          </View>
        </View>
        <View style={qiblaStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand.primary} />
          <Typography size="md" color="secondary">
            {t('screens.qibla.loading')}
          </Typography>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[qiblaStyles.container, { paddingTop: insets.top }]}>
        <View style={qiblaStyles.header}>
          <IconButton
            familyName="MaterialIcons"
            iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
            variant="ghost"
            size="medium"
            onPress={() => router.back()}
          />
          <View style={qiblaStyles.headerTitle}>
            <Typography size="lg" weight="bold">
              {t('screens.qibla.title')}
            </Typography>
          </View>
        </View>
        <View style={qiblaStyles.errorContainer}>
          <Icon familyName="MaterialIcons" iconName="location-off" variant="muted" size={48} />
          <Typography size="md" color="secondary" align="center">
            {error === 'sensorUnavailable'
              ? t('screens.qibla.sensorUnavailable')
              : t('screens.qibla.permissionDenied')}
          </Typography>
          {permissionDenied && (
            <Pressable
              style={[qiblaStyles.settingsButton, { backgroundColor: theme.colors.brand.primary }]}
              onPress={() => void Linking.openSettings()}
            >
              <Typography size="md" weight="semiBold" color="inverse">
                {t('screens.qibla.openSettings')}
              </Typography>
            </Pressable>
          )}
          <Pressable
            style={[qiblaStyles.retryButton, { borderColor: theme.colors.brand.primary }]}
            onPress={retry}
          >
            <Typography size="md" weight="semiBold" color="primary">
              {t('screens.qibla.retry')}
            </Typography>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[qiblaStyles.container, { paddingTop: insets.top }]}>
      <View style={qiblaStyles.header}>
        <IconButton
          familyName="MaterialIcons"
          iconName={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
          variant="ghost"
          size="medium"
          onPress={() => router.back()}
        />
        <View style={qiblaStyles.headerTitle}>
          <Typography size="lg" weight="bold">
            {t('screens.qibla.title')}
          </Typography>
        </View>
      </View>

      <View style={qiblaStyles.content}>
        {/* Fixed Kaaba icon at top of compass area */}
        <View style={qiblaStyles.kaabaContainer}>
          <Image source={kaabaImage} style={[qiblaStyles.kaabaImage, { tintColor: kaabaColor }]} />
        </View>

        <View style={qiblaStyles.compassContainer}>
          {/* Compass dial rotates with device heading */}
          <Animated.View
            style={[qiblaStyles.compassDial, { borderColor: dialBorderColor }, compassStyle]}
          >
            <View style={qiblaStyles.cardinalContainer}>
              <View style={qiblaStyles.cardinalN}>
                <Typography size="md" weight="bold" color="primary">
                  {t('screens.qibla.north')}
                </Typography>
              </View>
              <View style={qiblaStyles.cardinalS}>
                <Typography size="sm" color="secondary">
                  {t('screens.qibla.south')}
                </Typography>
              </View>
              <View style={qiblaStyles.cardinalE}>
                <Typography size="sm" color="secondary">
                  {t('screens.qibla.east')}
                </Typography>
              </View>
              <View style={qiblaStyles.cardinalW}>
                <Typography size="sm" color="secondary">
                  {t('screens.qibla.west')}
                </Typography>
              </View>
            </View>
          </Animated.View>

          {/* Qibla needle overlay — rotates independently to point at qibla */}
          <Animated.View style={[qiblaStyles.qiblaNeedleOverlay, qiblaNeedleStyle]}>
            <View style={qiblaStyles.qiblaIndicator}>
              <Icon
                familyName="MaterialIcons"
                iconName="navigation"
                variant={isFacingQibla ? 'accent' : 'primary'}
                size={28}
              />
            </View>
          </Animated.View>
        </View>

        {/* Heading display */}
        <Typography size="2xl" weight="bold" style={qiblaStyles.headingText}>
          {t('screens.qibla.heading', { degrees: Math.round(heading) })}
        </Typography>

        {/* Status message */}
        <Typography
          size="md"
          weight="medium"
          color={isFacingQibla ? 'primary' : 'secondary'}
          style={qiblaStyles.statusText}
        >
          {isFacingQibla ? t('screens.qibla.facingQibla') : t('screens.qibla.pointToQibla')}
        </Typography>
      </View>
    </View>
  );
}
