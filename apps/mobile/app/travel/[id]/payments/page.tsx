import PaymentList from '@withbee/ui/payment-list';
import { Suspense } from 'react';
import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { getSharedPayments, getTravelHome } from '@withbee/apis';
import { SettlementButton } from '@withbee/ui/settlement-button';
import dayjs from 'dayjs';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import Error from './error';

dayjs.locale('ko');

interface TravelPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: TravelPageProps) {
  const { id } = params;
  const [travelHomeResponse, sharedPaymentsResponse] = await Promise.all([
    getTravelHome(Number(id)),
    getSharedPayments({ travelId: Number(id) }),
  ]);

  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentList
        travelId={Number(id)}
        initialPayments={sharedPaymentsResponse.data}
        travelInfo={travelHomeResponse.data!}
      />
      {travelHomeResponse.data?.travelEndDate &&
        dayjs(travelHomeResponse.data.travelEndDate).isBefore(dayjs()) && (
          <SettlementButton travelInfo={travelHomeResponse.data} />
        )}
    </Suspense>
  );
}
