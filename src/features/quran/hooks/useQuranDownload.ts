import { useCallback, useEffect, useRef, useState } from 'react';

import {
  type DownloadStatus,
  cancelDownload,
  extractPages,
  getInitialStatus,
  startDownload,
} from '../services/quranDownloadService';

export function useQuranDownload() {
  const [status, setStatus] = useState<DownloadStatus | 'loading'>('loading');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // On mount: determine initial state and auto-recover
  useEffect(() => {
    void (async () => {
      try {
        const initial = await getInitialStatus();
        if (!mountedRef.current) return;

        if (initial === 'ready') {
          setStatus('ready');
          return;
        }

        if (initial === 'downloaded') {
          setStatus('extracting');
          await extractPages();
          if (mountedRef.current) setStatus('ready');
          return;
        }

        setStatus('idle');
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Recovery failed');
        setStatus('idle');
      }
    })();
  }, []);

  const handleStartDownload = useCallback(async () => {
    setError(null);
    setProgress(0);
    setStatus('downloading');

    try {
      await startDownload((p) => {
        if (mountedRef.current) setProgress(p);
      });

      if (!mountedRef.current) return;

      setStatus('extracting');
      await extractPages();
      if (mountedRef.current) setStatus('ready');
    } catch (err) {
      if (!mountedRef.current) return;
      // 'cancelled' is expected when user taps Cancel — don't show error
      if (err instanceof Error && err.message === 'cancelled') return;
      setError(err instanceof Error ? err.message : 'Download failed');
      setStatus('idle');
    }
  }, []);

  const handleCancelDownload = useCallback(async () => {
    setStatus('idle');
    setProgress(0);
    try {
      await cancelDownload();
    } catch {
      // ignore
    }
  }, []);

  return {
    status,
    progress,
    error,
    isReady: status === 'ready',
    startDownload: handleStartDownload,
    cancelDownload: handleCancelDownload,
  };
}
