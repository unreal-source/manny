/*
  Warnings:

  - The primary key for the `Supporter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ghostStatus` on the `Supporter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supporter" DROP CONSTRAINT "Supporter_pkey",
DROP COLUMN "ghostStatus",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Supporter_pkey" PRIMARY KEY ("id");
