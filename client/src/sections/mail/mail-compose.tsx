import { useState, useCallback, useMemo } from 'react';
import * as Yup from 'yup';
// @mui
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import Editor from 'src/components/editor';
import { useAddMailTemplate } from 'src/api/mailTemplate';
import { getCurrentUser } from 'src/utils/SessionManager';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import RHFAutocomplete from 'src/components/hook-form/rhf-autocomplete';
import { JOB_SKILL_OPTIONS } from 'src/_mock';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

const ZINDEX = 1998;

const POSITION = 24;

type Props = {
  onCloseCompose: VoidFunction;
};

const uniqueOptions = {
  batches: ['20254', '24'], // Replace with actual unique semesters
  courses: ['unique course'], // Replace with actual unique courses
  tags: ['unique tag1', 'unique tag2'], // Replace with actual unique tags
};
export default function MailCompose({ onCloseCompose }: Props) {
  const smUp = useResponsive('up', 'sm');
  const addTemplate = useAddMailTemplate();
  const user = getCurrentUser();

  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const NewJobSchema = Yup.object().shape({
    to: Yup.string().required('To is required'),
    subject: Yup.string().required('Subject is required'),
    body: Yup.string().required('Body is required'),
    semesters: Yup.array(),
    courses: Yup.array(),
    tags: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      to: '',
      subject: '',
      body: 'string',
      semesters: [],
      courses: [],
      tags: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewJobSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fullScreen = useBoolean();

  const handleChangeMessage = useCallback((value: string) => {
    setMessage(value);
  }, []);

  const handleSave = () => {
    addTemplate.mutate({
      subject,
      body: message,
      createdBy: user?.id,
      status: 'ACTIVE',
    });
    onCloseCompose();
  };
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });
  return (
    <Portal>
      {(fullScreen.value || !smUp) && <Backdrop open sx={{ zIndex: ZINDEX }} />}

      <Paper
        sx={{
          right: 0,
          bottom: 0,
          borderRadius: 2,
          display: 'flex',
          position: 'fixed',
          zIndex: ZINDEX + 1,
          m: `${POSITION}px`,
          overflow: 'hidden',
          flexDirection: 'column',
          boxShadow: (theme) => theme.customShadows.dropdown,
          ...(fullScreen.value && {
            m: 0,
            right: POSITION / 2,
            bottom: POSITION / 2,
            width: `calc(100% - ${POSITION}px)`,
            height: `calc(100% - ${POSITION}px)`,
          }),
        }}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              bgcolor: 'background.neutral',
              p: (theme) => theme.spacing(1.5, 1, 1.5, 2),
            }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              New email
            </Typography>

            <IconButton onClick={fullScreen.onToggle}>
              <Iconify icon={fullScreen ? 'eva:collapse-fill' : 'eva:expand-fill'} />
            </IconButton>

            <IconButton onClick={onCloseCompose}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Stack>

          {/* <InputBase
          placeholder="To"
          endAdornment={
            <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle2' }}>
              <Box sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Cc</Box>
              <Box sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Bcc</Box>
            </Stack>
          }
          sx={{
            px: 2,
            height: 48,
            borderBottom: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        /> */}
          <Typography paddingX={2} marginTop={1} variant="subtitle2">
            To
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: 'space-between',
              paddingX: 2,
              marginTop: 1,
            }}
          >
            <RHFAutocomplete
              sx={{
                flex: '1 1 30%', // adjust flex-basis for responsiveness
                minWidth: '200px', // minimum width for each dropdown
              }}
              name="semesters"
              placeholder="+ Semesters"
              multiple
              disableCloseOnSelect
              options={['20254', '24']}
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
            <RHFAutocomplete
              sx={{
                flex: '1 1 30%',
                minWidth: '200px',
              }}
              name="courses"
              placeholder="+ Courses"
              multiple
              disableCloseOnSelect
              options={uniqueOptions.courses}
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
            <RHFAutocomplete
              sx={{
                flex: '1 1 30%',
                minWidth: '200px',
              }}
              name="tags"
              placeholder="+ Tags"
              multiple
              disableCloseOnSelect
              options={uniqueOptions.tags.map((tag) => tag)}
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
          </Box>
          <InputBase
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
            sx={{
              px: 2,
              height: 48,
              borderBottom: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          />

          <Stack spacing={2} flexGrow={1} sx={{ p: 2 }}>
            <Editor
              simple
              id="compose-mail"
              value={message}
              onChange={handleChangeMessage}
              placeholder="Type a message"
              sx={{
                '& .ql-editor': {},
                ...(fullScreen.value && {
                  height: 1,
                  '& .quill': {
                    height: 1,
                  },
                  '& .ql-editor': {
                    maxHeight: 'unset',
                  },
                }),
              }}
            />

            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" flexGrow={1}>
                <IconButton>
                  <Iconify icon="solar:gallery-add-bold" />
                </IconButton>

                <IconButton>
                  <Iconify icon="eva:attach-2-fill" />
                </IconButton>
              </Stack>

              <LoadingButton
                variant="contained"
                color="primary"
                // onClick={handleSave}
                type="submit"
                loading={isSubmitting}
                endIcon={<Iconify icon="iconamoon:send-fill" />}
              >
                Send
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Paper>
    </Portal>
  );
}
