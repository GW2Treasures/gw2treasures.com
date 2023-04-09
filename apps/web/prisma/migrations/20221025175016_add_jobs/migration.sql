-- CreateEnum
CREATE TYPE "JobState" AS ENUM ('Queued', 'Running', 'Success', 'Error');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "state" "JobState" NOT NULL DEFAULT 'Queued',
    "output" TEXT NOT NULL DEFAULT '',
    "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cron" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
