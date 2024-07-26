'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { useParams, useRouter } from 'src/routes/hook';
// _mock
import { _jobs, JOB_DETAILS_TABS } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
//
import { useFetchJobId } from 'src/api/jobs';
import { LoadingScreen } from 'src/components/loading-screen';
import JobDetailsContent from 'src/sections/job/job-details-content';
import { Box, Button, Dialog, Stack, Typography, useTheme } from '@mui/material';
import JobApplyForm from 'src/sections/job/job-form';

// ----------------------------------------------------------------------

export default function JobDetailsView() {
  const theme = useTheme();
  const router = useRouter();
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const [publish, setPublish] = useState('draft');
  const [openForm, setOpenForm] = useState(false);
  const { data: job, isLoading } = useFetchJobId(id as string);
  const [currentTab, setCurrentTab] = useState('content');

  const onCloseForm = useCallback(() => {
    setOpenForm(false);
  }, []);

  const onOpenForm = useCallback(() => {
    setOpenForm(true);
  }, []);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'candidates') {
      if (currentJob.candidates === 0) {
        return;
      }
    }
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  useEffect(() => {
    if (job && currentJob) {
      setPublish(currentJob.publish ? 'published' : 'draft');
    }
  }, [job]);

  if (isLoading) return <LoadingScreen />;

  const currentJob = {
    id: job.id,
    title: job.title,
    benefits: job.benefits,
    employmentTypes: job.employmentTypes,
    experience: job.experience,
    workingSchedule: job.workSchedule,
    expiredDate: job.expiryDate,
    role: job.role,
    locations: location,
    salary: job.salary,
    skills: job.skills,
    createdAt: job.createdAt,
    content: job.body,
    totalViews: job.JobApplication.length || 0,
    candidates: job.JobApplication,
    publish: job.isPublished,
  };

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      <Tab
        key={JOB_DETAILS_TABS[0].value}
        iconPosition="end"
        value={JOB_DETAILS_TABS[0].value}
        label={JOB_DETAILS_TABS[0].label}
      />
    </Tabs>
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        marginTop: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 5 }}>
        Vacancy
      </Typography>
      {renderTabs}

      {currentTab === 'content' && (
        <Box>
          <JobDetailsContent job={currentJob} />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              mb: { xs: 3, md: 5 },
              mt: 1,
            }}
            spacing={2}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push('/job-vacancy')}
            >
              Back
            </Button>

            <Button variant="contained" color="primary" onClick={() => onOpenForm()}>
              Apply
            </Button>
          </Stack>
        </Box>
      )}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openForm}
        onClose={onCloseForm}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <JobApplyForm vacancyId={id as string} onClose={onCloseForm} />
      </Dialog>
    </Container>
  );
}
