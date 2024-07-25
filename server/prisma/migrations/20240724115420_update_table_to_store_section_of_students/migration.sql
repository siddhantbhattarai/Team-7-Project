-- AlterTable
ALTER TABLE "email_templates" ADD COLUMN     "condition" JSONB;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "batch" TEXT,
ADD COLUMN     "class" TEXT,
ADD COLUMN     "section" TEXT,
ADD COLUMN     "tags" TEXT[];
