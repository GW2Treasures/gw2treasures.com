-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "cloth_rgb" TEXT NOT NULL DEFAULT '#fff',
ADD COLUMN     "leather_rgb" TEXT NOT NULL DEFAULT '#fff',
ADD COLUMN     "metal_rgb" TEXT NOT NULL DEFAULT '#fff';
