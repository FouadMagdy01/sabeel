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
    console.log('[TrackPlayer] registering playback service...');
    TrackPlayer.registerPlaybackService(() => PlaybackService);

    console.log('[TrackPlayer] setting up player...');
    await TrackPlayer.setupPlayer({
      iosCategory: IOSCategory.Playback,
      iosCategoryMode: IOSCategoryMode.SpokenAudio,
      iosCategoryOptions: [
        IOSCategoryOptions.DuckOthers,
        IOSCategoryOptions.InterruptSpokenAudioAndMixWithOthers,
      ],
      autoHandleInterruptions: true,
    });
    console.log('[TrackPlayer] player setup complete');

    TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
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
