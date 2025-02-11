import dynamic from 'next/dynamic';
import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import { Title } from '@withbee/ui/title';
import { FriendImage } from '@withbee/ui/friend-image';
import Link from 'next/link';
import { getTravelHome } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import { formatDateWithSlash } from '@withbee/utils';
import { InviteCodeButton } from './invite-code-button';
import styles from './page.module.css';
import Image from 'next/image';
import TravelMainImage from '../../../components/TravelMainImage';
import { Suspense } from 'react';

const BarChart = dynamic(
  () => import('@withbee/ui/chart').then((mod) => mod.BarChart), // named export 처리
  { ssr: false }, // SSR 비활성화
);

interface TravelHomeProps {
  params: {
    id: string;
  };
}
export default async function TravelDetailPage({ params }: TravelHomeProps) {
  const travelId = Number(params.id);
  const response = await getTravelHome(travelId);

  const statistics = Object.entries(response.statistics);
  const travelCountriesCount = response.countries?.length;

  return (
    <Suspense fallback={<div></div>}>
      <div className={styles.container}>
        <Title label="여행 홈" />
        <div className={styles.subContainer}>
          <div className={styles.subtitleContainer}>
            <p className={styles.date}>
              {formatDateWithSlash(response.travelStartDate)} ~{' '}
              {formatDateWithSlash(response.travelEndDate)}
            </p>
            <div className={styles.subtitleWrapper}>
              <h2 className={styles.subtitle}>{response.travelName}</h2>
              <Link
                href={`/travel/${travelId}/form?mode=edit`}
                className={styles.button}
              >
                <Image src="/edit.png" alt="edit" width={19} height={17.94} />
              </Link>
            </div>
          </div>
          <TravelMainImage travelId={travelId} image={response.mainImage} />

          {response.isDomesticTravel ? (
            <Item label="국내여행" />
          ) : (
            <div className={styles.tagWrapper}>
              {response.countries.map((country) => (
                <Item
                  key={country}
                  label={travelCountriesCount < 2 ? `${country} 여행` : country}
                />
              ))}
            </div>
          )}
          <div className={styles.friendsWrapper}>
            {response.travelMembers &&
              response.travelMembers.map((member) => (
                <FriendImage
                  key={member.id}
                  src={member.profileImage}
                  isGroup={response.travelMembers.length > 1}
                />
              ))}
          </div>
        </div>

        <div className={styles.btnWrapper}>
          <Link href={`/travel/${travelId}/payments`}>
            <Button label="그룹 결제 내역" />
          </Link>

          {response.settlementStatus !== 'DONE' ? (
            <InviteCodeButton travelId={travelId} />
          ) : (
            <Link href={`/travel/${travelId}/honey-capsule`}>
              <Button label="허니캡슐 열어보기" primary={false} />
            </Link>
          )}
        </div>
        {statistics.length !== 0 && (
          <BarChart
            expenses={statistics.map(([key, value]) => ({
              category: key,
              amount: value,
            }))}
          />
        )}
      </div>
    </Suspense>
  );
}
