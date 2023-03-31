// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { registerCronJobs } from './jobs/cron';
import { worker } from './worker';
import { healthServer } from './health-server';

// start worker
healthServer.start()
  .then(() => registerCronJobs())
  .then(() => worker.start());


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
