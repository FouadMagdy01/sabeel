export interface TasbeehPhrase {
  id: string;
  arabic: string;
  transliteration: string;
  translationKey: string;
  defaultTarget: number;
}

export interface TasbeehState {
  currentCount: number;
  selectedPhraseId: string;
  targetCount: number;
  hapticsEnabled: boolean;
}

export interface TasbeehActions {
  increment: () => void;
  reset: () => void;
  setSelectedPhrase: (phraseId: string) => void;
  setTargetCount: (target: number) => void;
  toggleHaptics: () => void;
  loadFromStorage: () => void;
}

export type TasbeehStore = TasbeehState & TasbeehActions;
