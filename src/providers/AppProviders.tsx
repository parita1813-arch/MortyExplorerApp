import { useEffect, type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from '../store';
import { bootstrapFavourites } from '../store/slices/favouritesSlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce request bursts and avoid hammering the API on quick interactions.
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes('429')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

/** Registers global providers and startup bootstrap logic. */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Bootstrap>{children}</Bootstrap>
      </QueryClientProvider>
    </Provider>
  );
}

function Bootstrap({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(bootstrapFavourites());
  }, [dispatch]);
  return children;
}
