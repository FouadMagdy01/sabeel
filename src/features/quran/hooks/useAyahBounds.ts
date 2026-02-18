import { useEffect, useRef, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { type AyahBound, getAyahBoundsForPage } from '../services/quranDatabase';

export function useAyahBounds(page: number) {
  const db = useSQLiteContext();
  const dbRef = useRef(db);
  dbRef.current = db;

  const [bounds, setBounds] = useState<AyahBound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAyahBoundsForPage(dbRef.current, page)
      .then((data) => {
        setBounds(data);
      })
      .catch((err: Error) => {
        console.error('[useAyahBounds] ERROR:', err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return { bounds, loading, error };
}
