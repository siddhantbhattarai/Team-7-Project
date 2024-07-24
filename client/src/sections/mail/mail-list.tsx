// @mui
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IMailTemplate } from 'src/types/mail';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
//
import Button from '@mui/material/Button';
import MailItem from './mail-item';
import { MailItemSkeleton } from './mail-skeleton';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  mails?: IMailTemplate[];
  //
  openMail: boolean;
  onCloseMail: VoidFunction;
  onClickMail: (id: string) => void;
  //
  selectedLabelId: string;
  selectedMailId: string;
  onToggleCompose: VoidFunction;
};

export default function MailList({
  loading,
  mails,
  onToggleCompose,
  //
  openMail,
  onCloseMail,
  onClickMail,
  //
  selectedLabelId,
  selectedMailId,
}: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderSkeleton = (
    <>
      {[...Array(8)].map((_, index) => (
        <MailItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {mails?.map((mailId) => (
        <MailItem
          key={mailId.id}
          mail={mailId}
          selected={selectedMailId === mailId.id}
          onClickMail={() => {
            onClickMail(mailId.id);
          }}
        />
      ))}
    </>
  );

  const renderContent = (
    <>
      <Stack sx={{ p: 2 }}>
        {mdUp ? (
          <TextField
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
            {selectedLabelId}
          </Typography>
        )}
      </Stack>

      <Scrollbar sx={{ px: 2 }}>
        {loading && renderSkeleton}

        {!!mails.length && renderList}
      </Scrollbar>
    </>
  );

  return mdUp ? (
    <Stack
      sx={{
        width: 320,
        flexShrink: 0,
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    >
      <Stack
        sx={{
          p: (theme) => ({
            xs: theme.spacing(2.5, 2.5, 2, 2.5),
            md: theme.spacing(2, 1.5),
          }),
        }}
      >
        <Button
          fullWidth
          color="inherit"
          variant="contained"
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={onToggleCompose}
        >
          Compose
        </Button>
      </Stack>
      {renderContent}
    </Stack>
  ) : (
    <Drawer
      open={openMail}
      onClose={onCloseMail}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: {
          width: 320,
        },
      }}
    >
      {renderContent}
    </Drawer>
  );
}
