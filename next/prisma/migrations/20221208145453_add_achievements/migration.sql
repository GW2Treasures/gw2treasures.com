-- CreateTable
CREATE TABLE "Achievement" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "iconId" INTEGER,
    "achievementCategoryId" INTEGER,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementHistory" (
    "achievmentId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "AchievementHistory_pkey" PRIMARY KEY ("achievmentId","revisionId")
);

-- CreateTable
CREATE TABLE "AchievementGroup" (
    "id" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AchievementGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementGroupHistory" (
    "achievmentGroupId" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "AchievementGroupHistory_pkey" PRIMARY KEY ("achievmentGroupId","revisionId")
);

-- CreateTable
CREATE TABLE "AchievementCategory" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "achievementGroupId" TEXT,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AchievementCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementCategoryHistory" (
    "achievmentCategoryId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "AchievementCategoryHistory_pkey" PRIMARY KEY ("achievmentCategoryId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_currentId_de_key" ON "Achievement"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_currentId_en_key" ON "Achievement"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_currentId_es_key" ON "Achievement"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_currentId_fr_key" ON "Achievement"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementGroup_currentId_de_key" ON "AchievementGroup"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementGroup_currentId_en_key" ON "AchievementGroup"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementGroup_currentId_es_key" ON "AchievementGroup"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementGroup_currentId_fr_key" ON "AchievementGroup"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementCategory_currentId_de_key" ON "AchievementCategory"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementCategory_currentId_en_key" ON "AchievementCategory"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementCategory_currentId_es_key" ON "AchievementCategory"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementCategory_currentId_fr_key" ON "AchievementCategory"("currentId_fr");

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_achievementCategoryId_fkey" FOREIGN KEY ("achievementCategoryId") REFERENCES "AchievementCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementHistory" ADD CONSTRAINT "AchievementHistory_achievmentId_fkey" FOREIGN KEY ("achievmentId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementHistory" ADD CONSTRAINT "AchievementHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementGroup" ADD CONSTRAINT "AchievementGroup_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementGroup" ADD CONSTRAINT "AchievementGroup_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementGroup" ADD CONSTRAINT "AchievementGroup_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementGroup" ADD CONSTRAINT "AchievementGroup_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementGroupHistory" ADD CONSTRAINT "AchievementGroupHistory_achievmentGroupId_fkey" FOREIGN KEY ("achievmentGroupId") REFERENCES "AchievementGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementGroupHistory" ADD CONSTRAINT "AchievementGroupHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCategory" ADD CONSTRAINT "AchievementCategory_achievementGroupId_fkey" FOREIGN KEY ("achievementGroupId") REFERENCES "AchievementGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCategory" ADD CONSTRAINT "AchievementCategory_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCategory" ADD CONSTRAINT "AchievementCategory_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCategory" ADD CONSTRAINT "AchievementCategory_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCategory" ADD CONSTRAINT "AchievementCategory_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCategoryHistory" ADD CONSTRAINT "AchievementCategoryHistory_achievmentCategoryId_fkey" FOREIGN KEY ("achievmentCategoryId") REFERENCES "AchievementCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCategoryHistory" ADD CONSTRAINT "AchievementCategoryHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
