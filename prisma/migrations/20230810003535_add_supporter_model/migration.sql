-- CreateTable
CREATE TABLE "Supporter" (
    "id" INTEGER NOT NULL,
    "ghostName" TEXT NOT NULL,
    "ghostEmail" TEXT NOT NULL,
    "ghostStatus" TEXT NOT NULL,
    "discordUsername" TEXT NOT NULL,

    CONSTRAINT "Supporter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supporter_id_key" ON "Supporter"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Supporter_ghostEmail_key" ON "Supporter"("ghostEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Supporter_discordUsername_key" ON "Supporter"("discordUsername");
