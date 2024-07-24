'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';

// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchGroupId } from 'src/api/groups';
//
import GroupNewEditForm from '../group-create-edit-form';

// ----------------------------------------------------------------------

export default function GroupEditView() {
  const settings = useSettingsContext();

  const { id } = useParams<{ id: string }>();

  const { data: currentGroup, isLoading } = useFetchGroupId(id);

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
            name: 'Group List',
            href: paths.dashboard.itinerary.groups.root,
          },
          { name: currentGroup?.groupId },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {isLoading ? 'Loading...' : <GroupNewEditForm currentGroup={currentGroup} />}
    </Container>
  );
}
