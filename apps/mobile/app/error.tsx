'use client';

import styles from './page.module.css';
import { useEffect } from 'react';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  // const { showToast } = useToast();

  // // SWR 사용하지 않는 페이지에서 에러 발생 시 토스트 메시지 출력
  // useEffect(() => {
  //   showToast.error({
  //     message:
  //       ERROR_MESSAGES[error.message as keyof typeof ERROR_MESSAGES] ||
  //       '에러 발생 from app/error.tsx',
  //   });
  // }, [error, showToast]);

  // console.error(error);

  return <div className={styles.errorContainer}>에러 발생. app/error</div>;
}
