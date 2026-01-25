import { useEffect, useState, useCallback } from 'react';
import { getItem, setItem, removeItem, addListener } from './storage';
import type { StorageKey, StorageValue } from './types';

/**
 * Hook options
 */
export interface UseStorageOptions<T extends StorageValue> {
  /**
   * Default value if key doesn't exist
   */
  defaultValue?: T;

  /**
   * Initialize storage with default value if key doesn't exist
   */
  initializeWithDefault?: boolean;
}

/**
 * Hook return type
 */
export interface UseStorageReturn<T extends StorageValue> {
  /**
   * Current value from storage
   */
  value: T | null;

  /**
   * Set a new value
   */
  setValue: (newValue: T | null) => void;

  /**
   * Remove the value from storage
   */
  removeValue: () => void;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error state
   */
  error: Error | null;

  /**
   * Refresh the value from storage
   */
  refresh: () => void;
}

/**
 * React hook for reactive storage access
 * Automatically syncs with storage changes and provides setter/getter
 *
 * @example
 * ```typescript
 * const { value, setValue } = useStorage(STORAGE_KEYS.preferences.theme, {
 *   defaultValue: 'light'
 * });
 *
 * // Use the value
 * console.log(value); // 'light' or stored value
 *
 * // Update the value
 * setValue('dark');
 * ```
 */
export function useStorage<T extends StorageValue = StorageValue>(
  key: StorageKey,
  options?: UseStorageOptions<T>
): UseStorageReturn<T> {
  const { defaultValue, initializeWithDefault = false } = options || {};

  const [value, setStateValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial value
  const loadValue = useCallback(() => {
    setLoading(true);
    setError(null);

    const result = getItem<T>(key);

    if (!result.success) {
      setError(result.error || new Error('Failed to get item'));
      setStateValue(defaultValue ?? null);
      setLoading(false);
      return;
    }

    // If value doesn't exist and we should initialize with default
    if (result.data === null && defaultValue !== undefined && initializeWithDefault) {
      const setResult = setItem(key, defaultValue);
      if (setResult.success) {
        setStateValue(defaultValue);
      } else {
        setError(setResult.error || new Error('Failed to set default value'));
        setStateValue(defaultValue);
      }
    } else {
      setStateValue(result.data ?? defaultValue ?? null);
    }

    setLoading(false);
  }, [key, defaultValue, initializeWithDefault]);

  // Load value on mount and when key changes
  useEffect(() => {
    loadValue();
  }, [loadValue]);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = addListener<T>(key, (newValue) => {
      setStateValue(newValue ?? defaultValue ?? null);
    });

    return unsubscribe;
  }, [key, defaultValue]);

  // Set value function
  const setValue = useCallback(
    (newValue: T | null) => {
      const result = setItem(key, newValue);

      if (!result.success) {
        setError(result.error || new Error('Failed to set item'));
      } else {
        setError(null);
        setStateValue(newValue ?? defaultValue ?? null);
      }
    },
    [key, defaultValue]
  );

  // Remove value function
  const removeValue = useCallback(() => {
    const result = removeItem(key);

    if (!result.success) {
      setError(result.error || new Error('Failed to remove item'));
    } else {
      setError(null);
      setStateValue(defaultValue ?? null);
    }
  }, [key, defaultValue]);

  // Refresh function
  const refresh = useCallback(() => {
    loadValue();
  }, [loadValue]);

  return {
    value,
    setValue,
    removeValue,
    loading,
    error,
    refresh,
  };
}

/**
 * Hook for boolean storage values with toggle functionality
 *
 * @example
 * ```typescript
 * const { value, toggle, setValue } = useStorageBoolean(
 *   STORAGE_KEYS.preferences.notifications_enabled,
 *   { defaultValue: true }
 * );
 * ```
 */
export function useStorageBoolean(
  key: StorageKey,
  options?: UseStorageOptions<boolean>
): UseStorageReturn<boolean> & { toggle: () => void } {
  const storageReturn = useStorage<boolean>(key, options);

  const toggle = useCallback(() => {
    storageReturn.setValue(!storageReturn.value);
  }, [storageReturn]);

  return {
    ...storageReturn,
    toggle,
  };
}

/**
 * Hook for object storage values with merge functionality
 *
 * @example
 * ```typescript
 * const { value, merge } = useStorageObject<UserPreferences>(
 *   STORAGE_KEYS.user_preferences,
 *   { defaultValue: { theme: 'light', language: 'en' } }
 * );
 *
 * // Merge partial updates
 * merge({ theme: 'dark' }); // Only updates theme, keeps language
 * ```
 */
export function useStorageObject<T extends object>(
  key: StorageKey,
  options?: UseStorageOptions<T>
): UseStorageReturn<T> & { merge: (partial: Partial<T>) => void } {
  const storageReturn = useStorage<T>(key, options);

  const merge = useCallback(
    (partial: Partial<T>) => {
      const currentValue = storageReturn.value || ({} as T);
      const merged = { ...currentValue, ...partial };
      storageReturn.setValue(merged);
    },
    [storageReturn]
  );

  return {
    ...storageReturn,
    merge,
  };
}

/**
 * Hook for array storage values with array manipulation methods
 *
 * @example
 * ```typescript
 * const { value, push, remove, clear } = useStorageArray<string>(
 *   STORAGE_KEYS.recent_searches,
 *   { defaultValue: [] }
 * );
 *
 * push('new search');
 * remove(0); // Remove by index
 * ```
 */
export function useStorageArray<T>(
  key: StorageKey,
  options?: UseStorageOptions<T[]>
): UseStorageReturn<T[]> & {
  push: (item: T) => void;
  remove: (index: number) => void;
  clear: () => void;
  filter: (predicate: (item: T) => boolean) => void;
} {
  const storageReturn = useStorage<T[]>(key, options);

  const push = useCallback(
    (item: T) => {
      const currentValue = storageReturn.value || [];
      storageReturn.setValue([...currentValue, item]);
    },
    [storageReturn]
  );

  const remove = useCallback(
    (index: number) => {
      const currentValue = storageReturn.value || [];
      const newValue = currentValue.filter((_, i) => i !== index);
      storageReturn.setValue(newValue);
    },
    [storageReturn]
  );

  const clear = useCallback(() => {
    storageReturn.setValue([]);
  }, [storageReturn]);

  const filter = useCallback(
    (predicate: (item: T) => boolean) => {
      const currentValue = storageReturn.value || [];
      const filtered = currentValue.filter(predicate);
      storageReturn.setValue(filtered);
    },
    [storageReturn]
  );

  return {
    ...storageReturn,
    push,
    remove,
    clear,
    filter,
  };
}
