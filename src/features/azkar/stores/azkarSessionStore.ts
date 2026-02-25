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
    setItem(STORAGE_KEYS.azkar.completedItems, [] as string[]);
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
        setItem(STORAGE_KEYS.azkar.completedItems, newCompleted);
      } else {
        set({
          currentRepeatCount: newCount,
          completedItems: newCompleted,
        });
        setItem(STORAGE_KEYS.azkar.currentRepeatCount, newCount);
        setItem(STORAGE_KEYS.azkar.completedItems, newCompleted);
      }
    } else {
      set({ currentRepeatCount: newCount });
      setItem(STORAGE_KEYS.azkar.currentRepeatCount, newCount);
    }
  },

  nextItem: () => {
    const { categoryId, currentItemIndex, completedItems } = get();
    if (!categoryId) return;

    const items = getItemsByCategory(categoryId);
    const nextIndex = Math.min(currentItemIndex + 1, items.length - 1);
    if (nextIndex === currentItemIndex) return;

    const currentItem = items[currentItemIndex];
    let newCompleted = completedItems;

    if (currentItem && !completedItems.includes(currentItem.id)) {
      newCompleted = [...completedItems, currentItem.id];
    }

    const nextItemData = items[nextIndex];
    const isNextCompleted = nextItemData ? newCompleted.includes(nextItemData.id) : false;
    const nextRepeatCount = isNextCompleted && nextItemData ? nextItemData.repeatCount : 0;

    set({
      currentItemIndex: nextIndex,
      currentRepeatCount: nextRepeatCount,
      completedItems: newCompleted,
    });
    setItem(STORAGE_KEYS.azkar.currentItemIndex, nextIndex);
    setItem(STORAGE_KEYS.azkar.currentRepeatCount, nextRepeatCount);
    setItem(STORAGE_KEYS.azkar.completedItems, newCompleted);
  },

  previousItem: () => {
    const { categoryId, currentItemIndex, completedItems } = get();
    if (!categoryId) return;

    const prevIndex = Math.max(currentItemIndex - 1, 0);
    if (prevIndex === currentItemIndex) return;

    const items = getItemsByCategory(categoryId);
    const prevItem = items[prevIndex];
    const isPrevCompleted = prevItem ? completedItems.includes(prevItem.id) : false;
    const prevRepeatCount = isPrevCompleted && prevItem ? prevItem.repeatCount : 0;

    set({ currentItemIndex: prevIndex, currentRepeatCount: prevRepeatCount });
    setItem(STORAGE_KEYS.azkar.currentItemIndex, prevIndex);
    setItem(STORAGE_KEYS.azkar.currentRepeatCount, prevRepeatCount);
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
      setItem(STORAGE_KEYS.azkar.completedItems, [] as string[]);
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
    const completedResult = getItem<string[]>(STORAGE_KEYS.azkar.completedItems);

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

    if (completedResult.data != null && Array.isArray(completedResult.data)) {
      updates.completedItems = completedResult.data;
    }

    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },
}));
