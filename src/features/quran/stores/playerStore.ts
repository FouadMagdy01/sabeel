import i18n from '@/i18n/config';
import { getSurahById } from '@/features/library/data/surahData';
import { getQuranClient, resolveAudioUrl } from '@/integrations/quranApi';
import { getItem, setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import { isValidQuranPage, isValidVerseKey } from '@quranjs/api';
import TrackPlayer, { RepeatMode, type Track as TPTrack } from 'react-native-track-player';
import { create } from 'zustand';

export type QuranRepeatMode = 'off' | 'one' | 'all';

type PlaybackSettings = {
  repeatMode: QuranRepeatMode;
  repeatCount: number;
  playbackSpeed: number;
};

type ReciterInfo = {
  id: string;
  name: string;
};

type Track = { id: string; url: string; title: string; artist: string };

type PlayerState = {
  isPlaying: boolean;
  currentTrackIndex: number;
  isVisible: boolean;
  isMiniPlayerHidden: boolean;
  tabBarHeight: number;
  selectedReciterId: string;
  reciterName: string;
  repeatMode: QuranRepeatMode;
  repeatCount: number;
  playbackSpeed: number;
  currentSurahName: string;
  currentAyahNumber: number;
  repeatPlayCount: number;

  playPageAyahs: (page: number, reciterId?: string) => Promise<void>;
  playSelectedAyahs: (ayahs: { sura: number; ayah: number }[], reciterId?: string) => Promise<void>;
  playSingleAyah: (sura: number, ayah: number, reciterId?: string) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  stop: () => Promise<void>;
  setSelectedReciter: (id: string, name: string) => void;
  setRepeatMode: (mode: QuranRepeatMode) => void;
  setRepeatCount: (count: number) => void;
  setPlaybackSpeed: (speed: number) => Promise<void>;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTrackIndex: (index: number) => void;
  setMiniPlayerHidden: (hidden: boolean) => void;
  setTabBarHeight: (height: number) => void;
  handleQueueEnded: () => Promise<void>;
  loadFromStorage: () => void;
};

const DEFAULT_RECITER_ID = '7';
const DEFAULT_RECITER_NAME = 'Mishari Rashid al-`Afasy';

function getLocalizedTrackTitle(sura: number, ayah: number): string {
  const surahInfo = getSurahById(sura);
  const isArabic = i18n.language === 'ar';
  const surahName = isArabic ? surahInfo?.nameArabic : surahInfo?.nameSimple;
  return i18n.t('screens.quran.player.surahAyah', {
    surah: surahName ?? String(sura),
    ayah: String(ayah),
  });
}

/**
 * Expand tracks for repeat. Each track is duplicated `repeatCount` times
 * when mode is 'one'. For 'all', the entire list is repeated.
 * Track IDs remain the same verse key so the event listener correctly
 * identifies surah/ayah from the ID.
 */
function expandTracksForRepeat(
  tracks: Track[],
  mode: QuranRepeatMode,
  repeatCount: number
): Track[] {
  if (mode === 'off' || repeatCount <= 1) return tracks;

  if (mode === 'one') {
    // Each track repeated N times: [A,A,B,B,C,C] for count=2
    const expanded: Track[] = [];
    for (const track of tracks) {
      for (let i = 0; i < repeatCount; i++) {
        expanded.push({ ...track });
      }
    }
    return expanded;
  }

  if (mode === 'all') {
    // Entire queue repeated N times: [A,B,C,A,B,C] for count=2
    const expanded: Track[] = [];
    for (let i = 0; i < repeatCount; i++) {
      for (const track of tracks) {
        expanded.push({ ...track });
      }
    }
    return expanded;
  }

  return tracks;
}

/**
 * Find the next queue index that has a different track ID from the current one.
 */
function findNextUniqueIndex(queue: TPTrack[], currentIndex: number): number | null {
  const currentId = queue[currentIndex]?.id as string | undefined;
  for (let i = currentIndex + 1; i < queue.length; i++) {
    if ((queue[i].id as string | undefined) !== currentId) return i;
  }
  return null;
}

/**
 * Find the previous queue index that starts a different track group.
 * Walks backwards to find the first index of the previous unique track.
 */
function findPreviousUniqueIndex(queue: TPTrack[], currentIndex: number): number | null {
  // First, find the start of the current group
  const currentId = queue[currentIndex]?.id as string | undefined;
  let groupStart = currentIndex;
  while (groupStart > 0 && (queue[groupStart - 1].id as string | undefined) === currentId) {
    groupStart--;
  }

  if (groupStart === 0) return null; // Already at start

  // Now find the start of the previous group
  const prevId = queue[groupStart - 1].id as string | undefined;
  let prevGroupStart = groupStart - 1;
  while (prevGroupStart > 0 && (queue[prevGroupStart - 1].id as string | undefined) === prevId) {
    prevGroupStart--;
  }

  return prevGroupStart;
}

async function loadAndPlayTracks(tracks: Track[], state: PlayerState) {
  const expanded = expandTracksForRepeat(tracks, state.repeatMode, state.repeatCount);

  await TrackPlayer.reset();
  await TrackPlayer.add(expanded);
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  await TrackPlayer.setRate(state.playbackSpeed);
  await TrackPlayer.play();
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentTrackIndex: 0,
  isVisible: false,
  isMiniPlayerHidden: false,
  tabBarHeight: 0,
  selectedReciterId: DEFAULT_RECITER_ID,
  reciterName: DEFAULT_RECITER_NAME,
  repeatMode: 'off',
  repeatCount: 1,
  playbackSpeed: 1,
  currentSurahName: '',
  currentAyahNumber: 0,
  repeatPlayCount: 0,

  playPageAyahs: async (page, reciterId) => {
    const state = get();
    const id = reciterId ?? state.selectedReciterId;

    if (!isValidQuranPage(page)) {
      console.warn('[PlayerStore] invalid page:', page);
      return;
    }

    try {
      const client = getQuranClient();
      const verses = await client.verses.findByPage(page);

      if (verses.length === 0) {
        console.warn('[PlayerStore] no verses for page');
        return;
      }

      const tracks: Track[] = [];

      for (const verse of verses) {
        const verseKey = verse.verseKey;
        if (!verseKey || !isValidVerseKey(verseKey)) {
          continue;
        }

        const result = await client.audio.findVerseRecitationsByKey(verseKey, id);
        const audioFile = result.audioFiles[0];
        if (!audioFile?.url) {
          console.warn('[PlayerStore] no audio for verse:', verseKey);
          continue;
        }

        const [sura, ayah] = verseKey.split(':').map(Number);
        tracks.push({
          id: verseKey,
          url: resolveAudioUrl(audioFile.url),
          title: getLocalizedTrackTitle(sura, ayah),
          artist: state.reciterName,
        });
      }

      if (tracks.length === 0) {
        console.warn('[PlayerStore] playPageAyahs — no tracks after fetch');
        return;
      }

      await loadAndPlayTracks(tracks, state);

      const firstTrack = tracks[0];
      const [sura, ayah] = firstTrack.id.split(':');
      set({
        isPlaying: true,
        isVisible: true,
        isMiniPlayerHidden: false,
        currentTrackIndex: 0,
        currentSurahName: sura,
        currentAyahNumber: Number(ayah),
        repeatPlayCount: 0,
      });
    } catch (error) {
      console.error('[PlayerStore] playPageAyahs error:', error);
    }
  },

  playSelectedAyahs: async (ayahs, reciterId) => {
    const state = get();
    const id = reciterId ?? state.selectedReciterId;

    if (ayahs.length === 0) {
      console.warn('[PlayerStore] playSelectedAyahs — no ayahs');
      return;
    }

    try {
      const tracks: Track[] = [];
      const client = getQuranClient();

      for (const { sura, ayah } of ayahs) {
        const verseKey = `${String(sura)}:${String(ayah)}`;
        if (!isValidVerseKey(verseKey)) {
          console.warn('[PlayerStore] invalid verse key:', verseKey);
          continue;
        }

        const result = await client.audio.findVerseRecitationsByKey(verseKey, id);
        const audioFile = result.audioFiles[0];
        if (!audioFile?.url) {
          console.warn('[PlayerStore] no audio for verse:', verseKey);
          continue;
        }

        tracks.push({
          id: verseKey,
          url: resolveAudioUrl(audioFile.url),
          title: getLocalizedTrackTitle(sura, ayah),
          artist: state.reciterName,
        });
      }

      if (tracks.length === 0) {
        console.warn('[PlayerStore] playSelectedAyahs — no tracks after fetch');
        return;
      }

      await loadAndPlayTracks(tracks, state);

      const firstAyah = ayahs[0];
      set({
        isPlaying: true,
        isVisible: true,
        isMiniPlayerHidden: false,
        currentTrackIndex: 0,
        currentSurahName: String(firstAyah.sura),
        currentAyahNumber: firstAyah.ayah,
        repeatPlayCount: 0,
      });
    } catch (error) {
      console.error('[PlayerStore] playSelectedAyahs error:', error);
    }
  },

  playSingleAyah: async (sura, ayah, reciterId) => {
    const state = get();
    const id = reciterId ?? state.selectedReciterId;

    const verseKey = `${String(sura)}:${String(ayah)}`;
    if (!isValidVerseKey(verseKey)) {
      console.warn('[PlayerStore] invalid verseKey:', verseKey);
      return;
    }

    try {
      const client = getQuranClient();
      const result = await client.audio.findVerseRecitationsByKey(verseKey, id);

      const audioFile = result.audioFiles[0];
      if (!audioFile?.url) {
        console.warn('[PlayerStore] no audio file for verse');
        return;
      }

      const track: Track = {
        id: verseKey,
        url: resolveAudioUrl(audioFile.url),
        title: getLocalizedTrackTitle(sura, ayah),
        artist: state.reciterName,
      };

      await loadAndPlayTracks([track], state);

      set({
        isPlaying: true,
        isVisible: true,
        isMiniPlayerHidden: false,
        currentTrackIndex: 0,
        currentSurahName: String(sura),
        currentAyahNumber: ayah,
        repeatPlayCount: 0,
      });
    } catch (error) {
      console.error('[PlayerStore] playSingleAyah error:', error);
    }
  },

  togglePlayPause: async () => {
    const state = get();
    if (state.isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    set({ isPlaying: !state.isPlaying });
  },

  skipToNext: async () => {
    const queue = await TrackPlayer.getQueue();
    const currentIndex = get().currentTrackIndex;
    const nextIndex = findNextUniqueIndex(queue, currentIndex);

    if (nextIndex != null) {
      await TrackPlayer.skip(nextIndex);
    }
    // At last unique track — do nothing
  },

  skipToPrevious: async () => {
    const queue = await TrackPlayer.getQueue();
    const currentIndex = get().currentTrackIndex;
    const prevIndex = findPreviousUniqueIndex(queue, currentIndex);

    if (prevIndex != null) {
      await TrackPlayer.skip(prevIndex);
    } else {
      // Already at first unique track — restart from beginning
      // Find start of current group
      const currentId = String(queue[currentIndex]?.id ?? '');
      let groupStart = currentIndex;
      while (groupStart > 0 && String(queue[groupStart - 1]?.id ?? '') === currentId) {
        groupStart--;
      }
      await TrackPlayer.skip(groupStart);
      await TrackPlayer.seekTo(0);
      await TrackPlayer.play();
      set({ isPlaying: true });
    }
  },

  stop: async () => {
    await TrackPlayer.reset();
    set({
      isPlaying: false,
      isVisible: false,
      currentTrackIndex: 0,
      repeatPlayCount: 0,
    });
  },

  setSelectedReciter: (id, name) => {
    set({ selectedReciterId: id, reciterName: name });
    const reciterInfo: ReciterInfo = { id, name };
    setItem(STORAGE_KEYS.quran.selectedReciter, reciterInfo);
  },

  setRepeatMode: (mode) => {
    set({ repeatMode: mode, repeatPlayCount: 0 });

    // Always use RepeatMode.Off — we handle repeat via queue duplication
    void TrackPlayer.setRepeatMode(RepeatMode.Off);

    const state = get();
    const settings: PlaybackSettings = {
      repeatMode: mode,
      repeatCount: state.repeatCount,
      playbackSpeed: state.playbackSpeed,
    };
    setItem(STORAGE_KEYS.quran.playbackSettings, settings);
  },

  setRepeatCount: (count) => {
    set({ repeatCount: count });
    const state = get();
    const settings: PlaybackSettings = {
      repeatMode: state.repeatMode,
      repeatCount: count,
      playbackSpeed: state.playbackSpeed,
    };
    setItem(STORAGE_KEYS.quran.playbackSettings, settings);
  },

  setPlaybackSpeed: async (speed) => {
    set({ playbackSpeed: speed });
    await TrackPlayer.setRate(speed);
    const state = get();
    const settings: PlaybackSettings = {
      repeatMode: state.repeatMode,
      repeatCount: state.repeatCount,
      playbackSpeed: speed,
    };
    setItem(STORAGE_KEYS.quran.playbackSettings, settings);
  },

  setIsPlaying: (playing) => {
    set({ isPlaying: playing });
  },

  setCurrentTrackIndex: (index) => {
    set({ currentTrackIndex: index });
  },

  setMiniPlayerHidden: (hidden) => {
    set({ isMiniPlayerHidden: hidden });
  },

  setTabBarHeight: (height) => {
    set({ tabBarHeight: height });
  },

  handleQueueEnded: async () => {
    await get().stop();
  },

  loadFromStorage: () => {
    const reciterResult = getItem<ReciterInfo>(STORAGE_KEYS.quran.selectedReciter);
    if (reciterResult.data) {
      set({ selectedReciterId: reciterResult.data.id, reciterName: reciterResult.data.name });
    }

    const settingsResult = getItem<PlaybackSettings>(STORAGE_KEYS.quran.playbackSettings);
    if (settingsResult.data) {
      set({
        repeatMode: settingsResult.data.repeatMode,
        repeatCount: settingsResult.data.repeatCount,
        playbackSpeed: settingsResult.data.playbackSpeed,
      });
    }
  },
}));
