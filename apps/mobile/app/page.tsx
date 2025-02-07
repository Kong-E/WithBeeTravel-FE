'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@withbee/ui/button';
import { Title } from '@withbee/ui/title';
import { Modal } from '@withbee/ui/modal';
import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import { getAccountList, getIsCard, postConnectedAccount } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useToast } from '@withbee/hooks/useToast';
import { mutate } from 'swr';

// Account
interface Account {
  accountId: number;
  product: string;
  accountNumber: string;
}

const CardIssuancePage = () => {
  const [issuanceState, setIssuanceState] = useState('initial');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isCardIssuance, setIsCardIssuance] = useState(false);

  const router = useRouter();

  // 계좌 리스트 조회
  const { data: AccountListData } = useSWR('accounts', getAccountList);
  const accountList =
    AccountListData && 'data' in AccountListData ? AccountListData.data : [];

  // 위비카드연결여부
  const { data: isCardData, error } = useSWR('isCard', getIsCard);

  const isLoading = !isCardData && !error;
  const hasCard =
    isCardData && 'data' in isCardData && isCardData.data
      ? isCardData.data.connectedWibeeCard
      : undefined;

  const handleIssuance = () => {
    mutate((key: string) => key.startsWith('isCard'));
    setIsCardIssuance(true);
    setIsAccountModalOpen(true);
  };

  const handleAccountSelection = (account: Account) => {
    if (selectedAccount?.accountId === account.accountId) {
      setSelectedAccount(null);
    } else {
      setSelectedAccount(account);
    }
  };

  const handleModalSubmit = async () => {
    if (selectedAccount) {
      isCardIssuance ? selectedAccount.accountNumber : '';
      const response = await postConnectedAccount(
        selectedAccount.accountId,
        isCardIssuance,
      );

      setIsAccountModalOpen(false);

      if (isCardIssuance) {
        setIssuanceState('processing');
        setTimeout(() => {
          setIssuanceState('complete');
        }, 5000);
      } else {
        router.push('/travel');
      }
    } else {
      alert('계좌를 선택해주세요.');
    }
  };

  const handleSkipIssuance = () => {
    setIsCardIssuance(false);
    setIsAccountModalOpen(true);
  };

  const rotationDuration = 2.8;
  const circleSegments = Array.from({ length: 22 }, (_, i) => i);

  const formatAccountNumber = (accountNumber: string) => {
    // 계좌번호가 13자리인 경우에만 적용
    if (accountNumber.length === 13) {
      return `${accountNumber.slice(0, 4)}-${accountNumber.slice(4, 7)}-${accountNumber.slice(7)}`;
    }
    return accountNumber; // 13자리가 아닐 경우 그대로 반환
  };

  return (
    <div className={styles.container}>
      <Title label="카드 혜택" disableBack={true} />
      <AnimatePresence mode="wait">
        {issuanceState === 'initial' && (
          <motion.div
            className={styles.cardWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className={styles.title}>위비 트래블 체크 카드</h1>
            <motion.div className={styles.withbeeCardWrap}>
              <Image
                src="https://m.wooricard.com/webcontent/cdPrdImgFileList/2024/6/7/6be0c887-7ff7-49bb-80a9-711e66879de6.gif"
                alt="위비트래블 카드"
                width={120}
                height={180}
                quality={100}
                className={styles.withbeeCard}
              />
            </motion.div>

            <div className={styles.benefitsContainer}>
              {[
                {
                  icon: '/imgs/cardBenefits/2.png',
                  title: '여행 공동 지출 관리 서비스',
                  desc: '여행 종료 후 결제 내역을 바탕으로 멤버별 지출 금액을 자동 계산',
                },
                {
                  icon: '/imgs/cardBenefits/1.png',
                  title: '해외 가맹점 이용수수료 면제',
                  desc: '국제브랜드 수수료(Mastercard 1%) 및 해외서비스 수수료(거래 건당 US$0.5)면제',
                },

                {
                  icon: '/imgs/cardBenefits/3.png',
                  title: '쿠팡, 배민, 스타벅스 5% 캐시백',
                  desc: '공식 앱 및 홈페이지를 통한 온라인 결제 건에 한함',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className={styles.benefitCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.benefitIcon}>
                    <Image
                      src={benefit.icon}
                      alt={benefit.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className={styles.benefitContent}>
                    <div className={styles.benefitTitle}>{benefit.title}</div>
                    <div className={styles.benefitDesc}>{benefit.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.btnWrap}>
              {isLoading && (
                <Button
                  label="로딩 중..."
                  className={styles.loadingButton}
                  disabled
                />
              )}
              {!isLoading &&
                (hasCard ? (
                  <Link href="/travel">
                    <Button
                      label="윗비트래블 시작하기"
                      className={styles.moveTrip}
                    />
                  </Link>
                ) : (
                  <>
                    <Button label="발급받기" onClick={handleIssuance} />
                    <div
                      className={styles.skipText}
                      onClick={() => setIsAccountModalOpen(true)}
                    >
                      카드 발급 없이 참가하기
                    </div>
                  </>
                ))}
            </div>
          </motion.div>
        )}

        {issuanceState === 'processing' && (
          <motion.div
            className={styles.processingContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.beeCirclePath}>
              <div className={styles.trailContainer}>
                {circleSegments.map((index) => (
                  <motion.div
                    key={index}
                    className={styles.trailSegment}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: rotationDuration / 2,
                      repeat: Infinity,
                      delay: (index * rotationDuration) / circleSegments.length,
                      ease: 'easeInOut',
                    }}
                    style={{
                      transform: `rotate(${index * (360 / circleSegments.length)}deg)`,
                    }}
                  />
                ))}
              </div>
              <motion.div
                className={styles.beeWrapper}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: rotationDuration,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div className={styles.bee}>
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Honeybee.png"
                    alt="Honeybee"
                    width="55"
                    height="50"
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>
            <motion.p
              className={styles.processingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              위비트래블 카드를 발급하고 있습니다.
            </motion.p>
            <motion.p
              className={styles.processingText2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              조금만 기다려주세요.
            </motion.p>
          </motion.div>
        )}
        {/* 발급 완료 */}
        {issuanceState === 'complete' && (
          <motion.div
            className={styles.completeContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <motion.div
              className={styles.completeCard}
              initial={{ y: 20, rotateY: 0 }}
              animate={{ y: 0, rotateY: [0, 180, 270, 360] }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 28,
                times: [0, 0.4, 0.6, 1],
                duration: 4,
                ease: 'easeInOut',
              }}
              style={{ perspective: 1000 }}
            >
              <Image
                src="https://d1c5n4ri2guedi.cloudfront.net/card/2700/card_img/34201/2700card.png"
                alt="발급된 카드"
                className={styles.completeCardImg}
                width={120}
                height={190}
                quality={100}
              />
            </motion.div>
            <motion.h2
              className={styles.completeTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              카드 발급이 완료되었습니다!
            </motion.h2>
            <motion.div
              className={styles.completeMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              친구를 초대하고 여행을 만들어 보세요.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0], // 위아래로 움직임
                scale: [1, 1.02, 1], // 약간 확대 축소
                rotate: [-2, 2, -2], // 좌우로 회전
              }}
              whileTap={{
                scale: 0.97,
                transition: {
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 300,
                },
              }}
              transition={{
                delay: 0.6,
                type: 'spring',
                bounce: 0.3,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  times: [0, 0.2, 0.5],
                  ease: [0.25, 0.1, 0.25, 1],
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  times: [0, 0.2, 0.5],
                  ease: [0.25, 0.1, 0.25, 1],
                },
                rotate: {
                  duration: 0.9,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                },
              }}
            >
              <Link href="/travel">
                <Button label="여행 생성하러 가기" className={styles.goTrip} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title="여행에 연결할 계좌를 선택해주세요."
        closeLabel={
          Array.isArray(accountList) && accountList.length > 0
            ? '선택 완료'
            : '계좌 생성하러 가기'
        }
        onSubmit={
          Array.isArray(accountList) && accountList.length > 0
            ? handleModalSubmit
            : () => {
                // 계좌 목록이 비어있을 때 링크로 이동
                router.push('/banking/create');
              }
        }
      >
        <div className={styles.accountList}>
          {Array.isArray(accountList) && accountList.length > 0 ? (
            accountList.map((account: Account) => (
              <div
                key={account.accountId}
                className={styles.accountItem}
                onClick={() => handleAccountSelection(account)}
              >
                <div className={styles.accountInfo}>
                  <p className={styles.accountNumber}>
                    {formatAccountNumber(account.accountNumber)}
                  </p>
                  <p className={styles.product}>{account.product}</p>
                </div>
                {selectedAccount?.accountId === account.accountId ? (
                  <Image
                    src="/check.png"
                    alt="select"
                    width={30}
                    height={30}
                    className={styles.selectIcon}
                  />
                ) : (
                  <Image
                    src="/uncheck.png"
                    alt="not select"
                    width={30}
                    height={30}
                    className={styles.notSelectIcon}
                  />
                )}
              </div>
            ))
          ) : (
            <p>연결된 계좌가 없습니다.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CardIssuancePage;
