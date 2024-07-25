-- DropForeignKey
ALTER TABLE "calendar_events" DROP CONSTRAINT "calendar_events_emailTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "calendar_events" DROP CONSTRAINT "calendar_events_userId_fkey";

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_emailTemplateId_fkey" FOREIGN KEY ("emailTemplateId") REFERENCES "email_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
