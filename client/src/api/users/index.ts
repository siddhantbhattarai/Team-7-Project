import api from 'src/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'src/components/snackbar';
import { IUserItem, IUserUniqueFields } from 'src/types/user';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// ----------------------------------------------------------------------

export const useFetchUsers = (
  pageNumber: string,
  rowsPerPage: string,
  name: string,
  role: string
) =>
  useQuery({
    queryKey: ['users', { pageNumber, rowsPerPage, name, role }],
    queryFn: async () => {
      const { data } = await api.get(
        `/users?page=${pageNumber}&perPage=${rowsPerPage}&search=${name}&role=${role}`
      );
      return data;
    },
  });

export const useFetchUsersUniqueRecords = () =>
  useQuery({
    queryKey: ['users-unique-records'],
    queryFn: async () => {
      const { data } = await api.get<IUserUniqueFields>(`/users/student/details`);
      return data as IUserUniqueFields;
    },
  });

export const useFetchDesignation = (
  pageNumber: string,
  rowsPerPage: string,
  name: string,
  role: string,
  designation: string
) =>
  useQuery({
    queryKey: ['users', { pageNumber, rowsPerPage, name, role }],
    queryFn: async () => {
      const { data } = await api.get(
        `/users?page=${pageNumber}&perPage=${rowsPerPage}&name=${name}&role=${role}&designation=${designation}`
      );
      return data;
    },
  });

export const useSearchUsers = (search: string) =>
  useQuery<IUserItem[]>({
    queryKey: ['users', { search }],
    queryFn: async () => {
      const { data } = await api.get<IUserItem[]>(`/users/allUsers?name=${search}`);
      return data;
    },
  });

export const useFetchUserId = (id: string) =>
  useQuery({
    queryKey: [{ id }],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
  });

export function useAddUser(setError: any, roles: string, reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const path =
    roles === 'USER'
      ? paths.dashboard.user.student
      : paths.dashboard.user[`${roles.toLowerCase()}s` as keyof typeof paths.dashboard.user];

  return useMutation({
    mutationKey: ['adduser'],
    mutationFn: async (user: {
      name: string;
      email: string;
      phoneNumber: string;
      profileImage: string;
      dob: string;
      address: string;
      role: string;
    }) => {
      await api.post(`/auth/register`, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'active',
      });
      enqueueSnackbar(`User Created Successfully!`, { variant: 'success' });
      router.push((path as string) || (paths.dashboard.user.student as string));
      reset();
    },
    onError: (error: any) => {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'Email should be unique'
      ) {
        enqueueSnackbar('Email should be unique', { variant: 'error' });
        setError('email', {
          type: 'email',
          message: 'Email should be unique',
        });
      } else {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
    },
  });
}

export function useUpdateUser(setError: any, roles: string, reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const path =
    roles === 'USER'
      ? paths.dashboard.user.student
      : paths.dashboard.user[`${roles.toLowerCase()}s` as keyof typeof paths.dashboard.user];

  return useMutation({
    mutationKey: ['updateuser'],
    mutationFn: async ({ user, id }: { user: any; id: string }) => {
      const res = await api.patch(`/users/${id}`, user);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['users', { id: data?.data?.id }],
        refetchType: 'active',
      });
      queryClient.setQueryData(['users', { id: data?.data?.id }], data?.data);
      enqueueSnackbar(`User Updated Successfully!`, { variant: 'success' });
      router.push((path as string) || (paths.dashboard.user.student as string));
      reset();
    },
    onError: (error: any) => {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'Email should be unique'
      ) {
        enqueueSnackbar('Email should be unique', { variant: 'error' });
        setError('email', {
          type: 'email',
          message: 'Email should be unique',
        });
      } else {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
    },
  });
}

export function useRemoveUser() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ['removeuser'],
    mutationFn: async (id: string) => {
      const res = await api.delete(`/users/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'active',
      });
      enqueueSnackbar(`User Removed Successfully!`, { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    },
  });
}
