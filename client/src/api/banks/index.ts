import api from 'src/utils/axios';
import { useQuery } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export const useFetchBanks = () =>
  useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const { data } = await api.get(`/banks`);
      return data;
    },
  });
