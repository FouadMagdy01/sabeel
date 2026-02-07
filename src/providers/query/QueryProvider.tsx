import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { mmkvPersister } from './mmkvPersister';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const { t } = useTranslation();

  const handleError = useCallback(
    (error: Error) => {
      Toast.show({
        type: 'error',
        text1: t('errors.title'),
        text2: error.message || t('errors.generic'),
      });
    },
    [t]
  );

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
        queryCache: new QueryCache({
          onError: handleError,
        }),

        mutationCache: new MutationCache({
          onError: handleError,
        }),
      }),
    [handleError]
  );

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: mmkvPersister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
