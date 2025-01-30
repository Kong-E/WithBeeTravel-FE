'use client';

import { PaymentError } from '@withbee/ui/payment-error';
import styles from './page.module.css';
import { APIError, ERROR_MESSAGES } from '@withbee/exception';

interface ErrorProps {
  error: APIError;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className={styles.errorContainer}>
      <PaymentError
        message1="해당하는 카테고리의"
        message2="결제 내역이 존재하지 않아요."
      />
    </div>
  );
}
