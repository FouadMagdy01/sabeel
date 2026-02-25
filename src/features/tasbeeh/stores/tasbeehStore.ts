import { getItem, setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import { create } from 'zustand';

import { TASBEEH_PHRASES } from '../constants/phrases';
import type { TasbeehStore } from '../types';

const DEFAULT_PHRASE = TASBEEH_PHRASES[0];

export const useTasbeehStore = create<TasbeehStore>((set, get) => ({
  currentCount: 0,
  selectedPhraseId: DEFAULT_PHRASE.id,
  targetCount: DEFAULT_PHRASE.defaultTarget,
  hapticsEnabled: true,

  increment: () => {
    const newCount = Number(get().currentCount) + 1;
    set({ currentCount: newCount });
    setItem(STORAGE_KEYS.tasbeeh.currentCount, newCount);
  },

  reset: () => {
    set({ currentCount: 0 });
    setItem(STORAGE_KEYS.tasbeeh.currentCount, 0);
  },

  setSelectedPhrase: (phraseId: string) => {
    const phrase = TASBEEH_PHRASES.find((p) => p.id === phraseId);
    if (!phrase) return;

    set({
      selectedPhraseId: phraseId,
      currentCount: 0,
      targetCount: phrase.defaultTarget,
    });
    setItem(STORAGE_KEYS.tasbeeh.selectedPhrase, phraseId);
    setItem(STORAGE_KEYS.tasbeeh.currentCount, 0);
    setItem(STORAGE_KEYS.tasbeeh.targetCount, phrase.defaultTarget);
  },

  setTargetCount: (target: number) => {
    set({ targetCount: target });
    setItem(STORAGE_KEYS.tasbeeh.targetCount, target);
  },

  toggleHaptics: () => {
    const newValue = !get().hapticsEnabled;
    set({ hapticsEnabled: newValue });
    setItem(STORAGE_KEYS.tasbeeh.hapticsEnabled, newValue);
  },

  loadFromStorage: () => {
    const countResult = getItem<number>(STORAGE_KEYS.tasbeeh.currentCount);
    const phraseResult = getItem<string>(STORAGE_KEYS.tasbeeh.selectedPhrase);
    const targetResult = getItem<number>(STORAGE_KEYS.tasbeeh.targetCount);
    const hapticsResult = getItem<boolean>(STORAGE_KEYS.tasbeeh.hapticsEnabled);

    const updates: Partial<TasbeehStore> = {};

    if (phraseResult.data != null) {
      const phrase = TASBEEH_PHRASES.find((p) => p.id === phraseResult.data);
      if (phrase) {
        updates.selectedPhraseId = phraseResult.data;
      }
    }

    if (countResult.data != null) {
      updates.currentCount = Number(countResult.data) || 0;
    }

    if (targetResult.data != null) {
      updates.targetCount = Number(targetResult.data) || 0;
    }

    if (hapticsResult.data != null) {
      updates.hapticsEnabled = hapticsResult.data;
    }

    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },
}));
