import { SystemTime } from '/src/systems/requests/properties/system-time.property';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '/src/scheduler/scheduler.service';
import { Schedule } from '/src/scheduler/entities/scheduler.entity';
import { ControlService } from '/src/systems/control.service';
import { parseExpression } from 'cron-parser';
import { exit } from 'node:process';
import { CronJob } from 'cron';
import { CronCount } from '/src/cron/cron.enum';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger: Logger = new Logger(CronService.name);

  constructor(
    @Inject(SchedulerService) private readonly schedulerService: SchedulerService,
    @Inject(ControlService) private readonly controlService: ControlService,
  ) {}

  async onModuleInit() {
    try {
      await this.addTasksFromDatabase();
    } catch (e) {
      this.logger.error(e);
      exit(1);
    }
  }

  async addCronJob(schedule: Schedule) {
    const crons = [
      new CronJob(schedule.startExpression, this.componentStart.bind(this, schedule)),
      new CronJob(schedule.stopExpression, this.componentStop.bind(this, schedule)),
    ];

    this.logger.log(`Added cron job for schedule "${schedule.name}"`);

    for (const cron of crons) cron.start();
  }

  private async addTasksFromDatabase() {
    const [schedules, count] = await this.schedulerService.findAll();
    for (const schedule of schedules) {
      await this.addCronJob(schedule);
    }
  }

  private async componentStart(schedule: Schedule) {
    if (schedule.removeAfterCount !== CronCount.Unlimited) {
      await this.schedulerService.decrementCountById(schedule.id);
    }

    const time = this.getTimeDelta(schedule);
    this.logger.log(`Starting system "${schedule.system.name}" for ${time.toString()}`);

    return await this.controlService.componentsStart(schedule.system, time);
  }

  private async componentStop(schedule: Schedule) {
    this.logger.log(`Stopping system "${schedule.system.name}"`);

    await this.controlService.componentsStop(schedule.system);

    const { removeAfterCount } = await this.schedulerService.findOne(schedule.id);
    if (removeAfterCount === CronCount.Zero) await this.schedulerService.removeById(schedule.id);
  }

  private getTimeDelta(schedule: Schedule) {
    const start = parseExpression(schedule.startExpression).next();
    const stop = parseExpression(schedule.stopExpression).next();

    const deltaSeconds = stop.getSeconds() - start.getSeconds();
    const deltaMinutes = stop.getMinutes() - start.getMinutes();
    // We only send min:sec to the IoT device not hours

    return SystemTime.from({
      min: Math.max(0, deltaMinutes),
      sec: Math.max(0, deltaSeconds),
    });
  }
}
