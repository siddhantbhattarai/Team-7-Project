'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';

// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useFetchUserId } from 'src/api/users';
import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserEditView() {
  const settings = useSettingsContext();

  const params: {
    id: string;
  } = useParams();

  const { id } = params;

  const { data: currentUser, isLoading } = useFetchUserId(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Student',
            href: paths.dashboard.user.student,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {isLoading && 'Loading...'}
      {currentUser && <UserNewEditForm currentUser={currentUser} />}
    </Container>
  );
}
