-- CreateTable
CREATE TABLE "job_vacancies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "employmentType" TEXT[],
    "experience" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "skills" TEXT[],
    "workSchedule" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "salary" TEXT NOT NULL,
    "salaryNegotiable" BOOLEAN NOT NULL,
    "benefits" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_vacancies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "skills" TEXT[],
    "profile" TEXT,
    "summary" TEXT,
    "yearsOfExperience" TEXT,
    "jobVacancyId" TEXT NOT NULL,
    "resume" TEXT,
    "resumeLink" TEXT,
    "summaryLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_vacancies" ADD CONSTRAINT "job_vacancies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobVacancyId_fkey" FOREIGN KEY ("jobVacancyId") REFERENCES "job_vacancies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
