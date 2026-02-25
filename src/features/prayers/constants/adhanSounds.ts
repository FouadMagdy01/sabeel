export interface AdhanSound {
  id: string;
  nameKey: string;
  filename: string | null;
}

export const ADHAN_SOUNDS: AdhanSound[] = [
  { id: 'default', nameKey: 'screens.adhanSound.defaultSound', filename: null },
  {
    id: 'adhan_mansour',
    nameKey: 'screens.adhanSound.sounds.mansour',
    filename: 'adhan_mansour',
  },
  {
    id: 'adhan_hafiz_mustafa',
    nameKey: 'screens.adhanSound.sounds.hafizMustafa',
    filename: 'adhan_hafiz_mustafa',
  },
  {
    id: 'adhan_dubai_mishary',
    nameKey: 'screens.adhanSound.sounds.dubaiMishary',
    filename: 'adhan_dubai_mishary',
  },
  {
    id: 'adhan_mashary',
    nameKey: 'screens.adhanSound.sounds.mashary',
    filename: 'adhan_mashary',
  },
];

export const DEFAULT_ADHAN_SOUND = 'adhan_mansour';
