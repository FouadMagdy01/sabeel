import { createMMKV, MMKV } from "react-native-mmkv";
import { STORAGE_KEYS } from "./constants";
import type {
  StorageKey,
  StorageListener,
  StorageOptions,
  StorageResult,
  StorageValue,
} from "./types";

/**
 * Build a nested export shape from STORAGE_KEYS
 * so exportData().data has autocomplete support
 */
type StorageExportShape<T> = {
  [K in keyof T]?: T[K] extends string
    ? StorageValue
    : T[K] extends object
    ? StorageExportShape<T[K]>
    : never;
};

export type ExportedStorageData = StorageExportShape<typeof STORAGE_KEYS>;

/**
 * Default MMKV instance (lazy initialized)
 */
let storageInstance: MMKV | undefined;

/**
 * Storage listeners map
 */
const listeners = new Map<StorageKey, Set<StorageListener>>();

/**
 * Initialize storage with optional configuration
 */
export function initializeStorage(options?: StorageOptions): void {
  storageInstance = createMMKV({
    id: options?.id ?? "default",
    encryptionKey: options?.encryptionKey,
  });
}

/**
 * Get the storage instance (initialize if not already)
 */
function getStorage(): MMKV {
  if (!storageInstance) {
    initializeStorage();
  }
  return storageInstance!;
}

/**
 * Set a value in storage
 */
export function setItem<T extends StorageValue>(
  key: StorageKey,
  value: T
): StorageResult<T> {
  try {
    const storage = getStorage();

    if (value === null || value === undefined) {
      storage.remove(key);
      notifyListeners(key, null);
      return { success: true, data: value };
    }

    switch (typeof value) {
      case "string":
      case "number":
      case "boolean":
        storage.set(key, value);
        break;
      case "object":
        storage.set(key, JSON.stringify(value));
        break;
    }

    notifyListeners(key, value);
    return { success: true, data: value };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Get a value from storage
 */
export function getItem<T extends StorageValue = StorageValue>(
  key: StorageKey
): StorageResult<T | null> {
  try {
    const storage = getStorage();

    if (!storage.contains(key)) {
      return { success: true, data: null };
    }

    const stringValue = storage.getString(key);
    if (stringValue !== undefined) {
      try {
        return { success: true, data: JSON.parse(stringValue) as T };
      } catch {
        return { success: true, data: stringValue as T };
      }
    }

    const numberValue = storage.getNumber(key);
    if (numberValue !== undefined) {
      return { success: true, data: numberValue as T };
    }

    const booleanValue = storage.getBoolean(key);
    if (booleanValue !== undefined) {
      return { success: true, data: booleanValue as T };
    }

    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Remove a value from storage
 */
export function removeItem(key: StorageKey): StorageResult<void> {
  try {
    const storage = getStorage();
    storage.remove(key);
    notifyListeners(key, null);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Clear all storage
 */
export function clear(): StorageResult<void> {
  try {
    const storage = getStorage();
    storage.clearAll();
    listeners.forEach((_, key) => notifyListeners(key, null));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function getAllKeys(): StorageResult<StorageKey[]> {
  try {
    return {
      success: true,
      data: getStorage().getAllKeys() as StorageKey[],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function hasItem(key: StorageKey): boolean {
  try {
    return getStorage().contains(key);
  } catch {
    return false;
  }
}

export function getMultipleItems<T extends StorageValue = StorageValue>(
  keys: readonly StorageKey[]
): StorageResult<Partial<Record<StorageKey, T | null>>> {
  try {
    const result: Partial<Record<StorageKey, T | null>> = {};
    for (const key of keys) {
      result[key] = getItem<T>(key).data ?? null;
    }
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function setMultipleItems(
  items: readonly { key: StorageKey; value: StorageValue }[]
): StorageResult<void> {
  try {
    for (const { key, value } of items) {
      const res = setItem(key, value);
      if (!res.success) throw res.error;
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function removeMultipleItems(
  keys: readonly StorageKey[]
): StorageResult<void> {
  try {
    for (const key of keys) {
      const res = removeItem(key);
      if (!res.success) throw res.error;
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Add a listener for storage changes
 */
export function addListener<T extends StorageValue>(
  key: StorageKey,
  callback: StorageListener<T>
): () => void {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }

  const set = listeners.get(key)!;
  set.add(callback as StorageListener);

  return () => {
    set.delete(callback as StorageListener);
    if (set.size === 0) listeners.delete(key);
  };
}

function notifyListeners(key: StorageKey, value: StorageValue | null): void {
  listeners.get(key)?.forEach((listener) => listener(value));
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: readonly string[],
  value: StorageValue
): void {
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < path.length - 1; i++) {
    current[path[i]] ??= {};
    current = current[path[i]] as Record<string, unknown>;
  }
  current[path[path.length - 1]] = value;
}

/**
 * Export storage using nested semantic keys
 */
export function exportData(): StorageResult<ExportedStorageData> {
  try {
    const result: ExportedStorageData = {};

    for (const [groupKey, groupValue] of Object.entries(STORAGE_KEYS)) {
      if (typeof groupValue !== "object") continue;

      for (const [subKey, storageKey] of Object.entries(groupValue)) {
        const value = getItem(storageKey as StorageKey).data;
        if (value !== null && value !== undefined) {
          setNestedValue(
            result as Record<string, unknown>,
            [groupKey, subKey],
            value
          );
        }
      }
    }

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Import storage data using the same nested shape
 */
export function importData(data: ExportedStorageData): StorageResult<void> {
  try {
    for (const [groupKey, groupValue] of Object.entries(data)) {
      if (typeof groupValue !== "object" || !groupValue) continue;

      for (const [subKey, value] of Object.entries(groupValue)) {
        const storageKey = (STORAGE_KEYS as Record<string, any>)[groupKey]?.[
          subKey
        ] as StorageKey | undefined;

        if (storageKey && value !== undefined) {
          const res = setItem(storageKey, value as StorageValue);
          if (!res.success) throw res.error;
        }
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
