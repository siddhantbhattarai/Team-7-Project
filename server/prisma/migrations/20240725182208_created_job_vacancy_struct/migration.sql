/*
  Warnings:

  - You are about to drop the column `employmentType` on the `job_vacancies` table. All the data in the column will be lost.
  - The `workSchedule` column on the `job_vacancies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `location` column on the `job_vacancies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `salary` on the `job_vacancies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "job_vacancies" DROP COLUMN "employmentType",
ADD COLUMN     "employmentTypes" TEXT[],
DROP COLUMN "workSchedule",
ADD COLUMN     "workSchedule" TEXT[],
DROP COLUMN "location",
ADD COLUMN     "location" TEXT[],
DROP COLUMN "salary",
ADD COLUMN     "salary" JSONB NOT NULL;
