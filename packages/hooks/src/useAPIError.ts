'use client';

import { useToast } from './useToast';
import { ERROR_MESSAGES, isAPIError } from '@withbee/exception';

const useAPIError = () => {
  const { showToast } = useToast();

  const handleError = (error: Error) => {
    showToast.error({
      message: isAPIError(error)
        ? ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
        : ERROR_MESSAGES.COMMON,
    });

    // throw error;
  };

  return { handleError };
};

export default useAPIError;
