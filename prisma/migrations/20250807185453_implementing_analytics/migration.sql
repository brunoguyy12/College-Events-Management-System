/*
  Warnings:

  - You are about to drop the column `totalAttendees` on the `event_analytics` table. All the data in the column will be lost.
  - Added the required column `completedAt` to the `event_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_eventId_fkey";

-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_eventId_fkey";

-- AlterTable
ALTER TABLE "event_analytics" DROP COLUMN "totalAttendees",
ADD COLUMN     "attendanceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "checkedInCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalFeedback" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "registrations" ADD COLUMN     "checkedInAt" TIMESTAMP(3),
ADD COLUMN     "feedbackGiven" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "feedbackShown" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "skills" DROP NOT NULL,
ALTER COLUMN "skills" SET DATA TYPE TEXT,
ALTER COLUMN "interests" DROP NOT NULL,
ALTER COLUMN "interests" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
