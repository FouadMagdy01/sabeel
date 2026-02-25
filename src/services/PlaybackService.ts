// src/services/PlaybackService.ts
import { usePlayerStore } from '@/features/quran/stores/playerStore';
import TrackPlayer, { Event } from 'react-native-track-player';

export const PlaybackService = async function () {
  console.log('[PlaybackService] registered');

  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    console.log('[PlaybackService] RemotePlay');
    await TrackPlayer.play();
    usePlayerStore.getState().setIsPlaying(true);
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    console.log('[PlaybackService] RemotePause');
    await TrackPlayer.pause();
    usePlayerStore.getState().setIsPlaying(false);
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    console.log('[PlaybackService] RemoteStop');
    await usePlayerStore.getState().stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    console.log('[PlaybackService] RemoteNext');
    await usePlayerStore.getState().skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    console.log('[PlaybackService] RemotePrevious');
    await usePlayerStore.getState().skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async (e) => {
    console.log('[PlaybackService] RemoteSeek position:', e.position);
    await TrackPlayer.seekTo(e.position);
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async (e) => {
    console.log('[PlaybackService] RemoteDuck — paused:', e.paused, 'permanent:', e.permanent);
    if (e.permanent) {
      await usePlayerStore.getState().stop();
    } else if (e.paused) {
      await TrackPlayer.pause();
      usePlayerStore.getState().setIsPlaying(false);
    } else {
      await TrackPlayer.play();
      usePlayerStore.getState().setIsPlaying(true);
    }
  });
};
