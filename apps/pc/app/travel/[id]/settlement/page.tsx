import styles from './page.module.css';
import '@withbee/styles';
import { Title } from '@withbee/ui/title';
import ModalWrapper from '../../../../components/ModalWrapper';
import Link from 'next/link';
import { Button } from '@withbee/ui/button';
import ExpenseDetails from '../../../../components/ExpenseDetails';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { SettlementDetails, getSettlementDetails } from '@withbee/apis';
import { SuccessResponse } from '@withbee/types';
import { redirect } from 'next/navigation';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES, isAPIError } from '@withbee/exception';
import OtherExpenseDetails from '../../../../components/OtherExpenseDetails';
import Image from 'next/image';

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { [key: string]: string };
}) {
  const travelId = Number(params.id);

  try {
    const response = (await getSettlementDetails(
      travelId,
    )) as SuccessResponse<SettlementDetails>;

    const {
      myTotalPayment,
      disagreeCount,
      totalPaymentAmounts,
      totalRequestedAmounts,
      myDetailPayments,
      others,
    } = response.data as SettlementDetails;

    const isModalOpen = searchParams['cancel'] === 'true'; // URL 파라미터로 모달 열기 여부를 결정
    const showHoneyCapsuleButton = disagreeCount < 1; // 허니캡슐 버튼 표시 여부

    // 'withHoneyCapsule' 클래스 추가 여부를 조건에 따라 설정
    const mainContentClass = showHoneyCapsuleButton
      ? `${styles.mainContent} ${styles.withHoneyCapsule}`
      : styles.mainContent;

    return (
      <div className={styles.container}>
        <h2 className="title">지출 상세 내역</h2>
        <div className={mainContentClass}>
          <div className={styles.summary}>
            <div className={styles.mainCard}>
              <div className={styles.summaryHeader}>
                <span>
                  <span className={styles.name}>{myTotalPayment.name}</span>
                  <span className={styles.name}>(나)</span>
                </span>
                <span
                  className={
                    myTotalPayment.totalPaymentCost >= 0
                      ? styles.positiveAmount
                      : styles.negativeAmount
                  }
                >
                  <span className={styles.suffixText}>총 </span>
                  {myTotalPayment.totalPaymentCost >= 0
                    ? `+${myTotalPayment.totalPaymentCost?.toLocaleString()}원`
                    : `${myTotalPayment.totalPaymentCost?.toLocaleString()}원`}
                  <span className={styles.suffixText}>
                    을{' '}
                    {myTotalPayment.totalPaymentCost >= 0 ? '받아요' : '보내요'}
                  </span>
                </span>
              </div>
              <div className={styles.summaryBody}>
                <div className={styles.completedStamp}>
                  {myTotalPayment.agreed && (
                    <div>
                      <Image
                        src="/imgs/settlement/stamp.png"
                        alt="stamp"
                        width={70}
                        height={70}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.summaryInfoWrapper}>
                  <div className={styles.summaryInfo}>
                    <span className={styles.label}>받을 금액 </span>
                    <span
                      className={styles.amount}
                    >{`${totalPaymentAmounts.toLocaleString()}원`}</span>
                  </div>
                  <div className={styles.summaryInfo}>
                    <span className={styles.label}>보낼 금액 </span>
                    <span
                      className={styles.amount}
                    >{`${totalRequestedAmounts.toLocaleString()}원`}</span>
                  </div>
                </div>
              </div>
              <ExpenseDetails myDetailPayments={myDetailPayments} />
            </div>
          </div>
          <OtherExpenseDetails others={others} />
          {disagreeCount > 0 && (
            <div
              className={
                myTotalPayment.agreed
                  ? styles.remainingUsersCompleted
                  : styles.remainingUsers
              }
            >
              <span>정산 완료까지 남은 인원 : </span>
              <strong>{disagreeCount}</strong>
              <span>명</span>
            </div>
          )}
          <div className={styles.btnWrapper}>
            {!myTotalPayment.agreed && (
              <Link href={{ pathname: `/travel/${params.id}/agreement` }}>
                <Button
                  label="동의하기"
                  size="xlarge"
                  className={styles.agreeBtn}
                />
              </Link>
            )}
            {showHoneyCapsuleButton && (
              <Link href={{ pathname: `/travel/${params.id}/honey-capsule` }}>
                <Button
                  label="허니캡슐 열어보기"
                  size="xlarge"
                  className={styles.honeyCapsuleBtn}
                />
              </Link>
            )}
            {!myTotalPayment.agreed && <ModalWrapper travelId={params.id} />}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (isAPIError(error))
      if (error.code === 'SETTLEMENT-002' || error.code === 'TRAVEL-001') {
        redirect(`/travel/${travelId}/settlement/pending?error=${error.code}`);
      }
  }
}
