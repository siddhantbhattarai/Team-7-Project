// sections
'use client';
import { Metadata } from 'next';
import { useFetchJobs } from 'src/api/jobs';
import { LoadingScreen } from 'src/components/loading-screen';
import { JobListView } from 'src/sections/job/view';
import { IJobItem } from 'src/types/job';

// ----------------------------------------------------------------------

export default function JobListPage() {
  const { data: jobs, isLoading } = useFetchJobs();

  if (isLoading) return <LoadingScreen />;

  let filteredJobs = jobs?.map((job) => {
    const { id, title, role, location, salary, skills, status, createdAt } = job;

    return {
      id,
      title,
      benefits: job.benefits,
      employmentTypes: job.employmentTypes,
      experience: job.experience,
      workingSchedule: job.workSchedule,
      expiredDate: job.expiryDate,
      role,
      locations: location,
      salary,
      skills,
      status,
      createdAt,
      content: job.body,
      totalViews: job._count.JobApplication,
    } as IJobItem;
  });

  return <JobListView jobs={filteredJobs} />;
}
