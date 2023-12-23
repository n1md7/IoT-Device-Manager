import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronJobParams } from 'cron';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  onModuleInit() {
    // TODO: register persisted cron jobs
  }

  addCronJob(name: string, time: CronJobParams['cronTime']) {
    try {
      const job = new CronJob(time, () => {
        console.log(`job ${name} executed`);
      });

      // @ts-ignore
      this.schedulerRegistry.addCronJob(name, job);
      job.start();
      console.log(this.schedulerRegistry.getCronJobs());

      console.log(`job ${name} added`);
    } catch (e) {
      console.log(e);
    }
  }
}
