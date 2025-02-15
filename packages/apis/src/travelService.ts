import { instance } from './instance';
import type { TravelMember } from '@withbee/types';
import {
  ErrorResponse,
  SuccessResponse,
  TravelHome,
  TravelFormData,
  TravelList,
} from '@withbee/types';

// 여행 생성
export const createTravel = async (
  travelName: string,
  isDomesticTravel: Boolean,
  travelCountries: string[],
  travelStartDate: string,
  travelEndDate: string,
): Promise<SuccessResponse<TravelFormData> | ErrorResponse> => {
  const response = instance.post<TravelFormData>('/api/travels', {
    body: JSON.stringify({
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    }),
  });

  return response;
};

// 여행 편집
export const editTravel = async (
  travelId: number,
  travelName: string,
  isDomesticTravel: Boolean,
  travelCountries: string[],
  travelStartDate: string,
  travelEndDate: string,
): Promise<SuccessResponse<TravelFormData> | ErrorResponse> => {
  const response = instance.patch<TravelFormData>(`/api/travels/${travelId}`, {
    body: JSON.stringify({
      travelId,
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    }),
  });

  return response;
};

//여행 목록
export const getTravelList = async (): Promise<
  SuccessResponse<TravelList[]> | ErrorResponse
> => {
  const response = instance.get<TravelList[]>(`/api/travels`, {
    cache: 'no-cache',
  });

  return response;
};

// 여행 멤버 불러오기
export const getTravelMembers = async (travelId: number) => {
  return await instance.get<TravelMember[]>(
    `/api/travels/${travelId}/members`,
    {
      cache: 'no-cache',
    },
  );
};

// 여행 홈 불러오기
export const getTravelHome = async (travelId: number) => {
  const response = await instance.get<TravelHome>(`/api/travels/${travelId}`, {
    cache: 'no-cache',
    // next: {
    //   tags: [`travel-${travelId}`], // 태그 기반 캐싱
    //   revalidate: 1000 * 1 * 60, // 1분
    // },
  });

  return (response as SuccessResponse<TravelHome>).data!;
};

export const changeTravelMainImage = async (
  travelId: string,
  formDataToSend: FormData,
) => {
  const response = await instance.patch(`/api/travels/${travelId}/main-image`, {
    body: formDataToSend,
    isMultipart: true,
  });
  return response;
};
