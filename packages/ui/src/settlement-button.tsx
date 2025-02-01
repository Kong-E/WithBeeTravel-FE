'use client';

import { AnimatedButton } from './animated-button';
import { useRouter } from 'next/navigation';
import { requestSettlement, useTravelHomeQuery } from '@withbee/apis';
import styles from './settlement-button.module.css';
import dayjs from 'dayjs';

interface SettlementButtonProps {
  travelId: number;
  isPC?: boolean;
}

export function SettlementButton({
  travelId,
  isPC = false,
}: SettlementButtonProps) {
  const { data: travelInfo } = useTravelHomeQuery(travelId);
  const router = useRouter();

  const getButtonProps = () => {
    if (travelInfo?.settlementStatus === 'PENDING') {
      if (travelInfo.captain) {
        return {
          label: '정산 시작하기',
          variant: 'attentionSeek' as const,
          onClick: async () => {
            await requestSettlement(travelInfo.id);
            router.push(`/travel/${travelInfo.id}/settlement`);
          },
        };
      }
      return {
        label: '정산 대기 중',
        disabled: true,
      };
    }
    if (travelInfo?.settlementStatus === 'ONGOING') {
      return {
        label: travelInfo.isAgreed ? '정산 현황 확인' : '정산 동의하러 가기',
        onClick: () => {
          router.push(`/travel/${travelInfo.id}/settlement`);
        },
      };
    }
    return {
      label: '정산 내역 확인',
      onClick: () => {
        router.push(`/travel/${travelInfo?.id}/settlement`);
      },
    };
  };

  return (
    travelInfo?.travelEndDate &&
    dayjs(travelInfo.travelEndDate).isBefore(dayjs()) && (
      <div className={[styles.btnWrapper, isPC ? styles.pc : ''].join(' ')}>
        <AnimatedButton {...getButtonProps()} />
      </div>
    )
  );
}
