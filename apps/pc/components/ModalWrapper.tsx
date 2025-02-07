'use client';

import { Button } from '@withbee/ui/button';
import { Modal } from '@withbee/ui/modal';
import { useState } from 'react';
import styles from './../app/travel/[id]/settlement/page.module.css';
import { cancelSettlement } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { useRouter } from 'next/navigation';
import { ERROR_MESSAGES } from '@withbee/exception';

export default function ModalWrapper({ travelId }: { travelId: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handelCancelSettlement = async () => {
    const response = await cancelSettlement(travelId);

    setIsModalOpen(false);
    router.push(`/travel/${travelId}/settlement/canceled`);
  };

  return (
    <>
      <Button
        label="정산 취소하기"
        primary={false}
        size="xlarge"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="정산을 취소하시겠습니까?"
        closeLabel="정산 취소하기"
        onSubmit={handelCancelSettlement}
      >
        <p className={styles.subtitle}>
          정산 취소는 되돌릴 수 없으며,
          <br />
          모든 그룹원에게 알림이 전송됩니다.
        </p>
      </Modal>
    </>
  );
}
