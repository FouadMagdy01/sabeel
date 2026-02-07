import type { SelectOption } from '@/common/components/Select';

/**
 * Dummy country data for signup form
 * In production, this would be fetched from a backend API
 */
export const COUNTRIES: SelectOption[] = [
  { value: 'sa', label: 'Saudi Arabia', icon: '🇸🇦' },
  { value: 'ae', label: 'United Arab Emirates', icon: '🇦🇪' },
  { value: 'eg', label: 'Egypt', icon: '🇪🇬' },
  { value: 'jo', label: 'Jordan', icon: '🇯🇴' },
  { value: 'lb', label: 'Lebanon', icon: '🇱🇧' },
  { value: 'sy', label: 'Syria', icon: '🇸🇾' },
  { value: 'iq', label: 'Iraq', icon: '🇮🇶' },
  { value: 'kw', label: 'Kuwait', icon: '🇰🇼' },
  { value: 'qa', label: 'Qatar', icon: '🇶🇦' },
  { value: 'bh', label: 'Bahrain', icon: '🇧🇭' },
  { value: 'om', label: 'Oman', icon: '🇴🇲' },
  { value: 'ye', label: 'Yemen', icon: '🇾🇪' },
  { value: 'ma', label: 'Morocco', icon: '🇲🇦' },
  { value: 'dz', label: 'Algeria', icon: '🇩🇿' },
  { value: 'tn', label: 'Tunisia', icon: '🇹🇳' },
  { value: 'ly', label: 'Libya', icon: '🇱🇾' },
  { value: 'sd', label: 'Sudan', icon: '🇸🇩' },
  { value: 'pk', label: 'Pakistan', icon: '🇵🇰' },
  { value: 'bd', label: 'Bangladesh', icon: '🇧🇩' },
  { value: 'id', label: 'Indonesia', icon: '🇮🇩' },
  { value: 'my', label: 'Malaysia', icon: '🇲🇾' },
  { value: 'tr', label: 'Turkey', icon: '🇹🇷' },
  { value: 'us', label: 'United States', icon: '🇺🇸' },
  { value: 'gb', label: 'United Kingdom', icon: '🇬🇧' },
  { value: 'ca', label: 'Canada', icon: '🇨🇦' },
  { value: 'au', label: 'Australia', icon: '🇦🇺' },
  { value: 'de', label: 'Germany', icon: '🇩🇪' },
  { value: 'fr', label: 'France', icon: '🇫🇷' },
  { value: 'other', label: 'Other', icon: '🌍' },
];
