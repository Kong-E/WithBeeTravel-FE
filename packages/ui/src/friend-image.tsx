/* eslint-disable no-redeclare */
import Image from 'next/image';
import styles from './friend-image.module.css';
import { HTMLAttributes } from 'react';

interface FriendImageProps extends HTMLAttributes<HTMLImageElement> {
  src: number;
  size?: number;
  className?: string;
  isGroup?: boolean;
}

export const FriendImage = ({
  src,
  size = 40,
  className,
  isGroup = false,
}: FriendImageProps) => {
  // 1-10 사이의 숫자로 제한
  const safeNumber = Math.max(1, Math.min(10, Number(src))) || 5;

  return (
    <Image
      src={`/imgs/friends/${safeNumber}.png`}
      alt={`Friend ${safeNumber}`}
      width={size}
      height={size}
      className={[styles.friend, isGroup && styles.isGroup, className].join(
        ' ',
      )}
    />
  );
};
