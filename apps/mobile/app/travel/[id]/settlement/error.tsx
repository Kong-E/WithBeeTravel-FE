'use client';

import { useToast } from '@withbee/hooks/useToast';
import { useEffect } from 'react';
import { PaymentError } from '@withbee/ui/payment-error';
import styles from './page.module.css';
import { APIError, ERROR_MESSAGES } from '@withbee/exception';
import { redirect } from 'next/navigation';

interface ErrorProps {
  error: APIError;
}

export default function Error({ error }: ErrorProps) {
  const { showToast } = useToast();

  useEffect(() => {
    if (error.code !== 'SETTLEMENT-002' && error.code !== 'TRAVEL-001') {
      showToast.error({
        message: ERROR_MESSAGES['COMMON'],
      });
      return;
    }
  }, [error, showToast]);
}
