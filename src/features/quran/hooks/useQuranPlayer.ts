import { usePlayerStore } from '@/features/quran/stores/playerStore';
import { useCallback, useEffect } from 'react';
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player';

const EVENTS = [
  Event.PlaybackState,
  Event.PlaybackActiveTrackChanged,
  Event.PlaybackQueueEnded,
  Event.PlaybackError,
];

export function useQuranPlayer() {
  const store = usePlayerStore();

  const isAyahPlaying = useCallback(
    (sura: number, ayah: number): boolean => {
      return (
        store.playerSource === 'quran' &&
        store.isPlaying &&
        store.currentSurahName === String(sura) &&
        store.currentAyahNumber === ayah
      );
    },
    [store.playerSource, store.isPlaying, store.currentSurahName, store.currentAyahNumber]
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
      console.warn('[useInitQuranPlayer] PlaybackState event', { state: event.state, playing });
      if (event.state === State.Error) {
        console.error(
          '[useInitQuranPlayer] Playback error — stopping player',
          JSON.stringify(event)
        );
        await usePlayerStore.getState().stop();
        return;
      }
      // Skip intermediate state changes while loading a new track to prevent
      // the play button from flickering (reset→pause→play cycle).
      if (!usePlayerStore.getState().isLoadingTrack) {
        usePlayerStore.getState().setIsPlaying(playing);
      }
    }

    if (event.type === Event.PlaybackError) {
      console.error('[useInitQuranPlayer] PlaybackError event', JSON.stringify(event));
      await usePlayerStore.getState().stop();
    }

    if (event.type === Event.PlaybackActiveTrackChanged) {
      console.warn('[useInitQuranPlayer] PlaybackActiveTrackChanged', { index: event.index });
      // Skip track-change events while loading a new track — playSurah already
      // set the correct currentSurahName optimistically. Processing these events
      // during loading causes intermediate renders that flicker the play button.
      if (usePlayerStore.getState().isLoadingTrack) return;

      if (event.index != null) {
        usePlayerStore.getState().setCurrentTrackIndex(event.index);
        const track = await TrackPlayer.getActiveTrack();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        console.warn('[useInitQuranPlayer] active track', { id: track?.id, url: track?.url });
        if (track?.id) {
          const trackId = String(track.id);
          if (trackId.startsWith('surah:')) {
            // Library track: "surah:123"
            const surahName = trackId.split(':')[1];
            console.warn('[useInitQuranPlayer] library track, setting surahName:', surahName);
            usePlayerStore.setState({
              currentSurahName: surahName,
              currentAyahNumber: 0,
            });
          } else {
            // Quran reader track: "sura:ayah"
            const parts = trackId.split(':');
            if (parts.length === 2) {
              console.warn('[useInitQuranPlayer] quran track, sura:', parts[0], 'ayah:', parts[1]);
              usePlayerStore.setState({
                currentSurahName: parts[0],
                currentAyahNumber: Number(parts[1]),
              });
            }
          }
        }
      }
    }

    if (event.type === Event.PlaybackQueueEnded) {
      console.warn('[useInitQuranPlayer] PlaybackQueueEnded');
      await usePlayerStore.getState().handleQueueEnded();
    }
  });

  useEffect(() => {
    usePlayerStore.getState().loadFromStorage();
  }, []);
}
