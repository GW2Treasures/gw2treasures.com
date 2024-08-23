-- CreateTable
CREATE TABLE "HomesteadDecoration" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "iconId" INTEGER,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HomesteadDecoration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomesteadDecorationHistory" (
    "homesteadDecorationId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "HomesteadDecorationHistory_pkey" PRIMARY KEY ("homesteadDecorationId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadDecoration_currentId_de_key" ON "HomesteadDecoration"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadDecoration_currentId_en_key" ON "HomesteadDecoration"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadDecoration_currentId_es_key" ON "HomesteadDecoration"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "HomesteadDecoration_currentId_fr_key" ON "HomesteadDecoration"("currentId_fr");

-- AddForeignKey
ALTER TABLE "HomesteadDecoration" ADD CONSTRAINT "HomesteadDecoration_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecoration" ADD CONSTRAINT "HomesteadDecoration_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecoration" ADD CONSTRAINT "HomesteadDecoration_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecoration" ADD CONSTRAINT "HomesteadDecoration_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecoration" ADD CONSTRAINT "HomesteadDecoration_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecorationHistory" ADD CONSTRAINT "HomesteadDecorationHistory_homesteadDecorationId_fkey" FOREIGN KEY ("homesteadDecorationId") REFERENCES "HomesteadDecoration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomesteadDecorationHistory" ADD CONSTRAINT "HomesteadDecorationHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
