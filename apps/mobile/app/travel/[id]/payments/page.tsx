import PaymentList from '@withbee/ui/payment-list';
import { SettlementButton } from '@withbee/ui/settlement-button';
import dayjs from 'dayjs';

dayjs.locale('ko');

interface TravelPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: TravelPageProps) {
  const { id } = params;

  return (
    <>
      <PaymentList travelId={Number(id)} />
      <SettlementButton travelId={Number(id)} />
    </>
  );
}
