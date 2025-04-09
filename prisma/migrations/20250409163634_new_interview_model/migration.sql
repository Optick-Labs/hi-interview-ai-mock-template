/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Interview` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[interviewId]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_companyId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "interviewId" TEXT,
ALTER COLUMN "conversationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "companyId",
DROP COLUMN "name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "InterviewStatus" NOT NULL DEFAULT 'IN_PROGRESS',
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_interviewId_key" ON "Evaluation"("interviewId");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
