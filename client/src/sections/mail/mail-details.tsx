import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDateTime } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Editor from 'src/components/editor';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import TextMaxLine from 'src/components/text-max-line';
import EmptyContent from 'src/components/empty-content';
import FileThumbnail from 'src/components/file-thumbnail';
// types
import { IMail, IMailLabel, IMailTemplate } from 'src/types/mail';
import { Dispatch, SetStateAction } from 'react';

// ----------------------------------------------------------------------

type Props = {
  mail: IMailTemplate;
  renderLabel: (id: string) => IMailLabel;
  val: string;
  setVal: Dispatch<SetStateAction<string>>;
};

export default function MailDetails({ mail, renderLabel, val, setVal }: Props) {
  const showAttachments = useBoolean(true);

  if (!mail) {
    return (
      <EmptyContent
        title="No Conversation Selected"
        description="Select a conversation to read"
        imgUrl="/assets/icons/empty/ic_email_selected.svg"
        sx={{
          borderRadius: 1.5,
          bgcolor: 'background.default',
        }}
      />
    );
  }

  const renderHead = (
    <Stack direction="row" alignItems="center" flexShrink={0} sx={{ height: 56, pl: 2, pr: 1 }}>
      <Stack direction="row" spacing={1} flexGrow={1} />

      <Stack direction="row" alignItems="center">
        <Checkbox
          color="warning"
          icon={<Iconify icon="eva:star-outline" />}
          checkedIcon={<Iconify icon="eva:star-fill" />}
          checked
        />

        <Checkbox
          color="warning"
          icon={<Iconify icon="material-symbols:label-important-rounded" />}
          checkedIcon={<Iconify icon="material-symbols:label-important-rounded" />}
          checked={false}
        />

        <Tooltip title="Archive">
          <IconButton>
            <Iconify icon="solar:archive-down-minimlistic-bold" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Mark Unread">
          <IconButton>
            <Iconify icon="fluent:mail-unread-20-filled" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Trash">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>

        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>
    </Stack>
  );

  const renderSubject = (
    <Stack spacing={2} direction="row" flexShrink={0} sx={{ p: 2 }}>
      <TextMaxLine variant="subtitle2" sx={{ flexGrow: 1 }}>
        Re: {mail.subject}
      </TextMaxLine>

      <Stack spacing={0.5}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <IconButton size="small">
            <Iconify width={18} icon="solar:reply-bold" />
          </IconButton>

          <IconButton size="small">
            <Iconify width={18} icon="solar:multiple-forward-left-broken" />
          </IconButton>

          <IconButton size="small">
            <Iconify width={18} icon="solar:forward-bold" />
          </IconButton>
        </Stack>

        <Typography variant="caption" noWrap sx={{ color: 'text.disabled' }}>
          {fDateTime(mail.createdAt)}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSender = (
    <Stack
      flexShrink={0}
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 2, 1, 2),
      }}
    >
      <Avatar
        alt="image"
        src="https://api-prod-minimal-v6.pages.dev/assets/images/avatar/avatar-1.webp"
        sx={{ mr: 2 }}
      >
        {mail.createdBy?.name.charAt(0).toUpperCase()}
      </Avatar>

      <ListItemText
        primary={
          <>
            {mail.createdBy?.name}
            <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>
              {` <${mail.createdBy.email}>`}
            </Box>
          </>
        }
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: true,
          component: 'span',
          typography: 'caption',
        }}
      />
    </Stack>
  );

  const renderAttachments = (
    <Stack
      spacing={1}
      sx={{
        p: 1,
        borderRadius: 1,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <ButtonBase
          onClick={showAttachments.onToggle}
          sx={{ color: 'text.secondary', typography: 'caption', borderRadius: 0.5 }}
        >
          <Iconify icon="eva:attach-2-fill" sx={{ mr: 0.5 }} />
          0 attachments
          <Iconify
            icon={
              showAttachments.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
            }
            width={16}
            sx={{ ml: 0.5 }}
          />
        </ButtonBase>

        <Button startIcon={<Iconify icon="eva:cloud-download-fill" />}>Download</Button>
      </Stack>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ py: 3, overflow: 'hidden', flexGrow: 1 }}>
      <Scrollbar>
        <Markdown
          children={mail.body}
          sx={{
            px: 2,
            '& p': {
              typography: 'body2',
            },
          }}
        />
      </Scrollbar>
    </Box>
  );

  const renderEditor = (
    <Stack
      spacing={2}
      sx={{
        p: (theme) => theme.spacing(0, 2, 2, 2),
      }}
    >
      <Editor simple id="reply-mail" value={val} onChange={setVal} />

      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" flexGrow={1}>
          <IconButton>
            <Iconify icon="solar:gallery-add-bold" />
          </IconButton>

          <IconButton>
            <Iconify icon="eva:attach-2-fill" />
          </IconButton>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          endIcon={<Iconify icon="iconamoon:send-fill" />}
        >
          Send
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      flexGrow={1}
      sx={{
        width: 1,
        minWidth: 0,
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    >
      {renderHead}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderSubject}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderSender}

      {renderContent}

      {renderEditor}
    </Stack>
  );
}
