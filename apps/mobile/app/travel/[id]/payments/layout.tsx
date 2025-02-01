import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import ItemGroup from '@withbee/ui/item-group';
import { Menu } from '@withbee/ui/menu';
import { getSharedPayments, getTravelHome } from '@withbee/apis';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import dayjs from 'dayjs';

interface LayoutProps {
  params: {
    id: string;
  };
  children: React.ReactNode;
}
export default async function Layout({ children, params }: LayoutProps) {
  const { id } = params;

  const queryClient = new QueryClient();

  const { data: travelInfo } = await queryClient.fetchQuery({
    queryKey: ['travelHome', Number(id)],
    queryFn: () => getTravelHome(Number(id)),
    staleTime: 1000 * 60 * 5,
  });

  console.log('prefdtche', travelInfo);

  queryClient.prefetchInfiniteQuery({
    queryKey: [
      'payments',
      Number(id),
      'latest',
      dayjs(travelInfo?.travelStartDate)
        .subtract(2, 'month')
        .format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
      null,
      '전체',
    ],
    queryFn: ({ pageParam = 0 }) =>
      getSharedPayments({ travelId: Number(id), page: pageParam }),
    initialPageParam: 0,
    staleTime: 1000 * 60 * 1,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className={styles.container}>
        <Title label="공동 결제 내역" />
        <Menu className={styles.menu} travelId={Number(id)} />
        <ItemGroup />
        <div className={styles.childrenWrapper}>{children}</div>
      </main>
    </HydrationBoundary>
  );
}
