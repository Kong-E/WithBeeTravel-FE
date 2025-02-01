'use client';

import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
} from '@tanstack/react-query';
import useAPIError from '@withbee/hooks/useAPIError';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function makeQueryClient(handleError: (error: Error) => void) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: true,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => handleError(error),
    }),
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(handleError: (error: Error) => void) {
  if (typeof window === 'undefined') {
    // Server: 항상 새로운 query client를 만든다.
    return makeQueryClient(handleError);
  }

  // Browser: 이미 가지고 있지 않다면 새로운 query client를 만든다.
  // 이는 초기 렌더링 중에 React가 일시 중단(suspense)될 경우 새로운 client를 만들지 않도록 하기 위해서이다.
  if (!browserQueryClient) browserQueryClient = makeQueryClient(handleError);
  return browserQueryClient;
}

function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const { handleError } = useAPIError();
  const queryClient = getQueryClient(handleError);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
