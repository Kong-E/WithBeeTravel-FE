import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { APIError } from '@withbee/exception';
import { TravelHome } from '@withbee/types';
import { getTravelHome } from '../travelService';

export const useTravelHomeQuery = (travelId: number) => {
  return useSuspenseQuery<TravelHome, APIError>({
    queryKey: ['travelHome', travelId],
    queryFn: () => getTravelHome(travelId),
    staleTime: 1000 * 60 * 5,
  });
};
