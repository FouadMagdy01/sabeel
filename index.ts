import { PlaybackService } from '@/services/PlaybackService';
import 'expo-router/entry';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  IOSCategory,
  IOSCategoryMode,
  IOSCategoryOptions,
} from 'react-native-track-player';
import './src/i18n/config';
import './src/theme/unistyles'; // <-- file that initializes Unistyles

async function setupPlayer() {
  try {
    TrackPlayer.registerPlaybackService(() => PlaybackService);

    console.log('[TrackPlayer] setting up player...');
    await TrackPlayer.setupPlayer({
      iosCategory: IOSCategory.Playback,
      iosCategoryMode: IOSCategoryMode.SpokenAudio,
      iosCategoryOptions: [IOSCategoryOptions.DuckOthers],
      autoHandleInterruptions: true,
    });
    console.log('[TrackPlayer] player setup complete');

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        stopForegroundGracePeriod: 5,
      },
    });
    console.log('[TrackPlayer] options updated');
  } catch (e) {
    console.error('[TrackPlayer] setup FAILED:', e);
  }
}

setupPlayer();
