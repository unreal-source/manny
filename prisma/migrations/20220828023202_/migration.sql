/*
  Warnings:

  - You are about to drop the `JobPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "JobPost";

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "channel" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
