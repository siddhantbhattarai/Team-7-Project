import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// utils
import { fData } from 'src/utils/format-number';
// types
import { IUserItem } from 'src/types/user';
// assets
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import api from 'src/utils/axios';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';
import MenuItem from '@mui/material/MenuItem';
import { useAddUser, useUpdateUser } from 'src/api/users';
import { USER_ROLES_OPTIONS, USER_GENDER_OPTIONS, USER_COURSE_OPTIONS } from 'src/_mock';
import { useSnackbar } from 'notistack';
import { useBoolean } from 'src/hooks/use-boolean';
import { Chip } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const { enqueueSnackbar } = useSnackbar();
  const [roles, setRoles] = useState<string>(roleParam || '');
  const [dob, setDob] = useState<Date | null>(null);

  const dobTrigger = useBoolean();

  const [imageChanged, setImageChanged] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setRoles(currentUser?.roles[0]);
      setDob(new Date(currentUser?.dob));
    }
  }, [currentUser]);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email address'),
    phoneNumber: Yup.string(),
    section: Yup.string().required('Section is required'),
    course: Yup.string().required('Course is required'),
    batch: Yup.string().required('Batch is required'),
    tags: Yup.array().required('Tags is required'),
    gender: Yup.string().required('Gender is required'),
    password: Yup.string().required('Password is required'),
    role: Yup.string(),
    avatarUrl: Yup.mixed<any>().nullable(),
    dob: Yup.string(),
    address: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      gender: currentUser?.gender || '',
      role: currentUser?.roles[0] || '',
      address: currentUser?.address || roleParam || '',
      avatarUrl: currentUser?.profileImage || null,
      dob: currentUser?.dob || '',
      section: currentUser?.section || '',
      batch: currentUser?.batch || '',
      course: currentUser?.course || '',
      tags: currentUser?.tags || [],
      password: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const addUser = useAddUser(setError, roles, reset);
  const updateUser = useUpdateUser(setError, roles, reset);

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const handleDateofBirth = (newValue: Date | null) => {
    setDob(newValue);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    if (!roles) {
      enqueueSnackbar(`Please select role`, { variant: 'info' });
      return;
    }
    try {
      let profileImage;
      if (imageChanged) {
        const formData = new FormData();
        formData.append('files', data?.avatarUrl);
        const res = await api.post(`/files`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        profileImage = res?.data?.data?.fileName;
      }
      const payload: any = {
        name: data.name,
        phoneNumber: data.phoneNumber || null,
        address: data.address || null,
        gender: data.gender,
        dob: dob?.toISOString() || null,
        password: data.password,
        batch: data.batch || null,
        section: data.section || null,
        course: data.course || null,
        tags: data.tags || [],
        roles: [roles],
      };
      if (data.email !== defaultValues.email) {
        payload.email = data.email || null;
      }
      if (!currentUser) {
        addUser.mutate({ ...payload, profileImage });
      } else {
        updateUser.mutate({
          user: { ...payload, ...(imageChanged && { profileImage }) },
          id: currentUser.id,
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setImageChanged(true);
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={5000000}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png
                    <br /> max size of {fData(5000000)}
                  </Typography>
                }
              />
            </Box>
            <Typography variant="subtitle2">* Please upload your image here.</Typography>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {/* Roles information fields start */}
              <RHFSelect
                name="role"
                label="Role"
                value={roles}
                {...(!currentUser && roleParam && { defaultValue: roleParam.toLocaleUpperCase() })}
                {...(currentUser && {
                  defaultValue:
                    USER_ROLES_OPTIONS.find((role) => role.label === defaultValues.role)?.value ||
                    '',
                })}
                onChange={(e) => setRoles(e.target.value)}
              >
                {USER_ROLES_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* Role information fields ends */}

              {/* Basic general information starts */}

              {/* {roles === 'ADMIN' && (
                <RHFSelect name="designation" label="Designation">
                  {USER_DESIGNATIONS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )} */}

              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="batch" label="Batch" />
              <RHFTextField name="section" label="Section" />
              <RHFSelect name="course" label="Courses">
                {USER_COURSE_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFAutocomplete
                sx={{
                  flex: '1 1 30%', // adjust flex-basis for responsiveness
                  minWidth: '200px', // minimum width for each dropdown
                }}
                name="tags"
                placeholder="+ Tags"
                multiple
                disableCloseOnSelect
                options={['abc', 'xyz']}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
              <DatePicker
                name="dob"
                label="Date of Birth"
                {...(currentUser && { defaultValue: new Date(defaultValues.dob) })}
                onChange={handleDateofBirth}
                open={dobTrigger.value}
                onClose={dobTrigger.onFalse}
                slotProps={{
                  textField: {
                    onClick: dobTrigger.onTrue,
                  },
                }}
              />

              <RHFSelect name="gender" label="Gender">
                {USER_GENDER_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* Basic general information ends */}
              <RHFTextField name="address" label="address" />
              <RHFTextField name="password" label="Password" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
              >
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
