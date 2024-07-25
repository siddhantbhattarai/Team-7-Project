'use client';

import { useEffect, useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hook';
// api
import { useGetLabels, useGetMails, useGetMail } from 'src/api/mail';
// components
import EmptyContent from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
//
import { useFetchMailTemplateById, useFetchMailTemplates } from 'src/api/mailTemplate';
import MailNav from '../mail-nav';
import MailList from '../mail-list';
import MailHeader from '../mail-header';
import MailCompose from '../mail-compose';
import MailDetails from '../mail-details';

// ----------------------------------------------------------------------

const LABEL_INDEX = 'inbox';

export default function MailView() {
  const [mailValue, setMaleValue] = useState('');

  const router = useRouter();

  const searchParams = useSearchParams();

  const selectedLabelId = searchParams.get('label') || LABEL_INDEX;

  const selectedMailId = searchParams.get('id') || '';

  const upMd = useResponsive('up', 'md');

  const settings = useSettingsContext();

  const openNav = useBoolean();

  const openMail = useBoolean();

  const openCompose = useBoolean();

  const { data: emails, isLoading } = useFetchMailTemplates();
  const { data: email, isLoading: mailDetailLoading } = useFetchMailTemplateById(selectedMailId);

  const firstMailId = emails?.length ? emails[0].id : '';

  const handleToggleCompose = useCallback(() => {
    if (openNav.value) {
      openNav.onFalse();
    }
    openCompose.onToggle();
  }, [openCompose, openNav]);

  const handleClickMail = useCallback(
    (mailId: string) => {
      if (!upMd) {
        openMail.onFalse();
      }

      const href = `${paths.dashboard.mail}?id=${mailId}`;

      router.push(href);
    },
    [openMail, router, upMd]
  );

  useEffect(() => {
    if (emails) {
      router.push(paths.dashboard.mail);
    }
  }, [isLoading, emails, router]);

  useEffect(() => {
    if (!selectedMailId && firstMailId) {
      handleClickMail(firstMailId);
    }
  }, [firstMailId, handleClickMail, selectedMailId]);

  useEffect(() => {
    if (openCompose.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [openCompose.value]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderEmpty = (
    <EmptyContent
      title={`Nothing in ${selectedLabelId}`}
      description="This folder is empty"
      imgUrl="/assets/icons/empty/ic_folder_empty.svg"
      sx={{
        borderRadius: 1.5,
        maxWidth: { md: 320 },
        bgcolor: 'background.default',
      }}
    />
  );

  const renderMailList = () => (
    <>
      {
        <MailList
          mails={emails}
          loading={isLoading}
          onToggleCompose={openCompose.onToggle}
          //
          openMail={openMail.value}
          onCloseMail={openMail.onFalse}
          onClickMail={handleClickMail}
          //
          selectedLabelId={selectedLabelId}
          selectedMailId={selectedMailId}
        />
      }
    </>
  );

  const renderMailDetails = (
    <>
      {mailDetailLoading || !email ? (
        <EmptyContent
          imgUrl="/assets/icons/empty/ic_email_disabled.svg"
          sx={{
            borderRadius: 1.5,
            bgcolor: 'background.default',
            ...(!upMd && {
              display: 'none',
            }),
          }}
        />
      ) : (
        <MailDetails val={mailValue} setVal={setMaleValue} mail={email} />
      )}
    </>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Mail
        </Typography>

        <Stack
          spacing={1}
          sx={{
            p: 1,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            bgcolor: 'background.neutral',
          }}
        >
          {!upMd && (
            <MailHeader
              onOpenNav={openNav.onTrue}
              onOpenMail={emails?.length ? null : openMail.onTrue}
            />
          )}

          <Stack
            spacing={1}
            direction="row"
            flexGrow={1}
            sx={{
              height: {
                xs: '72vh',
              },
            }}
          >
            {isLoading ? renderEmpty : renderMailList()}

            {mailDetailLoading ? renderLoading : renderMailDetails}
          </Stack>
        </Stack>
      </Container>

      {openCompose.value && <MailCompose onCloseCompose={openCompose.onFalse} />}
    </>
  );
}
