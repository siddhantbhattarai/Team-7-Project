import api from 'src/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'src/components/snackbar';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { IMailTemplate } from 'src/types/mail';

// ----------------------------------------------------------------------

export function useAddMailTemplate() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationKey: ['addemailtemplate'],
    mutationFn: async (email: Partial<IMailTemplate>) => {
      const res = api.post('/email', email);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['emailtemplates'],
        refetchType: 'active',
      });
      enqueueSnackbar('Email template Created Successfully!', { variant: 'success' });
      router.push(paths.dashboard.mail);
    },
    onError: () => {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    },
  });
}

export function useDeleteMailTemplates() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationKey: ['deleteemailtemplate'],
    mutationFn: async (id: string) => {
      const res = api.delete(`/email/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['emailtemplates'],
        refetchType: 'active',
      });
      enqueueSnackbar('Email template delete Successfully!', { variant: 'success' });
      router.push(paths.dashboard.mail);
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message || 'Something went wrong', { variant: 'error' });
    },
  });
}

export function useFetchMailTemplates() {
  return useQuery({
    queryKey: ['emailtemplates'],
    queryFn: async () => {
      const { data } = await api.get('/email');
      return data as IMailTemplate[];
    },
  });
}
export const useFetchMailTemplateById = (id: string) =>
  useQuery<IMailTemplate>({
    queryKey: [{ id }],
    queryFn: async () => {
      const { data } = await api.get(`/email/${id}`);
      return data as IMailTemplate;
    },
  });
