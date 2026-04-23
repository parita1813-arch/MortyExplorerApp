import { useEffect, type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from '../store';
import { bootstrapFavourites } from '../store/slices/favouritesSlice';

const queryClient = new QueryClient();

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
