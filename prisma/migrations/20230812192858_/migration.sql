/*
  Warnings:

  - You are about to drop the column `discordUsername` on the `Supporter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordId]` on the table `Supporter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Supporter_discordUsername_key";

-- AlterTable
ALTER TABLE "Supporter" DROP COLUMN "discordUsername",
ADD COLUMN     "discordId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Supporter_discordId_key" ON "Supporter"("discordId");
