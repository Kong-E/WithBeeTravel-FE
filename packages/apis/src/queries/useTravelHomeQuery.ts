import { useQuery } from '@tanstack/react-query';
import { APIError } from '@withbee/exception';
import { TravelHome } from '@withbee/types';
import { getTravelHome } from '../travelService';

export const useTravelHomeQuery = (travelId: number) => {
  return useQuery<TravelHome, APIError>({
    queryKey: ['travelHome', travelId],
    queryFn: async () => {
      const response = await getTravelHome(travelId);
      return response.data!;
    },
    staleTime: 1000 * 60 * 5,
  });
};
