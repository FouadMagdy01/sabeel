import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { useCallback, useEffect } from 'react';
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player';

const EVENTS = [Event.PlaybackState, Event.PlaybackActiveTrackChanged, Event.PlaybackQueueEnded];

export function useQuranPlayer() {
  const store = usePlayerStore();

  const isAyahPlaying = useCallback(
    (sura: number, ayah: number): boolean => {
      return (
        store.isPlaying &&
        store.currentSurahName === String(sura) &&
        store.currentAyahNumber === ayah
      );
    },
    [store.isPlaying, store.currentSurahName, store.currentAyahNumber]
  );

  return {
    isPlaying: store.isPlaying,
    isVisible: store.isVisible,
    isAyahPlaying,
    playPageAyahs: store.playPageAyahs,
    playSingleAyah: store.playSingleAyah,
    togglePlayPause: store.togglePlayPause,
    skipToNext: store.skipToNext,
    skipToPrevious: store.skipToPrevious,
    stop: store.stop,
  };
}

export function useInitQuranPlayer() {
  useTrackPlayerEvents(EVENTS, async (event) => {
    if (event.type === Event.PlaybackState) {
      const playing = event.state === State.Playing || event.state === State.Buffering;
      usePlayerStore.getState().setIsPlaying(playing);
    }

    if (event.type === Event.PlaybackActiveTrackChanged) {
      if (event.index != null) {
        usePlayerStore.getState().setCurrentTrackIndex(event.index);
        const track = await TrackPlayer.getActiveTrack();
        // Track ID is the verse key "sura:ayah"
        if (track?.id) {
          const parts = String(track.id).split(':');
          if (parts.length === 2) {
            usePlayerStore.setState({
              currentSurahName: parts[0],
              currentAyahNumber: Number(parts[1]),
            });
          }
        }
      }
    }

    if (event.type === Event.PlaybackQueueEnded) {
      await usePlayerStore.getState().handleQueueEnded();
    }
  });

  useEffect(() => {
    usePlayerStore.getState().loadFromStorage();
  }, []);
}
