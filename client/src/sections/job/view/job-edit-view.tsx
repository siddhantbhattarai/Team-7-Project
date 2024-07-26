'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _jobs } from 'src/_mock';
// components
import { useParams } from 'src/routes/hook';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import JobNewEditForm from '../job-new-edit-form';
import { useFetchJobId } from 'src/api/jobs';
import { LoadingScreen } from 'src/components/loading-screen';
import { IJobItem } from 'src/types/job';

// ----------------------------------------------------------------------

export default function JobEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { data: job, isLoading } = useFetchJobId(id as string);

  if (isLoading) return <LoadingScreen />;

  const currentJob = {
    id: job.id,
    title: job.title,
    benefits: job.benefits,
    employmentTypes: job.employmentTypes,
    experience: job.experience,
    workingSchedule: job.workSchedule,
    expiredDate: new Date(job.expiryDate),
    role: job.role,
    locations: location,
    salary: job.salary,
    skills: job.skills,
    createdAt: job.createdAt,
    content: job.body,
    totalViews: job.JobApplication.length || 0,
    candidates: job.JobApplication,
    publish: job.isPublished ? 'published' : 'draft',
    company: {
      fullAddress: 'kathmandu',
      name: 'company',
      logo: 'https://source.unsplash.com/240x120/?company',
      phoneNumber: '1234567890',
    },
  } as unknown as IJobItem;
  console.log('🚀 ~ JobEditView ~ currentJob:', currentJob);

  return (
    <>
      {currentJob && (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Edit"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
              {
                name: 'Job',
                href: paths.dashboard.job.root,
              },
              { name: currentJob?.title },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />

          <JobNewEditForm currentJob={currentJob} />
        </Container>
      )}
    </>
  );
}
