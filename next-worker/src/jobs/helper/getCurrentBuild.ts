import fetch from 'node-fetch';
import { Build, PrismaClient } from '@prisma/client';

export async function getCurrentBuild(db: PrismaClient): Promise<Build> {
  const apiBuild = await getBuildFromApi();

  // check if build is known
  const build = await db.build.findUnique({ where: { id: apiBuild }});

  if(build) {
    return build;
  }

  console.log(`Creating new build ${apiBuild}`);
  return await db.build.create({ data: { id: apiBuild }});
}

async function getBuildFromApi() {
  const content = await fetch('http://assetcdn.101.arenanetworks.com/latest64/101').then((r) => {
    if(r.status !== 200) {
      throw new Error(`Build API returned ${r.status} ${r.statusText}`);
    }

    return r.text();
  });

  if(!content.match(/^\d+ \d+ \d+ \d+ \d+$/)) {
    throw new Error('Got invalid build id response from API.');
  }

  return Number(content.split(' ')[0]);
}
