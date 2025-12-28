import { STORAGE_KEYS } from "./constants";

/**
 * Storage value types that can be stored
 */
export type StorageValue = string | number | boolean | object | null;

/**
 * Storage result type for operations
 */
export interface StorageResult<T = StorageValue> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Storage listener callback type
 */
export type StorageListener<T = StorageValue> = (value: T | null) => void;

/**
 * Storage options for configuration
 */
export interface StorageOptions {
  /**
   * MMKV instance ID for multiple storage instances
   */
  id?: string;

  /**
   * Encryption key for secure storage
   */
  encryptionKey?: string;
}

/**
 * Extract all storage keys from STORAGE_KEYS constant
 */
type ExtractStorageKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends string
        ? T[K]
        : T[K] extends object
        ? ExtractStorageKeys<T[K]>
        : never;
    }[keyof T]
  : never;

/**
 * Valid storage key type based on STORAGE_KEYS
 */
export type StorageKey = ExtractStorageKeys<typeof STORAGE_KEYS>;
