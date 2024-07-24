'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
// routes
import { paths } from 'src/routes/paths';
import { useSearchParams, useRouter } from 'src/routes/hook';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
import axios from 'src/utils/axios';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import FormProvider, { RHFCode } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

import { localStorageAvailable, localStorageGetItem } from 'src/utils/storage-available';
import { getCurrentUser } from 'src/utils/SessionManager';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { loginWithOTP } = useAuthContext();
  const storageAvailable = localStorageAvailable();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('Loading...');

  const router = useRouter();

  useEffect(() => {
    if (storageAvailable) {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        router.push(paths.auth.login);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageAvailable]);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const VerifyCodeSchema = Yup.object().shape({
    otp: Yup.string()
      .required('OTP Code is required')
      .matches(/^\d{6}$/, 'OTP must be 6 digits'),
  });

  const defaultValues = {
    otp: '',
  };

  const methods = useForm({
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await loginWithOTP(email, data.otp);
      const currentUser = getCurrentUser();
      if (currentUser) {
        const parseUser = currentUser;
        enqueueSnackbar(`Welcome Back ${parseUser.displayName}!`);
        localStorage.removeItem('email');
        router.push(returnTo || PATH_AFTER_LOGIN);
      }
    } catch (error) {
      enqueueSnackbar('Invalid OTP', { variant: 'error' });
      reset();
    }
  });

  const handleResendClick = async () => {
    try {
      const response = await axios.post('/auth/send-otp', {
        email,
      });
      if (response.data) {
        enqueueSnackbar('Verification code sent successfully');
      }
    } catch (error) {
      enqueueSnackbar('Resend Failed', { variant: 'error' });
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">Verification Code</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">
          We have emailed a 6-digit confirmation code to {email}, please enter the code in below box
          to verify your email.
        </Typography>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{ color: 'text.secondary', mt: 2.5, typography: 'caption', textAlign: 'center' }}
    >
      Don’t have a code? &nbsp;
      <span
        onClick={handleResendClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleResendClick();
          }
        }}
        role="button"
        tabIndex={0}
        style={{
          cursor: 'pointer',
          padding: 0,
          textDecoration: 'underline',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 'inherit',
        }}
      >
        Resend code
      </span>
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <RHFCode name="otp" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          Verify
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      {renderHead}

      {renderForm}

      {renderTerms}
    </>
  );
}
