-- CreateTable
CREATE TABLE "Sector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "attractiveness" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "marketGap" INTEGER NOT NULL,
    "fundingMomentum" INTEGER NOT NULL,
    "competitionIntensity" INTEGER NOT NULL,
    "saudiRelevance" INTEGER NOT NULL,
    "totalFunding" REAL NOT NULL,
    "companyCount" INTEGER NOT NULL,
    "avgDealSize" REAL NOT NULL,
    "yoyGrowth" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "arabicName" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "foundedYear" INTEGER NOT NULL,
    "totalFunding" REAL NOT NULL,
    "lastRoundSize" REAL NOT NULL,
    "lastRoundDate" TEXT NOT NULL,
    "investability" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "growthRate" INTEGER NOT NULL,
    "employees" INTEGER NOT NULL,
    "hqCity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "investors" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Company_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Company_sectorId_idx" ON "Company"("sectorId");

-- CreateIndex
CREATE INDEX "Company_investability_idx" ON "Company"("investability");

-- CreateIndex
CREATE INDEX "Company_stage_idx" ON "Company"("stage");
