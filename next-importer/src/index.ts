import { db } from './db';
import { processItems } from './import/items';
import { processSkins } from './import/skins';

async function run() {
  console.log('Importing...');

  const apiBuild = 0;

  // check if build is known
  const build = await db.build.findUnique({ where: { id: apiBuild }});

  if(build) {
    console.log(`Build ${build.id} already known since ${build.createdAt}.`);
  } else {
    console.log(`Creating new build ${apiBuild}`);
    await db.build.create({ data: { id: apiBuild }});
  }

  // update items
  await processItems(apiBuild);
  await processSkins(apiBuild);
}

run();
