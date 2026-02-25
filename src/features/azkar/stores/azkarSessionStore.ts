import { getItem, setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';
import { create } from 'zustand';

import { getItemsByCategory } from '../data';
import type { AzkarCategory, AzkarSessionStore } from '../types';

export const useAzkarSessionStore = create<AzkarSessionStore>((set, get) => ({
  categoryId: null,
  currentItemIndex: 0,
  currentRepeatCount: 0,
  completedItems: [],
  hapticsEnabled: true,

  startSession: (categoryId: AzkarCategory) => {
    set({
      categoryId,
      currentItemIndex: 0,
      currentRepeatCount: 0,
      completedItems: [],
    });
    setItem(STORAGE_KEYS.azkar.currentCategory, categoryId);
    setItem(STORAGE_KEYS.azkar.currentItemIndex, 0);
    setItem(STORAGE_KEYS.azkar.currentRepeatCount, 0);
  },

  incrementRepeat: () => {
    const { categoryId, currentItemIndex, currentRepeatCount, completedItems } = get();
    if (!categoryId) return;

    const items = getItemsByCategory(categoryId);
    const currentItem = items[currentItemIndex];
    if (!currentItem) return;

    const newCount = currentRepeatCount + 1;

    if (newCount >= currentItem.repeatCount) {
      const newCompleted = [...completedItems, currentItem.id];
      const nextIndex = currentItemIndex + 1;

      if (nextIndex < items.length) {
        set({
          currentRepeatCount: 0,
          currentItemIndex: nextIndex,
          completedItems: newCompleted,
        });
        setItem(STORAGE_KEYS.azkar.currentItemIndex, nextIndex);
        setItem(STORAGE_KEYS.azkar.currentRepeatCount, 0);
      } else {
        set({
          currentRepeatCount: newCount,
          completedItems: newCompleted,
        });
        setItem(STORAGE_KEYS.azkar.currentRepeatCount, newCount);
      }
    } else {
      set({ currentRepeatCount: newCount });
      setItem(STORAGE_KEYS.azkar.currentRepeatCount, newCount);
    }
  },

  nextItem: () => {
    const { categoryId, currentItemIndex } = get();
    if (!categoryId) return;

    const items = getItemsByCategory(categoryId);
    const nextIndex = Math.min(currentItemIndex + 1, items.length - 1);

    set({ currentItemIndex: nextIndex, currentRepeatCount: 0 });
    setItem(STORAGE_KEYS.azkar.currentItemIndex, nextIndex);
    setItem(STORAGE_KEYS.azkar.currentRepeatCount, 0);
  },

  previousItem: () => {
    const { currentItemIndex } = get();
    const prevIndex = Math.max(currentItemIndex - 1, 0);

    set({ currentItemIndex: prevIndex, currentRepeatCount: 0 });
    setItem(STORAGE_KEYS.azkar.currentItemIndex, prevIndex);
    setItem(STORAGE_KEYS.azkar.currentRepeatCount, 0);
  },

  resetSession: () => {
    const { categoryId } = get();
    set({
      currentItemIndex: 0,
      currentRepeatCount: 0,
      completedItems: [],
    });
    if (categoryId) {
      setItem(STORAGE_KEYS.azkar.currentItemIndex, 0);
      setItem(STORAGE_KEYS.azkar.currentRepeatCount, 0);
    }
  },

  toggleHaptics: () => {
    const newValue = !get().hapticsEnabled;
    set({ hapticsEnabled: newValue });
    setItem(STORAGE_KEYS.azkar.hapticsEnabled, newValue);
  },

  loadFromStorage: () => {
    const categoryResult = getItem<AzkarCategory>(STORAGE_KEYS.azkar.currentCategory);
    const indexResult = getItem<number>(STORAGE_KEYS.azkar.currentItemIndex);
    const repeatResult = getItem<number>(STORAGE_KEYS.azkar.currentRepeatCount);
    const hapticsResult = getItem<boolean>(STORAGE_KEYS.azkar.hapticsEnabled);

    const updates: Partial<AzkarSessionStore> = {};

    if (categoryResult.data != null) {
      updates.categoryId = categoryResult.data;
    }

    if (indexResult.data != null) {
      updates.currentItemIndex = Number(indexResult.data) || 0;
    }

    if (repeatResult.data != null) {
      updates.currentRepeatCount = Number(repeatResult.data) || 0;
    }

    if (hapticsResult.data != null) {
      updates.hapticsEnabled = hapticsResult.data;
    }

    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },
}));
