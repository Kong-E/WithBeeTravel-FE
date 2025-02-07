import { revalidateTag } from 'next/cache';
import { instance } from './instance';
import { SuccessResponse, CurrencyUnitOptions } from '@withbee/types';

export const createManualSharedPayment = async (
  travelId: string,
  formDataToSend: FormData,
) => {
  const response = await instance.post<undefined>(
    `/api/travels/${travelId}/payments/manual`,
    {
      body: formDataToSend,
      isMultipart: true, // multipart/form-data로 전송
    },
  );

  revalidateTag(`sharedPayments-${travelId}`);
  return response;
};

export const getCurrencyUnitOptions = async (travelId: string) => {
  const response = await instance.get<CurrencyUnitOptions>(
    `/api/travels/${travelId}/payments/currency-unit`,
  );
  return response as SuccessResponse<CurrencyUnitOptions>;
};
