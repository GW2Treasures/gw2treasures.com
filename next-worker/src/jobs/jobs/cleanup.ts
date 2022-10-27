import { Job } from '../job';

export const JobsCleanup: Job = {
  run: async (db) => {

    // delete old errored tasks
    const erroredDate = new Date();
    erroredDate.setMinutes(erroredDate.getMinutes() - (60 * 24));

    await db.job.deleteMany({
      where: { state: 'Error', finishedAt: { lt: erroredDate }, cron: null }
    });

    // delete old errored tasks
    const successDate = new Date();
    successDate.setMinutes(successDate.getMinutes() - 60);

    await db.job.deleteMany({
      where: { state: 'Success', finishedAt: { lt: successDate }, cron: null }
    });

    // delete timedOut tasks
    const timedOutDate = new Date();
    timedOutDate.setMinutes(timedOutDate.getMinutes() - 5);

    await db.job.updateMany({
      where: { state: 'Running', startedAt: { lt: timedOutDate } },
      data: { state: 'Error', output: 'Timeout', finishedAt: new Date() }
    });
  }
}
