import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// _mock
import { USER_DESIGNATIONS, USER_STATUS_OPTIONS, USER_GENDER_OPTIONS } from 'src/_mock';
// types
import { IUserItem } from 'src/types/user';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { useFetchBanks } from 'src/api/banks';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentUser?: IUserItem;
};

export default function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phone || '',
      gender: currentUser?.gender || '',
      status: currentUser?.status || '',
      dob: currentUser?.dob || '',
      designation: currentUser?.designation || '',
      avatarUrl: currentUser?.profileImage || null,
      country: currentUser?.address?.country || '',
      state: currentUser?.address?.state || '',
      city: currentUser?.address?.city || '',
      address: currentUser?.address?.address || '',
      zipCode: currentUser?.address?.zipCode || '',
      role: currentUser?.roles[0]?.roleId || '',
      company: currentUser?.professional?.companyName || '',
      passportNumber: currentUser?.professional?.passportNumber || '',
      passportExpire: currentUser?.professional?.passportExpire || '',
      citizenNumber: currentUser?.professional?.citizenNumber || '',
      panNumber: currentUser?.professional?.panNumber || '',
      guide_license: currentUser?.professional?.guide_license || '',
      nma: currentUser?.professional?.nma || '',
      bankId: currentUser?.bankId || '',
      accountNumber: currentUser?.accountNumber || '',
    }),
    [currentUser]
  );

  const { data: banks } = useFetchBanks();

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods}>
        <DialogTitle>Quick View</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            This is for viewing purposes only.
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFSelect name="status" label="Status" disabled>
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <RHFTextField name="name" label="Full Name" disabled />
            <RHFTextField name="email" label="Email Address" disabled />
            <RHFTextField name="phoneNumber" label="Phone Number" disabled />

            <RHFSelect name="gender" label="Gender" disabled>
              {USER_GENDER_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFAutocomplete
              name="country"
              label="Country"
              options={countries.map((country) => country.label)}
              getOptionLabel={(option) => option}
              disabled
              blurOnSelect
              renderOption={(props, option) => {
                const { code, label, phone } = countries.filter(
                  (country) => country.label === option
                )[0];

                if (!label) {
                  return null;
                }

                return (
                  <li {...props} key={label}>
                    <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    />
                    {label} ({code}) +{phone}
                  </li>
                );
              }}
            />

            <RHFTextField name="state" label="State/Province" disabled />
            <RHFTextField name="city" label="City" disabled />
            <RHFTextField name="address" label="Address" disabled />
            <RHFTextField name="zipCode" label="Zip/Code" disabled />
            <RHFTextField name="company" label="Company" disabled />
            <RHFTextField name="role" label="Role" disabled />

            {currentUser?.roles[0].roleId === 'ADMIN' && (
              <>
                <RHFSelect name="designation" label="Designation" disabled>
                  {USER_DESIGNATIONS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTextField name="panNumber" label="PAN Number" disabled />
                {banks && (
                  <RHFSelect name="bankId" label="Please select your bank*" disabled >
                    {banks.map((bank: any) => (
                      <MenuItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField name="accountNumber" label="Account Number" disabled />
              </>
            )}

            {currentUser?.roles[0].roleId !== 'GUIDE' &&
              currentUser?.roles[0].roleId !== 'ADMIN' && (
                <>
                  <RHFTextField name="passportNumber" label="Passport Number" disabled />
                  <DatePicker
                    disabled
                    name="passportNumber"
                    {...(currentUser && { defaultValue: new Date(defaultValues.passportExpire) })}
                    label="Passport Expiry"
                  />
                </>
              )}
            {currentUser?.roles[0].roleId === 'GUIDE' && (
              <>
                <RHFTextField name="citizenNumber" label="Citizenship Number" disabled />
                <RHFTextField name="guide_license" label="Guide License" disabled />
                <RHFTextField name="panNumber" label="PAN Number" disabled />
                <DatePicker
                  disabled
                  label="NMA Expiry"
                  {...(currentUser && { defaultValue: new Date(defaultValues.nma) })}
                />
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Back
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
