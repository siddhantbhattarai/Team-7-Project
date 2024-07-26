import { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
// utils
import uuidv4 from 'src/utils/uuidv4';
import { fTimestamp } from 'src/utils/format-time';
// api
import {
  deleteEvent,
  useAddEventCalendar,
  useDeleteEventCalendar,
  useUpdateEventCalendar,
} from 'src/api/calendar';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, {
  RHFTextField,
  RHFSwitch,
  RHFSelect,
  RHFAutocomplete,
  RHFUploadBox,
} from 'src/components/hook-form';
// types
import { ICalendarEvent, ICalendarDate } from 'src/types/calendar';
import { USER_GENDER_OPTIONS } from 'src/_mock/_user';
import { Chip, MenuItem, Tab, Typography } from '@mui/material';
import { CALENDAR_EVENT_OPTIONS } from 'src/_mock';
import { IMailTemplate } from 'src/types/mail';
import { IUserUniqueFields } from 'src/types/user';
import { formatDistanceToNowStrict } from 'date-fns';
import { getCurrentUser } from 'src/utils/SessionManager';

// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  vacancyId: string;
};

export default function JobApplyForm({ vacancyId, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const EventSchema = Yup.object().shape({
    file: Yup.mixed<any>().required('File is required').nullable(),
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
  });

  const currentEvent = {
    file: null,
    name: '',
    email: '',
    phone: '',
  };

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // const dateError = values.date ? values.date > new Date().toString() : false;
  const handleFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log('🚀 ~ JobApplyForm ~ acceptedFiles:', acceptedFiles);
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      console.log('🚀 ~ JobApplyForm ~ newFile:', newFile);

      if (file) {
        setValue('file', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, mt: 3 }}>
          Apply for this job
        </Typography>
        <Stack spacing={3}>
          <RHFTextField name="name" label="Full Name" placeholder="Your full name" />

          <RHFTextField name="email" label="Email" placeholder="Your email" />

          <RHFTextField name="phone" label="Phone" placeholder="Your phone number" />
        </Stack>

        <Typography variant="body1" sx={{ px: 1 }}>
          Upload your CV
        </Typography>
        <RHFUploadBox maxFiles={1} maxSize={3000000} onDrop={handleFileDrop} name="file" />
        {values?.file && <p>{values.file.name}</p>}
      </Stack>

      <Box sx={{ flexGrow: 1 }} />
      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Apply Now
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
