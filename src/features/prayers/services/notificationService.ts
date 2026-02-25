import i18n from '@/i18n/config';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { DayPrayerTimes, PrayerKey, YearlyPrayerData } from '../types';
import { NOTIFIABLE_PRAYERS } from '../types';

// iOS caps at ~64, Android at 500. Stay well under both.
const MAX_SCHEDULED = 50;

const PRAYER_CHANNEL_PREFIX = 'prayer_times';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Android caches notification channel sound settings even after deletion.
 * Recreating a channel with the same ID keeps the old sound.
 * To work around this, we use a unique channel ID per sound selection
 * (e.g. "prayer_times_adhan_mansour") and clean up old channels.
 */
function getPrayerChannelId(soundFilename?: string): string {
  return soundFilename
    ? `${PRAYER_CHANNEL_PREFIX}_${soundFilename}`
    : `${PRAYER_CHANNEL_PREFIX}_default`;
}

async function ensureAndroidChannel(soundFilename?: string): Promise<string> {
  const channelId = getPrayerChannelId(soundFilename);
  if (Platform.OS !== 'android') return channelId;

  const soundName = soundFilename ? `${soundFilename}.mp3` : 'default';

  // Clean up old prayer channels that use a different sound
  try {
    const channels = await Notifications.getNotificationChannelsAsync();
    for (const ch of channels) {
      if (ch.id.startsWith(PRAYER_CHANNEL_PREFIX) && ch.id !== channelId) {
        await Notifications.deleteNotificationChannelAsync(ch.id);
      }
    }
  } catch {
    // Channels may not exist yet
  }

  await Notifications.setNotificationChannelAsync(channelId, {
    name: 'Prayer Times',
    importance: Notifications.AndroidImportance.HIGH,
    sound: soundName,
    vibrationPattern: [0, 250, 250, 250],
    enableLights: true,
  });

  return channelId;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelAllPrayerNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function parsePrayerDateTime(dateStr: string, timeStr: string): Date | null {
  const [dd, mm, yyyy] = dateStr.split('-');
  const [hh, min] = timeStr.split(':');
  const date = new Date(
    parseInt(yyyy, 10),
    parseInt(mm, 10) - 1,
    parseInt(dd, 10),
    parseInt(hh, 10),
    parseInt(min, 10),
    0
  );
  return isNaN(date.getTime()) ? null : date;
}

function collectUpcomingPrayers(
  yearlyData: YearlyPrayerData,
  limit: number
): { prayerKey: PrayerKey; date: Date }[] {
  const now = new Date();
  const result: { prayerKey: PrayerKey; date: Date }[] = [];

  const sortedDates = Object.keys(yearlyData.data).sort((a, b) => {
    const [da, ma, ya] = a.split('-').map(Number);
    const [db, mb, yb] = b.split('-').map(Number);
    return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
  });

  for (const dateKey of sortedDates) {
    const day: DayPrayerTimes = yearlyData.data[dateKey];
    for (const prayer of NOTIFIABLE_PRAYERS) {
      const prayerDate = parsePrayerDateTime(dateKey, day[prayer]);
      if (prayerDate && prayerDate > now) {
        result.push({ prayerKey: prayer, date: prayerDate });
        if (result.length >= limit) return result;
      }
    }
  }

  return result;
}

export async function scheduleYearlyPrayerNotifications(
  yearlyData: YearlyPrayerData,
  prayerNames: Record<PrayerKey, string>,
  adhanSound?: string
): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  // Resolve sound: 'default' id maps to system default, otherwise use the filename
  const soundFilename = adhanSound && adhanSound !== 'default' ? adhanSound : undefined;
  const notificationSound = soundFilename ? `${soundFilename}.mp3` : 'default';

  const channelId = await ensureAndroidChannel(soundFilename);
  await cancelAllPrayerNotifications();

  const lang = i18n.language;
  const upcoming = collectUpcomingPrayers(yearlyData, MAX_SCHEDULED);

  for (const { prayerKey, date } of upcoming) {
    const name = prayerNames[prayerKey];
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('prayers.notification.title', { prayer: name }),
          body: i18n.t('prayers.notification.body', { prayer: name }),
          sound: notificationSound,
          data: { lang, prayerKey },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          ...(Platform.OS === 'android' && { channelId }),
        },
      });
    } catch {
      break;
    }
  }
}

export async function checkAndResyncNotificationLanguage(
  yearlyData: YearlyPrayerData | null,
  prayerNames: Record<PrayerKey, string>,
  adhanSound?: string
): Promise<void> {
  if (!yearlyData) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  if (scheduled.length === 0) return;

  const firstData = scheduled[0].content.data as { lang?: string } | undefined;
  const scheduledLang = firstData?.lang;
  const currentLang = i18n.language;

  if (scheduledLang === currentLang) return;

  await scheduleYearlyPrayerNotifications(yearlyData, prayerNames, adhanSound);
}
