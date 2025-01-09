'use client';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useToast } from '@withbee/hooks/useToast';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

export const SWRProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();

  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          showToast.error({
            message:
              ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] ||
              '에러 발생 from SWRProvider',
          });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
