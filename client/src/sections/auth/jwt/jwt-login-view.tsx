'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { useSearchParams, useRouter } from 'src/routes/hook';
// components
import { PATH_AFTER_LOGIN } from 'src/config-global';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { getCurrentUser } from 'src/utils/SessionManager';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);

  const [errorMsg] = useState('');

  const searchParams = useSearchParams();
  const { loginWithPassword } = useAuthContext();
  const returnTo = searchParams.get('returnTo');

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      await loginWithPassword(data.email, data.password);
      const currentUser = getCurrentUser();
      if (currentUser) {
        const parseUser = currentUser;
        enqueueSnackbar(`Welcome Back ${parseUser.displayName}!`);
        setSubmitting(false);
        router.push(returnTo || PATH_AFTER_LOGIN);
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message || 'Something went wrong', { variant: 'error' });
      setSubmitting(false);
      reset();
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">ISMT Hub</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">
          ISMT Hub is a digital platform designed to foster a closer and more efficient connection
          between the administration and students of the International School of Management and
          Technology (ISMT)
        </Typography>

        {/* <Link component={RouterLink} href={paths.auth.login} variant="subtitle2">
          Create an account
        </Link> */}
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Email address" />
      <RHFTextField name="password" label="Password" />

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={submitting}
      >
        Login to your account
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
  );
}
