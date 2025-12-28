/**
 * Storage utility module
 * Provides type-safe storage operations using MMKV
 */

// Export all storage functions
export {
  initializeStorage,
  setItem,
  getItem,
  removeItem,
  clear,
  getAllKeys,
  hasItem,
  getMultipleItems,
  setMultipleItems,
  removeMultipleItems,
  addListener,
  getStorageSize,
  exportData,
  importData,
} from "./storage";

// Export hooks
export {
  useStorage,
  useStorageBoolean,
  useStorageObject,
  useStorageArray,
} from "./useStorage";

// Export types
export type {
  StorageValue,
  StorageResult,
  StorageListener,
  StorageOptions,
  StorageKey,
} from "./types";

export type {
  UseStorageOptions,
  UseStorageReturn,
} from "./useStorage";

// Export constants
export { STORAGE_KEYS } from "./constants";
