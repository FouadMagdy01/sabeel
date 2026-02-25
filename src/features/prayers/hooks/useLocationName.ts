import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { getItem, setItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/storage/constants';

import type { YearlyPrayerData } from '../types';

interface LocationNameData {
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
}

function hasLocationChanged(
  cached: LocationNameData,
  lat: number,
  lng: number,
  threshold = 0.01
): boolean {
  if (cached.latitude === undefined || cached.longitude === undefined) return true;
  return (
    Math.abs(cached.latitude - lat) > threshold || Math.abs(cached.longitude - lng) > threshold
  );
}

async function reverseGeocodeWithRetry(
  latitude: number,
  longitude: number
): Promise<Location.LocationGeocodedAddress | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results.length > 0) return results[0];
    } catch {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  return null;
}

export function useLocationName(): LocationNameData {
  const [locationName, setLocationName] = useState<LocationNameData>(() => {
    const cached = getItem<LocationNameData>(STORAGE_KEYS.prayers.locationName);
    if (cached.success && cached.data) return cached.data;
    return { city: '', country: '' };
  });

  useEffect(() => {
    const resolve = async () => {
      const yearlyResult = getItem<YearlyPrayerData>(STORAGE_KEYS.prayers.yearlyData);
      if (!yearlyResult.success || !yearlyResult.data) return;

      const { latitude, longitude } = yearlyResult.data.location;

      // Skip if cached name is still valid for these coordinates
      const cached = getItem<LocationNameData>(STORAGE_KEYS.prayers.locationName);
      if (
        cached.success &&
        cached.data?.city &&
        !hasLocationChanged(cached.data, latitude, longitude)
      ) {
        setLocationName(cached.data);
        return;
      }

      const place = await reverseGeocodeWithRetry(latitude, longitude);
      if (place) {
        const data: LocationNameData = {
          city: place.city ?? place.subregion ?? formatCoordinates(latitude, longitude),
          country: place.country ?? '',
          latitude,
          longitude,
        };
        setLocationName(data);
        setItem(STORAGE_KEYS.prayers.locationName, data);
      } else {
        // Geocoding failed — use formatted coordinates as fallback
        const data: LocationNameData = {
          city: formatCoordinates(latitude, longitude),
          country: '',
          latitude,
          longitude,
        };
        setLocationName(data);
        setItem(STORAGE_KEYS.prayers.locationName, data);
      }
    };

    void resolve();
  }, []);

  return locationName;
}
