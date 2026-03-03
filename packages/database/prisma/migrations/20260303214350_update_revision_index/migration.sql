-- DropIndex
DROP INDEX "Revision_language_type_idx";

-- CreateIndex
CREATE INDEX "Revision_language_type_entity_createdAt_idx" ON "Revision"("language", "type", "entity", "createdAt" DESC);
