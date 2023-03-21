import { PrismaClient } from '@prisma/client';

export async function createIcon(url: string | undefined, db: PrismaClient) {
  const icon = url?.match(/\/(?<signature>[^/]*)\/(?<id>[^/]*)\.png$/)?.groups as { signature: string, id: number } | undefined;

  if(icon) {
    icon.id = Number(icon.id);

    await db.icon.upsert({
      create: icon,
      update: {},
      where: { id: icon.id }
    });
  }

  return icon?.id;
}
