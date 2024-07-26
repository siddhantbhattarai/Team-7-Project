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
import { useAddMailTemplate, useSendMailTemplate } from 'src/api/mailTemplate';
import { getCurrentUser } from 'src/utils/SessionManager';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

const ZINDEX = 1998;

const POSITION = 24;

type Props = {
  onCloseCompose: VoidFunction;
};

export default function MailCompose({ onCloseCompose }: Props) {
  const smUp = useResponsive('up', 'sm');
  const addTemplate = useAddMailTemplate(onCloseCompose);
  const sendEmail = useSendMailTemplate(onCloseCompose);
  const user = getCurrentUser();

  const [message, setMessage] = useState('');
  const [to, setTo] = useState('');
  const [isSendNow, setIsSendNow] = useState(false);
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

  const fullScreen = useBoolean();

  const handleChangeMessage = useCallback((value: string) => {
    setMessage(value);
  }, []);

  const handleSave = () => {
    if (subject === '' || message === '') {
      return;
    }
    const details: any = {
      subject,
      body: message,
      createdBy: user?.id,
      status: 'ACTIVE',
    };
    if (isSendNow) {
      if (to === '') {
        return;
      }

      details.to = to;
      sendEmail.mutate(details);
    } else {
      addTemplate.mutate(details);
    }
  };

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

          <Tooltip title={'send now'}>
            <IconButton
              onClick={() => {
                setIsSendNow(!isSendNow);
              }}
            >
              <Iconify icon="iconamoon:send-fill" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={fullScreen.onToggle}>
            <Iconify icon={fullScreen ? 'eva:collapse-fill' : 'eva:expand-fill'} />
          </IconButton>

          <IconButton onClick={onCloseCompose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>

        {isSendNow && (
          <InputBase
            placeholder="To"
            onChange={(e) => setTo(e.target.value)}
            endAdornment={
              <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle2' }}>
                <Box sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Cc</Box>
                <Box sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  Bcc
                </Box>
              </Stack>
            }
            sx={{
              px: 2,
              height: 48,
              borderBottom: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          />
        )}
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

            {isSendNow ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSave}
                type="submit"
                endIcon={<Iconify icon="iconamoon:send-fill" />}
              >
                Send now
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                type="submit"
                endIcon={<Iconify icon="iconamoon:save-fill" />}
              >
                Save
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Portal>
  );
}
