import { Country } from 'country-state-city';

import type { SelectOption } from '@/common/components/Select';

/**
 * All countries sourced from country-state-city library.
 * Value is the ISO 3166-1 alpha-2 country code (lowercase), e.g. "eg", "us".
 */
export const COUNTRIES: SelectOption[] = Country.getAllCountries().map((country) => ({
  value: country.isoCode.toLowerCase(),
  label: country.name,
  icon: country.flag,
}));
