import { create } from 'zustand';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';
import { RANDOM_ACTS_POOL, type RandomActDefinition } from '../constants/randomActs';
import type { PrayerName } from '../types';

interface DailyTodosState {
  date: string;
  completedPrayers: PrayerName[];
  completedAzkar: ('morning_azkar' | 'evening_azkar')[];
  completedRandomActs: string[];
  dailyRandomActs: RandomActDefinition[];
}

interface DailyTodosActions {
  togglePrayer: (name: PrayerName) => void;
  markAzkarCompleted: (category: 'morning_azkar' | 'evening_azkar') => void;
  toggleRandomAct: (id: string) => void;
  loadFromStorage: () => void;
}

interface PersistedData {
  date: string;
  completedPrayers: PrayerName[];
  completedAzkar: ('morning_azkar' | 'evening_azkar')[];
  completedRandomActs: string[];
  dailyRandomActIds: string[];
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function pickDailyRandomActs(dateStr: string): RandomActDefinition[] {
  // Seed from date for consistency
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = seed * 31 + dateStr.charCodeAt(i);
  }
  seed = Math.abs(seed);

  // Fisher-Yates partial shuffle to pick 2
  const pool = [...RANDOM_ACTS_POOL];
  const result: RandomActDefinition[] = [];
  for (let i = 0; i < 2 && pool.length > 0; i++) {
    const idx = seed % pool.length;
    result.push(pool[idx]);
    pool.splice(idx, 1);
    seed = Math.abs(seed * 7 + 13);
  }
  return result;
}

function persist(state: DailyTodosState): void {
  const data: PersistedData = {
    date: state.date,
    completedPrayers: state.completedPrayers,
    completedAzkar: state.completedAzkar,
    completedRandomActs: state.completedRandomActs,
    dailyRandomActIds: state.dailyRandomActs.map((a) => a.id),
  };
  setItem(STORAGE_KEYS.dailyTodos.data, data);
}

const today = getTodayDateString();

export const useDailyTodosStore = create<DailyTodosState & DailyTodosActions>((set, get) => ({
  date: today,
  completedPrayers: [],
  completedAzkar: [],
  completedRandomActs: [],
  dailyRandomActs: pickDailyRandomActs(today),

  togglePrayer: (name: PrayerName) => {
    const state = get();
    const isCompleted = state.completedPrayers.includes(name);
    const completedPrayers = isCompleted
      ? state.completedPrayers.filter((p) => p !== name)
      : [...state.completedPrayers, name];
    const newState = { ...state, completedPrayers };
    set({ completedPrayers });
    persist(newState);
  },

  markAzkarCompleted: (category: 'morning_azkar' | 'evening_azkar') => {
    const state = get();
    if (state.completedAzkar.includes(category)) return;
    const completedAzkar = [...state.completedAzkar, category];
    const newState = { ...state, completedAzkar };
    set({ completedAzkar });
    persist(newState);
  },

  toggleRandomAct: (id: string) => {
    const state = get();
    const isCompleted = state.completedRandomActs.includes(id);
    const completedRandomActs = isCompleted
      ? state.completedRandomActs.filter((a) => a !== id)
      : [...state.completedRandomActs, id];
    const newState = { ...state, completedRandomActs };
    set({ completedRandomActs });
    persist(newState);
  },

  loadFromStorage: () => {
    const result = getItem<PersistedData>(STORAGE_KEYS.dailyTodos.data);
    const currentDate = getTodayDateString();

    if (result.success && result.data?.date === currentDate) {
      // Restore saved state for today
      const saved = result.data;
      const dailyRandomActs = saved.dailyRandomActIds
        .map((id) => RANDOM_ACTS_POOL.find((a) => a.id === id))
        .filter((a): a is RandomActDefinition => a !== undefined);

      set({
        date: currentDate,
        completedPrayers: saved.completedPrayers,
        completedAzkar: saved.completedAzkar,
        completedRandomActs: saved.completedRandomActs,
        dailyRandomActs:
          dailyRandomActs.length > 0 ? dailyRandomActs : pickDailyRandomActs(currentDate),
      });
    } else {
      // New day — reset everything
      const dailyRandomActs = pickDailyRandomActs(currentDate);
      const newState: DailyTodosState = {
        date: currentDate,
        completedPrayers: [],
        completedAzkar: [],
        completedRandomActs: [],
        dailyRandomActs,
      };
      set(newState);
      persist(newState);
    }
  },
}));
