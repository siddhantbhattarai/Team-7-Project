/*
  Warnings:

  - Added the required column `condition` to the `calendar_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calendar_events" ADD COLUMN     "condition" JSONB NOT NULL;
