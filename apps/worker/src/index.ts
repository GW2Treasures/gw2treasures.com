// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { registerCronJobs } from './jobs/cron';
import { worker } from './worker';
import { healthServer } from './health-server';
import { startNewJob } from './run-job';

if(process.argv.length > 2) {
  // run a single job
  healthServer.start()
    .then(() => startNewJob(process.argv[2]))
    .then(() => healthServer.close());
} else {
  // start worker
  healthServer.start()
    .then(() => registerCronJobs())
    .then(() => worker.start());
}


// shutdown handling

let shuttingDown = false;

function shutdownHandler() {
  if(shuttingDown) {
    console.log('Forcing shutdown');
    process.exit(1);
  }

  shuttingDown = true;

  console.log('Gracefully shutting down...');
  worker.shutdown();
  healthServer.close();
}

process.on('SIGTERM', shutdownHandler);
process.on('SIGINT', shutdownHandler);
