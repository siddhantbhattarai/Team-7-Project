-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_jobVacancyId_fkey";

-- DropForeignKey
ALTER TABLE "job_vacancies" DROP CONSTRAINT "job_vacancies_userId_fkey";

-- AddForeignKey
ALTER TABLE "job_vacancies" ADD CONSTRAINT "job_vacancies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobVacancyId_fkey" FOREIGN KEY ("jobVacancyId") REFERENCES "job_vacancies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
