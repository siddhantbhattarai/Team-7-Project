// components
import FormProvider, { RHFTextField, RHFUploadBox } from 'src/components/hook-form';
// types
import { Box, Button, DialogActions, Stack, Typography } from '@mui/material';
import api from 'src/utils/axios';
import { useCallback, useState } from 'react';

import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { useApplyJob } from 'src/api/jobs';
// ----------------------------------------------------------------------

type Props = {
  onClose: VoidFunction;
  vacancyId: string;
};

export default function JobApplyForm({ vacancyId, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const EventSchema = Yup.object().shape({
    file: Yup.mixed<any>().required('File is required').nullable(),
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone is required'),
  });

  const currentEvent = {
    file: null,
    name: '',
    phone: '',
  };

  const applyJob = useApplyJob(onClose);

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
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('file', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data: any) => {
    if (data.file) {
      applyJob.mutate({ id: vacancyId, file: data.file });
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, mt: 3 }}>
          Apply for this job
        </Typography>
        <Stack spacing={3}>
          <RHFTextField name="name" label="Full Name" placeholder="Your full name" />

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
