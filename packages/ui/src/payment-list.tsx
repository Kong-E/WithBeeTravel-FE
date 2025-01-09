'use client';

import type {
  PageResponse,
  SharedPayment,
  SortBy,
  SuccessResponse,
  TravelHome,
} from '@withbee/types';
import styles from './payment-list.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
// import { getSharedPayments } from '@withbee/apis';
import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Payment } from './payment';
import { useToast } from '@withbee/hooks/useToast';
import { PaymentSkeleton } from './payment-skeleton';
import { usePaymentParams } from '@withbee/hooks/usePaymentParams';
import { APIError, ERROR_MESSAGES, isAPIError } from '@withbee/exception';
import { GetSharedPaymentsParams } from '@withbee/apis';
import { useSession } from 'next-auth/react';

interface PaymentListProps {
  travelId: number;
  initialPayments?: PageResponse<SharedPayment> | undefined;
  travelInfo: TravelHome;
}

export default function PaymentList({
  travelId,
  travelInfo,
}: PaymentListProps) {
  const { params, updateParam } = usePaymentParams();
  const { data: session, status } = useSession();
  const { sortBy, startDate, endDate, memberId, category } = params;
  const { showToast } = useToast();
  const { travelStartDate, travelEndDate } = travelInfo;
  const { accessToken } = session?.user ?? {};

  const getSharedPayments = async ({
    travelId,
    page = 0,
    sortBy = 'latest',
    memberId,
    startDate,
    endDate,
    category,
  }: GetSharedPaymentsParams) => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      sortBy,
    });

    // 선택적 파라미터는 값이 있을 때만 추가
    if (memberId) searchParams.append('memberId', memberId.toString());
    if (startDate) searchParams.append('startDate', startDate);
    if (endDate) searchParams.append('endDate', endDate);
    if (category) searchParams.append('category', category);

    const response = await fetch(
      `http://localhost:8080/api/travels/${travelId}/payments?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response;
  };

  // Intersection Observer로 특정 요소가 화면에 보이는지 감지
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  const getQueryParams = (pageParam: number) => ({
    travelId,
    page: pageParam,
    sortBy: sortBy as SortBy,
    startDate:
      startDate ||
      dayjs(travelStartDate).subtract(2, 'month').format('YYYY-MM-DD'),
    endDate: endDate || travelEndDate,
    ...(memberId !== 0 && { memberId }),
    ...(category !== '전체' && { category }),
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<PageResponse<SharedPayment>, APIError>({
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

        const result = await response.json();

        if (!response.ok) {
          throw new APIError(result.code, result.message);
        }

        return result.data;
      },
      getNextPageParam: (lastPage: PageResponse<SharedPayment>) => {
        if (lastPage?.last) return undefined;
        return lastPage?.number + 1;
      },
      initialPageParam: 0,
      retry: false,
    });

  // 모든 페이지의 결제내역을 하나의 배열로 합치기
  const payments =
    data?.pages.flatMap((page) =>
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

  // 에러 발생 시 토스트 메시지 출력
  /* useEffect(() => {
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
      } else {
        showToast.error({
          message:
            ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] ||
            '에러 발생 from payment-list.tsx',
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

  // travelInfo에서 받아온 startDate와 endDate를 searchParams에 반영
  useEffect(() => {
    if (!startDate && !endDate && travelStartDate) {
      updateParam(
        'startDate',
        dayjs(travelStartDate).subtract(2, 'month').format('YYYY-MM-DD'),
      );
      updateParam('endDate', dayjs().format('YYYY-MM-DD'));
    }
  }, [startDate, endDate, travelStartDate, updateParam]);

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
                  key={`payments-${index}`}
                >
                  <span className={styles.date}>{date}</span>
                  {payments.map((payment) => (
                    <Payment
                      key={payment.id}
                      travelId={travelId}
                      paymentInfo={payment}
                      travelInfo={travelInfo}
                    />
                  ))}
                </div>
              ))
            : payments.map((payment) => (
                <Payment
                  key={payment.id}
                  travelId={travelId}
                  paymentInfo={payment}
                  travelInfo={travelInfo}
                />
              ))}
          <div ref={ref} />
        </motion.div>
      </section>

      {isFetchingNextPage && !error && <PaymentSkeleton count={2} />}
    </AnimatePresence>
  );
}
