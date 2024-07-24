'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import GroupNewEditForm from '../group-create-edit-form';
//

// ----------------------------------------------------------------------

export default function GroupCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Group"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root
          },
          {
            name: 'Groups List',
            href: paths.dashboard.itinerary.groups.root
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <GroupNewEditForm />
    </Container>
  );
}
