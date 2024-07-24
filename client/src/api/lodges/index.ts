import api from 'src/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'src/components/snackbar';
import { ILodgeBranch, ILodge } from 'src/types/hotel';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// ----------------------------------------------------------------------

export function useAddLodge(reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationKey: ['addLodge'],
    mutationFn: async (hotel: Partial<ILodge>) => {
      const res = api.post('/lodges', hotel);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lodges'],
        refetchType: 'active',
      });
      enqueueSnackbar('Branch Created Successfully!', { variant: 'success' });
      router.push(paths.dashboard.accommodation.lodge.branch.list);
      reset();
    },
    onError: () => {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    },
  });
}

export function useFetchLodges() {
  return useQuery({
    queryKey: ['lodgeList'],
    queryFn: async () => {
      const { data } = await api.get('/lodges');
      return data;
    },
  });
}

export const useFetchLodgeBranches = (search: string, perPage: string, page: string) =>
  useQuery<ILodgeBranch>({
    queryKey: ['lodges', { search, perPage, page }],
    queryFn: async () => {
      const { data } = await api.get<ILodgeBranch>(
        `/lodges/branches?search=${search}&perPage=${perPage}&page=${page}`
      );
      return data;
    },
  });

export function useUpdateLodgeBranch(reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationKey: ['updateLodgeBranch'],
    mutationFn: async ({ branch, id }: { branch: Partial<ILodgeBranch>; id: string }) => {
      const res = api.patch(`/lodges/branch/${id}`, branch);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['lodges', { id: data?.data?.id }],
        refetchType: 'active',
      });

      queryClient.setQueryData(['lodges', { id: data?.data?.id }], data?.data);
      enqueueSnackbar('Branch Updated Successfully!', { variant: 'success' });
      router.push(paths.dashboard.accommodation.lodge.branch.list);
      reset();
    },
    onError: () => {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    },
  });
}

export function useRemoveLodgeBranch() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationKey: ['removeLodgeBranch'],
    mutationFn: async (id: string) => {
      const res = api.delete(`/lodges/branch/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lodges'],
        refetchType: 'active',
      });

      enqueueSnackbar('Branch Removed Successfully!', { variant: 'success' });
      router.push('/dashboard/lodge/branch');
    },
    onError: () => {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    },
  });
}
