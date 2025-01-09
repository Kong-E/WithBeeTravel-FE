'use client';
import { useEffect, useState } from 'react';
import { useToast } from '@withbee/hooks/useToast';
import { changeTravelMainImage } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import styles from './TravelMainImage.module.css';
import Image from 'next/image';

interface TravelMainImageProps {
  travelId: number;
  image?: string;
}

export default function TravelMainImage({
  travelId,
  image,
}: TravelMainImageProps) {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | undefined>(image);
  const [mainImage, setMainImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleMainImageChange = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('image', mainImage ? mainImage : new Blob());

    const response = await changeTravelMainImage(
      travelId.toString(),
      formDataToSend,
    );
  };

  useEffect(() => {
    if (mainImage) {
      handleMainImageChange();
    }
  }, [mainImage]);

  return (
    <>
      <input
        id="mainImageFileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.mainImageInput}
      />
      <label htmlFor="mainImageFileInput" className={styles.imgWrapper}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="main image"
            layout="fill"
            objectFit="cover"
            className={styles.mainImage}
          />
        )}
      </label>
    </>
  );
}
