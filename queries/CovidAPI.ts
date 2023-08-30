import { useQuery } from '@tanstack/react-query';
import CovidAPI, {
  GetAllCountryStatsRequestParams,
} from '../constants/CovidAPI';

export const useGetGlobalStats = () =>
  useQuery({
    queryKey: ['GET_GLOBAL_STATS'],
    queryFn: CovidAPI.getGlobalStats,
  });

export const useGetCountryStats = (country: string) =>
  useQuery({
    queryKey: ['GET_COUNTRY_STATS', country],
    queryFn: () => CovidAPI.getCountryStats(country),
  });
