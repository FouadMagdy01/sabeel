import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const QIBLA_THRESHOLD = 3; // degrees
const SMOOTHING_FACTOR = 0.15;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function calculateQiblaBearing(lat: number, lng: number): number {
  const phi1 = toRadians(lat);
  const phi2 = toRadians(KAABA_LAT);
  const deltaLambda = toRadians(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const bearing = toDegrees(Math.atan2(y, x));
  return ((bearing % 360) + 360) % 360;
}

/**
 * Interpolate between two angles using the shortest arc.
 * Handles the 360°↔0° wraparound correctly.
 */
function lerpAngle(prev: number, next: number, alpha: number): number {
  let diff = next - prev;
  // Normalize diff to [-180, 180] for shortest arc
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  const result = prev + alpha * diff;
  return ((result % 360) + 360) % 360;
}

interface QiblaCompassState {
  heading: number;
  qiblaAngle: number;
  isFacingQibla: boolean;
  isLoading: boolean;
  error: string | null;
  permissionDenied: boolean;
  retry: () => void;
}

export function useQiblaCompass(): QiblaCompassState {
  const [heading, setHeading] = useState(0);
  const [qiblaBearing, setQiblaBearing] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const smoothedHeadingRef = useRef(0);

  const retry = useCallback(() => {
    setError(null);
    setPermissionDenied(false);
    setIsLoading(true);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (mounted) {
          setPermissionDenied(true);
          setError('permissionDenied');
          setIsLoading(false);
        }
        return;
      }

      // Get user location
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (mounted) {
          const bearing = calculateQiblaBearing(
            location.coords.latitude,
            location.coords.longitude
          );
          setQiblaBearing(bearing);
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setError('permissionDenied');
          setIsLoading(false);
        }
        return;
      }

      // Subscribe to OS-level compass heading (pre-calibrated, 0-360°)
      try {
        subscriptionRef.current = await Location.watchHeadingAsync((headingData) => {
          if (!mounted) return;
          const rawHeading = headingData.magHeading; // 0-360, pre-calibrated
          const smoothed = lerpAngle(smoothedHeadingRef.current, rawHeading, SMOOTHING_FACTOR);
          smoothedHeadingRef.current = smoothed;
          setHeading(smoothed);
        });
      } catch {
        if (mounted) {
          setError('sensorUnavailable');
          setIsLoading(false);
        }
      }
    }

    void init();

    return () => {
      mounted = false;
      subscriptionRef.current?.remove();
    };
  }, [retryCount]);

  // Calculate the angle the qibla indicator should rotate relative to device
  const qiblaAngle = (((qiblaBearing - heading) % 360) + 360) % 360;

  // Check if facing qibla within threshold
  const angleDiff = Math.abs(qiblaAngle);
  const isFacingQibla = angleDiff <= QIBLA_THRESHOLD || angleDiff >= 360 - QIBLA_THRESHOLD;

  return {
    heading,
    qiblaAngle,
    isFacingQibla,
    isLoading,
    error,
    permissionDenied,
    retry,
  };
}
