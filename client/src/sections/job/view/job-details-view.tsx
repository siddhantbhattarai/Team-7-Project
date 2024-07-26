'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// _mock
import { _jobs, JOB_PUBLISH_OPTIONS, JOB_DETAILS_TABS } from 'src/_mock';
// components
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
//
import JobDetailsToolbar from '../job-details-toolbar';
import JobDetailsContent from '../job-details-content';
import JobDetailsCandidates from '../job-details-candidates';
import { useFetchJobId } from 'src/api/jobs';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function JobDetailsView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const [publish, setPublish] = useState('draft');
  const { data: job, isLoading } = useFetchJobId(id as string);
  const [currentTab, setCurrentTab] = useState('content');

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
    totalViews: job._count.JobApplication,
    candidates: job._count.JobApplication,
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
      {JOB_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'candidates' ? (
              <Label variant="filled">{currentJob?.totalViews}</Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <JobDetailsToolbar
        backLink={paths.dashboard.job.root}
        editLink={paths.dashboard.job.edit(`${currentJob?.id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {currentTab === 'content' && <JobDetailsContent job={currentJob} />}

      {currentTab === 'candidates' && <JobDetailsCandidates candidates={currentJob?.candidates} />}
    </Container>
  );
}
