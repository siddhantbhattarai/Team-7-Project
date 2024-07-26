import api from 'src/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'src/components/snackbar';
import { IUserItem, IUserUniqueFields } from 'src/types/user';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { IJobVacancy } from 'src/types/job';

// ----------------------------------------------------------------------

export const useFetchJobs = () =>
  useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await api.get(`/jobs`);
      return data as IJobVacancy[];
    },
  });

export const useFetchJobId = (id: string) =>
  useQuery({
    queryKey: [`jobs-${id}`],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${id}`);
      return data;
    },
  });

export function useAddJob(reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationKey: ['addJob'],
    mutationFn: async (jobDetails: any) => {
      await api.post(`/jobs`, jobDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobs'],
        refetchType: 'active',
      });
      enqueueSnackbar(`New Job Vacancy Created Successfully!`, { variant: 'success' });
      router.push(paths.dashboard.job.root);
      reset();
    },
    onError: (error: any) => {
      console.log(error.response.data.message || 'Something went wrong');
      enqueueSnackbar(`Something went wrong`, { variant: 'error' });
    },
  });
}

export function useUpdateJob(reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationKey: ['updateJob'],
    mutationFn: async ({ job, id }: { job: any; id: string }) => {
      const res = await api.patch(`/jobs/${id}`, job);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['jobs', { id: data?.data?.id }],
        refetchType: 'active',
      });
      queryClient.setQueryData(['users', { id: data?.data?.id }], data?.data);
      enqueueSnackbar(`Job Vacancy Updated Successfully!`, { variant: 'success' });
      router.push(paths.dashboard.job.root);
      reset();
    },
    onError: (error: any) => {
      console.log(error.response.data.message || 'Something went wrong');
      enqueueSnackbar(`Something went wrong`, { variant: 'error' });
    },
  });
}

export function useApplyJob(onClose: VoidFunction) {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ['applyJob'],
    mutationFn: async ({ id, file }: { id: string; file: string }) => {
      const formData = new FormData();
      formData.append('files', file);
      const res = await api.post(`/jobs/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Successfully applied for this job', { variant: 'success' });
      onClose();
    },
    onError: (error: any) => {
      console.log(error.response.data.message || 'Something went wrong');
      enqueueSnackbar(error.response.data.message || 'Failed to apply for this job', {
        variant: 'error',
      });
    },
  });
}

export function useRemoveJob() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ['remoteJob'],
    mutationFn: async (id: string) => {
      const res = await api.delete(`/jobs/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobs'],
        refetchType: 'active',
      });
      enqueueSnackbar(`Job Vacancy Removed Successfully!`, { variant: 'success' });
    },
    onError: (error: any) => {
      console.log(error.response.data.message || 'Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    },
  });
}
