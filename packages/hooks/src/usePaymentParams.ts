'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { SortBy } from '@withbee/types';
import dayjs from 'dayjs';

export type ParamKey =
  | 'sortBy'
  | 'startDate'
  | 'endDate'
  | 'memberId'
  | 'category';
export type ParamValue = string | number | SortBy | undefined;

export function usePaymentParams(travelStartDate: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateParam = (key: ParamKey, value: ParamValue) => {
    const params = new URLSearchParams(searchParams);

    switch (key) {
      case 'memberId':
        if (value && Number(value) !== 0) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
        break;

      case 'category':
        if (value && value !== '전체') {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
        break;

      case 'sortBy':
        if (value && value !== 'latest') {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
        break;

      case 'startDate':
      case 'endDate':
        if (value) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
        break;
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return {
    params: {
      sortBy: searchParams.get('sortBy') || 'latest',
      startDate:
        searchParams.get('startDate') ||
        dayjs(travelStartDate).subtract(2, 'month').format('YYYY-MM-DD'),
      endDate: searchParams.get('endDate') || dayjs().format('YYYY-MM-DD'),
      memberId: Number(searchParams.get('memberId')) || 0,
      category: searchParams.get('category') || '전체',
    },
    updateParam,
  };
}
