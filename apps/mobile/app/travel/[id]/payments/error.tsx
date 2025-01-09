'use client';

import { useToast } from '@withbee/hooks/useToast';
import { useEffect } from 'react';
import { PaymentError } from '@withbee/ui/payment-error';
import styles from './page.module.css';
import { APIError, ERROR_MESSAGES } from '@withbee/exception';

interface ErrorProps {
  error: APIError;
}

export default function Error({ error }: ErrorProps) {
  // const { showToast } = useToast();

  // useEffect(() => {
  //   showToast.error({
  //     message:
  //       ERROR_MESSAGES[error.message as keyof typeof ERROR_MESSAGES] ||
  //       '에러 발생 from app/travel/[id]/error.tsx',
  //   });
  // }, [error, showToast]);

  return (
    <div className={styles.errorContainer}>
      <PaymentError
        message1="해당하는 카테고리의"
        message2="결제 내역이 존재하지 않아요."
      />
    </div>
  );
}
