import styles from './page.module.css';
import ItemGroup from '@withbee/ui/item-group';
import { Menu } from '@withbee/ui/menu';
import { getTravelHome } from '@withbee/apis';

interface LayoutProps {
  params: {
    id: string;
  };
  children: React.ReactNode;
}
export default async function Layout({ children, params }: LayoutProps) {
  const { id } = params;
  const travelHomeResponse = await getTravelHome(Number(id));

  return (
    <main className={styles.container}>
      <h2 className="title">공동 결제 내역</h2>
      <Menu className={styles.menu} travelInfo={travelHomeResponse.data!} />
      <ItemGroup />
      <div className={styles.childrenWrapper}>{children}</div>
    </main>
  );
}
