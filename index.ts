import { PlaybackService } from '@/services/PlaybackService';
import 'expo-router/entry';
import TrackPlayer, { Capability } from 'react-native-track-player';

import './src/theme/unistyles'; // <-- file that initializes Unistyles
async function setupPlayer() {
  try {
    // Register the playback service
    TrackPlayer.registerPlaybackService(() => PlaybackService);

    // Setup the player
    await TrackPlayer.setupPlayer();

    TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      notificationCapabilities: [Capability.Play, Capability.Pause],
    });
  } catch (e) {
    console.error('Failed to setup TrackPlayer:', e);
  }
}

setupPlayer();
