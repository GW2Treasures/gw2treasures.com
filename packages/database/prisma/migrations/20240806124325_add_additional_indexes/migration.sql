-- Enable pg_trgm
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "Achievement_createdAt_idx" ON "Achievement"("createdAt");

-- CreateIndex
CREATE INDEX "Achievement_name_de_name_en_name_es_name_fr_idx" ON "Achievement" USING GIN ("name_de" gin_trgm_ops, "name_en" gin_trgm_ops, "name_es" gin_trgm_ops, "name_fr" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Item_createdAt_idx" ON "Item"("createdAt");

-- CreateIndex
CREATE INDEX "Item_name_de_name_en_name_es_name_fr_idx" ON "Item" USING GIN ("name_de" gin_trgm_ops, "name_en" gin_trgm_ops, "name_es" gin_trgm_ops, "name_fr" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Skill_createdAt_idx" ON "Skill"("createdAt");

-- CreateIndex
CREATE INDEX "Skill_name_de_name_en_name_es_name_fr_idx" ON "Skill" USING GIN ("name_de" gin_trgm_ops, "name_en" gin_trgm_ops, "name_es" gin_trgm_ops, "name_fr" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Skin_createdAt_idx" ON "Skin"("createdAt");

-- CreateIndex
CREATE INDEX "Skin_name_de_name_en_name_es_name_fr_idx" ON "Skin" USING GIN ("name_de" gin_trgm_ops, "name_en" gin_trgm_ops, "name_es" gin_trgm_ops, "name_fr" gin_trgm_ops);
