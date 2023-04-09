import chalk from 'chalk';
import { createServer } from 'http';
import { worker } from './worker';

const server = createServer((_, res) => {
  // calculate the time since last worker run
  const now = new Date();
  const minutesSinceLastJob = (now.valueOf() - worker.lastJob.valueOf()) / 1000 / 60;

  // if this worker hasn't checked for a new job in > 15 minutes, report unhealthy
  if(minutesSinceLastJob > 15) {
    res.writeHead(503);
    res.end('DOWN');
  } else {
    res.writeHead(200);
    res.end('UP');
  }
});


export const healthServer = {
  close() {
    server.close();
  },

  start() {
    return new Promise<void>((resolve) => {
      server.listen(process.env.HEALTH_PORT, undefined, () => {
        const address = server.address();
        console.log(`Health Server running on ${chalk.blue(typeof address === 'string' ? address : `http://localhost:${address?.port}`)}`);

        resolve();
      });
    });
  }
};
