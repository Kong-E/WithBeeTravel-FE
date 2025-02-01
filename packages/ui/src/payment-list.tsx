'use client';

import type { PageResponse, SharedPayment } from '@withbee/types';
import styles from './payment-list.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Payment } from './payment';
import { PaymentSkeleton } from './payment-skeleton';
import { usePaymentParams } from '@withbee/hooks/usePaymentParams';
import { APIError, ERROR_MESSAGES } from '@withbee/exception';
import { getSharedPayments, useTravelHomeQuery } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';

interface PaymentListProps {
  travelId: number;
}

export default function PaymentList({ travelId }: PaymentListProps) {
  const { data: travelInfo } = useTravelHomeQuery(travelId);
  const { showToast } = useToast();
  const { travelStartDate } = travelInfo!;
  const { params } = usePaymentParams(travelStartDate);
  const { sortBy, startDate, endDate, memberId, category } = params;

  // Intersection Observer로 특정 요소가 화면에 보이는지 감지
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const getQueryParams = (page: number) => ({
    travelId,
    page,
    sortBy,
    startDate,
    endDate,
    ...(memberId && { memberId }),
    ...(category !== '전체' && { category }),
  });

  const {
    data: paymentList,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useSuspenseInfiniteQuery<PageResponse<SharedPayment>, APIError>({
    queryKey: [
      'payments',
      travelId,
      sortBy,
      startDate,
      endDate,
      memberId,
      category,
    ],
    queryFn: async ({ pageParam = 0 }: { pageParam?: unknown }) => {
      const response = await getSharedPayments(
        getQueryParams(pageParam as number),
      );
      return response.data as PageResponse<SharedPayment>;
    },
    getNextPageParam: (lastPage: PageResponse<SharedPayment>) => {
      if (lastPage?.last) return undefined;
      return lastPage?.number + 1;
    },
    initialPageParam: 0,
    staleTime: 1000 * 5 * 60, // 5분
  });

  // 모든 페이지의 결제내역을 하나의 배열로 합치기
  const payments =
    paymentList?.pages.flatMap((page) =>
      page && Array.isArray(page?.content) ? page.content : [],
    ) ?? [];

  // 날짜별로 결제 내역을 그룹화하는 함수
  const groupPaymentsByDate = (payments: SharedPayment[]) => {
    const grouped = payments.reduce(
      (acc: Record<string, SharedPayment[]>, payment) => {
        const date = dayjs(payment.paymentDate).format('YYYY년 MM월 DD일');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(payment);
        return acc;
      },
      {},
    );

    return Object.entries(grouped).sort(([dateA], [dateB]) => {
      return dayjs(dateB, 'YYYY년 MM월 DD일').diff(
        dayjs(dateA, 'YYYY년 MM월 DD일'),
      );
    });
  };

  /* // 에러 발생 시 토스트 메시지 출력
  useEffect(() => {
    if (!error) return;

    // throw new Error('에러 발생 from payment-list.tsx');

    console.error(
      'Error from payment-list.tsx:',
      error instanceof APIError,
      JSON.stringify(error),
    );

    if (error instanceof APIError) {
      if (error.code === 'VALIDATION-003') {
        if (startDate && endDate) {
          if (dayjs(startDate).isAfter(dayjs(endDate))) {
            updateParam('endDate', startDate);
          } else {
            updateParam('startDate', endDate);
          }
        }
        showToast.warning({
          message: ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES],
        });
      }
    }
  }, [error, startDate, endDate, updateParam, showToast]); */

  // 무한 스크롤 처리
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <AnimatePresence>
      <section className={styles.paymentContainer}>
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {sortBy === 'latest'
            ? groupPaymentsByDate(payments).map(([date, payments], index) => (
                <div
                  className={styles.paymentWrapper}
                  key={`payments-${date}-${index}`}
                >
                  <span className={styles.date}>{date}</span>
                  {payments.map((payment) => (
                    <Payment
                      key={payment.id}
                      travelId={travelId}
                      paymentInfo={payment}
                      travelInfo={travelInfo!}
                    />
                  ))}
                </div>
              ))
            : payments.map((payment) => (
                <Payment
                  key={payment.id}
                  travelId={travelId}
                  paymentInfo={payment}
                  travelInfo={travelInfo!}
                />
              ))}
          {!isFetching && <div ref={ref} />}
        </motion.div>
      </section>

      {isFetchingNextPage && !error && <PaymentSkeleton count={2} />}
    </AnimatePresence>
  );
}
