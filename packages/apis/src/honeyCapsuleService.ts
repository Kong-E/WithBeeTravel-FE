import { instance } from './instance';
import { SuccessResponse, HoneyCapsule } from '@withbee/types';

export const getHoneyCapsule = async (travelId: string) => {
  const response = await instance.get<HoneyCapsule[]>(
    `/api/travels/${travelId}/honeycapsule`,
  );

  return response as SuccessResponse<HoneyCapsule[]>;
};
