/*
  Warnings:

  - A unique constraint covering the columns `[flipSkillId]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Skill" ADD COLUMN     "flipSkillId" INTEGER,
ADD COLUMN     "flipSkillIdRaw" INTEGER;

-- CreateTable
CREATE TABLE "public"."_chainSkills" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_chainSkills_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_chainSkills_B_index" ON "public"."_chainSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_flipSkillId_key" ON "public"."Skill"("flipSkillId");

-- AddForeignKey
ALTER TABLE "public"."Skill" ADD CONSTRAINT "Skill_flipSkillId_fkey" FOREIGN KEY ("flipSkillId") REFERENCES "public"."Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_chainSkills" ADD CONSTRAINT "_chainSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_chainSkills" ADD CONSTRAINT "_chainSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
