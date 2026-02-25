import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/common/components/Icon';
import { Typography } from '@/common/components/Typography';
import { useAuth } from '@/providers';
import { styles, AVATAR_DIMENSIONS } from './ProfileHeader.styles';

export function ProfileHeader() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
    : null;

  const email = user?.email;

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {initials ? (
          <Typography type="heading" size="lg" weight="bold" color="brandPrimary">
            {initials}
          </Typography>
        ) : (
          <Icon
            familyName="Ionicons"
            iconName="person"
            size={AVATAR_DIMENSIONS.size * 0.45}
            variant="accent"
          />
        )}
      </View>
      <View style={styles.info}>
        <Typography type="body" size="md" weight="semiBold" style={styles.nameText}>
          {displayName ?? t('settings.profile.guestMode')}
        </Typography>
        {email && (
          <Typography type="caption" color="muted">
            {email}
          </Typography>
        )}
      </View>
    </View>
  );
}
