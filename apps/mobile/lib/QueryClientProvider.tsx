'use client';

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import useAPIError from '@withbee/hooks/useAPIError';
import { ReactNode } from 'react';

export const QueryClientComponentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { handleError } = useAPIError();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: true,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => handleError(error),
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
