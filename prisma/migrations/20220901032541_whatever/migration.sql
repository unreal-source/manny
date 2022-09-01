/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[messageId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_messageId_key" ON "Job"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_messageId_key" ON "Portfolio"("messageId");
